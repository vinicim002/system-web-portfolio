---
description: "Lista de tarefas da funcionalidade 001 — Telas da área admin"
---

# Tarefas: Telas da área admin

**Entrada**: documentos de design em `specs/001-admin-telas/`

**Pré-requisitos**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Testes**: só Vitest para a lógica pura (serviço local de projetos e esquema de validação), como
decidido em `research.md`, item 14. As telas são conferidas pelo [quickstart.md](./quickstart.md).

**Organização**: tarefas agrupadas por história, para cada uma ser feita e conferida sozinha.

## Formato: `[ID] [P?] [História] Descrição`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem depender de tarefa pendente)
- **[US1]…[US5]**: história da spec a que a tarefa pertence
- Caminhos relativos à raiz do repositório; `F/` = `system-portfolio-web-frontend/`

---

## Fase 1: Preparação

**Objetivo**: dependências e componentes que todas as telas usam.

- [X] T001 Instalar `@tanstack/react-query` (versão estável atual, fixa) em `F/package.json` e `F/package-lock.json`
- [X] T002 Adicionar pelo shadcn os componentes `alert-dialog`, `dialog`, `select`, `switch`, `checkbox`, `tabs`, `badge`, `sheet`, `dropdown-menu`, `separator`, `tooltip`, `table` e `sonner` em `F/src/components/ui/`, conferindo que cada arquivo gerado importa `cn` de `@/lib/utils` (alias de `F/components.json`)
- [X] T003 [P] Instalar Vitest como dependência de desenvolvimento, criar `F/vitest.config.ts` (ambiente `node`, alias `@` → `src`) e o script `"test": "vitest run"` em `F/package.json`
- [X] T004 [P] Criar o namespace `admin` em `F/messages/pt.json` com as chaves comuns: `admin.meta.title`, `admin.sampleNotice`, `admin.common.{save,cancel,back,loading,notFound,notFoundHint,goHome,example}`

---

## Fase 2: Base (bloqueia todas as histórias)

**Objetivo**: layout raiz do admin, tipos, serviços locais, validação e hooks.

**⚠️ Nenhuma história começa antes desta fase terminar.**

