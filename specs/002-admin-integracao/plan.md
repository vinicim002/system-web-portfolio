# Plano de implementação: Integração real da área admin

**Branch**: `main` (sem branch própria) | **Data**: 2026-11-12 | **Especificação**: [spec.md](./spec.md)

**Entrada**: especificação em `specs/002-admin-integracao/spec.md`

## Resumo

Segunda entrega do admin: troca a implementação local da 001 pela real, sem mudar as telas.

- **Entrada segura**: Supabase Auth com e-mail e senha + segundo fator TOTP obrigatório, guiado no
  `/admin/login` (cadastro por QR code no primeiro acesso, código nos seguintes), guarda no cliente
  no grupo `(painel)`, botão Sair e lembrete de segundo fator.
- **Banco exige o segundo fator**: `is_admin()` passa a exigir `aal2`; todas as policies de
  projetos e do Storage herdam a regra.
- **Projetos e imagens reais**: `projects.supabase.ts` com o mesmo contrato da 001; imagens no bucket
  `project-images/projects/<id>/`, com limpeza de órfãs.
- **Site atualizado em até 1 minuto**: rota `POST /api/revalidate` (só invalida cache, autorizada pelo
  Supabase) + tag cache D1 no Cloudflare.
- **Produção**: `/admin` liberado com `ADMIN_ENABLED=true` por último.

## Contexto técnico

**Linguagem/versão**: TypeScript estrito; Next.js 16.4.6 (App Router, `cacheComponents`,
`partialPrefetching`), React 19.3; SQL (Postgres 17 do Supabase); Deno não muda.

**Dependências principais**:

| Dependência | Uso | Situação |
|---|---|---|
| `@supabase/supabase-js` 2.117.3 | Auth (senha + MFA TOTP), banco, Storage | Já instalado |
| TanStack Query, React Hook Form, Zod, shadcn/ui, next-intl | Telas da 001 | Já instalado |
| `@opennextjs/cloudflare` 1.20.14 | Tag cache D1 (`d1NextTagCache`) além do KV | Já instalado; configurar |
| Supabase CLI | Migrations, testes locais | Já em uso |

Nada novo a instalar (o QR code vem pronto do Supabase como SVG).

**Armazenamento**: Postgres (`projects`, `admins`), Storage (`project-images`), sessão no navegador;
no Cloudflare, KV (páginas) e D1 (marcas de invalidação).

**Testes**: Vitest para funções puras novas; SQL no Supabase local para RLS `aal1` × `aal2` e
`reorder_projects`; roteiro manual do [quickstart.md](./quickstart.md); preview do Cloudflare para a
invalidação.

**Plataforma-alvo**: navegadores atuais; produção em Cloudflare Workers (`viniciusvilanova.com`).

**Tipo de projeto**: app web (front Next.js + backend Supabase).

**Metas de desempenho**: login completo em menos de 30 s (CS-001); site atualizado em até 1 min
após salvar (CS-004).

**Restrições**:

- Componentes das telas da 001 sem mudança de layout (RF-011, CS-007).
- Nenhum acesso direto ao Supabase em componentes (princípio III).
- Migrations versionadas, testadas localmente antes do projeto real.
- Custo zero: só planos grátis (Supabase, Cloudflare KV e D1).

**Escala/escopo**: 1 admin, ~5 a 20 projetos, até 13 imagens por projeto.

## Verificação da constituição

*Gate antes da Fase 0, verificado de novo depois da Fase 1.*

| Princípio | Como o plano cumpre | Situação |
|---|---|---|
| I. Português e textos separados | Textos novos (login em etapas, segurança, erros) no namespace `admin` de `messages/pt.json` | ✅ |
| II. Spec e dossiê | Sem conteúdo novo do site; dados reais vêm do banco | ✅ |
| III. Camada isolada, backend só Supabase | Telas → hooks → `src/lib/api/admin/` (`projects.supabase.ts`, `auth.ts`, `revalidate.ts`). Rota `/api/revalidate` **não serve nem grava dados**: só invalida cache, com autorização do próprio Supabase — permitida pela exceção da emenda 1.1.2 | ✅ |
| IV. Segurança por RLS | `is_admin()` exige `aal2`; policies existentes herdam; cadastro público continua desligado; nenhuma chave secreta no front | ✅ |
| V. Visual e acessibilidade | Etapas novas com os mesmos componentes e tokens; foco e rótulos como na 001 | ✅ |
| VI. Páginas públicas rápidas e indexáveis | Continuam estáticas com `"use cache"` + `cacheTag("projects")`; invalidação sob demanda (o próprio princípio prevê o admin invalidando) | ✅ |
| VII. Telas primeiro | Telas revisadas e aprovadas (`specs/001-admin-telas/review.md`); integração só agora | ✅ |

