# Especificação do projeto (v1, outubro de 2026)

Fonte original: `doc/portfolio-especificacao.pdf` (local, não versionado). Este arquivo é a referência versionada.

Legenda: **DECIDIDO** = requisito fixo · **PROPOSTA** = ponto de partida ajustável · **EM ABERTO** = perguntar ao autor.

## 1. Visão geral (DECIDIDO)

Portfólio de desenvolvedor (mobile, web e automação): apresenta o autor, lista projetos com páginas de case e oferece contato. Área admin privada para adicionar, editar e excluir projetos (novas funções virão com o tempo).

- Bilíngue: português (padrão) e inglês.
- Modo claro e escuro, alternância pelo usuário e respeito à preferência do sistema.
- SEO: páginas públicas renderizadas no servidor ou geradas estaticamente.
- Custo zero de infraestrutura.

## 2. Stack (DECIDIDO)

| Camada         | Tecnologia                              | Observações |
|----------------|-----------------------------------------|-------------|
| Framework      | Next.js (App Router) + TypeScript       | Front-end apenas; sem API routes como backend próprio |
| Estilo         | Tailwind CSS + shadcn/ui                | Cores via variáveis CSS |
| Idiomas        | next-intl                               | Rotas prefixadas `/pt/...` e `/en/...` |
| Tema           | next-themes                             | Classe `.dark` no `html` |
| Animação       | Framer Motion                           | Moderado; respeitar `prefers-reduced-motion` |
| Formulários    | React Hook Form + Zod                   | Admin e contato |
| Dados no admin | TanStack Query                          | Cache e mutations do CRUD |
| Backend        | Supabase                                | Postgres, Auth, Storage, RLS. Sem Java/Spring |
| Hospedagem     | Cloudflare Workers                      | `@opennextjs/cloudflare` |

Todo acesso a dados passa por `src/lib/api/`.

## 3. Identidade visual (DECIDIDO)

**Fonte:** Geist (títulos e texto), Geist Mono (código), via `next/font` (pacote `geist` ou `next/font/google`). Pesos: títulos 700, texto 400, destaques 500.

**Cores:**

| Token           | Claro     | Escuro    | Uso |
|-----------------|-----------|-----------|-----|
| `--primary`     | `#010066` | `#010066` | Marca. Claro: botões principais, destaques. Escuro: base do fundo, não usar em texto |
| `--secondary`   | `#6D4AFF` | `#6D4AFF` | Roxo elétrico. Botões no escuro, detalhes, hover |
| `--background`  | `#FFFFFF` | `#06061F` | Fundo da página |
| `--card`        | `#F5F5FA` | `#0F0F35` | Cards e superfícies elevadas |
| `--foreground`  | `#0E0E1A` | `#F2F2F8` | Texto principal |
| `--muted`       | `#5C5C70` | `#A3A3BC` | Texto secundário |
| `--border`      | `#E3E3EC` | `#22224A` | Bordas e divisórias |
| `--accent-text` | `#6D4AFF` | `#B9BAFF` | Links e palavras em destaque |

Regras: cinzas levemente azulados (nunca cinza neutro puro). Botão primário: fundo `--primary` no claro e `--secondary` no escuro, texto branco. Sem gradientes chamativos; visual limpo.

```css
/* src/app/globals.css */
:root {
  --primary: #010066;
  --secondary: #6D4AFF;
  --background: #FFFFFF;
  --card: #F5F5FA;
  --foreground: #0E0E1A;
  --muted: #5C5C70;
  --border: #E3E3EC;
  --accent-text: #6D4AFF;
}
.dark {
  --background: #06061F;
  --card: #0F0F35;
  --foreground: #F2F2F8;
  --muted: #A3A3BC;
  --border: #22224A;
  --accent-text: #B9BAFF;
}
```

## 4. Páginas e rotas (PROPOSTA)

