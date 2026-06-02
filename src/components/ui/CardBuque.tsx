'use client';

import { Eye, Heart, MessageCircle } from 'lucide-react';
import { Buque } from '@/types';
import { formatarKwanza, whatsappLink } from '@/lib/data';
import { ImagemPublicacao } from '@/components/ui/ImagemPublicacao';

type CardBuqueProps = {
  buque: Buque;
  favorito?: boolean;
  onFavorito?: (buque: Buque) => void;
  onDetalhes?: (buque: Buque) => void;
};

export default function CardBuque({ buque, favorito, onFavorito, onDetalhes }: CardBuqueProps) {
  return (
    <article className="card-interactive group relative overflow-hidden rounded-xl bg-surface-white ring-1 ring-outline-variant/40">
      <div className="relative aspect-[4/5] overflow-hidden">
        <ImagemPublicacao
          src={buque.imagem_url}
          alt={buque.nome}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <button
          type="button"
          aria-label={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          onClick={() => onFavorito?.(buque)}
          className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/90 text-primary shadow-sm backdrop-blur hover:scale-110 hover:bg-white"
        >
          <Heart className={`size-5 transition-transform ${favorito ? 'scale-110 fill-primary' : ''}`} />
        </button>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{buque.categoria || 'Especial'}</p>
            <h3 className="mt-1 font-headline-sm text-[20px] text-primary">{buque.nome}</h3>
          </div>
          <span className="shrink-0 rounded-full bg-primary-fixed px-3 py-1 text-sm font-bold text-on-primary-fixed">
            {formatarKwanza(Number(buque.preco))}
          </span>
        </div>
        <p className="mt-3 min-h-12 text-sm leading-6 text-on-surface-variant">
          {buque.descricao || 'Arranjo floral fresco preparado por encomenda.'}
        </p>
        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDetalhes?.(buque)}
            className="grid size-10 place-items-center rounded-full border border-outline-variant text-primary hover:bg-surface-container-low"
            aria-label={`Ver detalhes de ${buque.nome}`}
          >
            <Eye className="size-4" />
          </button>
          <a
            href={whatsappLink(`Olá, gostaria de informações sobre o buquê ${buque.nome}.`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white hover:-translate-y-0.5 hover:shadow-lg"
          >
            <MessageCircle className="size-4" />
            Solicitar
          </a>
        </div>
      </div>
    </article>
  );
}
