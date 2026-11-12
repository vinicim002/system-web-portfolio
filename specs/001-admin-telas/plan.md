# Plano de implementação: Telas da área admin

**Branch**: `main` (sem branch própria) | **Data**: 2026-11-11 | **Especificação**: [spec.md](./spec.md)

**Entrada**: especificação em `specs/001-admin-telas/spec.md`

## Resumo

Primeira entrega do admin, **só de telas** (princípio VII). O admin ganha um layout raiz próprio em
`src/app/admin/`, em português e fora das rotas com idioma, com:

- login só visual, moldura com menu (Início, Projetos, Sistemas) e aviso fixo de dados de exemplo;
- Início e Sistemas com a grade dos sistemas do autor e páginas "em construção" por sistema;
- gestão completa de projetos: lista com busca e filtros, formulário com todos os campos,
  pré-visualização de imagens e de markdown, publicar, destacar, ordenar e excluir.

As telas só conhecem os **contratos dos serviços** ([contracts/servicos.md](./contracts/servicos.md)).
A implementação local guarda tudo em memória, a partir dos 5 projetos atuais, e volta ao estado
inicial ao recarregar. Depois da revisão do autor, ela será trocada pelo Supabase sem mexer nas telas.

## Contexto técnico

**Linguagem/versão**: TypeScript em modo estrito; Next.js 16.4.6 (App Router, `cacheComponents` e
`partialPrefetching` ativos), React 19.3.

**Dependências principais**:

| Dependência | Uso | Situação |
|---|---|---|
| Next.js, React | Rotas, layouts e telas | Já instalado |
| Tailwind CSS v4 + shadcn/ui + `lucide-react` | Estilo com os tokens da marca, componentes acessíveis e ícones | Instalado; adicionar componentes (`research.md`, item 12) |
| `next-intl` | Textos do admin no namespace `admin` de `messages/pt.json` | Já instalado |
| `next-themes` | Tema claro e escuro, reaproveitando `Providers` | Já instalado |
| React Hook Form + Zod + `@hookform/resolvers` | Formulário de projeto e validação | Já instalado |
| `react-markdown` | Pré-visualização do conteúdo (via `ProjectContent`) | Já instalado |
| `@tanstack/react-query` | Estado das telas sobre os serviços | **Instalar** |
| `sonner` (via shadcn) | Confirmações breves das ações | **Instalar** |
| Vitest | Testes do serviço local e da validação | **Instalar** (dev) |

**Armazenamento**: memória do navegador, no módulo da implementação local. Nada persiste (RF-022).

**Testes**: Vitest para `projects.local.ts` e `validations/project.ts`. Telas conferidas pelo
[quickstart.md](./quickstart.md) e por prints nos dois temas e no celular.

**Plataforma-alvo**: navegadores atuais de computador e celular; `http://localhost:3000/admin`.

**Tipo de projeto**: app web (front-end Next.js em `system-portfolio-web-frontend/`). O backend
(`system-portfolio-web-backend/`) não muda nesta entrega.

**Metas de desempenho**: troca de tela dentro do admin parece imediata; cada ação reflete na tela em
até 1 s (CS-004), mesmo com a espera simulada de ~150 ms.

**Restrições**:

- Sem autenticação real, gravação no Supabase, upload no Storage nem invalidação de cache
  (princípio VII).
- Toda leitura e mudança passa pelos serviços de `src/lib/api/admin/` (princípio III).
- Nenhum texto de interface direto nos componentes (princípio I).
- Cores só pelos tokens; contraste AA, foco visível e celular sem rolagem lateral (princípio V).
- O bundle do site público não importa nada do admin.

**Escala/escopo**: 1 usuário, 8 rotas, 3 entidades (Projeto, Sistema monitorado, Imagem em
pré-visualização), 5 projetos e 4 sistemas iniciais.

## Verificação da constituição

*Gate antes da Fase 0, verificado de novo depois da Fase 1.*