| Página      | Rota                                   | Conteúdo |
|-------------|----------------------------------------|----------|
| Home        | `/[locale]`                            | Hero, destaques de projetos, tecnologias, chamada para contato |
| Sobre       | `/[locale]/sobre` (en: `/about`)       | Bio, trajetória, habilidades |
| Projetos    | `/[locale]/projetos` (en: `/projects`) | Lista com filtro: mobile, web, automação |
| Projeto     | `/[locale]/projetos/[slug]`            | Case: descrição, imagens, stack, links (repo, demo) |
| Contato     | `/[locale]/contato` (en: `/contact`)   | Formulário e links (e-mail, GitHub, LinkedIn) |
| Admin login | `/admin/login`                         | Supabase Auth. Sem i18n |
| Admin       | `/admin`, `/admin/projetos`            | Painel protegido: CRUD de projetos |

Textos fixos em `messages/pt.json` e `messages/en.json`. Conteúdo dos projetos vem do banco com campos nos dois idiomas.

## 5. Área admin (DECIDIDO + PROPOSTA)

- Decidido: admin privado para adicionar e excluir projetos, com espaço para novas funções.
- Proposta: único usuário admin (o autor), Supabase Auth (e-mail/senha ou magic link), cadastro público desativado.
- Proteção em duas camadas: middleware do Next redireciona `/admin` sem sessão + RLS no Supabase (escrita só para o admin).
- Funções iniciais: listar, criar, editar, excluir, publicar/despublicar; upload de imagens no Storage; ordenar destaques.

## 6. Modelo de dados (PROPOSTA)

```sql
create table projects (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title_pt     text not null,
  title_en     text not null,
  summary_pt   text,
  summary_en   text,
  content_pt   text,          -- markdown
  content_en   text,          -- markdown
  category     text check (category in ('mobile','web','automation')),
  tech_stack   text[] default '{}',
  cover_url    text,
  gallery_urls text[] default '{}',
  repo_url     text,
  demo_url     text,
  featured     boolean default false,
  published    boolean default false,
  sort_order   int default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
```

- RLS: leitura pública só de `published = true`; insert/update/delete só para o admin autenticado.
- Storage: bucket público `project-images` para leitura; upload restrito ao admin.
- Plano gratuito pausa após 7 dias sem atividade → Cron Trigger do Cloudflare com consulta leve a cada poucos dias.

## 7. Estrutura de pastas do front (PROPOSTA)

```
src/
  app/
    [locale]/
      layout.tsx
      page.tsx                 # Home
      sobre/page.tsx
      projetos/page.tsx
      projetos/[slug]/page.tsx
      contato/page.tsx
    admin/
      login/page.tsx
      layout.tsx               # protegido
      page.tsx
      projetos/...
    globals.css
  components/
    ui/                        # shadcn/ui
    layout/                    # Header, Footer, ThemeToggle, LanguageSwitch
    sections/                  # Hero, ProjectsGrid, etc.
    admin/
  lib/
    api/                       # ÚNICO ponto de acesso a dados (Supabase)
      projects.ts
    supabase/                  # clients (browser e server)
    validations/               # schemas Zod
  i18n/                        # config do next-intl
  types/
messages/
  pt.json
  en.json
middleware.ts                  # i18n + proteção do /admin
```

## 8. Convenções (PROPOSTA)

Ver [../rules/code.md](../rules/code.md).

## 9. Ordem de desenvolvimento

| # | Etapa | Status |
|---|-------|--------|
| 1 | Identidade visual (cores e fonte) | Concluída |
| 2 | Setup: Next + TS + Tailwind com tokens + Geist + next-themes + next-intl + shadcn/ui + estrutura de pastas | Próxima |
| 3 | Front das páginas públicas, seguindo referências do autor | Pendente |
| 4 | Supabase: tabela, RLS, storage, auth | Pendente |
| 5 | Área admin com CRUD | Pendente |
| 6 | Deploy no Cloudflare e cron de keep-alive | Pendente |

## 10. Em aberto

- Referências visuais e layout de cada página (o autor enviará).
- Conteúdo: textos, bio, lista de projetos e imagens.
- Domínio do site.
- Formulário de contato: serviço de e-mail ou tabela no Supabase.
- Funções extras do admin além do CRUD.
