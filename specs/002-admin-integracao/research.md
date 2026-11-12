# Pesquisa: Integração real da área admin

Decisões técnicas da Fase 0. Versões conferidas no projeto em 2026-11-12: `@supabase/supabase-js`
2.117.3, Next.js 16.4.6, `@opennextjs/cloudflare` 1.20.14, `wrangler` 4.154.0.

## 1. Segundo fator: TOTP do Supabase Auth

- **Decisão**: usar o MFA nativo do Supabase Auth com fator `totp`:
  `auth.mfa.enroll({ factorType: "totp", friendlyName })` devolve `totp.qr_code` (SVG em data URI),
  `totp.secret` e `totp.uri`; `auth.mfa.challenge({ factorId })` + `auth.mfa.verify({ factorId,
  challengeId, code })` sobem a sessão para `aal2`; `auth.mfa.getAuthenticatorAssuranceLevel()`
  informa `currentLevel` e `nextLevel`; `auth.mfa.listFactors()` lista os fatores (até 10).
- **Motivo**: grátis, sem serviço novo, e o nível `aal2` vai dentro do token da sessão, o que deixa o
  banco conferir o segundo fator (item 3).
- **Projeto real**: TOTP vem ligado por padrão no Supabase hospedado (conferir em Authentication →
  Multi-Factor). **Local**: `config.toml` está com `[auth.mfa.totp] enroll_enabled = false` e
  `verify_enabled = false` → ligar os dois para testar.
- **Alternativas**: SMS (pago e menos seguro), WebAuthn/passkeys (fora do escopo da spec; o
  `supabase-js` atual já traz passkeys ligadas por padrão, fica para depois), códigos de recuperação
  (`auth.mfa.recoveryCodes.*`, existem mas são **experimentais** e exigem a opção `recoveryCodes:
  true` no cliente; ficam para depois). Para não perder o acesso: lembrete de cadastrar um segundo
  fator (RF-005) e procedimento de recuperação pelo painel (RF-020).

## 2. Onde a sessão vive e como as telas são protegidas

- **Decisão**: sessão no navegador (armazenamento padrão do `supabase-js`), com um **guarda no
  cliente** no layout `(painel)` que decide: sem sessão → `/admin/login`; sessão `aal1` com fator →
  etapa do código; sessão `aal1` sem fator → cadastro do fator; não admin → acesso negado e sair;
  `aal2` admin → telas. A segurança real fica no **RLS** (item 3): sem `aal2`, o banco não entrega
  rascunhos nem aceita gravações.
- **Motivo**: as telas do admin são estáticas e não carregam dados no servidor; toda leitura e
  gravação passa pelo Supabase com o token do usuário. Proteger no servidor exigiria cookies
  (`@supabase/ssr`), o proxy rodando em Node no Worker (suporte experimental do OpenNext, já com
  aviso no build) e páginas dinâmicas, sem ganho de segurança sobre o RLS.
- **Alternativas**: `@supabase/ssr` + proxy redirecionando no servidor (mais peças, mais custo no
  Worker; reavaliar se um dia houver dado sensível renderizado no servidor).

## 3. Banco exigindo o segundo fator (RLS `aal2`)

- **Decisão**: nova migration que redefine `public.is_admin()` para exigir, além da linha em
  `public.admins`, a claim `aal = 'aal2'` do token:
  `exists (select 1 from public.admins where user_id = auth.uid()) and coalesce(auth.jwt() ->>
  'aal', '') = 'aal2'`. Como as policies de `projects` e de `storage.objects` (`project-images`) já
  usam `is_admin()`, todas passam a exigir `aal2` sem mexer nelas.
- **Saber se é admin antes do código (RF-002)**: a policy `admins_read_self` já deixa o usuário
  autenticado ler a própria linha; o guarda consulta essa linha logo após a senha. Sem linha →
  acesso negado e sair.
- **Teste**: no Supabase local, com `set local role authenticated` e `request.jwt.claims` simulando
  `aal1` e `aal2`, conferir leitura de rascunho, insert, update, delete e upload (mesmo método dos
  13 testes da etapa 4).
- **Alternativas**: checar `aal2` só nas telas (não atende RF-009); policies novas por tabela
  (duplicação desnecessária).

## 4. Implementação real dos serviços

- **Decisão**: `src/lib/api/admin/projects.supabase.ts` implementa o mesmo `AdminProjectsService`
  da 001; `projects.ts` passa a exportar a implementação Supabase quando
  `NEXT_PUBLIC_SUPABASE_*` existir (senão, a local, para desenvolvimento sem banco). Os hooks do
  TanStack Query e os componentes não mudam (RF-011).
