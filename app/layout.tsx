import type { Metadata } from 'next';
import { Space_Mono, Instrument_Serif } from 'next/font/google';
import './globals.css';

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
});

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'The Adaptive Form',
  description:
    'Workspace generativo: l’AI assembla un piano di lancio strutturato e modificabile mentre conversi.',
  openGraph: {
    title: 'The Adaptive Form',
    description: 'Il tuo piano di lancio si costruisce mentre parli.',
    type: 'website',
    locale: 'it_IT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Adaptive Form',
    description: 'Il tuo piano di lancio si costruisce mentre parli.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${spaceMono.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}