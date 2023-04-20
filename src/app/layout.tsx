import './globals.css';
import clsx from 'clsx';
import localFont from 'next/font/local';
import React from 'react';

export const metadata = {
  title: 'Home Aurora MultiMedia',
  description: 'Home page Aurora',
};
const din = localFont({
  src: '../../public/fonts/FontsFree-Net-PF-DinText-Pro-Regular.ttf',
  weight: '400',
  variable: '--font-din',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