- [X] T005 [P] Criar `F/src/types/admin.ts` com `ProjectDraft` (campos editáveis de `ProjectRow`, sem `id`, `created_at`, `updated_at`; listas como `string[]` e textos vazios como `""`), `PreviewImage` (`url`, `name`, `size` "até 5 MB (5.242.880 bytes)", `kind: "cover" | "gallery"`) e `MonitoredSystem` (`slug`, `name`, `url`, `state: "live" | "soon"`, `sample` com `status: "up" | "degraded" | "down"`, `uptimePercent`, `visitsLast7Days`, `blockedThreatsLast7Days`, `checkedAt`), conforme `data-model.md`
- [X] T006 [P] Criar `F/src/lib/api/admin/errors.ts` com a classe `AdminServiceError` e `code: "not_found" | "slug_taken"`
- [X] T007 [P] Criar `F/src/lib/slugify.ts`: remove acentos, passa para minúsculas, troca o que não é letra ou número por hífen e remove hífens repetidos e das pontas (resultado compatível com `^[a-z0-9]+(-[a-z0-9]+)*$`)
- [X] T008 Criar `F/src/lib/api/admin/projects.ts` com a interface `AdminProjectsService` (`list`, `get`, `isSlugAvailable`, `create`, `update`, `remove`, `setPublished`, `setFeatured`, `move`) e o export `adminProjects` apontando para a implementação local, conforme `contracts/servicos.md`
- [X] T009 Implementar `F/src/lib/api/admin/projects.local.ts`: estado em memória iniciado com `structuredClone(mockProjects)` de `F/src/lib/api/projects.mock.ts`; espera de ~150 ms em cada operação; `list` filtra por `q` "sem diferenciar maiúsculas e acentos, só no título pt e en", `category` e `status`, ordenado por `sort_order`; `create` gera `id` com `crypto.randomUUID()`, datas ISO, `published` padrão falso e `sort_order` "próximo número depois do maior existente"; `update` muda `updated_at`; `remove` e `move` renumeram `sort_order` de forma contínua (0, 1, 2…) sem repetir; erros `not_found` e `slug_taken` via `AdminServiceError`; textos vazios do rascunho viram `null`
- [X] T010 [P] Testes Vitest em `F/src/lib/api/admin/projects.local.test.ts`: lista inicial com 5 projetos; busca "logistica" encontra "Telecarga Logística"; criar com slug repetido lança `slug_taken`; editar muda `updated_at`; excluir renumera a ordem; `move("up")` no primeiro item não muda nada; publicar e destacar alteram só o item certo
- [X] T011 [P] Criar `F/src/lib/api/admin/systems.ts` (interface `AdminSystemsService` com `list` e `get`) e `F/src/lib/api/admin/systems.local.ts` com RookHub (`https://rookhub.com.br/`), RookMTR (`https://rookmtr.com.br/`) e Fazendo Comuns (`https://www.fazendocomuns.com.br/`) como `live`, com `sample` de exemplo, e Zona Sul Urgente como `soon`, sem `sample`; ordem fixa e espera de ~150 ms
- [X] T012 Criar o esquema Zod `projectDraftSchema` em `F/src/lib/validations/project.ts`: `slug` obrigatório com `^[a-z0-9]+(-[a-z0-9]+)*$`; `title_pt` e `title_en` obrigatórios "até 120 caracteres"; resumos "até 300 caracteres"; conteúdos "até 20.000 caracteres"; `category` em `mobile | web | automation` ou vazio; `status` em `production | mvp | in_progress | proposal`; `tech_stack` "itens sem repetir, até 15"; `gallery_urls` "até 12 imagens"; `repo_url` e `demo_url` "URL válida (http/https) quando preenchido"; `sort_order` "inteiro ≥ 0"; mensagens de erro como chaves `admin.validation.*`
- [X] T013 [P] Testes Vitest em `F/src/lib/validations/project.test.ts`: aceita os 5 projetos iniciais; recusa slug com maiúscula, espaço ou hífen duplo; recusa título vazio; recusa link sem `http(s)`; recusa stack com item repetido
- [X] T014 Criar os hooks do TanStack Query em `F/src/hooks/admin/use-admin-projects.ts` (`useAdminProjects`, `useAdminProject`, `useSaveProject`, `useDeleteProject`, `useTogglePublished`, `useToggleFeatured`, `useMoveProject`) e `F/src/hooks/admin/use-admin-systems.ts` (`useAdminSystems`, `useAdminSystem`), com as invalidações de `contracts/servicos.md`
- [X] T015 Criar o layout raiz `F/src/app/admin/layout.tsx`: `<html lang="pt-BR">` com as fontes Geist e `../globals.css`, `Providers` (tema), `NextIntlClientProvider` com `locale="pt"` e só o namespace `admin`, e `metadata` com `robots: { index: false, follow: false }` e título padrão do admin
- [X] T016 Criar o "não encontrado" do admin: `F/src/components/admin/shared/NotFoundState.tsx` (mensagem e atalho de volta configuráveis), `F/src/app/admin/not-found.tsx` (usa o componente com atalho para `/admin`) e `F/src/app/admin/[...missing]/page.tsx` (chama `notFound()`)
- [X] T017 [P] Criar `F/src/components/admin/shared/EmptyState.tsx` (ícone, título, texto e ação opcional) para listas vazias

**Ponto de controle**: `npm run test` passa; `/admin/qualquer-coisa` mostra o "não encontrado" do admin.

---

## Fase 3: História 1 — Entrar no admin e navegar pela estrutura (P1) 🎯 MVP

**Objetivo**: login só visual, moldura com menu, tema e aviso de dados de exemplo.

**Teste independente**: abrir `/admin/login`, clicar em Entrar, navegar pelos 3 itens do menu e trocar
o tema; abrir `/admin/projetos` direto pela barra de endereço sem passar pelo login.

- [X] T018 [P] [US1] Criar `F/src/components/admin/auth/LoginForm.tsx` e `F/src/app/admin/(auth)/login/page.tsx`: campos e-mail e senha, botão Entrar que só faz `router.push("/admin")`, sem validar nem guardar nada, e aviso discreto de que o login ainda é só visual (RF-001, RF-002)
- [X] T019 [P] [US1] Criar `F/src/components/admin/layout/AdminNav.tsx` com Início (`/admin`, marcado só na rota exata), Projetos (`/admin/projetos*`), Sistemas (`/admin/sistemas*`) e "Ver site" (`/pt`, nova aba), usando `aria-current="page"` no item ativo (RF-003)
- [X] T020 [P] [US1] Criar `F/src/components/admin/layout/SampleDataNotice.tsx`: faixa fixa e discreta avisando que os dados são de exemplo e não são salvos (RF-005)
- [X] T021 [US1] Criar `F/src/components/admin/layout/AdminTopbar.tsx` (título da área, botão de tema reaproveitando o comportamento de `ThemeToggle`, botão de menu no celular) e `F/src/components/admin/layout/AdminShell.tsx` (menu lateral no computador, `Sheet` no celular, `SampleDataNotice` e área de conteúdo) (RF-004, RF-023)
- [X] T022 [US1] Criar `F/src/components/admin/providers/AdminQueryProvider.tsx` (cliente do TanStack Query por sessão do navegador) e `F/src/app/admin/(painel)/layout.tsx` com `AdminQueryProvider`, `Toaster` (sonner) e `AdminShell`
- [X] T023 [US1] Criar `F/src/app/admin/(painel)/page.tsx` provisória com o título do Início (a grade entra na história 2)
- [X] T024 [US1] Adicionar a `F/messages/pt.json` as chaves `admin.login.*`, `admin.nav.*` e `admin.shell.*` usadas em T018–T023