- **Ordem (`move`, `remove`, `create`/`update` com `sort_order`)**: uma função SQL
  `public.reorder_projects(ids uuid[])` (security invoker, protegida por `is_admin()`) renumera de 0
  em diante numa única transação, evitando estados intermediários com números repetidos.
- **Erros**: `23505` (único) no slug → `AdminServiceError("slug_taken")`; nenhuma linha afetada →
  `not_found`; falha de rede → erro genérico tratado pelas telas (RF-017).
- **Alternativas**: renumerar no cliente com vários `update` (estados intermediários e mais idas ao
  banco).

## 5. Imagens no Storage

- **Decisão**: no salvar, a implementação Supabase converte cada URL `blob:` do rascunho em arquivo
  (`fetch(blobUrl)` → `Blob`) e envia para `project-images/projects/<projectId>/<uuid>.<ext>`;
  grava o projeto com as URLs públicas. O `id` de projeto novo é gerado no cliente
  (`crypto.randomUUID()`) para a pasta existir antes da gravação.
- **Falha no meio (RF-013)**: envia primeiro; se algum envio ou a gravação falhar, apaga os arquivos
  novos desse salvamento e devolve erro; o formulário fica como estava.
- **Órfãs (RF-014)**: depois de gravar, apaga as URLs que existiam antes e sumiram, **só se forem do
  bucket** (prefixo `/storage/v1/object/public/project-images/`). Excluir projeto apaga a pasta
  `projects/<id>/`. Caminhos `/images/...` (imagens atuais do site) nunca são apagados.
- **`next/image`**: liberar o host do Storage em `images.remotePatterns`.
- **Alternativas**: upload assinado por Edge Function (desnecessário: o RLS do Storage já exige
  admin `aal2`).

## 6. Site atualizado ao salvar (invalidação do cache)

- **Decisão**: depois de cada mutação bem-sucedida, o admin chama `POST /api/revalidate` com o token
  da sessão. A rota consulta o Supabase **com o token do próprio usuário** (`rpc("is_admin")`): só
  segue se for admin com `aal2`; então invalida a tag `projects` com expiração imediata
  (`revalidateTag("projects", { expire: 0 })`). O próximo acesso a cada página pública é gerado de
  novo com os dados atuais. `cacheLife("hours")` continua como rede de segurança.
- **No Cloudflare**: somar o **tag cache em D1** do OpenNext (`d1NextTagCache`, binding
  `NEXT_TAG_CACHE_D1`; D1 grátis: 5 milhões de leituras e 100 mil gravações por dia). O cache de
  páginas continua no KV; gravações no KV só acontecem quando o autor salva.
- **Princípio III**: a rota **não serve nem grava dados** (não é backend próprio); ela só manda o
  Next descartar o cache, e a autorização é do próprio Supabase. Registrado em "Acompanhamento de
  complexidade" e sugerida emenda de correção (1.1.2) na constituição para deixar isso explícito.
- **Alternativas**: `cacheLife` de 1 minuto (regeneração constante: estouraria as 1.000 gravações
  diárias do KV grátis e exigiria fila do OpenNext); Database Webhook do Supabase chamando o Worker
  com segredo compartilhado (mais peças: segredo no banco, `pg_net`, e invalidaria também em edições
  feitas pelo painel do Supabase — vantagem pequena para um admin só).
- **A conferir na implementação**: invalidação da cache composta (`"use cache"`) pelo tag cache do
  OpenNext no preview (`opennextjs-cloudflare preview`) e em produção, antes de fechar a História 4.

## 7. Liberar o admin em produção

- **Decisão**: `ADMIN_ENABLED = "true"` em `vars` do `wrangler.jsonc` na última tarefa, depois das
  Histórias 1 a 4 validadas em produção com o admin ainda escondido (testes pelo preview local e pela
  rota de revalidação). `noindex` continua em todas as telas.
- **Supabase Auth**: cadastrar `https://viniciusvilanova.com` em Site URL e Redirect URLs (o login
  por senha não redireciona, mas o padrão deixa o projeto pronto).

## 8. Testes

- **Vitest**: funções puras novas (montagem de linhas a partir do rascunho, cálculo de imagens órfãs,
  caminho no Storage, tradução de erros do Supabase).
- **SQL no Supabase local**: RLS com `aal1` x `aal2` (item 3) e `reorder_projects`.
- **Manual (quickstart)**: login com fator, gravações, imagens, atualização do site, produção.
