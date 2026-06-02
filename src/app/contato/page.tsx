'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { CONTACT_EMAIL, WHATSAPP_DISPLAY, whatsappLink } from '@/lib/data';

export default function ContatoPage() {
  const [enviado, setEnviado] = useState(false);

  const enviar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
    setEnviado(true);
  };

  return (
    <div className="bg-surface">
      <section className="container-shell grid gap-10 py-14 md:grid-cols-[0.9fr_1.1fr] md:py-20">
        <div>
          <p className="font-label-md text-sm font-semibold uppercase tracking-wide text-secondary">
            Contacto
          </p>
          <h1 className="mt-3 font-headline-lg text-headline-lg-mobile text-primary md:text-headline-lg">
            Conte-nos que sentimento quer enviar.
          </h1>
          <p className="mt-4 text-body-lg text-on-surface-variant">
            Responderemos com sugestões de buquês, disponibilidade e opções de entrega no Uíge.
          </p>

          <div className="mt-8 grid gap-4">
            <a
              href={whatsappLink('Olá, gostaria de saber sobre um buquê.')}
              target="_blank"
              rel="noreferrer"
              className="card-soft flex items-center gap-4 rounded-xl p-5 hover:-translate-y-1"
            >
              <span className="grid size-11 place-items-center rounded-full bg-[#25D366]/12 text-[#128C4A]">
                <MessageCircle className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-primary">WhatsApp</p>
                <p className="text-sm text-on-surface-variant">{WHATSAPP_DISPLAY}</p>
              </div>
            </a>
            <a href={`tel:${WHATSAPP_DISPLAY.replaceAll(' ', '')}`} className="card-soft flex items-center gap-4 rounded-xl p-5 hover:-translate-y-1">
              <span className="grid size-11 place-items-center rounded-full bg-primary-fixed text-primary">
                <Phone className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-primary">Telefone</p>
                <p className="text-sm text-on-surface-variant">{WHATSAPP_DISPLAY}</p>
              </div>
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="card-soft flex items-center gap-4 rounded-xl p-5 hover:-translate-y-1">
              <span className="grid size-11 place-items-center rounded-full bg-secondary-container text-secondary">
                <Mail className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-primary">E-mail</p>
                <p className="text-sm text-on-surface-variant">{CONTACT_EMAIL}</p>
              </div>
            </a>
            <div className="card-soft flex items-center gap-4 rounded-xl p-5">
              <span className="grid size-11 place-items-center rounded-full bg-tertiary-fixed text-tertiary">
                <MapPin className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-primary">Endereço</p>
                <p className="text-sm text-on-surface-variant">Rua das Flores, Uíge, Angola</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-soft rounded-2xl p-6 md:p-8">
          <h2 className="font-headline-md text-headline-md text-primary">Enviar mensagem</h2>
          <form onSubmit={enviar} className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input name="nome" required placeholder="Nome" className="focus-ring min-h-12 rounded-lg border border-outline-variant px-4" />
              <input name="telefone" required placeholder="Telefone" className="focus-ring min-h-12 rounded-lg border border-outline-variant px-4" />
            </div>
            <input type="email" name="email" required placeholder="E-mail" className="focus-ring min-h-12 rounded-lg border border-outline-variant px-4" />
            <textarea name="mensagem" required rows={5} placeholder="Mensagem" className="focus-ring rounded-lg border border-outline-variant px-4 py-3" />
            {enviado && (
              <p className="flex items-center gap-2 rounded-lg bg-primary-fixed p-3 text-sm font-semibold text-on-primary-fixed">
                <CheckCircle2 className="size-4" /> Mensagem registada. Entraremos em contacto em breve.
              </p>
            )}
            <button
              type="submit"
              className="min-h-12 rounded-full bg-primary px-7 font-semibold text-on-primary hover:bg-primary-container"
            >
              Enviar mensagem
            </button>
          </form>
        </div>
      </section>

      <section className="container-shell pb-16">
        <div className="overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-low">
          <iframe
            title="Mapa aproximado da Essência Floral"
            src="https://www.google.com/maps?q=U%C3%ADge%2C%20Angola&output=embed"
            className="h-[360px] w-full"
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
}
