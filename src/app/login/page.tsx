'use client';

import CustomButton from '@/components/ui/custom-button/CustomButton';
import { useAuthContext } from '@/context-providers/auth-context';
import { useRouter } from 'next/navigation';
import { generateSecretKey, getPublicKey } from 'nostr-tools';
import { useEffect, useState } from 'react';

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
  );
}
