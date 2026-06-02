import { Buque, Entrega } from '@/types';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient';

export async function listarBuques(): Promise<{ data: Buque[]; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { data: [], error: 'Supabase não configurado.' };
  }

  const { data, error } = await supabase.from('buques').select('*').order('created_at', { ascending: false });
  return { data: (data as Buque[]) ?? [], error: error?.message ?? null };
}

export async function listarEntregas(): Promise<{ data: Entrega[]; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { data: [], error: 'Supabase não configurado.' };
  }

  const { data, error } = await supabase.from('entregas').select('*').order('data', { ascending: false });
  return { data: (data as Entrega[]) ?? [], error: error?.message ?? null };
}
