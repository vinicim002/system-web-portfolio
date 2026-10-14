# Registro de decisões

Formato: data — decisão — motivo.

- 2026-10 — Backend apenas com Supabase (Postgres, Auth, Storage, RLS); descartado Java/Spring com Docker — suficiente para o CRUD e gratuito.
- 2026-10 — Hospedagem no Cloudflare Workers via `@opennextjs/cloudflare` — custo zero.
- 2026-10 — Acesso a dados isolado em `src/lib/api/` — permite trocar de backend mexendo só nessa camada.
- 2026-10-13 — Repositório com duas pastas: `system-portfolio-web-frontend/` (Next.js) e `system-portfolio-web-backend/` (artefatos do Supabase: migrations, RLS, seeds).
- 2026-10-13 — Commits em Conventional Commits (prefixo inglês, descrição pt-BR), autoria única do Vinicius, sem co-autor/assinatura de IA.
- 2026-10-13 — Única pasta de IA permitida: `.claude/`. `doc/` e segredos fora do git.
