'use client';

import CustomButton from '@/components/ui/custom-button/CustomButton';
import Field from '@/components/ui/field/field';
import { useAuthContext } from '@/context-providers/auth-context';
import { environment } from '@/environments/environment';
import { useRouter } from 'next/navigation';
import { Relay, finalizeEvent } from 'nostr-tools';
import { use, useEffect, useState } from 'react';

export default function Offers() {
  const router = useRouter();
  const { isLoading, isLogged, publicKey, secretKey } = useAuthContext();

  const [offers, setOffers] = useState<any[]>([]);
  const [currentOffer, setCurrentOffer] = useState<any>(null);
  const [formValues, setFormValues] = useState<{
    title?: string;
    summary?: string;
    requiredSkills?: string[];
    location?: string;
    price?: number;
    currency?: string;
    period?: string;
    tags?: string[];
  } | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isLogged || !publicKey) router.push('/login');
    else {
      fetchOffers();
    }
  }, [isLoading, isLogged, router]);

  const fetchOffers = async () => {
    if (!publicKey) return;

    const relay = await Relay.connect(environment.RELAY_URL);
    console.log(`Connected to ${relay.url}`);
    const fetchingOffers: any[] = [];
    const sub = relay.subscribe(
      [
        {
          kinds: [30023],
          authors: [publicKey],
        },
      ],
      {
        onevent(event) {
          try {
            const offer = {
              id: event.id,
              created_at: event.created_at,
              ...JSON.parse(event.content),
            };
            console.log('Offer event received:', event, offer);
            fetchingOffers.push(offer);
          } catch (error) {
            console.error('Error parsing offer event:', error);
          }
        },
        oneose() {
          sub.close();
          relay.close();

          setOffers(fetchingOffers);
        },
      }
    );
  };

  useEffect(() => {
    if (currentOffer) {
      console.log('Current offer selected:', currentOffer);
    }
  }, [currentOffer]);

  const deleteOffer = async (offer: any) => {
    if (!secretKey) return;

    //warning dialog
    if (!confirm('Are you sure you want to delete this offer?')) return;

    console.log('Deleting offer:', offer);
    try {
      const eventTemplate = {
        kind: 5,
        tags: [
          ['e', offer.id],
          ['k', '30023'],
        ],
        content: 'Offer deleted request by the author',
        created_at: Math.floor(Date.now() / 1000),
      };
      console.log('Event template created:', eventTemplate);
      const sk = new Uint8Array(Buffer.from(secretKey, 'base64'));
      const signedEvent = finalizeEvent(eventTemplate, sk);
      console.log('Offer deletion signed');

      const relay = await Relay.connect(environment.RELAY_URL);
      console.log(`Connected to ${relay.url}`);

      await relay.publish(signedEvent);
      console.log('Offer deletion published');
      relay.close();
      alert('Offer deleted');

      setCurrentOffer(null);
      fetchOffers();
    } catch (error) {
      console.error('Error deleting offer: ', error);
      alert('Error deleting offer');
    }
  };

  if (currentOffer) {
    return (
      <>
        <div className="px-10 pt-5">
          <CustomButton
            tabIndex={9}
            type="button"
            buttonType="primary"
            onClick={() => setCurrentOffer(null)}
          >
            Go back to offers
          </CustomButton>
        </div>
        <div className="flex h-2 flex-1">
          <div className="h-full w-2/3 flex-1 overflow-y-auto p-5">
            <section className="p-5">
              <form className="overflow-y-auto" onSubmit={(event) => event.preventDefault()}>
                <Field
                  tabIndex={1}
                  className="mb-3"
                  value={currentOffer.title}
                  label="Title"
                  isReadOnly
                />
                <Field
                  tabIndex={2}
                  className="mb-3"
                  value={currentOffer.summary}
                  label="Summary"
                  isReadOnly
                />
                <Field
                  tabIndex={3}
                  className="mb-3"
                  value={currentOffer?.requiredSkills && currentOffer?.requiredSkills.join(',')}
                  label="Required Skills"
                  isReadOnly
                />
                <Field
                  tabIndex={4}
                  className="mb-3"
                  value={currentOffer?.location}
                  label="Location"
                  isReadOnly
                />
                <Field
                  tabIndex={5}
                  className="mb-3"
                  value={currentOffer?.price?.toString()}
                  label="Price"
                  isReadOnly
                />
                <Field
                  tabIndex={6}
                  className="mb-3"
                  value={currentOffer?.currency}
                  label="Currency"
                  isReadOnly
                />
                <Field
                  tabIndex={7}
                  className="mb-3"
                  value={currentOffer?.period}
                  label="Period"
                  isReadOnly
                />
                <Field
                  tabIndex={8}
                  className="mb-3"
                  value={currentOffer?.tags?.join(',')}
                  label="Tags"
                  isReadOnly
                />

                <div className="py-5">
                  <CustomButton
                    tabIndex={9}
                    type="button"
                    buttonType="danger"
                    onClick={() => deleteOffer(currentOffer)}
                  >
                    Delete offer
                  </CustomButton>
                </div>
              </form>
            </section>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col">
      <h1 className="border-b border-dotted border-brandColor p-3 font-bold text-brandColor">
        Total offers published: {offers.length}
      </h1>
      <ul className="p-3">
        {offers.map((offer, index) => (
          <li
            key={index}
            className="mb-2 flex cursor-pointer flex-col rounded-lg bg-[#98d3e2] p-2"
            onClick={() => setCurrentOffer(offer)}
          >
            <span className="font-bold text-brandColor">Offer Id: </span>
            {offer.id} <br />
            <span className="font-bold text-brandColor">Title: </span>
            {offer.title} <br />
            <span className="font-bold text-brandColor">Created at: </span>
            {new Date(offer.created_at * 1000).toLocaleString()} <br />
          </li>
        ))}
      </ul>
    </div>
  );
}
