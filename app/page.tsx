"use client";
import { Relay, finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools";
import { useState } from "react";

export default function Home() {
  /* Section 1 */
  const [keyPair, setKeyPair] = useState<{
    sk: string;
    pk: string;
  } | null>(null);
  const [inputKey, setInputKey] = useState("");

  const generateKeyPair = () => {
    const sk = generateSecretKey();
    const pk = getPublicKey(sk);
    setKeyPair({ sk: Buffer.from(sk).toString('base64'), pk });
  };

  const handleLogin = () => {
    if (inputKey) {
      const sk = new Uint8Array(Buffer.from(inputKey,'base64'));
      setKeyPair({
        sk: inputKey,
        pk: getPublicKey(sk),
      });
    }
  };

  /* Section 2 */
  const [formValues, setFormValues] = useState<{
    title?: string,
    summary?: string,
    requiredSkills?: string[],
    location?: string,
    price?: number,
    currency?: string,
    period?: string,
    tags?: string[]
  } | null>(null);
  
  const insertOffer = async (event: React.FormEvent<HTMLFormElement>) => {
    if(!keyPair?.sk) return;

    event.preventDefault();
    const workOfferString = JSON.stringify(formValues);
    console.log(workOfferString);

    const eventTemplate = {
      kind: 30023,
      tags: [],
      content: workOfferString,
      created_at: Math.floor(Date.now() / 1000),
    };
    const sk = new Uint8Array(Buffer.from(keyPair.sk, 'base64'));
    const signedEvent = finalizeEvent(eventTemplate, sk);
    console.log("Offer signed");

    const relay = await Relay.connect('wss://relay.damus.io');
    console.log(`Connected to ${relay.url}`);
    
    await relay.publish(signedEvent);
    relay.close();
    alert('Offer inserted');

    setFormValues(null);
  };

  return (
    <main>
      <h1>web-agedap-admin</h1>
      <section>
        {
          keyPair ? (
            <>
              <h2>KeyPair</h2>
              <span>Secret Key: {keyPair.sk}</span><br />
              <span>Public Key: {keyPair.pk}</span>
            </>
          ) : (
            <>
              <h2>Generate KeyPair or login</h2>
              <button onClick={generateKeyPair}>Generate KeyPair</button>
              <br /><br />
              <input type="text" placeholder="Secret Key" value={inputKey} onChange={(e) => setInputKey(e.target.value)} /><br />
              <button onClick={handleLogin}>Login</button>
            </>
          )
        }
      </section>
      {
        keyPair && (
          <section>
            <h2>Insert offer</h2>
            <form onSubmit={insertOffer}>
              <input type="text" placeholder="Title" value={formValues?.title} onChange={(e) => setFormValues({ ...formValues, title: e.target.value })} /><br />
              <input type="text" placeholder="Summary" value={formValues?.summary} onChange={(e) => setFormValues({ ...formValues, summary: e.target.value })} /><br />
              <input type="text" placeholder="Required Skills (separados por coma)" value={formValues?.requiredSkills && formValues?.requiredSkills.join(",")} onChange={(e) => setFormValues({ ...formValues, requiredSkills: e.target.value.split(",") })} /><br />
              <input type="text" placeholder="Location" value={formValues?.location} onChange={(e) => setFormValues({ ...formValues, location: e.target.value })} /><br />
              <input type="number" placeholder="Price" value={formValues?.price} onChange={(e) => setFormValues({ ...formValues, price: e.target.valueAsNumber })} /><br />
              <input type="text" placeholder="Currency" value={formValues?.currency} onChange={(e) => setFormValues({ ...formValues, currency: e.target.value })} /><br />
              <input type="text" placeholder="Period" value={formValues?.period} onChange={(e) => setFormValues({ ...formValues, period: e.target.value })} /><br />
              <input type="text" placeholder="Tags (separados por coma)" value={formValues?.tags && formValues?.tags.join(",")} onChange={(e) => setFormValues({ ...formValues, tags: e.target.value.split(",") })} /><br />
              <button type="submit">Insert offer</button>
            </form>
          </section>
        )
      }
    </main>
  );
}
