'use client';

import CustomButton from '@/components/ui/custom-button/CustomButton';
import { useAuthContext } from '@/context-providers/auth-context';
import { useRouter } from 'next/navigation';
import { generateSecretKey, getPublicKey } from 'nostr-tools';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();
  const { isLoading, isLogged, loginByUsername, loginBySecretKey } = useAuthContext();

  useEffect(() => {
    if (isLoading) return;
    if (isLogged) router.push('/home');
  }, [isLoading, isLogged, router]);

  const [inputKey, setInputKey] = useState('');

  const generateKeyPair = () => {
    loginByUsername();
    router.push('/home');
  };

  const handleLogin = () => {
    if (inputKey) {
      loginBySecretKey(inputKey);
      router.push('/home');
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
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
      <div className="mt-5 flex w-full flex-row items-center justify-center gap-8">
        <Image src="/FEDER.png" alt="FEDER" width={200} height={200} />
        <Image src="/XUNTA.png" alt="XUNTA" width={200} height={200} />
      </div>
      <div className="flex w-[30rem] flex-row items-center justify-center gap-8 text-sm text-center">
        <h3>Este proyecto ha sido subvencionado por la Axencia Galega de Innovación (GAIN) con fondos FEDER de la Unión Europea, con el apoyo de la Consellería de Economía e Industria de la Xunta de Galicia, en el marco de su compromiso con el impulso a la investigación, el desarrollo tecnológico y la innovación.</h3>
      </div>
    </div>
  );
}