**Depois da Fase 1**: os contratos mantêm todos os itens; o III fica coberto pela emenda 1.1.2.

## Estrutura do projeto

### Documentação (desta funcionalidade)

```text
specs/002-admin-integracao/
├── plan.md
├── research.md          # Fase 0
├── data-model.md        # Fase 1
├── quickstart.md        # Fase 1
├── contracts/
│   ├── servicos.md      # AdminProjectsService (Supabase) + AdminAuthService
│   ├── revalidacao.md   # POST /api/revalidate
│   └── rotas.md         # Etapas do login, guarda e moldura
├── checklists/requirements.md
└── tasks.md             # Fase 2 (/speckit-tasks)
```

### Código-fonte

```text
system-portfolio-web-backend/supabase/
├── config.toml                               # ligar [auth.mfa.totp] para testes locais
├── migrations/2026111xxxxxxx_admin_mfa.sql   # is_admin() com aal2 + reorder_projects()
└── tests/rls_mfa.sql                         # aal1 x aal2 (leitura, gravação, Storage, reorder)

system-portfolio-web-frontend/
├── messages/pt.json                          # + admin.auth.*, admin.security.*
├── next.config.ts                            # images.remotePatterns do Storage
├── open-next.config.ts                       # + tagCache D1
├── wrangler.jsonc                            # + d1_databases (NEXT_TAG_CACHE_D1); ADMIN_ENABLED no fim
└── src/
    ├── app/api/revalidate/route.ts           # só invalida a tag "projects"
    ├── app/admin/(auth)/login/page.tsx       # etapas: senha, cadastro do fator, código
    ├── app/admin/(painel)/seguranca/page.tsx # fatores + cadastrar outro
    ├── components/admin/auth/                # LoginForm (real), MfaEnroll, MfaVerify, AuthGate
    ├── components/admin/layout/              # + botão Sair, lembrete do segundo fator
    ├── lib/api/admin/
    │   ├── auth.ts                           # AdminAuthService
    │   ├── projects.supabase.ts              # mesma interface da 001
    │   ├── storage.ts                        # envio, caminhos e limpeza de órfãs
    │   ├── revalidate.ts                     # chama /api/revalidate
    │   └── projects.ts                       # escolhe Supabase ou local
    └── hooks/admin/use-admin-auth.ts
```

**Decisão de estrutura**: tudo do admin continua em `src/lib/api/admin/`, `src/hooks/admin/` e
`src/components/admin/`; a única peça fora é a rota de revalidação, que o Next exige em `src/app`.

## Acompanhamento de complexidade

| Desvio | Por que é necessário | Alternativa mais simples recusada porque |
|---|---|---|
| Rota `POST /api/revalidate` no Next (princípio III fala em "não usar API routes como backend próprio") | `revalidateTag` só roda no servidor do Next; é o único jeito de o site mostrar mudanças em até 1 min (RF-015) sem regenerar páginas o tempo todo. A rota não acessa dados do portfólio e a autorização é do Supabase (RLS `is_admin()` com `aal2`) | `cacheLife` de 1 min: regeneração constante estoura as 1.000 gravações/dia do KV grátis e exige fila no Worker. Database Webhook: segredo compartilhado no banco + `pg_net`, mais peças para o mesmo resultado |

**Resolvido**: emenda de correção **1.1.2** aprovada pelo autor em 2026-11-12 — uma rota do Next
que **apenas invalida cache**, sem ler nem gravar dados e autorizada pelo Supabase, não é backend
próprio.
