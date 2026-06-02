-- ============================================================
-- Essência Floral — schema Supabase
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabelas
CREATE TABLE IF NOT EXISTS buques (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    categoria TEXT NOT NULL,
    imagem_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS entregas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    data DATE NOT NULL,
    imagem_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

-- RLS
ALTER TABLE buques ENABLE ROW LEVEL SECURITY;
ALTER TABLE entregas ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas (se existirem) para evitar conflitos
DROP POLICY IF EXISTS "Leitura pública de buquês" ON buques;
DROP POLICY IF EXISTS "Escrita autenticada de buquês" ON buques;
DROP POLICY IF EXISTS "Insert buques autenticado" ON buques;
DROP POLICY IF EXISTS "Update buques autenticado" ON buques;
DROP POLICY IF EXISTS "Delete buques autenticado" ON buques;

DROP POLICY IF EXISTS "Leitura pública de entregas" ON entregas;
DROP POLICY IF EXISTS "Escrita autenticada de entregas" ON entregas;
DROP POLICY IF EXISTS "Insert entregas autenticado" ON entregas;
DROP POLICY IF EXISTS "Update entregas autenticado" ON entregas;
DROP POLICY IF EXISTS "Delete entregas autenticado" ON entregas;

-- Leitura pública (site)
CREATE POLICY "Leitura pública de buquês" ON buques FOR SELECT USING (true);
CREATE POLICY "Leitura pública de entregas" ON entregas FOR SELECT USING (true);

-- Escrita só para admin autenticado
CREATE POLICY "Insert buques autenticado" ON buques FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Update buques autenticado" ON buques FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Delete buques autenticado" ON buques FOR DELETE TO authenticated USING (true);

CREATE POLICY "Insert entregas autenticado" ON entregas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Update entregas autenticado" ON entregas FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Delete entregas autenticado" ON entregas FOR DELETE TO authenticated USING (true);

-- Storage bucket para fotos
INSERT INTO storage.buckets (id, name, public)
VALUES ('imagens', 'imagens', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Leitura pública de imagens" ON storage.objects;
DROP POLICY IF EXISTS "Upload autenticado de imagens" ON storage.objects;
DROP POLICY IF EXISTS "Atualização autenticada de imagens" ON storage.objects;
DROP POLICY IF EXISTS "Remoção autenticada de imagens" ON storage.objects;

CREATE POLICY "Leitura pública de imagens"
ON storage.objects FOR SELECT
USING (bucket_id = 'imagens');

CREATE POLICY "Upload autenticado de imagens"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'imagens');

CREATE POLICY "Atualização autenticada de imagens"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'imagens');

CREATE POLICY "Remoção autenticada de imagens"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'imagens');
