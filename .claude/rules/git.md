# Regras de Git

## Padrão de commit

Conventional Commits: **prefixo em inglês**, **descrição em português (pt-BR)**, no imperativo/presente, minúscula, sem ponto final.

```
<tipo>(<escopo opcional>): <descrição em português>

<corpo opcional em português explicando o porquê>
```

| Tipo       | Uso                                                        |
|------------|------------------------------------------------------------|
| `feat`     | nova funcionalidade                                        |
| `fix`      | correção de bug                                            |
| `docs`     | documentação                                               |
| `style`    | formatação, espaços (sem mudança de lógica)               |
| `refactor` | refatoração sem mudar comportamento                        |
| `perf`     | melhoria de desempenho                                     |
| `test`     | testes                                                     |
| `build`    | dependências, build, bundler                               |
| `ci`       | pipelines e automações de CI                               |
| `chore`    | manutenção, configs, tarefas gerais                        |
| `revert`   | reverte um commit anterior                                 |

Escopos sugeridos: `front`, `admin`, `api`, `supabase`, `i18n`, `theme`, `ui`, `deploy`.

Exemplos:

```
feat(front): adiciona seção hero na home
fix(admin): corrige upload de imagem da galeria
chore: configura eslint e prettier
refactor(api): isola consultas de projetos em src/lib/api
```

## Autoria

- O **único autor** dos commits é o Vinicius (config git local do autor).
- **Proibido** adicionar `Co-Authored-By`, `Generated with Claude Code`, menções a Claude, IA, Codex, Cursor ou qualquer trailer/assinatura automática — em commits **e** em descrições de PR.
- Não alterar `git config user.name` / `user.email`.

## Nunca versionar

- `doc/` (documentos locais do autor).
- `.env`, `.env.*` (somente `.env.example` sem valores reais pode ir), `.dev.vars`.
- Chaves, tokens, service role key do Supabase, certificados (`*.pem`, `*.key`).
- Pastas de outras ferramentas de IA (`.codex/`, `.cursor/`, etc.).

Antes de cada commit, rodar `git status` e conferir que nada disso está staged. Preferir `git add <arquivos>` explícitos a `git add -A` quando houver dúvida.

## Fluxo

- Branch principal: `main`. Remoto: `origin` (GitHub `vinicim002/system-web-portfolio`).
- Commits pequenos e focados; uma mudança lógica por commit.
- Push somente quando o autor pedir.
