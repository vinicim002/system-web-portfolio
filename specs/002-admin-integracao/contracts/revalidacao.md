# Contrato: invalidação do cache do site

Única rota do servidor do Next nesta entrega. **Não lê nem grava dados do portfólio**: só pede ao
Next que descarte o cache marcado com a tag `projects`. A autorização é decidida pelo Supabase
com o token do próprio usuário.

## `POST /api/revalidate`

| Item | Valor |
|---|---|
| Arquivo | `src/app/api/revalidate/route.ts` |
| Cabeçalho | `Authorization: Bearer <access_token da sessão aal2>` |
| Corpo | vazio |
| Origem | só `https://viniciusvilanova.com` e `http://localhost:3000` (checagem de `Origin`) |

### Processamento

1. Sem token ou origem fora da lista → `401`.
2. Consulta `rpc("is_admin")` no Supabase com o token recebido (a mesma regra do RLS: admin **e**
   `aal2`). Falso ou erro → `403`.
3. `revalidateTag("projects", { expire: 0 })` → `200 { ok: true }`.

### Respostas

| Status | Corpo | Quando |
|---|---|---|
| 200 | `{ "ok": true }` | Cache invalidado |
| 401 | `{ "error": "unauthorized" }` | Sem token ou origem não permitida |
| 403 | `{ "error": "forbidden" }` | Não é admin com segundo fator |
| 405 | — | Método diferente de POST |

## No Cloudflare

- Tag cache D1 do OpenNext (`NEXT_TAG_CACHE_D1`) registra a invalidação; o cache de páginas segue
  no KV (`NEXT_INC_CACHE_KV`).
- A rota fica fora do proxy de idioma (matcher já ignora `/api`).
