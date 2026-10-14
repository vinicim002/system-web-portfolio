# Convenções de código

## Idioma

- Comentários, mensagens ao autor e textos de documentação: **português do Brasil**.
- Nomes de variáveis, funções, componentes, arquivos e pastas: **inglês**.
- Textos de interface nunca hardcoded: ficam em `messages/pt.json` e `messages/en.json` (next-intl).

## React / Next.js

- App Router, TypeScript estrito.
- **Server Components por padrão**; `'use client'` só onde houver interatividade.
- Componentes em PascalCase, arquivo `PascalCase.tsx`; hooks com prefixo `use`.
- Páginas públicas renderizadas no servidor ou estáticas (SEO).
- Não usar API routes do Next como backend próprio.

## Dados

- **Nunca** acessar o Supabase diretamente de componentes. Todo acesso passa por `src/lib/api/` (camada isolada, permite trocar de backend no futuro).
- Clients do Supabase em `src/lib/supabase/` (browser e server).
- Schemas Zod em `src/lib/validations/`; tipos em `src/types/`.
- Variáveis de ambiente públicas: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. **Nunca** expor a service role key no front.

## Estilo

- Tailwind + shadcn/ui; cores **sempre** via variáveis CSS (tokens da spec), nunca hex solto em componentes.
- Cinzas levemente azulados; sem cinza neutro puro; sem gradientes chamativos.
- Fonte Geist (texto/títulos) e Geist Mono (código). Pesos: títulos 700, texto 400, destaques 500.
- Animações com Framer Motion de forma moderada, respeitando `prefers-reduced-motion`.

## Qualidade

- Acessibilidade: contraste AA nos dois temas, foco visível, `alt` em imagens.
- Responsivo, mobile-first.
- Formulários com React Hook Form + Zod; CRUD do admin com TanStack Query.
