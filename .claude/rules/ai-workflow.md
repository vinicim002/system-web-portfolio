# Como a IA trabalha neste repositório

- A única pasta de configuração de IA é `.claude/`. Não criar `.codex/`, `.cursor/`, `AGENTS.md`, `.cursorrules`, `.windsurf/` nem equivalentes.
- Memória e contexto do projeto ficam em `.claude/memory/` e `.claude/context/` (arquivos `.md`). Atualizar ao fim de cada etapa relevante:
  - decisões novas → `memory/decisions.md`
  - status/próximos passos → `memory/progress.md`
  - mudanças na especificação → `context/spec.md`
- A pasta `doc/` contém a especificação original em PDF; ela **não** é versionada. A versão de referência versionada é `context/spec.md`.
- Seguir a spec: DECIDIDO é fixo; PROPOSTA é ponto de partida; EM ABERTO → perguntar ao autor.
- Não inventar layouts finais: aguardar as referências visuais do autor para cada tela; até lá, estruturas simples e neutras.
- Comandos de terminal compatíveis com bash (Linux Pop!_OS 24.04).
- Ao commitar, seguir [git.md](git.md) à risca — sem co-autor e sem assinatura de IA.
