'use client';
import { Relay, finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools';
import { useState } from 'react';
import CustomButton from '@/components/ui/custom-button/CustomButton';
import Field from '@/components/ui/field/field';
import ListSelector from '@/components/smart/list-selector/list-selector';

// const RELAY_URL = 'wss://relay.damus.io';
const RELAY_URL = 'ws://137.184.117.201:8008';

export default function Home() {
  /* Section 1 */
  const [keyPair, setKeyPair] = useState<{
    sk: string;
    pk: string;
  } | null>(null);
  const [inputKey, setInputKey] = useState('');

  const generateKeyPair = () => {
    const sk = generateSecretKey();
    const pk = getPublicKey(sk);
    setKeyPair({ sk: Buffer.from(sk).toString('base64'), pk });
  };

  const handleLogin = () => {
    if (inputKey) {
      const sk = new Uint8Array(Buffer.from(inputKey, 'base64'));
      setKeyPair({
        sk: inputKey,
        pk: getPublicKey(sk),
      });
    }
  };

  /* Section 2 */
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
    if (!keyPair?.sk) return;

    event.preventDefault();
    const workOfferString = JSON.stringify(formValues);
    console.log('Inserting offer: ', workOfferString);

    const eventTemplate = {
      kind: 30023,
      tags: [['t', offerType]],
      content: workOfferString,
      created_at: Math.floor(Date.now() / 1000),
    };
    const sk = new Uint8Array(Buffer.from(keyPair.sk, 'base64'));
    const signedEvent = finalizeEvent(eventTemplate, sk);
    console.log('Offer signed');

    const relay = await Relay.connect(RELAY_URL);
    console.log(`Connected to ${relay.url}`);

    await relay.publish(signedEvent);
    relay.close();
    alert('Offer inserted');

    setFormValues(null);
  };

  const updateForm = (key: string, value: any) => {
    setFormValues({ ...formValues, [key]: value });
  };

  const [offerType, setOfferType] = useState<string>('artificial_intelligence');
  const onChangeOfferType = (value: string) => {
    setOfferType(value);
  };

  return !keyPair ? (
    <div className="flex h-full w-full items-center justify-center">
      <main className="w-full max-w-[30rem] rounded-md border border-lightGrey p-6 shadow-md">
        <h1 className="text-lg font-bold text-brandColor">
          <i className="bi bi-person-fill-lock mr-3 text-[2rem] text-brandColor" />
          Welcome to Agdap admin web
        </h1>
        <p className="pb-5">To identify yourself when publishing offers generate a new keypair</p>
        <CustomButton onClick={generateKeyPair}>Generate new keyPair</CustomButton>
        <p className="pb-5 pt-10">or login using your own secret key</p>
        <input
          className="mb-5 w-full rounded-md border border-lightGrey p-4"
          type="text"
          placeholder="Secret Key"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
        />
        <br />
        <CustomButton onClick={handleLogin}>Login</CustomButton>
      </main>
    </div>
  ) : (
    <main className="flex h-full w-full overflow-hidden">
      <h1 className="flex w-[20%] flex-col items-center bg-brandColor p-5 text-lg font-bold text-white">
        <i className="bi bi-person-fill-lock mr-3 text-[2rem] text-white" />
        Agdap admin web
      </h1>
      <div className="flex w-[80%] flex-col">
        <header className="p-10 pb-0">
          <h1 className="flex flex-none flex-row items-baseline justify-start border-b border-dotted border-lightGrey pb-5 text-lg font-bold text-brandColor">
            <span>Insert new offer</span>
            <span className="mx-3 h-[10px] w-[1px] bg-brandColor"></span>
            <span className="flex flex-row items-baseline">
              <span className="pr-3">Industry: </span>
              <ListSelector
                items={[
                  { id: '1', name: 'Artificial Inteligence', value: 'artificial_intelligence' },
                ]}
                onChange={onChangeOfferType}
                selectedValue={offerType}
              />
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
                <p className="break-all"> {keyPair.sk}</p>
              </div>
              <div className="">
                <h2 className="pb-1 font-bold">Public Key:</h2>
                <p className="break-all"> {keyPair.pk}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
