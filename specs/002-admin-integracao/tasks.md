---
description: "Lista de tarefas da funcionalidade 002 — Integração real da área admin"
---

# Tarefas: Integração real da área admin

**Entrada**: documentos de design em `specs/002-admin-integracao/`

**Pré-requisitos**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Testes**: Vitest só para funções puras novas; script SQL de RLS `aal1` × `aal2` no Supabase local;
o resto pelo [quickstart.md](./quickstart.md).

**Organização**: tarefas por história, cada uma conferível sozinha.

**Confirmação do autor**: tarefas marcadas com 🔒 mexem no projeto real do Supabase ou no Cloudflare
(produção). Antes de cada uma, pedir confirmação explícita ao autor; comandos do CLI do Supabase só
com `--yes` depois do ok.

## Formato: `[ID] [P?] [História] Descrição`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependência pendente)
- **[US1]…[US5]**: história da spec
- `F/` = `system-portfolio-web-frontend/`; `B/` = `system-portfolio-web-backend/supabase/`

---

## Fase 1: Preparação

**Objetivo**: banco local com MFA ligado e a nova regra de segundo fator testada.

- [X] T001 Ligar o TOTP para testes locais em `B/config.toml`: `[auth.mfa.totp] enroll_enabled = true` e `verify_enabled = true`
- [X] T002 Criar a migration `B/migrations/20261112120000_admin_mfa.sql`: redefinir `public.is_admin()` como `exists (select 1 from public.admins where user_id = (select auth.uid())) and coalesce((select auth.jwt()) ->> 'aal', '') = 'aal2'` (security definer, `search_path` vazio, mesmos grants); criar `public.reorder_projects(ids uuid[])` (`security invoker`; recusa com `42501` se `is_admin()` for falso; recusa se `ids` não tiver todos os projetos; define `sort_order` = posição de 0 em diante numa transação; `grant execute` para `authenticated`); criar a policy `project_images_admin_select` em `storage.objects` (`for select to authenticated using (bucket_id = 'project-images' and (select public.is_admin()))`), exigida pelo Storage para apagar e listar arquivos
- [X] T003 Criar `B/tests/rls_mfa.sql`: com `set local role authenticated` e `request.jwt.claims` do admin em `aal1` e em `aal2` (e de um usuário não admin), conferir: rascunho invisível em `aal1` e visível em `aal2`; insert/update/delete recusados em `aal1` e aceitos em `aal2`; `reorder_projects` recusado em `aal1`; upload, listagem e delete em `storage.objects` do `project-images` recusados em `aal1` e aceitos em `aal2`; anônimo continua lendo só publicados
- [X] T004 Subir o Supabase local, rodar `npx supabase db reset` e `B/tests/rls_mfa.sql` em `B/` e corrigir até todos os casos passarem
- [X] T005 [P] Adicionar o host do Storage (`yxqarosyroxewbicoxkx.supabase.co`, caminho `/storage/v1/object/public/project-images/**`) em `images.remotePatterns` de `F/next.config.ts`

---

## Fase 2: Base (bloqueia as histórias)

**Objetivo**: cliente do admin com sessão, serviço de autenticação e textos.

**⚠️ Nenhuma história começa antes desta fase terminar.**

