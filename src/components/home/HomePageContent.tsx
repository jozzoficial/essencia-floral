'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, Sparkles, Star } from 'lucide-react';
import CardBuque from '@/components/ui/CardBuque';
import { EntregaCarousel } from '@/components/ui/EntregaCarousel';
import { EstadoVazio } from '@/components/ui/EstadoVazio';
import { HeroCarousel } from '@/components/ui/HeroCarousel';
import { whatsappLink } from '@/lib/data';
import { listarBuques, listarEntregas } from '@/lib/publicacoes';
import { Buque, Entrega } from '@/types';

const depoimentos = [
  { nome: 'JOZZ', texto: 'O buquê chegou fresco e com uma apresentação linda. A minha mãe ficou emocionada.' },
  { nome: 'Lídia Francisco', texto: 'Atendimento muito atento, ajudaram-me a escolher as flores certas para pedir desculpas.' },
  { nome: 'Ernesto Sunda', texto: 'A entrega foi rápida e o cartão escrito à mão deu um toque muito especial.' },
];

export function HomePageContent() {
  const [buques, setBuques] = useState<Buque[]>([]);
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const [resBuques, resEntregas] = await Promise.all([listarBuques(), listarEntregas()]);
      setBuques(resBuques.data);
      setEntregas(resEntregas.data);
      setCarregando(false);
    }
    carregar();
  }, []);

  const destaques = buques.slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-surface-container-low pb-10 pt-6 md:pb-14 md:pt-8">
        <div className="container-shell">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="animate-fade-up order-2 lg:order-1">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <Sparkles className="size-4" /> Vamos dar certo aqui mesmo
              </p>
              <h1 className="font-headline-lg text-headline-lg-mobile text-primary md:text-headline-lg">
                Essência Floral
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-on-surface-variant">
                Transformamos sentimentos em flores, com arranjos elegantes e entregas especiais para aniversários,
                namoro, desculpas e momentos que pedem cuidado.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/buques"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 font-semibold text-on-primary shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:bg-primary-container"
                >
                  Ver buquês
                </Link>
                <a
                  href={whatsappLink('Olá, gostaria de encomendar um buquê.')}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-outline-variant bg-surface-white px-7 font-semibold text-primary hover:-translate-y-0.5 hover:shadow-md"
                >
                  <MessageCircle className="size-5" /> Falar no WhatsApp
                </a>
              </div>
            </div>
            <div className="animate-fade-up order-1 lg:order-2" style={{ animationDelay: '120ms' }}>
              <HeroCarousel />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-shell">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-label-md text-sm font-semibold uppercase tracking-wide text-secondary">Galeria escolhida</p>
              <h2 className="mt-2 font-headline-md text-headline-md text-primary">Buquês em destaque</h2>
            </div>
            {buques.length > 0 && (
              <Link href="/buques" className="font-semibold text-primary hover:text-primary-container">
                Ver galeria completa
              </Link>
            )}
          </div>

          {carregando ? (
            <div className="grid gap-gutter md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton-card aspect-[3/4] rounded-xl" />
              ))}
            </div>
          ) : destaques.length ? (
            <div className="grid gap-gutter md:grid-cols-3">
              {destaques.map((buque, index) => (
                <div key={buque.id} className="animate-fade-up" style={{ animationDelay: `${index * 80}ms` }}>
                  <CardBuque buque={buque} />
                </div>
              ))}
            </div>
          ) : (
            <EstadoVazio
              titulo="Ainda sem buquês publicados"
              descricao="As novidades aparecerão aqui assim que forem adicionadas no painel administrativo."
            />
          )}
        </div>
      </section>

      <section className="section-padding bg-surface-container-low">
        <div className="container-shell">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-label-md text-sm font-semibold uppercase tracking-wide text-secondary">Provas sociais</p>
              <h2 className="mt-2 font-headline-md text-headline-md text-primary">Entregas recentes</h2>
            </div>
            {entregas.length > 0 && (
              <Link href="/entregas" className="font-semibold text-primary hover:text-primary-container">
                Ver momentos entregues
              </Link>
            )}
          </div>

          {carregando ? (
            <div className="flex gap-5 overflow-hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton-card min-w-[280px] aspect-video rounded-xl sm:min-w-[360px]" />
              ))}
            </div>
          ) : entregas.length ? (
            <EntregaCarousel entregas={entregas.slice(0, 6)} />
          ) : (
            <EstadoVazio
              titulo="Ainda sem entregas publicadas"
              descricao="Partilhe fotos das entregas realizadas no admin para inspirar novos clientes."
            />
          )}
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="animate-fade-up">
            <p className="font-label-md text-sm font-semibold uppercase tracking-wide text-secondary">Cuidado em cada detalhe</p>
            <h2 className="mt-2 font-headline-md text-headline-md text-primary">Flores que chegam bonitas, pontuais e com intenção.</h2>
            <div className="mt-6 grid gap-4 text-on-surface-variant">
              {['Seleção diária de flores frescas', 'Cartões personalizados', 'Entrega no Uíge e arredores'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-primary" /> {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {depoimentos.map((depoimento, index) => (
              <article
                key={depoimento.nome}
                className="card-interactive animate-fade-up rounded-xl p-6"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 flex text-tertiary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-tertiary" />
                  ))}
                </div>
                <p className="text-sm leading-6 text-on-surface-variant">&quot;{depoimento.texto}&quot;</p>
                <p className="mt-4 font-semibold text-primary">{depoimento.nome}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
