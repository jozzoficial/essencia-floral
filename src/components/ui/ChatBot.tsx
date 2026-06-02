'use client';

import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { MensagemChat } from '@/types';

export function ChatBot() {
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState<MensagemChat[]>([
    { role: 'assistant', content: 'Olá! Sou a assistente virtual da Essência Floral. Como posso ajudá-lo hoje?' },
  ]);
  const [input, setInput] = useState('');
  const [carregando, setCarregando] = useState(false);

  const enviarMensagem = async () => {
    if (!input.trim() || carregando) return;

    const texto = input.trim();
    const novaMensagem = { role: 'user' as const, content: texto };
    setMensagens((prev) => [...prev, novaMensagem]);
    setInput('');
    setCarregando(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: texto, historico: mensagens }),
      });
      const data = await res.json();
      if (!res.ok && !data.resposta) {
        throw new Error('Resposta inválida da API');
      }
      setMensagens((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.resposta || 'Pode falar connosco pelo WhatsApp para atendimento imediato.',
        },
      ]);
    } catch {
      setMensagens((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Desculpe, estou com problemas técnicos. Tente novamente ou fale pelo WhatsApp.',
        },
      ]);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      {!aberto && (
        <button
          type="button"
          onClick={() => setAberto(true)}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-primary p-4 text-on-primary shadow-lg hover:bg-primary-container"
          aria-label="Abrir atendimento"
        >
          <MessageCircle size={24} />
        </button>
      )}
      {aberto && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[min(520px,calc(100vh-32px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-white shadow-xl">
          <div className="flex items-center justify-between bg-primary p-4 text-on-primary">
            <span className="font-bold">Atendimento Essência Floral</span>
            <button type="button" onClick={() => setAberto(false)} aria-label="Fechar atendimento">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {mensagens.map((msg, idx) => (
              <div key={`${msg.role}-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-xl p-3 text-sm leading-6 ${
                    msg.role === 'user'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-low text-on-surface'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {carregando && <div className="text-center text-sm text-on-surface-variant">A escrever...</div>}
          </div>
          <div className="flex gap-2 border-t border-outline-variant/30 p-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
              placeholder="Digite sua mensagem..."
              className="focus-ring flex-1 rounded-full border border-outline-variant px-4 py-2"
            />
            <button
              type="button"
              onClick={enviarMensagem}
              disabled={carregando}
              className="grid size-10 place-items-center rounded-full bg-primary text-on-primary"
              aria-label="Enviar mensagem"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
