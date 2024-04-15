'use client';

import { useAuthContext } from '@/context-providers/auth-context';
import { useRouter } from 'next/navigation';
import { Relay, finalizeEvent } from 'nostr-tools';
import { useEffect, useState } from 'react';

const RELAY_URL = 'ws://137.184.117.201:8008';

export default function Chat() {
  const router = useRouter();
  const { isLoading, isLogged, logout, publicKey, secretKey } = useAuthContext();

  const [chats, setChats] = useState<any[]>([]);
  const [currentChat, setCurrentChat] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');

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
    console.log('Authors: ', publicKey, currentChat.pubkey);
    console.log('Tags: ', currentChat.nostrId);
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
    subscribeToChat();
  }, [currentChat]);

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

  return isLogged ? (
    <main className="flex h-full w-full overflow-hidden">
      {currentChat ? (
        <div className="flex flex-col">
          <h1>Chat with: {currentChat.pubkey}</h1>
          <h2>{currentChat.nostrId}</h2>
          <div className="mb-4 max-h-[300px] bg-slate-200">
            <div className="m-2">
              {chatMessages.map((message, index) => (
                <div key={index} className="m-2">
                  {publicKey === message.fromPublicKey ? (
                    <p className="text-right text-sm">{message.content}</p>
                  ) : (
                    <p className="text-left text-sm">{message.content}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-row">
              <input
                className="flex-1 rounded-lg border border-slate-400 p-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="cursor-pointer p-2" onClick={sendMessage}>
                Send
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <h1>Chats: {chats.length}</h1>
          <ul>
            {chats.map((chat, index) => (
              <li key={index} className="cursor-pointer" onClick={() => setCurrentChat(chat)}>
                {chat.pubkey}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  ) : (
    <main className="flex h-full w-full items-center justify-center">Loading page...</main>
  );
}
