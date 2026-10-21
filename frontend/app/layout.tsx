import type { Metadata } from 'next';
import { Fraunces, Work_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const display = Fraunces({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display' });
const body = Work_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'DENA — Délices des Nations',
  description: 'Découvrez le menu de DENA à Bertoua, composez votre commande et préparez vos mariages, fêtes et événements avec notre service traiteur. Contact et devis sur WhatsApp.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body className="font-body text-navy antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
