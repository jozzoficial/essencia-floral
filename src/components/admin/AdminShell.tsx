'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Flower2, LayoutDashboard, LogOut, Menu, Package, Truck } from 'lucide-react';
import { useState } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/buques', label: 'Buquês', icon: Package },
  { href: '/admin/entregas', label: 'Entregas', icon: Truck },
];

export function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [aberto, setAberto] = useState(false);

  const sair = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const nav = (
    <nav className="grid gap-2">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setAberto(false)}
          className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold ${
            pathname === href
              ? 'bg-primary text-on-primary'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
          }`}
        >
          <Icon className="size-5" />
          {label}
        </Link>
      ))}
      <button
        type="button"
        onClick={sair}
        className="mt-3 flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold text-error hover:bg-error-container"
      >
        <LogOut className="size-5" />
        Sair
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-outline-variant/40 bg-surface-white p-5 lg:block">
        <Link href="/admin/dashboard" className="mb-8 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-primary text-on-primary">
            <Flower2 className="size-6" />
          </span>
          <div>
            <p className="font-headline-sm text-lg font-bold text-primary">Essência Floral</p>
            <p className="text-xs text-on-surface-variant">Administração</p>
          </div>
        </Link>
        {nav}
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-outline-variant/40 bg-surface-white/95 backdrop-blur">
          <div className="flex min-h-20 items-center justify-between px-4 md:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Painel</p>
              <h1 className="font-headline-md text-[26px] text-primary">{title}</h1>
            </div>
            <button
              type="button"
              aria-label="Abrir menu administrativo"
              onClick={() => setAberto((valor) => !valor)}
              className="grid size-11 place-items-center rounded-full border border-outline-variant text-primary lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
          {aberto && <div className="border-t border-outline-variant/40 bg-surface-white p-4 lg:hidden">{nav}</div>}
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
