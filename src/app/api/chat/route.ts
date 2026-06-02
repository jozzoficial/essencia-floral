import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const geminiApiKey = process.env.GEMINI_API_KEY;
const modelosGemini = (process.env.GEMINI_MODEL ?? 'gemini-3.5-flash,gemini-2.5-flash-lite')
  .split(',')
  .map((modelo) => modelo.trim())
  .filter(Boolean);

async function gerarRespostaGemini(prompt: string) {
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY não configurada');
  }

  const ai = new GoogleGenAI({ apiKey: geminiApiKey });
  let ultimoErro: unknown;

  for (const model of modelosGemini) {
    try {
      const result = await ai.models.generateContent({ model, contents: prompt });
      const resposta = result.text?.trim();
      if (resposta) return resposta;
      throw new Error('Resposta vazia do modelo Gemini');
    } catch (error) {
      ultimoErro = error;
      console.warn(`Modelo ${model} indisponível:`, error);
    }
  }

  throw ultimoErro ?? new Error('Nenhum modelo Gemini disponível');
}

const CONTEXTO = `
Você é a assistente virtual da Essência Floral, uma floricultura localizada no Uíge, Angola.
Informações importantes:
- Fundada em 2020.
- Produtos: buquês para aniversário, namoro, desculpas, casamento, formaturas.
- Preços médios: entre 10.000 Kz e 50.000 Kz (Kwanza angolano).
- Entregas: realizamos em toda a cidade do Uíge e arredores.
- Contato: WhatsApp +244 923 000 000, e-mail geral@essenciafloral.ao.
- Site: essenciafloral.ao.

Instruções de resposta:
- Responda sempre em português de Angola.
- Seja simpática, profissional e acolhedora.
- Não invente informações sobre a empresa; use apenas o contexto fornecido.
- Se perguntarem sobre preços ou disponibilidade, sugira entrar em contato pelo WhatsApp para obter cotação atualizada.
- Mantenha respostas concisas (máximo 3 parágrafos).
`;

export async function POST(request: Request) {
  try {
    if (!geminiApiKey) {
      return NextResponse.json(
        { resposta: 'O assistente virtual não está configurado. Contacte-nos pelo WhatsApp.' },
        { status: 503 },
      );
    }

    const { mensagem, historico } = await request.json();

    if (!mensagem?.trim()) {
      return NextResponse.json({ resposta: 'Por favor, escreva uma mensagem.' }, { status: 400 });
    }

    const historicoLimitado = (historico ?? []).slice(-10);
    const conversaFormatada = historicoLimitado
      .map((msg: { role: string; content: string }) => `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}`)
      .join('\n');

    const prompt = `${CONTEXTO}\n\nHistórico da conversa:\n${conversaFormatada}\n\nUsuário: ${mensagem}\nAssistente:`;

    const resposta = await gerarRespostaGemini(prompt);

    return NextResponse.json({ resposta });
  } catch (error) {
    console.error('Erro no chat Gemini:', error);
    return NextResponse.json(
      {
        resposta:
          'Desculpe, estou com problemas técnicos no momento. Tente novamente mais tarde ou fale diretamente pelo WhatsApp.',
      },
      { status: 500 },
    );
  }
}
