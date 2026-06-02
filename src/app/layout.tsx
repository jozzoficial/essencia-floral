import { Open_Sans, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import { SiteChrome } from '@/components/ui/SiteChrome';

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Essência Floral | Buquês e entregas no Uíge',
  description: 'Buquês frescos, entregas especiais e atendimento personalizado no Uíge, Angola.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-AO" className={`${openSans.variable} ${plusJakarta.variable}`}>
      <body className="bg-background text-on-surface antialiased">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