**Ponto de controle**: história 1 funciona sozinha, no computador e no celular. Conferir: tsc, lint e build sem erros; a tela nos temas claro e escuro e em 390×844 (fluxo de trabalho da constituição).

---

## Fase 4: História 2 — Ver a central de sistemas no Início (P2)

**Objetivo**: grade de sistemas no Início e em Sistemas, com páginas "em construção".

**Teste independente**: no Início, ver os 4 cards; abrir RookHub, RookMTR e Fazendo Comuns; conferir
que Zona Sul Urgente aparece "em breve" e não abre painel.

- [ ] T025 [P] [US2] Criar `F/src/components/admin/systems/SystemCard.tsx`: ícone (inicial do nome sobre a cor da marca), nome, estado; para `live`, resumo de `sample` (status, disponibilidade, visitas e ameaças bloqueadas em 7 dias) com a marca "exemplo" e link para `/admin/sistemas/[slug]`; para `soon`, selo "em breve" sem link (RF-007)
- [ ] T026 [US2] Criar `F/src/components/admin/systems/SystemsGrid.tsx` usando `useAdminSystems`, com estado de carregamento
- [ ] T027 [US2] Completar `F/src/app/admin/(painel)/page.tsx`: `SystemsGrid` e atalhos "Ver projetos" (`/admin/projetos`) e "Novo projeto" (`/admin/projetos/novo`) (RF-006)
- [ ] T028 [P] [US2] Criar `F/src/app/admin/(painel)/sistemas/page.tsx` com o `SystemsGrid`, sem os atalhos de projetos
- [ ] T029 [US2] Criar `F/src/components/admin/systems/SystemPlaceholder.tsx` (lê `slug` com `useParams`, busca com `useAdminSystem`; nome, ícone, link externo e aviso "painel em construção"; `slug` inexistente ou `soon` → `NotFoundState` com atalho para `/admin/sistemas`) e `F/src/app/admin/(painel)/sistemas/[slug]/page.tsx` que o renderiza dentro de `<Suspense>` (RF-008, RF-024)
- [ ] T030 [US2] Adicionar a `F/messages/pt.json` as chaves `admin.home.*` e `admin.systems.*`

**Ponto de controle**: histórias 1 e 2 funcionam sozinhas. Conferir: tsc, lint e build sem erros; a tela nos temas claro e escuro e em 390×844 (fluxo de trabalho da constituição).

---

## Fase 5: História 3 — Consultar e filtrar os projetos (P3)

**Objetivo**: lista dos 5 projetos com busca e filtros.

**Teste independente**: abrir `/admin/projetos`, buscar "rook" e "logistica", filtrar Web + Em produção
e limpar; conferir a mensagem de lista vazia.

- [ ] T031 [P] [US3] Criar `F/src/components/admin/projects/ProjectFilters.tsx`: busca, `Select` de categoria e de status e botão "limpar", lendo e gravando `?q=&categoria=&status=` na URL (RF-010, `contracts/rotas.md`)
- [ ] T032 [P] [US3] Criar `F/src/components/admin/projects/ProjectsTable.tsx` (computador): colunas título, categoria, status, publicado/rascunho, destaque e ordem; título leva a `/admin/projetos/[id]` (RF-009)
- [ ] T033 [P] [US3] Criar `F/src/components/admin/projects/ProjectCardMobile.tsx` (celular): as mesmas informações em cartão (RF-023)
- [ ] T034 [US3] Criar `F/src/app/admin/(painel)/projetos/page.tsx`: lê os filtros dentro de `<Suspense>`, usa `useAdminProjects(filters)`, mostra tabela no computador e cartões no celular, `EmptyState` para busca sem resultado (com "limpar filtros") e para lista vazia (com "novo projeto"), e botão "Novo projeto"
- [ ] T035 [US3] Adicionar a `F/messages/pt.json` as chaves `admin.projects.list.*` e os rótulos de categoria e status em `admin.projects.labels.*`

