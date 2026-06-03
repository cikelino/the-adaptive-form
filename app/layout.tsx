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

export const metadata: Metadata = {
  title: 'The Adaptive Form',
  description: "L'interfaccia si costruisce mentre scrivi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${spaceMono.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}