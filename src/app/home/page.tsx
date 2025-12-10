'use client';

import ListSelector, { ListItem } from '@/components/smart/list-selector/list-selector';
import CustomButton from '@/components/ui/custom-button/CustomButton';
import Field from '@/components/ui/field/field';
import { useAuthContext } from '@/context-providers/auth-context';
import { environment } from '@/environments/environment';
import { Relay, finalizeEvent } from 'nostr-tools';
import { useState } from 'react';
import Image from 'next/image';

const industries: ListItem[] = [
  { id: '1', name: 'Inteligencia Artificial', value: 'artificial_intelligence' },
  { id: '2', name: 'Desarrollo Móviles', value: 'mobile_development' },
  { id: '3', name: 'Recursos Humanos', value: 'human_resources' },
];

export default function Home() {
  const { publicKey, secretKey } = useAuthContext();

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

  const onInsertOffer = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!secretKey) return;

    event.preventDefault();
    const workOfferString = JSON.stringify(formValues);
    console.log('Inserting offer: ', workOfferString);

    try {
      const eventTemplate = {
        kind: 30023,
        tags: [
          ['t', industry],
          ['d', `${publicKey}: ${formValues?.title}`],
          ['title', formValues?.title || ''],
        ],
        content: workOfferString,
        created_at: Math.floor(Date.now() / 1000),
      };
      const sk = new Uint8Array(Buffer.from(secretKey, 'base64'));
      const signedEvent = finalizeEvent(eventTemplate, sk);
      console.log('Offer signed');

      const relay = await Relay.connect(environment.RELAY_URL);
      console.log(`Connected to ${relay.url}`);

      await relay.publish(signedEvent);
      console.log('Offer published');
      relay.close();
      alert('Offer inserted');

      setFormValues(null);
    } catch (error) {
      console.error('Error inserting offer: ', error);
      alert('Error inserting offer');
    }
  };

  const updateForm = (key: string, value: any) => {
    setFormValues({ ...formValues, [key]: value });
  };

  const [industry, setIndustry] = useState<string>('artificial_intelligence');
  const onChangeIndustry = (value: string) => {
    setIndustry(value);
  };

  return (
    <>
      <header className="p-10 pb-0">
        <h1 className="flex flex-none flex-row items-baseline justify-start border-b border-dotted border-lightGrey pb-5 text-lg font-bold text-brandColor">
          <span>Insert new offer</span>
          <span className="mx-3 h-[10px] w-[1px] bg-brandColor"></span>
          <span className="flex flex-row items-baseline">
            <span className="pr-3">Industry: </span>
            <ListSelector items={industries} onChange={onChangeIndustry} selectedValue={industry} />
          </span>
        </h1>
      </header>
      <div className="flex h-2 flex-1">
        {/* Inset offer */}
        <div className="h-full w-2/3 flex-1 overflow-y-auto p-5">
          <section className="p-5">
            <form className="overflow-y-auto" onSubmit={onInsertOffer}>
              <Field
                tabIndex={1}
                className="mb-3"
                value={formValues?.title}
                label="Title"
                onChange={(value) => updateForm('title', value)}
              />
              <Field
                tabIndex={2}
                className="mb-3"
                value={formValues?.summary}
                label="Summary"
                onChange={(value) => updateForm('summary', value)}
              />
              <Field
                tabIndex={3}
                className="mb-3"
                value={formValues?.requiredSkills && formValues?.requiredSkills.join(',')}
                label="Required Skills (separados por coma)"
                onChange={(value) =>
                  updateForm(
                    'requiredSkills',
                    value.split(',').map((skill) => skill.trim())
                  )
                }
              />
              <Field
                tabIndex={4}
                className="mb-3"
                value={formValues?.location}
                label="Location"
                onChange={(value) => updateForm('location', value)}
              />
              <Field
                tabIndex={5}
                className="mb-3"
                value={formValues?.price?.toString()}
                label="Price"
                onChange={(value) => updateForm('price', parseFloat(value))}
              />
              <Field
                tabIndex={6}
                className="mb-3"
                value={formValues?.currency}
                label="Currency"
                onChange={(value) => updateForm('currency', value)}
              />
              <Field
                tabIndex={7}
                className="mb-3"
                value={formValues?.period}
                label="Period"
                onChange={(value) => updateForm('period', value)}
              />
              <Field
                tabIndex={8}
                className="mb-3"
                value={formValues?.tags?.join(',')}
                label="Tags (separados por coma)"
                onChange={(value) =>
                  updateForm(
                    'tags',
                    value.split(',').map((tag) => tag.trim())
                  )
                }
              />

              <div className="py-5">
                <CustomButton tabIndex={9} type="submit">
                  Insert offer
                </CustomButton>
              </div>
            </form>
          </section>
        </div>
        <div className="w-1/3 p-5 text-xs">
          {/* For dev purposes */}
          <section className="bg-gray-200 p-5 text-gray-500">
            <h1 className="pb-3 font-semibold">For development purposes</h1>
            <div className="pb-5">
              <h2 className="pb-1 font-bold">Secret Key:</h2>
              <p className="break-all"> {secretKey}</p>
            </div>
            <div className="">
              <h2 className="pb-1 font-bold">Public Key:</h2>
              <p className="break-all"> {publicKey}</p>
            </div>
          </section>
          <div className="flex flex-row gap-8 w-full justify-center items-center mt-5">
            <Image src="/FEDER.png" alt="FEDER" width={200} height={200} />
            <Image src="/XUNTA.png" alt="XUNTA" width={200} height={200} />
          </div>
        </div>
      </div>
    </>
  );
}
