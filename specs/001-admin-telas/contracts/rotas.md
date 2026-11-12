# Contrato: rotas do admin

Todas ficam sob `src/app/admin/`, com layout raiz próprio, em português e fora do proxy de idioma.

| Rota | Tela | História | Observação |
|---|---|---|---|
| `/admin/login` | Login (só visual) | 1 | Grupo `(auth)`, sem moldura. "Entrar" leva a `/admin` |
| `/admin` | Início: grade de sistemas + atalhos de projetos | 1, 2 | Grupo `(painel)` |
| `/admin/sistemas` | Grade de sistemas, sem atalhos de projetos | 2 | |
| `/admin/sistemas/[slug]` | Esqueleto do painel do sistema ("em construção") | 2 | `slug` inexistente ou `soon` → não encontrado |
| `/admin/projetos` | Lista com busca, filtros e ações rápidas | 3, 5 | Filtros na URL (`?q=&categoria=&status=`) |
| `/admin/projetos/novo` | Formulário em branco | 4 | |
| `/admin/projetos/[id]` | Formulário de edição | 4 | `id` inexistente → não encontrado |
| `/admin/*` (qualquer outra) | Página não encontrada do admin | — | `[...missing]` + `not-found.tsx` |

## Menu

| Item | Rota | Marcado quando |
|---|---|---|
| Início | `/admin` | rota exatamente igual |
| Projetos | `/admin/projetos` | rota começa com `/admin/projetos` |
| Sistemas | `/admin/sistemas` | rota começa com `/admin/sistemas` |
| Ver site | `/pt` | abre o site público (nova aba) |

## Regras

- Nenhuma rota é bloqueada nesta entrega (RF-002, princípio VII).
- Todas as rotas têm `robots: noindex, nofollow` (RF-025).
- Filtros da lista ficam na URL para que voltar da edição mantenha a busca do autor.
