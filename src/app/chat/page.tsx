'use client';

import { useAuthContext } from '@/context-providers/auth-context';
import { useRouter } from 'next/navigation';
import { Relay, finalizeEvent } from 'nostr-tools';
import { useEffect, useRef, useState } from 'react';

const RELAY_URL = 'ws://137.184.117.201:8008';

export default function Chat() {
  const router = useRouter();
  const { isLoading, isLogged, logout, publicKey, secretKey } = useAuthContext();

  const [chats, setChats] = useState<any[]>([]);
  const [currentChat, setCurrentChat] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isLogged || !publicKey) router.push('/login');
    else {
      fetchChats();
    }
  }, [isLoading, isLogged, router]);

  const fetchChats = async () => {
    if (!publicKey) return;

    const relay = await Relay.connect(RELAY_URL);
    console.log(`Connected to ${relay.url}`);
    const sub = relay.subscribe(
      [
        {
          kinds: [30023],
          authors: [publicKey],
        },
      ],
      {
        onevent(event) {
          fetchChat(event);
        },
        oneose() {
          sub.close();
          relay.close();
        },
      }
    );
  };

  const fetchChat = async (event: any) => {
    console.log(event);
    let offer = JSON.parse(event.content);
    offer.nostrId = event.id;

    const relay = await Relay.connect(RELAY_URL);
    let currentChat: string = '';
    const chats: any[] = [];
    const sub = relay.subscribe(
      [
        {
          kinds: [1],
          '#t': [offer.nostrId],
        },
      ],
      {
        onevent(event) {
          if (event.pubkey != currentChat) {
            if (chats.find((chat) => chat.nostrId === offer.nostrId)) return;

            chats.push({
              nostrId: offer.nostrId,
              pubkey: event.pubkey,
            });
            currentChat = event.pubkey;
          }
        },
        oneose() {
          console.log('Chats fetched: ', chats);
          setChats(chats);
        },
      }
    );
  };

  const subscribeToChat = async () => {
    const relay = await Relay.connect(RELAY_URL);
    // console.log('Authors: ', publicKey, currentChat?.pubkey);
    // console.log('Tags: ', currentChat?.nostrId);
    const sub = relay.subscribe(
      [
        {
          kinds: [1],
          authors: [publicKey, currentChat.pubkey],
          '#t': [currentChat.nostrId],
        },
      ],
      {
        onevent(event) {
          setChatMessages((prev) => [
            ...prev,
            {
              fromPublicKey: event.pubkey,
              timestamp: event.created_at,
              content: event.content,
            },
          ]);
        },
      }
    );
  };

  useEffect(() => {
    if (!currentChat) return;

    subscribeToChat();
  }, [currentChat]);

  useEffect(() => {
    if (messageContainerRef.current)
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  }, [chatMessages]);

  const sendMessage = async () => {
    if (!secretKey) return;

    const eventTemplate = {
      kind: 1,
      tags: [['t', currentChat.nostrId]],
      content: message,
      created_at: Math.floor(Date.now() / 1000),
    };
    const sk = new Uint8Array(Buffer.from(secretKey, 'base64'));
    const signedEvent = finalizeEvent(eventTemplate, sk);
    const relay = await Relay.connect(RELAY_URL);
    await relay.publish(signedEvent);
    relay.close();
    setMessage('');
  };

  return (
    <>
      {currentChat ? (
        <div className="flex h-full w-full flex-col justify-between">
          <header className="border-b border-dotted border-brandColor bg-[#9dbec5] p-3 ">
            <h1>
              <span className="font-bold text-[#527177]">Chat with: </span>
              <span>{currentChat.pubkey}</span>
            </h1>
            <h2>
              <span className="font-bold text-[#527177]">Offer nostrId: </span>
              <span>{currentChat.nostrId}</span>
            </h2>
          </header>
          <div ref={messageContainerRef} className="flex-1 overflow-y-scroll bg-[#d5eef4] pb-4">
            <div className="m-2 py-2">
              {chatMessages.map((message, index) => (
                <div key={index} className="m-2">
                  {publicKey === message.fromPublicKey ? (
                    <div className="flex w-full items-start justify-end">
                      <div className="flex">
                        <div className="rounded-bl-md rounded-br-md rounded-tl-md bg-brandColor px-3 py-2">
                          <div className="text-base text-white">{message.content}</div>
                        </div>
                        <div className="h-0 w-0 border-r-[5px] border-t-[11px] border-r-transparent border-t-brandColor"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full items-start justify-start">
                      <div className="flex">
                        <div className="h-0 w-0 border-l-[5px] border-t-[11px] border-l-transparent border-t-[#86cadb]"></div>
                        <div className="rounded-bl-md rounded-br-md rounded-tr-md bg-[#86cadb] px-3 py-2">
                          <span className=" text-base text-brandColor">{message.content}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* send bloc */}
          <div className="flex flex-row p-3">
            <input
              className="mr-3 flex-1 rounded-lg border border-slate-400 px-3 py-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div
              className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-md bg-brandColor"
              onClick={sendMessage}
            >
              <i className="bi bi-send-fill text-[1.4rem] text-white" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <h1 className="border-b border-dotted border-brandColor p-3 font-bold text-brandColor">
            Active chats: {chats.length}
          </h1>
          <ul className="p-3">
            {chats.map((chat, index) => (
              <li
                key={index}
                className="mb-2 flex cursor-pointer flex-col rounded-lg bg-[#98d3e2] p-2"
                onClick={() => setCurrentChat(chat)}
              >
                <span className="font-bold text-brandColor">Chat from pubKey: </span>
                {chat.pubkey}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