**Ponto de controle**: histórias 1, 2 e 3 funcionam sozinhas. Conferir: tsc, lint e build sem erros; a tela nos temas claro e escuro e em 390×844 (fluxo de trabalho da constituição).

---

## Fase 6: História 4 — Criar e editar um projeto (P4)

**Objetivo**: formulário completo com validação, imagens e markdown com pré-visualização.

**Teste independente**: criar um projeto com todos os campos, capa e 2 imagens de galeria e salvar;
editar um projeto existente; tentar sair com alterações não salvas.

- [ ] T036 [P] [US4] Criar `F/src/hooks/admin/use-unsaved-changes.ts` e `F/src/components/admin/shared/LeaveGuard.tsx` (contexto com o estado "tem alteração não salva", aviso `beforeunload` e `ConfirmLeaveDialog` com `AlertDialog`); envolver o conteúdo em `AdminShell` e fazer `AdminNav` e os links "voltar" pedirem confirmação quando houver alteração (RF-017)
- [ ] T037 [P] [US4] Criar `F/src/components/admin/projects/ImagePicker.tsx` (capa): `accept="image/*"`, recusa o que não é imagem ou passa de "5 MB (5.242.880 bytes)" com mensagem, pré-visualização com `URL.createObjectURL` e `alt` com o nome do arquivo, remover, libera a URL ao remover ou desmontar, aviso de envio simulado (RF-015)
- [ ] T038 [P] [US4] Criar `F/src/components/admin/projects/GalleryEditor.tsx`: adicionar várias imagens "até 12", pré-visualização em grade com `alt` com o nome de cada arquivo, subir e descer por botões acessíveis por teclado, remover, mesmas regras de tipo e tamanho do `ImagePicker` (RF-015)
- [ ] T039 [P] [US4] Criar `F/src/components/admin/projects/MarkdownField.tsx`: `Tabs` "Escrever" e "Pré-visualizar", reaproveitando `ProjectContent` de `F/src/components/sections/project/ProjectContent.tsx`; markdown com formatação inválida aparece como texto sem quebrar a tela (RF-016, casos-limite)
- [ ] T040 [US4] Criar `F/src/components/admin/projects/ProjectForm.tsx` com React Hook Form + `projectDraftSchema`: seções Identificação (slug sugerido por `slugify(title_pt)` enquanto o slug estiver vazio ou não tiver sido editado à mão; checagem de slug único com `isSlugAvailable`), Textos (título, resumo e conteúdo em pt e en), Classificação (categoria, status, stack como lista de chips), Mídia (`ImagePicker` e `GalleryEditor`), Links (repositório e demo), Publicação (destaque, publicado, ordem); erro junto de cada campo; salvar com `useSaveProject`, toast de confirmação e volta para a lista mantendo os filtros (RF-011 a RF-014, RF-020)
- [ ] T041 [US4] Criar `F/src/app/admin/(painel)/projetos/novo/page.tsx` com `ProjectForm` em branco (status padrão `in_progress`, rascunho)
- [ ] T042 [US4] Criar `F/src/components/admin/projects/ProjectEditor.tsx` (lê `id` com `useParams`, carrega com `useAdminProject`, mostra `ProjectForm` preenchido ou `NotFoundState` com atalho para `/admin/projetos`) e `F/src/app/admin/(painel)/projetos/[id]/page.tsx` que o renderiza dentro de `<Suspense>` (RF-024)
- [ ] T043 [US4] Adicionar a `F/messages/pt.json` as chaves `admin.projects.form.*`, `admin.images.*` e `admin.validation.*`

**Ponto de controle**: histórias 1 a 4 funcionam sozinhas; `npm run test` passa. Conferir: tsc, lint e build sem erros; a tela nos temas claro e escuro e em 390×844 (fluxo de trabalho da constituição).

---

## Fase 7: História 5 — Publicar, destacar, ordenar e excluir (P5)

**Objetivo**: ações rápidas na lista com confirmação.

**Teste independente**: despublicar e publicar, mover um projeto e excluir um projeto (confirmando e
cancelando), conferindo cada resultado na lista; recarregar e ver o estado inicial.

