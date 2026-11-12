# Guia de validação: Integração real da área admin

Como conferir que a entrega cumpre a [spec](./spec.md). Contratos em [contracts/](./contracts/) e
regras em [data-model.md](./data-model.md).

## Pré-requisitos

- Supabase local (Docker) para testar migrations e RLS; projeto real `yxqarosyroxewbicoxkx` para a
  validação final.
- `system-portfolio-web-frontend/.env.local` com `NEXT_PUBLIC_SUPABASE_URL` e
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` (chave publishable).
- Aplicativo autenticador no celular (Google Authenticator, Microsoft Authenticator, Authy ou
  1Password).
- Supabase real: MFA TOTP ligado (Authentication → Multi-Factor).

## Rodar

```bash
# banco local (system-portfolio-web-backend/)
npx supabase start -x studio,imgproxy,mailpit,realtime,logflare,vector,supavisor,postgres-meta
npx supabase db reset                 # migrations + seed
# testes de RLS aal1 x aal2 (script SQL da implementação)

# front (system-portfolio-web-frontend/)
npm run test && npx tsc --noEmit && npm run lint && npm run build
npm run dev                           # http://localhost:3000/admin/login
npx opennextjs-cloudflare build && npx opennextjs-cloudflare preview   # runtime do Cloudflare
```

## Roteiro por história

| # | Passos | Resultado esperado |
|---|---|---|
| 1 | Entrar sem fator; cadastrar pelo QR code; sair; entrar de novo com o código; errar o código; abrir `/admin/projetos` deslogado | Cadastro confirma com 6 dígitos; segundo login pede código; erro claro; acesso direto vai ao login e volta à tela pedida |
| 1 | Entrar com uma conta que não é admin (local) | Acesso negado e sessão encerrada |
| 2 | Criar, editar, publicar, destacar, mover e excluir, recarregando a cada passo | Tudo continua igual depois de recarregar e em outro navegador |
| 2 | Com sessão `aal1` (senha sem código), tentar gravar pelo console do navegador | Recusado pelo banco |
| 3 | Criar com capa + 2 imagens; trocar a capa; remover 1 imagem; excluir o projeto | Imagens aparecem no site; no Storage não sobra nada de `projects/<id>/` |
| 3 | Editar um projeto com imagens antigas (`/images/...`) | Continuam aparecendo e não são apagadas |
| 4 | Despublicar e publicar um projeto; editar texto pt/en | Site (dev, preview Cloudflare e produção) mostra a mudança em até 1 minuto |
| 5 | Com `ADMIN_ENABLED=true` publicado, entrar pelo domínio | Login, código e gravação funcionando; HTML do admin com `noindex` |

## Conferências gerais

- `POST /api/revalidate` sem token → 401; com token `aal1` → 403; com `aal2` → 200.
- Telas da 001 sem mudança de layout (roteiro de `specs/001-admin-telas/quickstart.md`).
- Rascunho não abre no site nem por endereço direto.
- Recuperação documentada: remover fator pelo painel do Supabase (Authentication → Users → usuário
  → MFA factors).
