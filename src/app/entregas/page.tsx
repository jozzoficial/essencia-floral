'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, X } from 'lucide-react';
import { Entrega } from '@/types';
import { formatarData, whatsappLink } from '@/lib/data';
import { listarEntregas } from '@/lib/publicacoes';
import { EstadoVazio } from '@/components/ui/EstadoVazio';
import { ImagemPublicacao } from '@/components/ui/ImagemPublicacao';

export default function EntregasPage() {
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [selecionada, setSelecionada] = useState<Entrega | null>(null);
  const [visiveis, setVisiveis] = useState(6);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      const { data, error } = await listarEntregas();
      setEntregas(data);
      setErro(error);
      setCarregando(false);
    }
    carregar();
  }, []);

  return (
    <div className="bg-surface">
      <section className="container-shell py-14 md:py-20">
        <div className="max-w-3xl animate-fade-up">
          <p className="font-label-md text-sm font-semibold uppercase tracking-wide text-secondary">Provas sociais</p>
          <h1 className="mt-3 font-headline-lg text-headline-lg-mobile text-primary md:text-headline-lg">Momentos felizes que entregamos</h1>
          <p className="mt-4 text-body-lg text-on-surface-variant">
            Uma galeria de surpresas, aniversários e gestos de carinho preparados pela nossa equipa.
          </p>
        </div>

        {carregando && (
          <div className="masonry-grid mt-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton-card mb-6 aspect-[4/3] rounded-xl" />
            ))}
          </div>
        )}

        {!carregando && erro && (
          <p className="mt-6 rounded-lg bg-error-container p-4 text-sm text-error">{erro}</p>
        )}

        {!carregando && !entregas.length && (
          <div className="mt-10">
            <EstadoVazio
              titulo="Nenhuma entrega publicada ainda"
              descricao="Em breve partilharemos fotos de entregas realizadas. Quer encomendar? Fale connosco."
              acao={{ href: whatsappLink('Olá, gostaria de encomendar um buquê com entrega.'), label: 'Encomendar agora' }}
            />
          </div>
        )}

        {!carregando && entregas.length > 0 && (
          <>
            <div className="masonry-grid mt-10">
              {entregas.slice(0, visiveis).map((entrega, index) => (
                <button
                  type="button"
                  key={entrega.id}
                  onClick={() => setSelecionada(entrega)}
                  className="card-interactive animate-fade-up mb-6 block w-full break-inside-avoid overflow-hidden rounded-xl bg-surface-white text-left ring-1 ring-outline-variant/40"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className={`relative overflow-hidden ${index % 3 === 1 ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}>
                    <ImagemPublicacao src={entrega.imagem_url} alt={entrega.titulo} sizes="(min-width: 1024px) 33vw, 50vw" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary">
                      <CalendarDays className="size-4" /> {formatarData(entrega.data)}
                    </div>
                    <h2 className="mt-2 font-headline-sm text-[20px] text-primary">{entrega.titulo}</h2>
                    <p className="mt-2 text-sm leading-6 text-on-surface-variant">{entrega.descricao}</p>
                  </div>
                </button>
              ))}
            </div>

            {visiveis < entregas.length && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setVisiveis((atual) => atual + 3)}
                  className="rounded-full bg-primary px-7 py-3 font-semibold text-on-primary hover:-translate-y-0.5 hover:bg-primary-container hover:shadow-lg"
                >
                  Carregar mais entregas
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {selecionada && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-surface-white shadow-2xl animate-scale-in">
            <button
              type="button"
              onClick={() => setSelecionada(null)}
              aria-label="Fechar imagem"
              className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white text-primary shadow-sm"
            >
              <X className="size-5" />
            </button>
            <div className="relative h-[55vh] min-h-[320px]">
              <ImagemPublicacao src={selecionada.imagem_url} alt={selecionada.titulo} sizes="90vw" />
            </div>
            <div className="p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-secondary">{formatarData(selecionada.data)}</p>
              <h2 className="mt-2 font-headline-md text-headline-md text-primary">{selecionada.titulo}</h2>
              <p className="mt-3 text-on-surface-variant">{selecionada.descricao}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
