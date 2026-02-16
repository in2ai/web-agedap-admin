'use client';

import { Inter } from 'next/font/google';

import 'bootstrap-icons/font/bootstrap-icons.css';
import AuthContextProvider, { useAuthContext } from '@/context-providers/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import CustomButton from '@/components/ui/custom-button/CustomButton';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { isLoading, isLogged, logout, publicKey, secretKey } = useAuthContext();

  useEffect(() => {
    if (isLoading) return;
    if (!isLogged) router.push('/login');
  }, [isLoading, isLogged, router]);

  const onLogout = () => {
    logout();
    router.push('/login');
  };

  return isLogged ? (
    <main className="flex h-full w-full overflow-hidden">
      <div className="flex w-[16%] flex-col items-center justify-between bg-brandColor text-lg font-bold text-white ">
        <header className="flex flex-col items-center justify-between p-5">
          <i className="bi bi-person-fill-lock mr-3 text-[2rem] text-white" />
          <h1>Agedap admin web</h1>
        </header>
        <ul className="mt-10 w-full">
          <li className="mb-[2px] bg-[#ffffff] px-4 py-2 text-brandColor">
            <Link href="/home">Insert offer</Link>
          </li>
          <li className="mb-[2px] bg-[#2e6472] px-4 py-2">
            <Link href="/offers">My offers</Link>
          </li>
          <li className="mb-[2px] bg-[#2e6472] px-4 py-2">
            <Link href="/chat">Chats</Link>
          </li>
        </ul>

        <div className="mb-10 mt-auto w-28">
          <CustomButton tabIndex={9} buttonType="secondary" size="small" onClick={onLogout}>
            Logout
          </CustomButton>
        </div>
      </div>
      <div className="flex w-[84%] flex-col">{children}</div>
    </main>
  ) : (
    <main className="flex h-full w-full items-center justify-center">Loading page...</main>
  );
}
