'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Flower2, Loader2, Lock, Mail } from 'lucide-react';
import { heroSlides } from '@/lib/data';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient';

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro('');

    if (!isSupabaseConfigured) {
      setErro('Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para activar o login.');
      return;
    }

    setCarregando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setCarregando(false);

    if (error) {
      setErro('E-mail ou palavra-passe inválidos.');
      return;
    }

    window.location.href = '/admin/dashboard';
  };

  return (
    <div className="grid min-h-screen bg-surface md:grid-cols-2">
      <div className="relative hidden md:block">
        <Image src={heroSlides[0].src} alt={heroSlides[0].alt} fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-primary/45" />
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-surface-white p-8 shadow-xl ring-1 ring-outline-variant/40">
          <Link href="/" className="mb-8 inline-flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-primary text-on-primary">
              <Flower2 className="size-6" />
            </span>
            <span className="font-headline-sm text-[22px] font-bold text-primary">Essência Floral</span>
          </Link>
          <h1 className="font-headline-md text-headline-md text-primary">Área Administrativa</h1>
          <p className="mt-2 text-sm text-on-surface-variant">Entre para gerir buquês, entregas e conteúdo.</p>

          <form onSubmit={handleLogin} className="mt-8 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-on-surface">
              E-mail
              <span className="relative">
                <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus-ring min-h-12 w-full rounded-lg border border-outline-variant pl-11 pr-4"
                  placeholder="admin@essenciafloral.ao"
                  required
                />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-on-surface">
              Palavra-passe
              <span className="relative">
                <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="focus-ring min-h-12 w-full rounded-lg border border-outline-variant pl-11 pr-4"
                  placeholder="••••••••"
                  required
                />
              </span>
            </label>
            {erro && <p className="rounded-lg bg-error-container p-3 text-sm font-semibold text-error">{erro}</p>}
            <button
              type="submit"
              disabled={carregando}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 font-semibold text-on-primary hover:bg-primary-container"
            >
              {carregando && <Loader2 className="size-4 animate-spin" />}
              Entrar
            </button>
            <button type="button" className="text-sm font-semibold text-primary">
              Esqueceu a palavra-passe?
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
