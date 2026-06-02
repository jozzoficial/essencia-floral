import { Buque, Entrega } from '@/types';

export const WHATSAPP_NUMBER = '244928554408';
export const WHATSAPP_DISPLAY = '+244 928 554 408';
export const CONTACT_EMAIL = 'essencia.floral2@gmail.com';

export const categorias = [
  'Todos',
  'Aniversário',
  'Namoro',
  'Desculpas',
  'Casual',
  'Corporativo',
];

/** Imagens decorativas do hero, estão locais no projeto. */

export const heroSlides = [
  {
    src: '/snackbar/snack01.png',
    alt: 'Buquê Lussati para momentos especiais',
    legenda: 'Buquê Lussati para momentos especiais',
  },
  {
    src: '/snackbar/snack02.png',
    alt: 'Rosas para aniversários',
    legenda: 'Rosas para aniversários',
  },
  {
    src: '/snackbar/snack03.png',
    alt: 'Loja da essência floral',
    legenda: 'Loja da essência floral',
  },
  {
    src: '/snackbar/snack04.png',
    alt: 'Elegância para presentes únicos',
    legenda: 'Elegância para presentes únicos',
  },
];


export const sobreImage =
  '/snackbar/snack05.png';

export function formatarKwanza(valor: number) {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    maximumFractionDigits: 0,
  }).format(valor);
}

export function whatsappLink(mensagem: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
}

export function formatarData(data: string) {
  return new Intl.DateTimeFormat('pt-AO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(data));
}

export function mensagemErroSupabase(erro: unknown, fallback: string) {
  if (erro && typeof erro === 'object' && 'message' in erro && typeof erro.message === 'string') {
    if (erro.message.includes('row-level security')) {
      return 'Sem permissão. Confirme que está autenticado e que as políticas RLS do Supabase estão configuradas.';
    }
    if (erro.message.includes('Bucket not found')) {
      return 'Bucket "imagens" não encontrado. Crie-o no Supabase Storage (ver guia de configuração).';
    }
    return erro.message;
  }
  return fallback;
}
