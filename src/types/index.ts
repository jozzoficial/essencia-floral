export interface Buque {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  categoria?: string;
  imagem_url?: string;
  created_at?: string;
}

export interface Entrega {
  id: string;
  titulo: string;
  descricao?: string;
  data: string;
  imagem_url?: string;
  created_at?: string;
}

export interface MensagemChat {
  role: 'user' | 'assistant';
  content: string;
}
