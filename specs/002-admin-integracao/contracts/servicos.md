# Contrato: serviços do admin (integração real)

Continua valendo o contrato de projetos da 001 (`specs/001-admin-telas/contracts/servicos.md`), com
uma segunda implementação. Entra um serviço novo de autenticação. As telas só falam com estes
contratos, por hooks (princípio III).

## `AdminProjectsService` — implementação Supabase (`src/lib/api/admin/projects.supabase.ts`)

Mesmas operações e erros da 001. Diferenças de comportamento:

| Operação | Comportamento real |
|---|---|
| `list(filters)` | Lê `projects` (com rascunhos, graças ao RLS `aal2`), filtra no banco por categoria/status; busca sem acento feita no cliente sobre o resultado (poucos itens) |
| `get(id)` | `null` quando não existe ou não é visível |
| `isSlugAvailable(slug, ignoreId)` | Consulta `projects` pelo slug |
| `create(draft)` | Gera `id`; envia imagens `blob:` ao Storage; insere; reordena com `reorder_projects` para encaixar `sort_order`; em falha apaga os envios novos |
| `update(id, draft)` | Envia imagens novas; atualiza; reordena se `sort_order` mudou; apaga órfãs do bucket; em falha apaga os envios novos |
| `remove(id)` | Apaga a linha, reordena e apaga `projects/<id>/` no Storage |
| `setPublished`, `setFeatured` | Atualiza a coluna |
| `move(id, direction)` | Monta a nova ordem e chama `reorder_projects` |

Erros: slug repetido (`23505`) → `slug_taken`; linha inexistente → `not_found`; demais → erro
genérico (mensagem de "não foi possível salvar" das telas).

Seleção da implementação em `src/lib/api/admin/projects.ts`: Supabase quando
`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` existem; local caso contrário.

## `AdminAuthService` (novo, `src/lib/api/admin/auth.ts`)

| Operação | Entrada | Saída | Regras e erros |
|---|---|---|---|
| `getStatus()` | — | `AuthStatus` (abaixo) | Lê sessão, nível de garantia, fatores e se é admin |
| `signIn(email, password)` | credenciais | `AuthStatus` | Erro `invalid_credentials` (mensagem única) ou `rate_limited` |
| `startEnrollment(friendlyName)` | nome do fator | `{ factorId, qrCode, secret }` | Remove cadastro `unverified` anterior antes de começar |
| `confirmEnrollment(factorId, code)` | código de 6 dígitos | `AuthStatus` (`aal2`) | Erro `invalid_code` |
| `verifyCode(code)` | código de 6 dígitos | `AuthStatus` (`aal2`) | Usa o primeiro fator `verified`; erro `invalid_code` ou `rate_limited` |
| `listFactors()` | — | `{ id, friendlyName, createdAt }[]` | Só os `verified` |
| `signOut()` | — | `void` | Encerra a sessão local |
| `onChange(callback)` | função | cancelar inscrição | Avisa login, logout e renovação |

```text
AuthStatus =
  | { step: "signed_out" }
  | { step: "not_admin" }                 // senha certa, sem linha em admins → sair
  | { step: "enroll" }                    // admin aal1 sem fator verificado
  | { step: "verify" }                    // admin aal1 com fator verificado
  | { step: "ready"; factorCount: number } // admin aal2
```

Erros como `AdminServiceError` com novos códigos: `invalid_credentials`, `invalid_code`,
`rate_limited`, `not_admin`.

## Hooks novos (`src/hooks/admin/use-admin-auth.ts`)

| Hook | Usa |
|---|---|
| `useAuthStatus()` | `getStatus` + `onChange` |
| `useSignIn()`, `useVerifyCode()`, `useStartEnrollment()`, `useConfirmEnrollment()`, `useSignOut()` | operações acima |
| `useFactors()` | `listFactors` |

## `revalidatePublicSite()` (novo, `src/lib/api/admin/revalidate.ts`)

Chamada pelos hooks de mutação no `onSuccess` (salvar, excluir, publicar, destacar, mover). Falha
na invalidação não desfaz a gravação: mostra aviso "salvo; o site pode levar algumas horas para
mostrar" (cache expira sozinho). Contrato HTTP em [revalidacao.md](./revalidacao.md).
