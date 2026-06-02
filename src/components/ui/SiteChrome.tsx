'use client';

import { usePathname } from 'next/navigation';
import { Cabecalho } from '@/components/ui/Cabecalho';
import { ChatBot } from '@/components/ui/ChatBot';
import { Rodape } from '@/components/ui/Rodape';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <main className="min-h-screen bg-surface-container-low">{children}</main>;
  }

  return (
    <>
      <Cabecalho />
      <main className="min-h-screen pt-20">{children}</main>
      <Rodape />
      <ChatBot />
    </>
  );
}
