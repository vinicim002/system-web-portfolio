# Portfólio Vinicius — instruções do projeto

Portfólio pessoal de desenvolvedor (mobile, web e automação), bilíngue (pt/en), com modo claro/escuro e uma área admin privada para gerenciar projetos.

## Leia antes de qualquer tarefa

- [context/spec.md](context/spec.md) — especificação completa do projeto (stack, cores, rotas, dados, ordem de desenvolvimento).
- [rules/git.md](rules/git.md) — padrão de commits, autoria e o que nunca vai para o git.
- [rules/code.md](rules/code.md) — convenções de código, idioma e arquitetura.
- [rules/ai-workflow.md](rules/ai-workflow.md) — como a IA deve trabalhar neste repositório.
- [memory/decisions.md](memory/decisions.md) — registro de decisões tomadas ao longo do projeto.
- [memory/progress.md](memory/progress.md) — estado atual e próximos passos.

## Regras inegociáveis (resumo)

1. **Commits**: Conventional Commits com prefixo em inglês e descrição em português (`feat: adiciona seção hero`).
2. **Autoria única**: o único autor é o Vinicius. Proibido `Co-Authored-By`, menções a Claude, Claude Code, IA ou qualquer assinatura gerada em commits e PRs.
3. **Nunca versionar**: a pasta `doc/`, arquivos `.env*` (exceto `.env.example`), `.dev.vars`, chaves, tokens ou qualquer dado sensível.
4. **Somente `.claude/`**: não criar `.codex/`, `.cursor/`, `AGENTS.md`, `.cursorrules` ou configs de outras ferramentas de IA.
5. **Memória do projeto**: arquivos `.md` de contexto/memória ficam apenas dentro de `.claude/`.
6. Respostas e comentários de código em **português do Brasil**; nomes de variáveis, funções e arquivos em **inglês**.
7. Itens marcados como DECIDIDO na spec são fixos. EM ABERTO: perguntar ao autor antes de assumir.
8. Layouts finais só com as referências visuais enviadas pelo autor.

## Estrutura do repositório

```
system-web-portfolio/
├── .claude/                        # regras, contexto e memória do projeto
├── system-portfolio-web-frontend/  # app Next.js (front-end)
└── system-portfolio-web-backend/   # Supabase: migrations, RLS, seeds (sem Java/Spring)
```

Ambiente do autor: Linux (Pop!_OS 24.04), bash.
