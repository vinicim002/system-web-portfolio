# Modelo de dados: Telas da área admin

Os dados vivem em memória no navegador nesta entrega (`research.md`, item 4). Os tipos já existentes
em `src/types/project.ts` são reaproveitados; os novos ficam em `src/types/admin.ts`.

## Projeto (`ProjectRow`, existente)

Mesmo formato da tabela `public.projects` do Supabase, para a troca de implementação não mudar nada.

| Campo | Tipo | Regra |
|---|---|---|
| `id` | texto | Gerado ao criar (`crypto.randomUUID()`); não editável |
| `slug` | texto | Obrigatório, único, `^[a-z0-9]+(-[a-z0-9]+)*$` |
| `title_pt`, `title_en` | texto | Obrigatórios, até 120 caracteres |
| `summary_pt`, `summary_en` | texto ou vazio | Até 300 caracteres |
| `content_pt`, `content_en` | texto ou vazio | Markdown, até 20.000 caracteres |
| `category` | `mobile` \| `web` \| `automation` ou vazio | — |
| `status` | `production` \| `mvp` \| `in_progress` \| `proposal` | Obrigatório; padrão `in_progress` |
| `tech_stack` | lista de texto | Itens sem repetir, até 15 |
| `cover_url` | texto ou vazio | Nesta entrega: URL de pré-visualização (`blob:`) ou caminho já existente |
| `gallery_urls` | lista de texto | Até 12 imagens, na ordem exibida |
| `repo_url`, `demo_url` | texto ou vazio | URL válida (`http`/`https`) quando preenchido |
| `featured` | booleano | Padrão falso |
| `published` | booleano | Padrão falso (projeto novo nasce rascunho) |
| `sort_order` | inteiro ≥ 0 | Padrão: próximo número depois do maior existente |
| `created_at`, `updated_at` | data ISO | Preenchidas pelo serviço; `updated_at` muda a cada edição |

**Estados**:

```text
rascunho (published = false)  ⇄  publicado (published = true)
comum (featured = false)      ⇄  destaque  (featured = true)
qualquer estado  →  excluído (some da lista; sem lixeira nesta entrega)
```

**Ordem**: `sort_order` define a posição na lista e no site (inclusive a dos destaques). Reordenar
troca as posições entre itens vizinhos e renumera todos de forma contínua (0, 1, 2…), sem repetir (história 5,
cenário 2).

## Rascunho do formulário (`ProjectDraft`, novo)

O que o formulário manipula antes de salvar: os campos editáveis de `ProjectRow` (todos menos
`id`, `created_at` e `updated_at`), com listas como `string[]` e textos vazios como `""`. Ao salvar,
textos vazios viram `null`, como no banco.

## Imagem em pré-visualização (`PreviewImage`, novo)

| Campo | Tipo | Regra |
|---|---|---|
| `url` | texto | URL `blob:` criada no navegador, ou caminho de imagem já existente |
| `name` | texto | Nome do arquivo escolhido |
| `size` | número (bytes) | Até 5 MB (5.242.880 bytes) |
| `kind` | `cover` \| `gallery` | Onde a imagem é usada |

Só existe enquanto o formulário está aberto. A URL `blob:` é liberada ao remover a imagem ou sair.

## Sistema monitorado (`MonitoredSystem`, novo)

| Campo | Tipo | Regra |
|---|---|---|
| `slug` | texto | `rookhub`, `rookmtr`, `fazendo-comuns`, `zona-sul-urgente` |
| `name` | texto | Nome exibido |
| `url` | texto ou vazio | Endereço público do sistema |
| `state` | `live` \| `soon` | `soon` não abre painel (RF-007) |
| `sample` | objeto ou vazio | Resumo de exemplo; vazio quando `state = soon` |

`sample` (todos os valores inventados e marcados como exemplo na tela):

| Campo | Tipo | Exemplo |
|---|---|---|
| `status` | `up` \| `degraded` \| `down` | `up` |
| `uptimePercent` | número | `99.9` |
| `visitsLast7Days` | número | `1240` |
| `blockedThreatsLast7Days` | número | `37` |
| `checkedAt` | data ISO | horário fixo de exemplo |

Dados iniciais: RookHub, RookMTR e Fazendo Comuns como `live`; Zona Sul Urgente como `soon`. Os
campos de `sample` são só um ponto de partida: a revisão das telas define o que fica para a
especificação 002.
