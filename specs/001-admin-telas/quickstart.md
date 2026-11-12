# Guia de validação: Telas da área admin

Como rodar e conferir que a entrega cumpre a [spec](./spec.md). Os detalhes de rotas e serviços estão
em [contracts/](./contracts/) e os campos em [data-model.md](./data-model.md).

## Pré-requisitos

- Node 24 e dependências instaladas em `system-portfolio-web-frontend/` (`npm install`).
- Nenhuma variável nova: o admin desta entrega não usa o Supabase.

## Rodar

```bash
cd system-portfolio-web-frontend
npm run dev          # http://localhost:3000/admin/login
npm run test         # Vitest: serviço local e validação
npx tsc --noEmit && npm run lint && npm run build
```

## Roteiro por história

| # | Passos | Resultado esperado |
|---|---|---|
| 1 | Abrir `/admin/login`, clicar em Entrar; clicar em cada item do menu; trocar o tema; abrir `/admin/projetos` direto pela barra de endereço | Admin abre sem pedir senha; item do menu marcado; tema muda tudo; nenhuma rota bloqueada; aviso "dados de exemplo" sempre visível |
| 2 | No Início, conferir os 4 cards; clicar em RookHub, RookMTR e Fazendo Comuns; tentar o Zona Sul Urgente | 3 painéis "em construção"; Zona Sul Urgente aparece "em breve" e não abre painel |
| 3 | Em Projetos, buscar "rook" e "logistica" (sem acento); filtrar Web + Em produção; limpar | Lista filtra sem diferenciar acento; mensagem de vazio quando não há resultado |
| 4 | Novo projeto: digitar o título e ver o slug sugerido; tentar salvar com slug `rookhub`; escolher capa e 2 imagens de galeria, reordenar e remover uma; ver a pré-visualização do markdown; tentar sair sem salvar; salvar | Erro de slug repetido; pré-visualizações aparecem com aviso de envio simulado; diálogo ao sair; projeto novo na lista como rascunho |
| 5 | Despublicar um projeto; mover um projeto para cima; excluir com confirmação e depois cancelar outra exclusão; recarregar a página | Confirmação a cada ação; ordem renumerada sem repetir; ao recarregar, volta aos 5 projetos iniciais |

## Conferências gerais

- Site público (`/pt/projetos`) não muda depois de nenhuma ação no admin (CS-003).
- Imagem acima de 5 MB ou arquivo que não é imagem é recusado com mensagem.
- Markdown com formatação inválida aparece como texto na pré-visualização, sem quebrar a tela.
- `/admin/qualquer-coisa`, `/admin/projetos/nao-existe` e `/admin/sistemas/nao-existe` mostram
  "não encontrado" com atalho de volta.
- Prints nos temas claro e escuro, em 1440×900 e 390×844, sem rolagem lateral (CS-005).
- O HTML das telas do admin tem `noindex` (RF-025).