- [X] T006 Criar `F/src/lib/supabase/admin-client.ts`: cliente só do admin com sessão persistida no navegador (`persistSession: true`, `autoRefreshToken: true`, chave de armazenamento própria `vvn-admin-auth`), separado de `F/src/lib/supabase/client.ts` (que segue sem sessão para o site e o contato); `null` sem `NEXT_PUBLIC_SUPABASE_*`
- [X] T007 [P] Somar os códigos `invalid_credentials`, `invalid_code`, `rate_limited` e `not_admin` em `F/src/lib/api/admin/errors.ts`
- [X] T008 [P] Criar os tipos `AuthStatus` (`signed_out` | `not_admin` | `enroll` | `verify` | `ready` com `factorCount`) e `AdminFactor` (`id`, `friendlyName`, `createdAt`) em `F/src/types/admin.ts`, conforme `contracts/servicos.md`
- [X] T009 Criar `F/src/lib/api/admin/auth.ts` com `AdminAuthService` (`getStatus`, `signIn`, `startEnrollment`, `confirmEnrollment`, `verifyCode`, `listFactors`, `signOut`, `onChange`) sobre `admin-client.ts`: `getStatus` combina sessão, `mfa.getAuthenticatorAssuranceLevel()`, `mfa.listFactors()` (só `verified`) e a leitura da própria linha em `public.admins`; `startEnrollment` remove fatores `unverified` antes de `mfa.enroll({ factorType: "totp", friendlyName })` e devolve `{ factorId, qrCode, secret }`; `verifyCode` usa o primeiro fator `verified` com `mfa.challenge` + `mfa.verify`; erros traduzidos para `AdminServiceError` (mensagem única para senha/e-mail)
- [X] T010 [P] Testes Vitest em `F/src/lib/api/admin/auth.test.ts` para a função pura que decide o `AuthStatus` a partir de (sessão, nível atual, nº de fatores verificados, é admin): os 5 estados e a contagem de fatores
- [X] T011 Criar os hooks `useAuthStatus`, `useSignIn`, `useVerifyCode`, `useStartEnrollment`, `useConfirmEnrollment`, `useSignOut` e `useFactors` em `F/src/hooks/admin/use-admin-auth.ts` (TanStack Query; `onChange` invalida `["admin","auth"]`; sair limpa todo o cache do QueryClient)
- [X] T012 [P] Adicionar a `F/messages/pt.json` as chaves `admin.auth.*` (etapas senha/cadastro/código, erros, acesso negado, sair, dica de relógio do celular, "tente novamente em alguns minutos") e `admin.security.*` (lista de fatores, cadastrar outro, lembrete do segundo fator, como recuperar o acesso)

**Ponto de controle**: `npm run test`, `npx tsc --noEmit` e `npm run lint` passam.

---

## Fase 3: História 1 — Entrar com senha e segundo fator (P1) 🎯 MVP

**Objetivo**: login real em etapas, guarda das telas, sair e lembrete do segundo fator.

**Teste independente**: no Supabase local com uma conta admin sem fator: entrar, cadastrar o fator pelo
QR code, sair, entrar de novo com o código; abrir `/admin/projetos` deslogado e voltar à tela pedida;
entrar com conta não admin e ver acesso negado.

- [X] T013 [US1] Trocar a navegação visual de `F/src/components/admin/auth/LoginForm.tsx` pelo `useSignIn` (mesmo layout de campos e botão; erro único "e-mail ou senha inválidos"; estado de envio no botão) e tirar o aviso "login só visual"
- [X] T014 [P] [US1] Criar `F/src/components/admin/auth/MfaEnroll.tsx`: nome do fator (padrão "celular"), QR code do Supabase como `<img>` com `alt`, código manual com botão copiar, campo de 6 dígitos (`inputMode="numeric"`, `autoComplete="one-time-code"`) e confirmar com `useConfirmEnrollment`
- [X] T015 [P] [US1] Criar `F/src/components/admin/auth/MfaVerify.tsx`: campo de 6 dígitos com envio automático ao completar, erro de código inválido com dica de conferir a hora automática do celular, e "usar outra conta" (sair)
- [X] T016 [US1] Reescrever `F/src/app/admin/(auth)/login/page.tsx` para escolher a etapa pelo `useAuthStatus` (senha → cadastro → código; `not_admin` mostra acesso negado e sai) e, em `ready`, ir para `?voltar=` (aceitar só caminhos que começam com `/admin`) ou `/admin`, dentro de `<Suspense>` por causa do `useSearchParams`
- [X] T017 [US1] Criar `F/src/components/admin/auth/AuthGate.tsx` (sem `ready` → `router.replace("/admin/login?voltar=<rota>")`; enquanto carrega, moldura sem conteúdo; se a sessão cair com formulário alterado, avisar "entre de novo para salvar" e guardar o rascunho em memória até a volta) e usar em `F/src/app/admin/(painel)/layout.tsx` em volta do `AdminShell`
- [X] T018 [US1] Adicionar o botão Sair (`useSignOut`, depois `router.replace("/admin/login")`) em `F/src/components/admin/layout/AdminTopbar.tsx` e na gaveta de `F/src/components/admin/layout/AdminShell.tsx`, sem mudar o restante do layout; recarregar a página ao voltar do cache do navegador (`pageshow` com `persisted`) quando não houver sessão
- [X] T019 [P] [US1] Criar `F/src/components/admin/layout/SecondFactorReminder.tsx` (aparece quando `factorCount === 1`, com atalho para `/admin/seguranca`) e mostrar no topo do conteúdo em `AdminShell.tsx`
- [X] T020 [US1] Criar `F/src/app/admin/(painel)/seguranca/page.tsx` com a lista de fatores (`useFactors`), o cadastro de outro fator (reaproveita `MfaEnroll`) e o passo a passo de recuperação pelo painel do Supabase (RF-020)
- [X] T021 [US1] Mostrar `SampleDataNotice` só no Início e em Sistemas (tirar da moldura geral) em `F/src/components/admin/layout/AdminShell.tsx`, `F/src/app/admin/(painel)/page.tsx` e `F/src/app/admin/(painel)/sistemas/page.tsx` (RF-018)
- [X] T022 [US1] Conferir a História 1 no `npm run dev` com o Supabase local (conta admin local criada por SQL em `auth.users` ou pelo Studio, subindo o Supabase sem o `-x studio`, + linha em `admins`) e escrever o passo a passo de recuperação de acesso em `.claude/context/supabase.md`