| Princípio | Como o plano cumpre | Situação |
|---|---|---|
| I. Português e textos separados | Artefatos em português. Textos do admin no namespace `admin` de `messages/pt.json`, sem versão em inglês, como permite o princípio I desde a versão 1.1.1 | ✅ |
| II. Spec e dossiê como fonte | Os projetos iniciais vêm de `projects.mock.ts`, que segue o dossiê. Os resumos de sistemas são marcados como exemplo na tela | ✅ |
| III. Camada de dados isolada | Telas usam hooks sobre `AdminProjectsService`/`AdminSystemsService`; nenhum componente acessa o Supabase | ✅ |
| IV. Segurança por RLS | Nada novo é exposto: o admin desta entrega não fala com o banco. A tela de login não guarda credenciais | ✅ |
| V. Visual, acessibilidade e movimento | Mesmos tokens, Geist e temas; componentes shadcn acessíveis; sem efeitos WebGL no admin | ✅ |
| VI. Páginas públicas rápidas | Admin em layout raiz separado, com `noindex`; não entra no bundle do site | ✅ |
| VII. Telas primeiro no admin | Só implementação local; login só visual; nenhuma rota bloqueada; integração real só depois da revisão | ✅ |

**Depois da Fase 1**: o modelo de dados, os contratos e o guia de validação mantêm todos os itens
acima. Nenhuma violação; a seção "Acompanhamento de complexidade" não é necessária.

## Estrutura do projeto

### Documentação (desta funcionalidade)

```text
specs/001-admin-telas/
├── plan.md              # Este arquivo
├── research.md          # Fase 0: decisões técnicas
├── data-model.md        # Fase 1: entidades e regras
├── quickstart.md        # Fase 1: guia de validação
├── contracts/
│   ├── rotas.md         # Rotas e menu do admin
│   └── servicos.md      # Contratos dos serviços e hooks
├── checklists/
│   └── requirements.md  # Qualidade da especificação
└── tasks.md             # Fase 2 (/speckit-tasks)
```

### Código-fonte

```text
system-portfolio-web-frontend/
├── messages/pt.json                    # + namespace "admin"
├── src/
│   ├── app/admin/
│   │   ├── layout.tsx                  # Layout raiz: html/body, fontes, Providers, intl pt, noindex
│   │   ├── not-found.tsx               # "Não encontrado" do admin
│   │   ├── [...missing]/page.tsx       # Captura rotas inexistentes → notFound()
│   │   ├── (auth)/login/page.tsx       # Login só visual
│   │   └── (painel)/
│   │       ├── layout.tsx              # Moldura: menu, barra, aviso de exemplo, QueryClient, Toaster
│   │       ├── page.tsx                # Início
│   │       ├── sistemas/page.tsx
│   │       ├── sistemas/[slug]/page.tsx
│   │       ├── projetos/page.tsx
│   │       ├── projetos/novo/page.tsx
│   │       └── projetos/[id]/page.tsx
│   ├── components/admin/
│   │   ├── auth/                       # LoginForm
│   │   ├── providers/                  # AdminQueryProvider (TanStack Query)
│   │   ├── layout/                     # AdminShell, AdminNav, AdminTopbar, SampleDataNotice
│   │   ├── systems/                    # SystemCard, SystemsGrid, SystemPlaceholder
│   │   ├── projects/                   # ProjectsTable, ProjectCardMobile, ProjectFilters,
│   │   │                               # ProjectForm, ImagePicker, GalleryEditor, MarkdownField,
│   │   │                               # DeleteProjectDialog
│   │   └── shared/                     # LeaveGuard, ConfirmLeaveDialog, NotFoundState, EmptyState
│   ├── components/ui/                  # + componentes shadcn do research.md, item 12
│   ├── lib/api/admin/
│   │   ├── projects.ts                 # Contrato + escolha da implementação
│   │   ├── projects.local.ts           # Implementação em memória
│   │   ├── systems.ts
│   │   ├── systems.local.ts
│   │   └── errors.ts                   # AdminServiceError
│   ├── lib/validations/project.ts      # Esquema Zod do formulário
│   ├── lib/slugify.ts
│   ├── hooks/admin/                    # use-admin-projects.ts, use-admin-systems.ts,
│   │                                   # use-unsaved-changes.ts (arquivos em kebab-case)
│   └── types/admin.ts                  # ProjectDraft, PreviewImage, MonitoredSystem
└── src/**/*.test.ts                    # Vitest (serviço local e validação)
```

**Decisão de estrutura**: o admin fica dentro do mesmo app Next.js do site, em
`src/app/admin/` com layout raiz próprio (`research.md`, item 1). Componentes, serviços e hooks do
admin ficam em pastas `admin/` para não se misturarem com o site público e para a troca pelo
Supabase ficar concentrada em `src/lib/api/admin/`.
