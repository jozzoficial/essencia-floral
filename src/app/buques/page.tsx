'use client';

import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import CardBuque from '@/components/ui/CardBuque';
import { EstadoVazio } from '@/components/ui/EstadoVazio';
import { ImagemPublicacao } from '@/components/ui/ImagemPublicacao';
import { Buque } from '@/types';
import { categorias, formatarKwanza, whatsappLink } from '@/lib/data';
import { listarBuques } from '@/lib/publicacoes';

const faixas = [
  { id: 'todos', label: 'Todos os preços' },
  { id: 'ate-20', label: 'Até 20k' },
  { id: '20-30', label: '20k a 30k' },
  { id: '30-mais', label: '30k+' },
];

export default function BuquesPage() {
  const [buques, setBuques] = useState<Buque[]>([]);
  const [categoria, setCategoria] = useState('Todos');
  const [faixa, setFaixa] = useState('todos');
  const [visiveis, setVisiveis] = useState(6);
  const [selecionado, setSelecionado] = useState<Buque | null>(null);
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      const { data, error } = await listarBuques();
      setBuques(data);
      setErro(error);
      setCarregando(false);
    }
    carregar();
  }, []);

  const filtrados = useMemo(() => {
    return buques.filter((buque) => {
      const categoriaOk = categoria === 'Todos' || buque.categoria === categoria;
      const preco = Number(buque.preco);
      const precoOk =
        faixa === 'todos' ||
        (faixa === 'ate-20' && preco <= 20000) ||
        (faixa === '20-30' && preco > 20000 && preco <= 30000) ||
        (faixa === '30-mais' && preco > 30000);
      return categoriaOk && precoOk;
    });
  }, [buques, categoria, faixa]);

  const toggleFavorito = (buque: Buque) => {
    setFavoritos((atual) => {
      const proximo = new Set(atual);
      if (proximo.has(buque.id)) proximo.delete(buque.id);
      else proximo.add(buque.id);
      return proximo;
    });
  };

  return (
    <div className="bg-surface">
      <section className="container-shell py-14 md:py-20">
        <div className="max-w-3xl animate-fade-up">
          <p className="font-label-md text-sm font-semibold uppercase tracking-wide text-secondary">Galeria completa</p>
          <h1 className="mt-3 font-headline-lg text-headline-lg-mobile text-primary md:text-headline-lg">Buquês para cada intenção</h1>
          <p className="mt-4 text-body-lg text-on-surface-variant">
            Filtre por ocasião, veja detalhes e solicite o arranjo diretamente pelo WhatsApp.
          </p>
        </div>

        <div className="mt-10 grid gap-4 rounded-xl bg-surface-container-low p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex flex-wrap gap-2">
            {categorias.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCategoria(item);
                  setVisiveis(6);
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  categoria === item ? 'bg-primary text-on-primary shadow-md' : 'bg-white text-on-surface-variant hover:text-primary'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <select
            value={faixa}
            onChange={(e) => {
              setFaixa(e.target.value);
              setVisiveis(6);
            }}
            className="focus-ring min-h-11 rounded-full border border-outline-variant bg-white px-4 text-sm text-on-surface"
          >
            {faixas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {carregando && (
          <div className="mt-10 grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-card aspect-[3/4] rounded-xl" />
            ))}
          </div>
        )}

        {!carregando && erro && (
          <p className="mt-6 rounded-lg bg-error-container p-4 text-sm text-error">{erro}</p>
        )}

        {!carregando && !buques.length && (
          <div className="mt-10">
            <EstadoVazio
              titulo="Nenhum buquê publicado ainda"
              descricao="Volte em breve — estamos a preparar novos arranjos. Enquanto isso, fale connosco pelo WhatsApp."
              acao={{ href: whatsappLink('Olá, gostaria de saber que buquês têm disponíveis.'), label: 'Pedir sugestões' }}
            />
          </div>
        )}

        {!carregando && buques.length > 0 && (
          <>
            <div className="mt-10 grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtrados.slice(0, visiveis).map((buque, index) => (
                <div key={buque.id} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <CardBuque
                    buque={buque}
                    favorito={favoritos.has(buque.id)}
                    onFavorito={toggleFavorito}
                    onDetalhes={setSelecionado}
                  />
                </div>
              ))}
            </div>

            {!filtrados.length && (
              <div className="mt-10 rounded-xl bg-surface-container-low p-8 text-center text-on-surface-variant">
                Nenhum buquê encontrado para estes filtros.
              </div>
            )}

            {visiveis < filtrados.length && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setVisiveis((atual) => atual + 4)}
                  className="rounded-full bg-primary px-7 py-3 font-semibold text-on-primary hover:-translate-y-0.5 hover:bg-primary-container hover:shadow-lg"
                >
                  Carregar mais
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {selecionado && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/55 p-4">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-surface-white shadow-2xl animate-scale-in">
            <button
              type="button"
              onClick={() => setSelecionado(null)}
              aria-label="Fechar detalhes"
              className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white text-primary shadow-sm"
            >
              <X className="size-5" />
            </button>
            <div className="grid md:grid-cols-2">
              <div className="relative min-h-[340px]">
                <ImagemPublicacao src={selecionado.imagem_url} alt={selecionado.nome} sizes="(min-width: 768px) 50vw, 100vw" />
              </div>
              <div className="p-8">
                <p className="text-sm font-semibold uppercase tracking-wide text-secondary">{selecionado.categoria || 'Especial'}</p>
                <h2 className="mt-2 font-headline-md text-headline-md text-primary">{selecionado.nome}</h2>
                <p className="mt-4 text-on-surface-variant">{selecionado.descricao}</p>
                <p className="mt-6 text-2xl font-bold text-primary">{formatarKwanza(Number(selecionado.preco))}</p>
                <a
                  href={whatsappLink(`Olá, quero solicitar o buquê ${selecionado.nome}.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 font-semibold text-white hover:shadow-lg"
                >
                  <MessageCircle className="size-5" /> Solicitar via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