**Ponto de controle**: História 1 funcionando sozinha. tsc, lint e build sem erros; telas nos dois temas e em 390×844.

---

## Fase 4: História 2 — Projetos com os dados reais (P2)

**Objetivo**: mesmas telas, gravação permanente, banco exigindo `aal2`.

**Teste independente**: criar, editar, publicar, destacar, mover e excluir recarregando a cada passo;
com sessão `aal1` tentar gravar pelo console e ver recusa.

- [X] T023 [P] [US2] Criar as funções puras de mapeamento em `F/src/lib/api/admin/project-rows.ts`: rascunho → colunas (textos vazios viram `null`, como em `projects.local.ts`), nova ordem para `move` (troca com o vizinho; nada no topo/fim) e para encaixar um `sort_order` pedido, tradução de erro do PostgREST (`23505` → `slug_taken`, nenhuma linha → `not_found`)
- [X] T024 [P] [US2] Testes Vitest em `F/src/lib/api/admin/project-rows.test.ts` para as funções de T023
- [X] T025 [US2] Criar `F/src/lib/api/admin/projects.supabase.ts` implementando `AdminProjectsService` sobre `admin-client.ts` (sem imagens ainda: grava as URLs como vierem): `list` ordenado por `sort_order` com filtros de categoria/status no banco e busca sem acento no cliente (`normalizeSearch`); `get`; `isSlugAvailable`; `create` com `id` de `crypto.randomUUID()`; `update`; `remove`; `setPublished`; `setFeatured`; `move` e encaixe de ordem via `rpc("reorder_projects", { ids })`
- [X] T026 [US2] Em `F/src/lib/api/admin/projects.ts`, exportar a implementação Supabase quando `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` existirem e a local caso contrário, sem mudar a interface
- [X] T027 [US2] Garantir que as mutações mostram erro claro e mantêm o formulário (RF-017) conferindo `F/src/components/admin/projects/ProjectForm.tsx` e `F/src/components/admin/projects/ProjectActions.tsx` com a rede desligada; ajustar só mensagens em `F/messages/pt.json` se faltar alguma
- [X] T028 [US2] Conferir a História 2 no `npm run dev` com o Supabase local, incluindo a recusa em `aal1` pelo console do navegador e um rascunho que não abre no site nem pelo endereço direto (RF-016)

**Ponto de controle**: Histórias 1 e 2 funcionando sozinhas; `npm run test` passa.

---

## Fase 5: História 3 — Imagens no Storage (P3)

**Objetivo**: capa e galeria enviadas de verdade, sem órfãs, sem tocar nas imagens antigas.

**Teste independente**: criar com capa + 2 imagens; trocar a capa; remover 1 imagem; excluir o projeto;
no Storage local não sobra nada de `projects/<id>/`.

