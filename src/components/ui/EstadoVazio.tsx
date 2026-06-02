'use client';

import { Flower2 } from 'lucide-react';
import Link from 'next/link';

type EstadoVazioProps = {
  titulo: string;
  descricao: string;
  acao?: { href: string; label: string };
};

export function EstadoVazio({ titulo, descricao, acao }: EstadoVazioProps) {
  const acaoExterna = acao?.href.startsWith('http');
  const classesAcao =
    'mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-6 font-semibold text-on-primary hover:bg-primary-container';

  return (
    <div className="animate-fade-up flex flex-col items-center rounded-2xl border border-dashed border-outline-variant/60 bg-surface-white/80 px-8 py-14 text-center shadow-sm">
      <span className="mb-4 grid size-16 place-items-center rounded-full bg-primary-container/20 text-primary">
        <Flower2 className="size-8" />
      </span>
      <h3 className="font-headline-sm text-xl text-primary">{titulo}</h3>
      <p className="mt-3 max-w-md text-sm leading-6 text-on-surface-variant">{descricao}</p>
      {acao &&
        (acaoExterna ? (
          <a href={acao.href} target="_blank" rel="noreferrer" className={classesAcao}>
            {acao.label}
          </a>
        ) : (
          <Link href={acao.href} className={classesAcao}>
            {acao.label}
          </Link>
        ))}
    </div>
  );
}
