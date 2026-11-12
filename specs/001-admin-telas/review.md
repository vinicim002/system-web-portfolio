# Revisão do autor: Telas da área admin

**Fase 9 (princípio VII).** O autor usa as telas em `http://localhost:3000/admin` (em produção o
admin fica escondido) e decide, item a item, o que **fica**, **sai** ou **muda**. Só o que ficar
aprovado aqui vira função na integração real (próxima especificação).

**Como responder**: código + decisão, ex.: `P07 sai`, `S03 muda: mostrar só disponibilidade`.
Itens sem resposta ficam como estão.

**Data da revisão**: 2026-11-12

## Legenda

| Decisão | Significado |
|---|---|
| fica | Mantém como está e entra na integração real |
| sai | Remove da tela e não vira função |
| muda | Ajusta conforme a observação |

## 1. Entrada e estrutura

| Código | Item | Onde | Decisão | Observação |
|---|---|---|---|---|
| E01 | Tela de login (e-mail, senha, Entrar) | `/admin/login` | | Hoje só visual; na integração vira Supabase Auth |
| E02 | Aviso "login só visual" | `/admin/login` | | Some quando a Auth real entrar |
| E03 | Menu lateral (computador) / gaveta (celular) | todas | | |
| E04 | Item "Início" no menu | menu | | |
| E05 | Item "Projetos" no menu | menu | | |
| E06 | Item "Sistemas" no menu | menu | | Mostra a mesma grade do Início |
| E07 | Atalho "Ver site" (nova aba) | menu | | |
| E08 | Botão de tema claro/escuro | barra superior | | |
| E09 | Faixa "Dados de exemplo" no topo | todas | | Some na integração real |
| E10 | Barra superior no computador (só tem o botão de tema) | todas | | Pode receber algo mais (ex.: sair, usuário) |
| E11 | Página "não encontrado" do admin | `/admin/qualquer-coisa` | | |

## 2. Início e central de sistemas

| Código | Item | Onde | Decisão | Observação |
|---|---|---|---|---|
| S01 | Grade de sistemas no Início | `/admin` | | |
| S02 | Card de sistema no ar (RookHub, RookMTR, Fazendo Comuns) | grade | | |
| S03 | Status no card (Funcionando / Instável / Fora do ar) | card | | Cores só da paleta (lilás, cinza, vermelho); sem verde/amarelo |
| S04 | Disponibilidade (%) no card | card | | Dado de exemplo |
| S05 | Visitas (7 dias) no card | card | | Dado de exemplo |
| S06 | Ameaças bloqueadas (7 dias) no card | card | | Dado de exemplo |
| S07 | Rodapé do card "Últimos 7 dias · data" + selo "exemplo" | card | | |
| S08 | Card "Em breve" (Zona Sul Urgente) | grade | | |
| S09 | Ícone = inicial do nome sobre o lilás | card | | Trocar pelos logos quando você enviar |
| S10 | Seção "Portfólio" com "Ver projetos" e "Novo projeto" | `/admin` | | |
| S11 | Tela "Sistemas" separada no menu | `/admin/sistemas` | | Duplica a grade do Início |
| S12 | Página do sistema "Painel em construção" | `/admin/sistemas/rookhub` | | O painel completo é a spec seguinte |
| S13 | Botão "Abrir o site" na página do sistema | `/admin/sistemas/rookhub` | | |

## 3. Lista de projetos

| Código | Item | Onde | Decisão | Observação |
|---|---|---|---|---|
| L01 | Busca por título (sem acento) | `/admin/projetos` | | |
| L02 | Filtro por categoria | lista | | |
| L03 | Filtro por status | lista | | |
| L04 | "Limpar filtros" | lista | | |
| L05 | Contador "N projetos" | lista | | |
| L06 | Coluna Ordem (começa em 0) | tabela | | Pode mostrar a partir de 1 |
| L07 | Coluna Título + slug embaixo | tabela | | |
| L08 | Coluna Categoria | tabela | | |
| L09 | Coluna Status | tabela | | |
| L10 | Coluna Publicação (Publicado/Rascunho) | tabela | | |
| L11 | Coluna Destaque | tabela | | |
| L12 | Cartões no celular no lugar da tabela | celular | | |
| L13 | Mensagens de lista vazia / sem resultado | lista | | |

## 4. Ações rápidas na lista

