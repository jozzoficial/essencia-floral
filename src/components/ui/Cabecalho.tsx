'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flower2, LogIn, Menu, ShoppingBag, UserRound, X } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient';

export function Cabecalho() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const verificarSessao = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAdmin(Boolean(session));
    };

    verificarSessao();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(Boolean(session));
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const links = [
    { href: '/', label: 'Início' },
    { href: '/buques', label: 'Buquês' },
    { href: '/entregas', label: 'Entregas' },
    { href: '/sobre', label: 'Sobre' },
    { href: '/contato', label: 'Contacto' },
  ];

  const estaAtivo = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 z-50 w-full bg-surface/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-container-max items-center justify-between px-margin-mobile md:px-margin-desktop">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMenuAberto(false)}>
          <span className="grid size-11 place-items-center rounded-full bg-primary text-on-primary shadow-sm">
            <Flower2 className="size-6" aria-hidden="true" />
          </span>
          <span className="font-headline-sm text-[20px] font-bold tracking-tight text-primary sm:text-headline-sm">
            Essência Floral
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-label-md text-label-md ${
                estaAtivo(link.href)
                  ? 'border-b-2 border-primary pb-1 font-bold text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/buques"
            aria-label="Ver buquês"
            className="rounded-full p-2 hover:bg-surface-container-low"
          >
            <ShoppingBag className="h-5 w-5 text-primary" />
          </Link>
          {isAdmin ? (
            <Link
              href="/admin/dashboard"
              aria-label="Abrir dashboard"
              className="rounded-full p-2 hover:bg-surface-container-low"
            >
              <UserRound className="h-5 w-5 text-primary" />
            </Link>
          ) : (
            <Link
              href="/admin/login"
              className="rounded-full bg-primary px-6 py-2.5 font-button text-button text-on-primary hover:bg-primary-container active:scale-95"
            >
              Entrar
            </Link>
          )}
        </div>

        <button
          type="button"
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          className="rounded-full p-2 hover:bg-surface-container-low md:hidden"
          onClick={() => setMenuAberto((aberto) => !aberto)}
        >
          {menuAberto ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-primary" />}
        </button>
      </div>

      {menuAberto && (
        <div className="absolute left-0 top-20 z-40 flex w-full flex-col gap-4 border-t border-outline-variant/20 bg-surface-white px-6 py-4 shadow-lg md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuAberto(false)}
              className={`font-label-md text-label-md ${
                estaAtivo(link.href) ? 'font-bold text-primary' : 'text-on-surface-variant'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-outline-variant/20" />
          {isAdmin ? (
            <Link
              href="/admin/dashboard"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-2 font-label-md text-primary"
            >
              <UserRound className="h-5 w-5" /> Dashboard
            </Link>
          ) : (
            <Link
              href="/admin/login"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-2 font-label-md text-primary"
            >
              <LogIn className="h-5 w-5" /> Entrar
            </Link>
          )}
          <Link
            href="/buques"
            onClick={() => setMenuAberto(false)}
            className="flex items-center gap-2 font-label-md text-primary"
          >
            <ShoppingBag className="h-5 w-5" /> Buquês
          </Link>
        </div>
      )}
    </header>
  );
}