- [X] T029 [P] [US3] Criar as funções puras em `F/src/lib/api/admin/storage-paths.ts`: caminho `projects/<projectId>/<uuid>.<ext>` (extensão pelo tipo da imagem), saber se uma URL é do bucket (prefixo `/storage/v1/object/public/project-images/`), e listar órfãs (URLs do bucket que existiam antes e não existem depois; caminhos `/images/...` nunca entram)
- [X] T030 [P] [US3] Testes Vitest em `F/src/lib/api/admin/storage-paths.test.ts` (inclui: `/images/...` nunca é órfã; ordem e duplicatas não geram órfã)
- [X] T031 [US3] Criar `F/src/lib/api/admin/storage.ts`: enviar cada URL `blob:` (`fetch` → `Blob`; aceitar só `image/webp`, `image/png`, `image/jpeg` e `image/avif` (os tipos permitidos no bucket) e até "5 MB (5.242.880 bytes)") e devolver a URL pública; apagar uma lista de caminhos; apagar a pasta `projects/<id>/`
- [X] T032 [US3] Usar `storage.ts` em `create`/`update`/`remove` de `F/src/lib/api/admin/projects.supabase.ts`: enviar antes de gravar; se algum envio ou a gravação falhar, apagar os envios novos e lançar erro (RF-013), tratando sessão expirada (401/JWT vencido) como "entre de novo"; depois de gravar, apagar as órfãs; ao excluir, apagar a pasta
- [X] T033 [US3] Restringir a escolha às 4 extensões aceitas pelo bucket (`accept` e mensagem de recusa em `F/src/hooks/admin/use-preview-images.ts`, com texto em `F/messages/pt.json`) e manter as URLs `blob:` válidas até o salvamento terminar e liberar as que foram trocadas pelas URLs públicas, ajustando `F/src/hooks/admin/use-preview-images.ts` sem mudar `ImagePicker` e `GalleryEditor`
- [X] T034 [US3] Conferir a História 3 no `npm run dev` com o Supabase local (incluindo projeto antigo com `/images/...` editado sem perder imagens)

**Ponto de controle**: Histórias 1 a 3 funcionando sozinhas.

---

## Fase 6: História 4 — Site atualizado ao salvar (P4)

**Objetivo**: mudança no site em até 1 minuto, também no Cloudflare.

**Teste independente**: despublicar e publicar um projeto e ver a mudança na home e na lista do site
(dev e preview do Cloudflare).

- [ ] T035 [US4] Criar `F/src/app/api/revalidate/route.ts` conforme `contracts/revalidacao.md`: só `POST`; `Origin` em `https://viniciusvilanova.com` ou `http://localhost:3000`; `Authorization: Bearer`; cliente Supabase com o token do usuário e `rpc("is_admin")`; verdadeiro → `revalidateTag("projects", { expire: 0 })` e `200 { ok: true }`; senão `401`/`403`/`405`; nenhum dado do portfólio lido ou gravado
- [ ] T036 [P] [US4] Criar `F/src/lib/api/admin/revalidate.ts` com `revalidatePublicSite()` (envia o token da sessão de `admin-client.ts`; falha vira aviso, nunca desfaz a gravação)
- [ ] T037 [US4] Chamar `revalidatePublicSite()` no `onSuccess` de `useSaveProject`, `useDeleteProject`, `useTogglePublished`, `useToggleFeatured` e `useMoveProject` em `F/src/hooks/admin/use-admin-projects.ts`, com toast de aviso se falhar
- [ ] T038 [US4] Somar o tag cache D1 em `F/open-next.config.ts` (`tagCache: d1NextTagCache`) e o binding `NEXT_TAG_CACHE_D1` em `F/wrangler.jsonc` (banco criado na T039)
- [ ] T039 [US4] 🔒 Criar o banco D1 na conta do autor (`npx wrangler d1 create system-portfolio-web-tag-cache`) e fixar o `database_id` em `F/wrangler.jsonc`
- [ ] T040 [US4] Conferir a História 4 no `npm run dev` com o Supabase local (despublicar some da home e da lista em até 1 minuto; `POST /api/revalidate` sem token 401, com `aal1` 403, com `aal2` 200) e, no preview do Cloudflare (`npx opennextjs-cloudflare build && npx opennextjs-cloudflare preview`), só 401/403 e o tag cache D1 local criado — o preview não alcança o Supabase local (`global_fetch_strictly_public` bloqueia IP privado) e o teste completo fica para T046

