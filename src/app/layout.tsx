import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './global.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'web-agedap-admin',
  description: 'web-agedap-admin',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="h-screen w-screen overflow-hidden">{children}</div>
      </body>
    </html>
  );
}