- [ ] T044 [P] [US5] Criar `F/src/components/admin/projects/DeleteProjectDialog.tsx` (`AlertDialog` mostrando o título; confirma com `useDeleteProject` e toast) (RF-019)
- [ ] T045 [US5] Adicionar ações rápidas em `F/src/components/admin/projects/ProjectsTable.tsx` e `F/src/components/admin/projects/ProjectCardMobile.tsx`: `Switch` de publicado (`useTogglePublished`), alternar destaque (`useToggleFeatured`), subir e descer de qualquer projeto, destaque ou não (`useMoveProject`, desativados no topo e no fim) e menu com editar e excluir; cada ação com toast (RF-018, RF-020)
- [ ] T046 [US5] Adicionar o botão "Excluir projeto" com `DeleteProjectDialog` no rodapé de `F/src/components/admin/projects/ProjectForm.tsx` (só na edição), voltando para a lista após excluir
- [ ] T047 [US5] Adicionar a `F/messages/pt.json` as chaves `admin.projects.actions.*`

**Ponto de controle**: todas as histórias funcionam. Conferir: tsc, lint e build sem erros; a tela nos temas claro e escuro e em 390×844 (fluxo de trabalho da constituição).

---

## Fase 8: Acabamento

**Objetivo**: qualidade transversal antes de mostrar ao autor.

- [ ] T048 [P] Conferir acessibilidade e responsividade do admin: foco visível em todos os controles, rótulos em campos e botões de ícone, `alt` nas pré-visualizações de imagem, contraste nos dois temas e nenhuma rolagem lateral em 390×844 (CS-005)
- [ ] T049 [P] Conferir que o site público não importa nada de `F/src/components/admin/`, `F/src/lib/api/admin/` nem `F/src/hooks/admin/` (busca por imports) e que todas as páginas do admin saem com `noindex` (RF-025)
- [ ] T050 Rodar `npx tsc --noEmit`, `npm run lint`, `npm run test` e `npm run build` em `F/` sem erros
- [ ] T051 Seguir o roteiro de `specs/001-admin-telas/quickstart.md` e tirar prints de cada tela nos temas claro e escuro, em 1440×900 e 390×844
- [ ] T052 Atualizar `.claude/memory/progress.md` e `.claude/memory/decisions.md` com o estado da entrega (incluindo a convenção de arquivos de hooks em kebab-case em `F/src/hooks/`)

---

## Fase 9: Revisão do autor (princípio VII — obrigatória antes de qualquer integração)

**Objetivo**: o autor usa as telas e decide o que fica, o que sai e quais funções existem de fato.

- [ ] T053 Apresentar as telas ao autor (prints e `npm run dev`) e registrar a decisão sobre cada tela, campo e ação em `specs/001-admin-telas/review.md` (fica, sai ou muda) (CS-006)
- [ ] T054 Ajustar as telas conforme `specs/001-admin-telas/review.md`, removendo campos e ações descartados, e repetir T050–T051
- [ ] T055 Com a aprovação registrada em `specs/001-admin-telas/review.md`, listar as funções que a integração real precisa (Auth, gravação, Storage e atualização do site) e iniciar a próxima especificação com `/speckit-specify`; nenhuma integração é feita dentro da 001

---

## Dependências e ordem

### Entre fases

- **Preparação (Fase 1)** → **Base (Fase 2)** → histórias.
- **História 1** cria a moldura usada por todas as outras; faça primeiro.
- **Histórias 2 e 3** dependem só da Base e da História 1; podem ser feitas em paralelo.
- **História 4** depende da História 3 (a lista é o ponto de entrada e de volta do formulário).
- **História 5** depende das Histórias 3 e 4 (ações na lista e no formulário).
- **Acabamento (Fase 8)** depois das histórias; **Revisão do autor (Fase 9)** por último.

### Dentro da Base

- T005, T006, T007 em paralelo → T008 → T009 → T010.
- T011 e T012 em paralelo depois de T005; T013 depois de T012.
- T014 depois de T008, T009 e T011. T015 a T017 podem correr junto com T008–T014.

## Exemplos de paralelismo

```text
Base:        T005 + T006 + T007 juntos; depois T010 + T011 + T013
História 1:  T018 + T019 + T020 juntos; depois T021 → T022 → T023
História 2:  T025 + T028 juntos; depois T026 → T027 e T029
História 3:  T031 + T032 + T033 juntos; depois T034
História 4:  T036 + T037 + T038 + T039 juntos; depois T040 → T041 e T042
História 5:  T044; depois T045 e T046
```

## Estratégia

1. **MVP**: Fases 1 e 2 + História 1 (o autor já entra no admin e navega).
2. Somar a História 2 (central de sistemas) e mostrar a grade ao autor cedo, porque ela alimenta a
   especificação 002.
3. Somar as Histórias 3, 4 e 5 (gestão de projetos), conferindo cada uma pelo `quickstart.md`.
4. Fase 8 e, por fim, a Fase 9: só a aprovação do autor libera a integração com o Supabase.
