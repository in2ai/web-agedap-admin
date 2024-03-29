import { generateSecretKey, getPublicKey } from 'nostr-tools';

type KeyPair = {
  secretKey: string;
  publicKey: string;
};

const generateKeyPair = (): KeyPair => {
  const sk = generateSecretKey();
  const pk = getPublicKey(sk);

  const secretKey = Buffer.from(generateSecretKey()).toString('base64');
  return { secretKey: secretKey, publicKey: pk };
};

const getPublicKeyFromSecret = (secretKey: string): string => {
  const sk = new Uint8Array(Buffer.from(secretKey, 'base64'));
  const publicKey = getPublicKey(sk);
  return publicKey;
};

const nostrService = {
  generateKeyPair,
  getPublicKeyFromSecret,
};

export default nostrService;