**Ponto de controle**: Histórias 1 a 4 funcionando sozinhas no ambiente local.

---

## Fase 7: Projeto real e produção (com o admin ainda escondido)

**Objetivo**: levar banco e Worker para produção antes de abrir o admin.

- [ ] T041 🔒 Conferir com o autor que o MFA TOTP está ligado no projeto real (Authentication → Multi-Factor) e cadastrar `https://viniciusvilanova.com` em Site URL e Redirect URLs
- [ ] T042 🔒 Aplicar a migration no projeto real (`npx supabase db push --remote` em `B/..`) e rodar `B/tests/rls_mfa.sql` contra ele num bloco com `rollback` no final
- [ ] T043 🔒 Publicar o Worker com o tag cache (`npm run deploy` em `F/`) mantendo `/admin` escondido, e conferir `POST https://viniciusvilanova.com/api/revalidate` sem token → 401

---

## Fase 8: História 5 — Admin no site publicado (P5)

**Objetivo**: liberar o admin em produção depois de tudo validado.

**Teste independente**: abrir `https://viniciusvilanova.com/admin/login`, entrar com senha e código e
fazer uma alteração que aparece no site em até 1 minuto.

- [ ] T044 [US5] 🔒 Com o autor: primeiro acesso no projeto real pelo `npm run dev` (cadastro do fator no app autenticador dele e, de preferência, um segundo fator), confirmando a História 1 com a conta real
- [ ] T045 [US5] Adicionar `"vars": { "ADMIN_ENABLED": "true" }` em `F/wrangler.jsonc`
- [ ] T046 [US5] 🔒 Publicar (`npm run deploy` em `F/`) e conferir em produção: login com código, despublicar/publicar e uma edição aparecendo no site em até 1 minuto (CS-004, também no inglês), `noindex` nas telas do admin e `/admin/projetos` sem sessão levando ao login

---

## Fase 9: Acabamento

- [ ] T047 [P] Conferir que nenhum componente acessa o Supabase direto (busca por `@supabase` e `getSupabase` fora de `F/src/lib/`) e que o site público não importa nada do admin
- [ ] T048 [P] Rodar `npx tsc --noEmit`, `npm run lint`, `npm run test` e `npm run build` em `F/` sem erros
- [ ] T049 Seguir `specs/002-admin-integracao/quickstart.md` e o roteiro de `specs/001-admin-telas/quickstart.md` (sem regressão de layout, CS-007), com prints nos dois temas e em 390×844
- [ ] T050 Atualizar `.claude/context/supabase.md`, `.claude/context/cloudflare.md`, `.claude/memory/progress.md` e `.claude/memory/decisions.md`

---

## Dependências e ordem

- **Preparação (Fase 1)** → **Base (Fase 2)** → **História 1** (obrigatória para as demais).
- **História 2** depende da 1. **História 3** depende da 2 (mesmo serviço). **História 4** depende da 2
  (mutações) e pode correr junto com a 3.
- **Fase 7** depois das Histórias 1 a 4 validadas localmente. **História 5** só depois da Fase 7.
- **Acabamento** por último.

### Dentro das fases

- T001 → T002 → T003 → T004; T005 em paralelo.
- T006 → T009 → T011; T007, T008, T010 e T012 em paralelo com T006.
- T023 + T024 antes de T025; T029 + T030 antes de T031.

## Exemplos de paralelismo

```text
Preparação:  T005 junto com T001–T004
Base:        T007 + T008 + T010 + T012 junto com T006
História 1:  T014 + T015 + T019 juntos; depois T016 → T017 → T018 → T020 → T021
História 2:  T023 + T024 juntos; depois T025 → T026
História 3:  T029 + T030 juntos; depois T031 → T032 → T033
História 4:  T036 junto com T035; depois T037 → T038 → T039 → T040
```

## Estratégia

1. **MVP**: Fases 1 e 2 + História 1 (login real com segundo fator, testado no Supabase local).
2. Somar História 2 (gravação real) e conferir; depois 3 e 4.
3. Fase 7 leva banco e Worker para produção **com o admin escondido**.
4. História 5 libera o admin só depois do primeiro acesso real do autor com o fator cadastrado.
5. Todas as tarefas 🔒 pedem confirmação do autor antes de rodar.
