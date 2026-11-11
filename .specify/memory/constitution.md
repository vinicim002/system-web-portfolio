# Constituição do Portfólio Vinicius Vila Nova

## Princípios Centrais

### I. Português, bilíngue e textos separados do código

- Os artefatos do projeto (especificação, plano, tarefas e demais documentos) DEVEM ser
  escritos em português do Brasil. Nomes de variáveis, funções e arquivos ficam em inglês.
- O site é bilíngue: português (padrão) e inglês, com rotas `/pt/...` e `/en/...`.
- Nenhum texto de interface pode ficar escrito direto nos componentes: os textos DEVEM
  ficar em `messages/pt.json` e `messages/en.json` (next-intl).

Motivo: requisito de idioma da especificação e público nos dois idiomas.

### II. Especificação e dossiê como fontes oficiais

- A especificação do projeto (`.claude/context/spec.md`) define o que construir. Itens
  marcados como **DECIDIDO** são fixos; itens **EM ABERTO** DEVEM ser perguntados ao autor
  antes de qualquer suposição.
- O dossiê de carreira (`.claude/context/career.md`) é a fonte dos textos do site.
  Experiências, datas, cargos, formação, certificações, métricas, clientes e resultados
  NUNCA são inventados.
- Conteúdo de exemplo só é permitido quando o autor pedir, e DEVE ficar marcado como
  exemplo no código (`placeholder: true`) e visível no site até ser trocado.
- Layouts finais seguem as referências visuais enviadas pelo autor.

Motivo: o portfólio representa uma pessoa real; conteúdo falso é um risco profissional.

### III. Dados por uma camada isolada e backend só no Supabase

- Componentes NUNCA acessam o Supabase diretamente: toda leitura e escrita passa por
  `src/lib/api/`, com tipos definidos em `src/types/`.
- O backend é apenas o Supabase (Postgres, Auth, Storage, RLS e Edge Functions). NÃO é
  permitido usar API routes ou Server Actions do Next como backend próprio.
- Lógica que exige segredo (ex.: envio de e-mail pelo Resend) roda em Edge Function, com a
  chave nos secrets do Supabase.
- Trocar a origem dos dados NÃO pode exigir mudança nos componentes das telas.

Motivo: permitir trocar de backend mexendo só na camada de dados e manter custo zero.

### IV. Segurança por RLS e segredos fora do código

- Toda tabela exposta DEVE ter RLS ativo. O público lê só o que está publicado; escrita é
  exclusiva de admins (`public.admins` + `public.is_admin()`).
- O cadastro público fica desligado.
- A chave `service_role` NUNCA vai para o front nem para o git. Só chaves públicas
  (`NEXT_PUBLIC_SUPABASE_*`) chegam ao navegador.
- `.env*` (exceto `.env.example`), chaves, tokens e certificados NUNCA são versionados.

Motivo: o site é público e a área admin escreve no mesmo banco.

### V. Visual da marca, acessibilidade e movimento responsável

- Cores, fontes e espaçamentos DEVEM vir dos tokens da especificação (variáveis CSS
  publicadas para o Tailwind). Cores soltas em componentes NÃO são permitidas, exceto
  logos de marcas.
- Fonte Geist; modo claro e escuro, respeitando a preferência do sistema.
- Contraste AA nos dois temas, foco visível, texto alternativo em imagens e layout
  mobile-first sem rolagem lateral.
- Animações DEVEM respeitar `prefers-reduced-motion`. Efeitos pesados (WebGPU/WebGL)
  rodam só no cliente e DEVEM ter alternativa quando o navegador não suportar.

Motivo: manter a identidade consistente e o site utilizável por qualquer pessoa.

### VI. Páginas públicas rápidas e indexáveis

- Páginas públicas DEVEM ser renderizadas no servidor ou geradas estaticamente (SEO).
- Server Components por padrão; `'use client'` só onde houver interatividade.
- Dados públicos usam cache (`"use cache"` + `cacheTag`) para que o admin possa
  invalidá-los ao salvar.

Motivo: o portfólio precisa ser encontrado e abrir rápido em qualquer aparelho.

## Restrições do projeto

- Stack decidida: Next.js (App Router) + TypeScript, Tailwind CSS + shadcn/ui, next-intl,
  next-themes, Framer Motion (padrão de animação; GSAP só para efeitos de trajetória/SVG),
  React Hook Form + Zod, TanStack Query no admin e Supabase.
- Hospedagem no Cloudflare Workers via `@opennextjs/cloudflare`. Custo zero de
  infraestrutura é um objetivo.
- Estrutura do repositório: `system-portfolio-web-frontend/` (Next.js) e
  `system-portfolio-web-backend/` (Supabase: migrations, seed, Edge Functions).
- Mudanças no banco são feitas só por migrations versionadas e testadas localmente antes
  de chegar ao projeto real.

## Fluxo de trabalho

- Cada funcionalidade nova segue o Spec Kit: `/speckit-specify` → `/speckit-plan` →
  `/speckit-tasks` → `/speckit-implement`, com os artefatos em `specs/NNN-nome/`.
- Antes de implementar, a especificação e as regras citadas na tarefa DEVEM ser lidas.
- Commits seguem Conventional Commits (prefixo em inglês, descrição em português) e têm
  um único autor: o dono do repositório. Coautores ou atribuição a ferramentas de IA são
  proibidos. Push só quando o autor pedir.
- Antes de concluir uma tarefa: typecheck, lint e build DEVEM passar, e a tela DEVE ser
  conferida nos temas claro e escuro e no celular.

## Governança

- Esta constituição prevalece sobre outras práticas do projeto. Em caso de conflito com a
  especificação, os documentos e a constituição DEVEM ser alinhados antes de qualquer
  código.
- Emendas são feitas com o comando `/speckit-constitution`, registradas neste arquivo e
  acompanhadas do motivo.
- Versionamento semântico: MAIOR para remover ou redefinir um princípio; MENOR para
  adicionar um princípio ou seção ou ampliar uma regra; CORREÇÃO para ajustes de texto.
- Todo plano e toda revisão de código DEVEM verificar a conformidade com estes
  princípios.

**Versão**: 1.0.0 | **Ratificada**: 2026-11-11 | **Última emenda**: 2026-11-11
