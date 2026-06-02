import Image from 'next/image';
import Link from 'next/link';
import { HeartHandshake, Leaf, MapPin, ShieldCheck } from 'lucide-react';
import { sobreImage } from '@/lib/data';

const valores = [
  {
    titulo: 'Frescura',
    descricao: 'Selecionamos flores com atenção diária para garantir cor, textura e duração.',
    icon: Leaf,
  },
  {
    titulo: 'Cuidado humano',
    descricao: 'Cada cartão, laço e entrega é pensado para respeitar a emoção do momento.',
    icon: HeartHandshake,
  },
  {
    titulo: 'Confiança',
    descricao: 'Mantemos comunicação clara, horários combinados e confirmação após a entrega.',
    icon: ShieldCheck,
  },
];

export default function SobrePage() {
  return (
    <div className="bg-surface">
      <section className="container-shell grid gap-12 py-14 md:grid-cols-2 md:items-center md:py-20">
        <div>
          <p className="font-label-md text-sm font-semibold uppercase tracking-wide text-secondary">
            A nossa história
          </p>
          <h1 className="mt-3 font-headline-lg text-headline-lg-mobile text-primary md:text-headline-lg">
            Flores com alma, feitas no Uíge desde 2020.
          </h1>
          <div className="mt-6 space-y-4 text-body-lg text-on-surface-variant">
            <p>
              A Essência Floral nasceu da vontade de transformar gestos simples em memórias
              bonitas. Trabalhamos com arranjos elegantes, atendimento próximo e uma equipa que
              entende que flores quase sempre carregam uma mensagem importante.
            </p>
            <p>
              Atendemos aniversários, namoro, pedidos de desculpas, cerimónias e presentes
              corporativos, sempre com composição cuidada e entrega dedicada no Uíge e arredores.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/buques"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 font-semibold text-on-primary hover:bg-primary-container"
            >
              Ver buquês
            </Link>
            <Link
              href="/contato"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary px-7 font-semibold text-primary hover:bg-primary hover:text-on-primary"
            >
              Contactar
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-5 -top-5 hidden h-28 w-28 rounded-full bg-secondary-container md:block" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={sobreImage}
              alt="Interior de boutique floral com equipa a preparar buquês"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-14 md:py-20">
        <div className="container-shell">
          <div className="grid gap-6 md:grid-cols-3">
            {valores.map(({ titulo, descricao, icon: Icon }) => (
              <article key={titulo} className="card-soft rounded-xl p-6">
                <div className="grid size-12 place-items-center rounded-full bg-primary-fixed text-primary">
                  <Icon className="size-6" />
                </div>
                <h2 className="mt-5 font-headline-sm text-[22px] text-primary">{titulo}</h2>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant">{descricao}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-14 md:py-20">
        <div className="rounded-2xl bg-primary p-8 text-on-primary md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-on-primary/80">
                <MapPin className="size-4" /> Uíge, Angola
              </p>
              <h2 className="mt-3 font-headline-md text-headline-md">
                Vamos dar certo aqui mesmo.
              </h2>
            </div>
            <Link
              href="/contato"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 font-semibold text-primary hover:bg-surface-container-low"
            >
              Falar connosco
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
