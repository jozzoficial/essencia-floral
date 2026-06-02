import { comprimirImagem } from '@/lib/compressImage';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient';

const BUCKET = 'imagens';

export async function uploadImagem(file: File, pasta: 'buques' | 'entregas') {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Adicione as variáveis no ficheiro .env.local.');
  }

  const optimizada = await comprimirImagem(file);
  const caminho = `${pasta}/${crypto.randomUUID()}.jpg`;

  const { data, error } = await supabase.storage.from(BUCKET).upload(caminho, optimizada, {
    cacheControl: '31536000',
    upsert: false,
    contentType: 'image/jpeg',
  });

  if (error) {
    throw error;
  }

  if (!data?.path) {
    throw new Error('Upload concluído mas sem caminho de ficheiro.');
  }

  return supabase.storage.from(BUCKET).getPublicUrl(data.path).data.publicUrl;
}
