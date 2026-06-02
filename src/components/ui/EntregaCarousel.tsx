'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Entrega } from '@/types';
import { formatarData } from '@/lib/data';
import { ImagemPublicacao } from '@/components/ui/ImagemPublicacao';

export function EntregaCarousel({ entregas }: { entregas: Entrega[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (entregas.length <= 1) return;
    const timer = setInterval(() => {
      setIndice((atual) => {
        const proximo = (atual + 1) % entregas.length;
        scrollerRef.current?.scrollTo({ left: proximo * 380, behavior: 'smooth' });
        return proximo;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [entregas.length]);

  const scroll = (direction: 'left' | 'right') => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const delta = direction === 'left' ? -380 : 380;
    scroller.scrollBy({ left: delta, behavior: 'smooth' });
    setIndice((atual) => {
      if (direction === 'left') return Math.max(0, atual - 1);
      return Math.min(entregas.length - 1, atual + 1);
    });
  };

  if (!entregas.length) return null;

  return (
    <div className="relative">
      <div ref={scrollerRef} className="hide-scrollbar flex snap-x gap-5 overflow-x-auto pb-3">
        {entregas.map((entrega, index) => (
          <article
            key={entrega.id}
            className="card-interactive min-w-[280px] snap-start overflow-hidden rounded-xl bg-surface-white ring-1 ring-outline-variant/40 sm:min-w-[360px]"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="relative aspect-video overflow-hidden">
              <ImagemPublicacao src={entrega.imagem_url} alt={entrega.titulo} sizes="360px" className="object-cover" />
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{formatarData(entrega.data)}</p>
              <h3 className="mt-1 font-headline-sm text-[20px] text-primary">{entrega.titulo}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-on-surface-variant">{entrega.descricao}</p>
            </div>
          </article>
        ))}
      </div>

      {entregas.length > 1 && (
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Entrega anterior"
            className="grid size-10 place-items-center rounded-full border border-outline-variant text-primary hover:-translate-y-0.5 hover:bg-surface-container-low hover:shadow-md"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Próxima entrega"
            className="grid size-10 place-items-center rounded-full border border-outline-variant text-primary hover:-translate-y-0.5 hover:bg-surface-container-low hover:shadow-md"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}
