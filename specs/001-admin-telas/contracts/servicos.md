# Contrato: serviços do admin

As telas só conhecem estes contratos (princípio III, RF-021). Nesta entrega, a implementação é local
em memória (`*.local.ts`); depois da revisão das telas, ela é trocada pela integração com o Supabase
mantendo as mesmas assinaturas. Tipos em [data-model.md](../data-model.md).

## `AdminProjectsService` (`src/lib/api/admin/projects.ts`)

| Operação | Entrada | Saída | Regras e erros |
|---|---|---|---|
| `list(filters?)` | `{ q?, category?, status? }` | `ProjectRow[]` ordenados por `sort_order` | Busca sem diferenciar maiúsculas e acentos, só no título pt e en |
| `get(id)` | `id` | `ProjectRow \| null` | `null` quando não existe |
| `isSlugAvailable(slug, ignoreId?)` | `slug`, `id` do próprio projeto | `boolean` | Ignora o próprio projeto na edição |
| `create(draft)` | `ProjectDraft` | `ProjectRow` | Gera `id`, datas e `sort_order` padrão. Erro `slug_taken` se o slug já existe |
| `update(id, draft)` | `id`, `ProjectDraft` | `ProjectRow` | Atualiza `updated_at`. Erros `not_found` e `slug_taken` |
| `remove(id)` | `id` | `void` | Renumera `sort_order`. Erro `not_found` |
| `setPublished(id, value)` | `id`, `boolean` | `ProjectRow` | Erro `not_found` |
| `setFeatured(id, value)` | `id`, `boolean` | `ProjectRow` | Erro `not_found` |
| `move(id, direction)` | `id`, `"up" \| "down"` | `ProjectRow[]` | Troca com o vizinho e renumera de 0 em diante; no topo ou no fim, não faz nada |

Erros são lançados como `AdminServiceError` com `code` (`not_found` \| `slug_taken`). As telas
traduzem o `code` para uma mensagem em `messages/pt.json`.

## `AdminSystemsService` (`src/lib/api/admin/systems.ts`)

| Operação | Entrada | Saída | Regras |
|---|---|---|---|
| `list()` | — | `MonitoredSystem[]` | Ordem fixa: RookHub, RookMTR, Fazendo Comuns, Zona Sul Urgente |
| `get(slug)` | `slug` | `MonitoredSystem \| null` | `null` quando não existe |

## Comportamento da implementação local

- Estado em memória no módulo, começando por cópia de `mockProjects`; volta ao inicial ao recarregar
  a página (RF-022).
- Cada operação espera ~150 ms antes de responder, para as telas mostrarem carregamento.
- Nada é enviado para fora do navegador; o site público continua lendo a sua fonte própria.

## Hooks de tela (`src/hooks/admin/`)

| Hook | Usa | Invalida |
|---|---|---|
| `useAdminProjects(filters)` | `list` | — |
| `useAdminProject(id)` | `get` | — |
| `useSaveProject()` | `create` / `update` | lista e item |
| `useDeleteProject()` | `remove` | lista |
| `useTogglePublished()`, `useToggleFeatured()` | `setPublished`, `setFeatured` | lista e item |
| `useMoveProject()` | `move` | lista |
| `useAdminSystems()`, `useAdminSystem(slug)` | `list`, `get` | — |
| `useUnsavedChanges(isDirty)` | — | — (aviso ao sair) |
