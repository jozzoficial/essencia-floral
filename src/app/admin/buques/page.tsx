'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { CampoFoto } from '@/components/admin/CampoFoto';
import { categorias, mensagemErroSupabase } from '@/lib/data';
import { ImagemPublicacao } from '@/components/ui/ImagemPublicacao';
import { supabase } from '@/lib/supabaseClient';
import { uploadImagem } from '@/lib/uploadImage';
import { Buque } from '@/types';

const categoriasAdmin = categorias.filter((c) => c !== 'Todos');

const formInicial = { nome: '', descricao: '', preco: '', categoria: categoriasAdmin[0] ?? 'Aniversário' };

export default function AdminBuques() {
  const [buques, setBuques] = useState<Buque[]>([]);
  const [form, setForm] = useState(formInicial);
  const [imagem, setImagem] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarBuques();
  }, []);

  useEffect(() => {
    if (!imagem) return;
    const url = URL.createObjectURL(imagem);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imagem]);

  async function carregarBuques() {
    setCarregando(true);
    const { data, error } = await supabase.from('buques').select('*').order('created_at', { ascending: false });
    if (error) setErro('Não foi possível carregar os buquês.');
    else setBuques((data as Buque[]) ?? []);
    setCarregando(false);
  }

  function limparForm() {
    setForm(formInicial);
    setImagem(null);
    setPreviewUrl(undefined);
    setEditandoId(null);
    setErro('');
  }

  function editarBuque(buque: Buque) {
    setForm({
      nome: buque.nome,
      descricao: buque.descricao || '',
      preco: buque.preco.toString(),
      categoria: buque.categoria || categoriasAdmin[0],
    });
    setPreviewUrl(buque.imagem_url);
    setImagem(null);
    setEditandoId(buque.id);
    setErro('');
  }

  async function enviarForm(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro('');

    try {
      let imagem_url = editandoId ? buques.find((b) => b.id === editandoId)?.imagem_url : undefined;

      if (imagem) {
        imagem_url = await uploadImagem(imagem, 'buques');
      }

      if (!imagem_url && !editandoId) {
        throw new Error('Adicione uma foto do buquê.');
      }

      const dados = {
        nome: form.nome.trim(),
        descricao: form.descricao.trim() || null,
        preco: parseFloat(form.preco),
        categoria: form.categoria,
        imagem_url: imagem_url ?? null,
      };

      const { error } = editandoId
        ? await supabase.from('buques').update(dados).eq('id', editandoId)
        : await supabase.from('buques').insert(dados);

      if (error) throw error;

      limparForm();
      await carregarBuques();
    } catch (err) {
      setErro(mensagemErroSupabase(err, 'Erro ao guardar o buquê.'));
    } finally {
      setEnviando(false);
    }
  }

  async function excluirBuque(id: string) {
    if (!confirm('Deseja excluir esta publicação?')) return;
    const { error } = await supabase.from('buques').delete().eq('id', id);
    if (error) setErro(mensagemErroSupabase(error, 'Não foi possível excluir.'));
    else await carregarBuques();
  }

  return (
    <AdminShell title="Buquês">
      <p className="mb-6 text-sm text-on-surface-variant">
        Adicione publicações com foto em ficheiro. A imagem é optimizada e guardada como URL — o site público só
        carrega esse link.
      </p>

      <form
        onSubmit={enviarForm}
        className="mb-10 grid gap-4 rounded-2xl border border-outline-variant/40 bg-surface-white p-6 shadow-sm"
      >
        <h2 className="font-semibold text-primary">{editandoId ? 'Editar publicação' : 'Nova publicação'}</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            Nome
            <input
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="focus-ring min-h-11 rounded-lg border border-outline-variant px-3"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Preço (Kz)
            <input
              type="number"
              min="0"
              step="100"
              value={form.preco}
              onChange={(e) => setForm({ ...form, preco: e.target.value })}
              className="focus-ring min-h-11 rounded-lg border border-outline-variant px-3"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
            Categoria
            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="focus-ring min-h-11 rounded-lg border border-outline-variant px-3"
            >
              {categoriasAdmin.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-2 text-sm font-semibold">
          Descrição
          <textarea
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            rows={3}
            className="focus-ring rounded-lg border border-outline-variant px-3 py-2"
          />
        </label>

        <CampoFoto
          label="Foto do buquê"
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
            {editandoId ? 'Guardar alterações' : 'Publicar buquê'}
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
          {buques.map((buque) => (
            <article
              key={buque.id}
              className="card-interactive overflow-hidden rounded-xl bg-surface-white ring-1 ring-outline-variant/40"
            >
              <div className="relative aspect-[4/3]">
                <ImagemPublicacao src={buque.imagem_url} alt={buque.nome} sizes="(min-width: 1024px) 33vw, 50vw" />
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold uppercase text-secondary">{buque.categoria}</p>
                <h3 className="mt-1 font-semibold text-primary">{buque.nome}</h3>
                <p className="mt-1 text-sm font-bold text-primary">
                  {Number(buque.preco).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => editarBuque(buque)}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary-container/30"
                  >
                    <Pencil className="size-4" /> Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => excluirBuque(buque.id)}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-error hover:bg-error-container"
                  >
                    <Trash2 className="size-4" /> Excluir
                  </button>
                </div>
              </div>
            </article>
          ))}
          {!buques.length && (
            <p className="text-sm text-on-surface-variant sm:col-span-2 lg:col-span-3">
              Ainda não há publicações. Adicione o primeiro buquê acima.
            </p>
          )}
        </div>
      )}
    </AdminShell>
  );
}