| Código | Item | Onde | Decisão | Observação |
|---|---|---|---|---|
| A01 | Switch publicar/despublicar | linha | | |
| A02 | Estrela de destaque | linha | | |
| A03 | Setas subir/descer (ordem) | linha | | Ordem única para o site todo |
| A04 | Aviso de ordem com filtros ativos | lista | | |
| A05 | Menu "⋮" com Editar | linha | | O título também leva à edição |
| A06 | Menu "⋮" com Excluir + confirmação | linha | | |
| A07 | Mensagem breve (toast) a cada ação | todas | | |

## 5. Formulário de projeto (criar e editar)

| Código | Item | Onde | Decisão | Observação |
|---|---|---|---|---|
| P01 | Seção Identificação: endereço curto (slug) | formulário | | Sugerido pelo título pt |
| P02 | Prévia "Link no site: /pt/projetos/…" | slug | | |
| P03 | Título pt e en (obrigatórios) | Textos | | |
| P04 | Resumo pt e en (até 300, com contador) | Textos | | |
| P05 | Conteúdo pt e en em markdown | Textos | | |
| P06 | Abas Escrever / Pré-visualizar do markdown | Textos | | |
| P07 | Categoria (Mobile, Web, Automação, Sem categoria) | Classificação | | |
| P08 | Status (Em produção, MVP, Em evolução, Proposta técnica) | Classificação | | |
| P09 | Stack em chips (até 15) | Classificação | | |
| P10 | Capa (uma imagem, até 5 MB) | Imagens | | |
| P11 | Galeria (até 12, reordenar por setas, remover) | Imagens | | Sem arrastar e soltar |
| P12 | Aviso "envio simulado" | Imagens | | Some na integração real |
| P13 | Link do repositório | Links | | |
| P14 | Link da demo | Links | | |
| P15 | Switch Publicado | Publicação | | |
| P16 | Switch Destaque | Publicação | | |
| P17 | Campo Ordem (número) | Publicação | | Repete as setas da lista |
| P18 | Rodapé fixo com Cancelar / Salvar | formulário | | |
| P19 | "Excluir projeto" no rodapé da edição | edição | | |
| P20 | Aviso ao sair sem salvar | formulário | | Não cobre o "voltar" do navegador |
| P21 | Volta para a lista mantendo a busca | edição | | |
| P22 | Projeto novo nasce rascunho, em evolução, no fim da lista | criação | | |

## 6. Ideias e perguntas em aberto

Coisas que não existem e podem entrar (responda `fica`, `sai` ou detalhe):

| Código | Ideia | Decisão | Observação |
|---|---|---|---|
| N01 | Botão "Sair" (logout) na barra superior | | Necessário com a Auth real |
| N02 | Contadores no Início (ex.: N publicados, N rascunhos) | | |
| N03 | Pré-visualizar o projeto como no site antes de publicar | | |
| N04 | Arrastar e soltar para reordenar (projetos e galeria) | | Pede uma biblioteca nova |
| N05 | Mensagens do formulário de contato listadas no admin | | Hoje chegam só no Gmail |
| N06 | Logos reais dos sistemas | | Você envia os arquivos |
| N07 | Mais sistemas na central (Radar, automações) | | Spec seguinte |

## Decisões registradas

- **2026-11-12 — Tudo fica por enquanto.** O autor aprovou as telas como estão para seguir rápido:
  com cadastrar e gerenciar projetos o admin já atende. Ajustes de layout e funções novas do admin
  ficam para uma rodada futura de revisão (os códigos acima continuam valendo como referência).
- Pergunta do autor: viabilidade de autenticação em dois fatores no login → ver especificação da
  integração (Supabase Auth com MFA por app autenticador).

## Funções que a integração real precisa (T055)

1. **Autenticação** (Supabase Auth, e-mail + senha, cadastro público desligado) no `/admin/login`,
   com proteção das rotas do admin e botão de sair.
2. **Gravação dos projetos** no Supabase pelas mesmas operações do `AdminProjectsService`
   (listar, ler, criar, editar, excluir, publicar, destacar, ordenar), respeitando o RLS de admin.
3. **Imagens** de capa e galeria no bucket `project-images` (até 5 MB).
4. **Atualização do site** ao salvar (invalidação do cache `projects`; no Cloudflare, tag cache).
5. **Liberar o `/admin` em produção** (`ADMIN_ENABLED`) só depois dos itens 1 a 4.
6. Central de sistemas continua com dados de exemplo (painel real é outra especificação).
