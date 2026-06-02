import Link from 'next/link';
import { Mail, MapPin, Phone, Flower2 } from 'lucide-react';
import { SiFacebook, SiInstagram } from '@icons-pack/react-simple-icons';
import { CONTACT_EMAIL, WHATSAPP_DISPLAY, whatsappLink } from '@/lib/data';

export function Rodape() {
  const links = [
    { href: '/', label: 'Início' },
    { href: '/buques', label: 'Buquês' },
    { href: '/entregas', label: 'Entregas' },
    { href: '/sobre', label: 'Sobre' },
    { href: '/contato', label: 'Contacto' },
  ];

  return (
    <footer className="bg-primary text-on-primary">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-on-primary text-primary">
              <Flower2 className="size-6" aria-hidden="true" />
            </span>
            <span className="font-headline-sm text-headline-sm font-bold">Essência Floral</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-on-primary/80">
            Transformamos sentimentos em flores frescas, com entregas cuidadas no Uíge e
            atendimento próximo para cada ocasião.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="https://www.instagram.com/essencia_fl0ral"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <SiInstagram className="size-5" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100075627889996"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <SiFacebook className="size-5" />
            </a>
          </div>
        </div>

        <nav>
          <h2 className="font-headline-sm text-lg font-semibold">Links rápidos</h2>
          <div className="mt-4 grid gap-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-on-primary/80 hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <div>
          <h2 className="font-headline-sm text-lg font-semibold">Contacto</h2>
          <div className="mt-4 grid gap-3 text-sm text-on-primary/80">
            <a
              href={whatsappLink('Olá, gostaria de saber sobre um buquê.')}
              className="flex items-center gap-3 hover:text-white"
            >
              <Phone className="size-4" /> {WHATSAPP_DISPLAY}
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-3 hover:text-white">
              <Mail className="size-4" /> {CONTACT_EMAIL}
            </a>
            <span className="flex items-center gap-3">
              <MapPin className="size-4" /> Uíge, Angola
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-on-primary/70">
        © 2026 Essência Floral. Todos os direitos reservados.
      </div>
    </footer>
  );
}