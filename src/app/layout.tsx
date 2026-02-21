import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './global.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AuthContextProvider from '@/context-providers/auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'web-mecopia-admin',
  description: 'web-mecopia-admin',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="h-screen w-screen overflow-hidden">
          <AuthContextProvider>{children}</AuthContextProvider>
        </div>
      </body>
    </html>
  );
}
