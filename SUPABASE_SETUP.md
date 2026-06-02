# Configurar o Supabase — Essência Floral

Guia passo a passo para a **primeira vez**. Tempo estimado: **15–20 minutos**.

---

## 1. Criar conta e projecto

1. Aceda a [supabase.com](https://supabase.com) e crie uma conta gratuita.
2. Clique em **New project**.
3. Escolha um nome (ex.: `essencia-floral`), uma password forte para a base de dados e a região mais próxima.
4. Aguarde o projecto ficar pronto (1–2 minutos).

---

## 2. Obter as chaves da API

1. No menu lateral: **Project Settings** (ícone de engrenagem) → **API**.
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. No ficheiro `.env.local` na raiz do projecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
GEMINI_API_KEY=sua_chave_gemini_opcional
```

4. Reinicie o servidor: `npm run dev`.

---

## 3. Criar tabelas e permissões (SQL)

1. No Supabase: **SQL Editor** → **New query**.
2. Abra o ficheiro `supabase/schema.sql` deste repositório.
3. Copie **todo** o conteúdo e cole no editor.
4. Clique em **Run**.

Isto cria:
- Tabela `buques` (nome, preço, categoria, descrição, imagem_url)
- Tabela `entregas` (título, data, descrição, imagem_url)
- Políticas de leitura pública e escrita só para utilizadores autenticados
- Bucket `imagens` para fotos

---

## 4. Criar utilizador administrador

1. Menu lateral: **Authentication** → **Users**.
2. Clique em **Add user** → **Create new user**.
3. Introduza o e-mail e password que usará no login admin.
4. Marque **Auto Confirm User** (para não precisar de confirmar e-mail).
5. Guarde.

Login admin: `http://localhost:3000/admin/login`

---

## 5. Verificar o Storage (fotos)

1. Menu lateral: **Storage**.
2. Deve existir o bucket **`imagens`** com etiqueta **Public**.
3. Se não existir:
   - **New bucket**
   - Nome: `imagens`
   - Marque **Public bucket**
   - Create

As fotos ficam em pastas `buques/` e `entregas/` dentro deste bucket. O site guarda apenas a **URL** — não carrega ficheiros pesados.

---

## 6. Testar o fluxo completo

1. Faça login em `/admin/login`.
2. Vá a **Buquês** → preencha o formulário → escolha uma foto → **Publicar buquê**.
3. Abra `/buques` noutro separador — a publicação deve aparecer.
4. Repita em **Entregas** → verifique em `/entregas` e na home.

---

## Problemas comuns

| Erro | Solução |
|------|---------|
| `row-level security` ao guardar | Execute de novo o `schema.sql` (secção das políticas RLS). |
| `Bucket not found` | Crie o bucket `imagens` público no Storage. |
| Login funciona mas não redireciona | Reinicie `npm run dev` e limpe cookies do site. |
| Página pública vazia | Normal se ainda não publicou nada — adicione conteúdo no admin. |
| Upload falha | Confirme que está autenticado e que o bucket `imagens` é público. |

---

## Resumo do fluxo de fotos

```
Admin escolhe ficheiro → comprime no browser → upload Supabase Storage → URL guardada na tabela → site mostra a URL
```

Assim o site permanece leve: só carrega imagens optimizadas via link, não ficheiros embebidos.
