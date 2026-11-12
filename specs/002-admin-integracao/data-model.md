# Modelo de dados: Integração real da área admin

Nada muda nas colunas das tabelas da etapa 4; muda **quem pode** gravar (segundo fator) e entram
uma função de reordenação e a convenção de caminhos das imagens. Tipos do front continuam em
`src/types/project.ts` e `src/types/admin.ts`.

## Admin (`public.admins`, existente)

| Campo | Regra |
|---|---|
| `user_id` | Conta do Supabase Auth do autor; única linha hoje |

- Policy `admins_read_self` (existente): o usuário autenticado lê só a própria linha → usada pelo
  guarda para saber se a conta é admin logo após a senha (`aal1`).

## Fator de autenticação (Supabase Auth, gerenciado pelo serviço)

| Campo | Regra |
|---|---|
| `id` | Gerado no cadastro |
| `factor_type` | `totp` |
| `friendly_name` | Nome dado pelo autor (ex.: "celular", "1Password"); único por conta |
| `status` | `unverified` (cadastro iniciado) → `verified` (código confirmado) |

- Cadastro não confirmado fica `unverified` e é descartado ao recomeçar (remover antes de novo
  `enroll`, para não acumular).
- Até 10 fatores por conta (`max_enrolled_factors`).

## Sessão (Supabase Auth)

```text
sem sessão ──senha correta──▶ aal1 ──código correto──▶ aal2 ──sair/expirar──▶ sem sessão
                               │
                               └─ conta sem linha em admins → acesso negado → sair
```

- O guarda das telas só libera em `aal2` com linha em `admins`.
- O token de `aal2` carrega a claim `aal = 'aal2'`, lida pelo banco.

## Função `public.is_admin()` (redefinida)

| Antes | Depois |
|---|---|
| `exists (admins.user_id = auth.uid())` | o mesmo **e** `auth.jwt() ->> 'aal' = 'aal2'` |

Efeito em cadeia (sem mudar as policies): `projects_public_read` (rascunhos só para admin `aal2`),
`projects_admin_insert/update/delete` e `project_images_admin_insert/update/delete`.

## Função `public.reorder_projects(ids uuid[])` (nova)

| Regra | Detalhe |
|---|---|
| Entrada | Todos os `id` de projetos na nova ordem |
| Efeito | `sort_order` = posição na lista, de 0 em diante, numa transação |
| Segurança | `security invoker`; recusa (`42501`) se `is_admin()` for falso; recusa se a lista não tiver todos os projetos |

## Projeto (`public.projects`, existente)

Mesmas colunas e regras da 001 (`specs/001-admin-telas/data-model.md`). Mudanças de uso:

- `id` de projeto novo gerado no cliente (`crypto.randomUUID()`) para a pasta das imagens.
- `cover_url` e `gallery_urls` guardam URL pública do Storage (novas) ou caminho `/images/...`
  (anteriores a esta entrega).

## Imagem do projeto (Storage, bucket `project-images`)

| Regra | Detalhe |
|---|---|
| Caminho | `projects/<projectId>/<uuid>.<ext>` (nome aleatório: sem colisão entre projetos) |
| Tipo e tamanho | só `image/*`, até 5 MB (limites do bucket + checagem no navegador) |
| URL guardada | URL pública do objeto |
| Órfã | URL do bucket que existia antes do salvamento e não existe depois → apagada |
| Exclusão do projeto | apaga tudo em `projects/<projectId>/` |
| Protegidas | caminhos `/images/...` nunca são apagados |

## Cache do site (Next + OpenNext)

| Item | Regra |
|---|---|
| Tag | `projects` (já usada em `src/lib/api/projects.ts`) |
| Invalidação | `POST /api/revalidate` após cada mutação do admin; expira na hora |
| Onde fica no Cloudflare | páginas no KV (existente); marcas de invalidação no D1 (novo) |
