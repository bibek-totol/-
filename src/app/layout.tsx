import type { Metadata } from 'next';
import { Noto_Sans_Bengali, Inter } from 'next/font/google';
import './globals.css';

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-bengali',
  display: 'swap'
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'কৃষি আবহাওয়া – জেলা কৃষি আবহাওয়া বুলেটিন | Krishi Abohawa',
  description:
    'বাংলাদেশ কৃষি আবহাওয়া তথ্য সেবা (বামিস) ও কৃষি সম্প্রসারণ অধিদপ্তর (DAE) ভিত্তিক জেলাওয়ারী আবহাওয়া পূর্বাভাস ও ফসল-গবাদিপশুর পরামর্শ বুলেটিন।',
  keywords: [
    'কৃষি আবহাওয়া',
    'BAMIS',
    'DAE',
    'weather bulletin',
    'Bangladesh agro-meteorology',
    'কৃষি বুলেটিন',
    'আবহাওয়ার পূর্বাভাস'
  ],
  authors: [{ name: 'Krishi Abohawa' }]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${notoSansBengali.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
