'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { CampoFoto } from '@/components/admin/CampoFoto';
import { ImagemPublicacao } from '@/components/ui/ImagemPublicacao';
import { formatarData, mensagemErroSupabase } from '@/lib/data';
import { supabase } from '@/lib/supabaseClient';
import { uploadImagem } from '@/lib/uploadImage';
import { Entrega } from '@/types';
const formInicial = { titulo: '', descricao: '', data: new Date().toISOString().slice(0, 10) };

export default function AdminEntregas() {
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [form, setForm] = useState(formInicial);
  const [imagem, setImagem] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarEntregas();
  }, []);

  useEffect(() => {
    if (!imagem) return;
    const url = URL.createObjectURL(imagem);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imagem]);

  async function carregarEntregas() {
    setCarregando(true);
    const { data, error } = await supabase.from('entregas').select('*').order('data', { ascending: false });
    if (error) setErro('Não foi possível carregar as entregas.');
    else setEntregas((data as Entrega[]) ?? []);
    setCarregando(false);
  }

  function limparForm() {
    setForm(formInicial);
    setImagem(null);
    setPreviewUrl(undefined);
    setEditandoId(null);
    setErro('');
  }

  function editarEntrega(entrega: Entrega) {
    setForm({
      titulo: entrega.titulo,
      descricao: entrega.descricao || '',
      data: entrega.data.slice(0, 10),
    });
    setPreviewUrl(entrega.imagem_url);
    setImagem(null);
    setEditandoId(entrega.id);
    setErro('');
  }

  async function enviarForm(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro('');

    try {
      let imagem_url = editandoId ? entregas.find((item) => item.id === editandoId)?.imagem_url : undefined;

      if (imagem) {
        imagem_url = await uploadImagem(imagem, 'entregas');
      }

      if (!imagem_url && !editandoId) {
        throw new Error('Adicione uma foto da entrega.');
      }

      const dados = {
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim() || null,
        data: form.data,
        imagem_url: imagem_url ?? null,
      };

      const { error } = editandoId
        ? await supabase.from('entregas').update(dados).eq('id', editandoId)
        : await supabase.from('entregas').insert(dados);

      if (error) throw error;

      limparForm();
      await carregarEntregas();
    } catch (err) {
      setErro(mensagemErroSupabase(err, 'Erro ao guardar a entrega.'));    } finally {
      setEnviando(false);
    }
  }

  async function excluirEntrega(id: string) {
    if (!confirm('Deseja excluir esta publicação?')) return;
    const { error } = await supabase.from('entregas').delete().eq('id', id);
    if (error) setErro(mensagemErroSupabase(error, 'Não foi possível excluir.'));    else await carregarEntregas();
  }

  return (
    <AdminShell title="Entregas">
      <p className="mb-6 text-sm text-on-surface-variant">
        Registe entregas realizadas com foto. A imagem é comprimida no browser, enviada para o Supabase Storage e
        apenas a URL fica na base de dados.
      </p>

      <form
        onSubmit={enviarForm}
        className="mb-10 grid gap-4 rounded-2xl border border-outline-variant/40 bg-surface-white p-6 shadow-sm"
      >
        <h2 className="font-semibold text-primary">{editandoId ? 'Editar publicação' : 'Nova publicação'}</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
            Título
            <input
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className="focus-ring min-h-11 rounded-lg border border-outline-variant px-3"
              placeholder="Ex.: Surpresa de aniversário no Uíge"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Data da entrega
            <input
              type="date"
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
              className="focus-ring min-h-11 rounded-lg border border-outline-variant px-3"
              required
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-semibold">
          Descrição
          <textarea
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            rows={3}
            className="focus-ring rounded-lg border border-outline-variant px-3 py-2"
            placeholder="Conte brevemente o momento da entrega..."
          />
        </label>

        <CampoFoto
          label="Foto da entrega"
          previewUrl={previewUrl}
          onChange={setImagem}
          obrigatorio={!editandoId}
        />

        {erro && <p className="rounded-lg bg-error-container p-3 text-sm font-semibold text-error">{erro}</p>}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={enviando}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-on-primary disabled:opacity-60"
          >
            {enviando && <Loader2 className="size-4 animate-spin" />}
            {editandoId ? 'Guardar alterações' : 'Publicar entrega'}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={limparForm}
              className="min-h-11 rounded-full border border-outline-variant px-6 font-semibold text-on-surface-variant"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {carregando ? (
        <p className="text-sm text-on-surface-variant">A carregar...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entregas.map((entrega) => (
            <article
              key={entrega.id}
              className="card-interactive overflow-hidden rounded-xl bg-surface-white ring-1 ring-outline-variant/40"
            >
              <div className="relative aspect-[4/3]">
                <ImagemPublicacao src={entrega.imagem_url} alt={entrega.titulo} sizes="(min-width: 1024px) 33vw, 50vw" />
              </div>              <div className="p-4">
                <p className="text-xs font-semibold uppercase text-secondary">{formatarData(entrega.data)}</p>
                <h3 className="mt-1 font-semibold text-primary">{entrega.titulo}</h3>
                {entrega.descricao && (
                  <p className="mt-2 line-clamp-2 text-sm text-on-surface-variant">{entrega.descricao}</p>
                )}
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => editarEntrega(entrega)}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary-container/30"
                  >
                    <Pencil className="size-4" /> Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => excluirEntrega(entrega.id)}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-error hover:bg-error-container"
                  >
                    <Trash2 className="size-4" /> Excluir
                  </button>
                </div>
              </div>
            </article>
          ))}
          {!entregas.length && (
            <p className="text-sm text-on-surface-variant sm:col-span-2 lg:col-span-3">
              Ainda não há publicações. Adicione a primeira entrega acima.
            </p>
          )}
        </div>
      )}
    </AdminShell>
  );
}
