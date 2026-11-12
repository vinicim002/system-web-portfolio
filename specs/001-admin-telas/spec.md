# Especificação: Telas da área admin

**Branch**: `main` (sem branch própria da funcionalidade)

**Criada em**: 2026-11-11

**Status**: Rascunho

**Entrada**: primeira entrega da área admin feita só de telas, com dados de exemplo em memória,
seguindo o princípio VII da constituição. O objetivo é o autor navegar por todas as telas do admin
para decidir o que fica, o que sai e quais funções realmente precisam existir antes de qualquer
integração. Inclui login só visual, estrutura e menu do admin, início com a grade dos sistemas do
autor e a gestão completa dos projetos do portfólio.

**Referências**: `.specify/memory/constitution.md` (princípios III, IV, V e VII),
`.claude/context/spec.md` (seções 4, 5 e 6), `.claude/memory/decisions.md` (visão do admin como
central de sistemas, 2026-11-11).

## Cenários de uso e testes *(obrigatório)*

### História 1: Entrar no admin e navegar pela estrutura (Prioridade: P1)

O autor abre o endereço de login do admin, vê a tela de entrada com a identidade visual do site e
clica em **Entrar**. Sem verificar nenhuma senha, o admin abre na tela **Início**. Um menu fixo dá
acesso a **Início**, **Projetos** e **Sistemas**, e o item da tela atual aparece marcado. O autor
alterna entre os temas claro e escuro e volta ao site público por um atalho.

**Por que esta prioridade**: é a base de todas as outras telas. Sem ela não há onde revisar nada.

**Teste independente**: abrir o login, clicar em Entrar, clicar em cada item do menu e conferir que
a tela certa abre, com o item marcado e o visual do site nos dois temas.

**Cenários de aceite**:

1. **Dado** que o autor abre o login do admin, **quando** a tela carrega, **então** aparecem os
   campos de e-mail e senha, o botão Entrar e um aviso discreto de que o login ainda é só visual.
2. **Dado** a tela de login, **quando** o autor clica em Entrar com os campos vazios ou
   preenchidos, **então** o admin abre na tela Início sem validar credenciais nem guardar nada.
3. **Dado** qualquer tela do admin, **quando** o autor clica num item do menu, **então** a tela
   correspondente abre, o item fica marcado e o menu continua visível.
4. **Dado** que o autor digita diretamente o endereço de uma tela do admin, **quando** a página
   carrega, **então** a tela abre sem passar pelo login (nenhuma rota é bloqueada nesta entrega).
5. **Dado** qualquer tela do admin, **quando** o autor troca o tema, **então** toda a interface muda
   entre claro e escuro, seguindo as cores da marca.

---

### História 2: Ver a central de sistemas no Início (Prioridade: P2)

No Início, o autor vê uma grade com o ícone de cada sistema que ele mantém: **RookHub**, **RookMTR**
e **Fazendo Comuns** (já no ar) e **Zona Sul Urgente** (marcado como em breve). Cada card mostra um
resumo de status de exemplo. O Início também tem atalhos para a gestão de projetos. Ao clicar num
sistema, abre a página daquele sistema, que nesta entrega mostra só o esqueleto, com o nome, o
ícone e o aviso de que o painel está em construção.

**Por que esta prioridade**: é a porta de entrada da visão do admin como central de sistemas e
precisa ser revisada antes da especificação 002, que detalha o painel de cada sistema.

**Teste independente**: abrir o Início, conferir os quatro cards, clicar em cada sistema no ar e
conferir que a página daquele sistema abre com o aviso de construção.

**Cenários de aceite**:

1. **Dado** o Início, **quando** a tela carrega, **então** aparecem quatro cards de sistema, cada um
   com ícone, nome e um resumo de status de exemplo identificado como dado de exemplo.
2. **Dado** o card de um sistema já no ar, **quando** o autor clica nele, **então** abre a página só
   daquele sistema, com nome, ícone e o aviso "painel em construção".
3. **Dado** o card do Zona Sul Urgente, **quando** o autor o vê, **então** ele aparece como "em
   breve", sem resumo de status e sem levar a um painel.
4. **Dado** o Início, **quando** o autor clica no atalho de projetos, **então** a lista de projetos
   abre; e o atalho "novo projeto" abre o formulário em branco.
5. **Dado** a tela **Sistemas** no menu, **quando** ela abre, **então** mostra a mesma grade de
   sistemas do Início, sem os atalhos de projetos.

---

### História 3: Consultar e filtrar os projetos do portfólio (Prioridade: P3)

O autor abre **Projetos** e vê a lista dos 5 projetos atuais do site, com título, categoria, status,
se está publicado ou é rascunho, se é destaque e a ordem. Ele busca pelo nome e filtra por
categoria e por status.

**Por que esta prioridade**: mostrar os dados como eles são hoje é o primeiro passo para decidir
quais campos e ações a gestão realmente precisa.

**Teste independente**: abrir Projetos, conferir os 5 projetos com todas as colunas, buscar por
parte de um nome e combinar os filtros.

**Cenários de aceite**:

1. **Dado** a tela Projetos, **quando** ela carrega, **então** os 5 projetos aparecem na ordem
   definida, cada um com título, categoria, status, situação de publicação, destaque e ordem.
2. **Dado** a lista, **quando** o autor digita parte de um título na busca, **então** só os projetos
   que contêm o texto aparecem, sem diferenciar maiúsculas, minúsculas nem acentos.
3. **Dado** a lista, **quando** o autor escolhe uma categoria e um status, **então** só os projetos
   que atendem aos dois filtros aparecem, e é possível limpar os filtros com um clique.
4. **Dado** uma busca ou filtro sem resultados, **quando** a lista fica vazia, **então** aparece uma
   mensagem dizendo que nenhum projeto foi encontrado e como limpar os filtros.

---

### História 4: Criar e editar um projeto (Prioridade: P4)

O autor abre um projeto existente ou clica em **Novo projeto** e preenche um formulário com todos os
campos do projeto: endereço curto (slug), título e resumo em português e inglês, conteúdo em
português e inglês, categoria, status, stack, capa, galeria, links de repositório e demo, destaque,
publicado e ordem. Ele escolhe imagens do computador para a capa e a galeria e vê a pré-visualização
na hora, sem que nada seja enviado. Ao salvar, o projeto aparece atualizado na lista.

**Por que esta prioridade**: é a tela mais extensa e a que mais pode revelar campos sobrando ou
faltando; por isso é revisada depois da estrutura e da lista.

**Teste independente**: criar um projeto novo com todos os campos, salvar, conferir que ele aparece
na lista; editar um projeto existente, salvar e conferir a mudança.

**Cenários de aceite**:

1. **Dado** o formulário de novo projeto, **quando** o autor preenche os campos obrigatórios e
   salva, **então** o projeto aparece na lista com os valores informados e uma mensagem confirma o
   salvamento.
2. **Dado** o formulário, **quando** o autor tenta salvar sem título em português ou inglês, sem
   endereço curto ou com um endereço curto já usado ou fora do formato (letras minúsculas, números e
   hífens), **então** o salvamento é impedido e cada campo com problema mostra o motivo.
3. **Dado** um endereço curto vazio ou ainda não editado à mão, **quando** o autor digita o título
   em português, **então** um endereço curto é sugerido a partir do título; depois que o autor o
   altera, a sugestão para.
4. **Dado** o formulário, **quando** o autor escolhe imagens para a capa ou a galeria, **então** as
   imagens aparecem como pré-visualização, podem ser removidas ou reordenadas na galeria, e um aviso
   informa que o envio é simulado.
5. **Dado** o conteúdo em markdown, **quando** o autor alterna para a pré-visualização, **então** o
   texto aparece formatado como no site público.
6. **Dado** um formulário com alterações não salvas, **quando** o autor tenta sair da tela, **então**
   o admin pergunta se ele quer descartar as alterações.
7. **Dado** um projeto existente, **quando** o autor abre a edição, **então** todos os campos chegam
   preenchidos com os valores atuais.

---

### História 5: Publicar, destacar, ordenar e excluir projetos (Prioridade: P5)

Na lista, o autor publica ou despublica um projeto, marca ou desmarca como destaque, muda a ordem
dos projetos (inclusive dos destaques) com botões de subir e descer, e exclui um projeto depois de confirmar.

**Por que esta prioridade**: são ações rápidas que dependem da lista pronta; revisá-las mostra quais
merecem atalho direto na lista e quais podem ficar só no formulário.

**Teste independente**: na lista, despublicar e publicar um projeto, trocar a ordem de dois
projetos e excluir um projeto, conferindo o resultado de cada ação na própria lista.

**Cenários de aceite**:

1. **Dado** um projeto publicado, **quando** o autor o despublica, **então** ele passa a aparecer
   como rascunho na lista e uma mensagem confirma a mudança.
2. **Dado** a lista, **quando** o autor muda a ordem de um projeto (destaque ou não), **então** a
   nova ordem aparece imediatamente e os números de ordem se ajustam sem repetir.
3. **Dado** um projeto, **quando** o autor pede para excluí-lo, **então** o admin pede confirmação
   mostrando o título; ao confirmar, o projeto some da lista; ao cancelar, nada muda.
4. **Dado** qualquer ação desta história, **quando** o autor recarrega a página, **então** os dados
   voltam ao estado inicial, e o site público nunca é afetado.

---

### Casos-limite

- Recarregar a página descarta todas as alterações e volta aos 5 projetos iniciais; um aviso fixo no
  admin lembra que os dados são de exemplo e não são salvos.
- Excluir todos os projetos deixa a lista vazia com uma mensagem e o atalho para criar um novo.
- Imagens muito grandes (acima de 5 MB) ou em formato que não é imagem são recusadas na escolha, com
  a mensagem do motivo, seguindo o mesmo limite do espaço de imagens real.
- Endereço de uma tela do admin que não existe mostra a mensagem de página não encontrada do admin,
  com atalho para o Início.
- Endereço de um projeto ou sistema que não existe mostra a mensagem de item não encontrado, com
  atalho para a lista correspondente.
- Em tela de celular, o menu vira um botão que abre a navegação, e a lista de projetos troca as
  colunas por cartões.
- Conteúdo em markdown com formatação inválida é mostrado como texto na pré-visualização, sem quebrar
  a tela.

## Requisitos *(obrigatório)*

### Requisitos funcionais

- **RF-001**: O admin DEVE ter um endereço de login próprio, separado do site público, com campos de
  e-mail e senha e um botão Entrar.
- **RF-002**: O login DEVE ser só visual nesta entrega: não verifica credenciais, não guarda sessão
  nem senha e não bloqueia nenhuma tela do admin.
- **RF-003**: O admin DEVE ter um menu com Início, Projetos e Sistemas, marcando a tela atual, e um
  atalho para abrir o site público.
- **RF-004**: O admin DEVE estar todo em português e usar a identidade visual do site, nos temas
  claro e escuro, com troca de tema disponível em todas as telas.
- **RF-005**: O admin DEVE exibir de forma permanente um aviso de que os dados são de exemplo e não
  são salvos.
- **RF-006**: O Início DEVE mostrar a grade de sistemas (RookHub, RookMTR, Fazendo Comuns e Zona Sul
  Urgente) e atalhos para a lista de projetos e para criar um projeto.
- **RF-007**: Cada card de sistema no ar DEVE mostrar ícone, nome e um resumo de status de exemplo
  identificado como exemplo; o Zona Sul Urgente DEVE aparecer como "em breve", sem levar a painel.
- **RF-008**: Cada sistema no ar DEVE ter uma página própria que, nesta entrega, mostra nome, ícone e
  o aviso de painel em construção.
- **RF-009**: A tela Projetos DEVE listar os projetos com título, categoria, status, situação de
  publicação, destaque e ordem, começando pelos 5 projetos atuais do site.
- **RF-010**: A lista DEVE permitir busca por título (sem diferenciar maiúsculas e acentos) e filtros
  por categoria e status, combináveis e com opção de limpar.
- **RF-011**: O admin DEVE permitir criar e editar um projeto com todos os campos do modelo:
  endereço curto, título e resumo em português e inglês, conteúdo em português e inglês, categoria,
  status, stack, capa, galeria, link do repositório, link da demo, destaque, publicado e ordem.
- **RF-012**: O formulário DEVE exigir endereço curto único no formato de letras minúsculas, números
  e hífens, e títulos em português e inglês, mostrando o motivo de cada erro junto do campo.
- **RF-013**: O formulário DEVE sugerir o endereço curto a partir do título em português enquanto ele
  estiver vazio ou não tiver sido editado à mão.
- **RF-014**: O formulário DEVE validar que os links de repositório e demo, quando preenchidos, são
  endereços válidos.
- **RF-015**: O formulário DEVE permitir escolher imagens de capa e galeria com pré-visualização
  imediata, remover imagens e reordenar a galeria, sem enviar nada, recusando arquivos que não são
  imagem ou que passam de 5 MB.
- **RF-016**: O formulário DEVE oferecer pré-visualização do conteúdo em markdown com a mesma
  formatação do site público.
- **RF-017**: O admin DEVE perguntar antes de descartar alterações não salvas ao sair do formulário.
- **RF-018**: A lista DEVE permitir publicar e despublicar, marcar e desmarcar destaque e reordenar
  os projetos (a mesma ordem vale para os destaques no site), refletindo a mudança na hora.
- **RF-019**: O admin DEVE pedir confirmação, mostrando o título, antes de excluir um projeto.
- **RF-020**: Toda ação de salvar, publicar, ordenar ou excluir DEVE mostrar uma confirmação breve do
  que aconteceu.
- **RF-021**: Todas as leituras e mudanças de projetos DEVEM passar pela camada de dados do projeto,
  com uma implementação local em memória que possa ser trocada pela integração real sem mudar as
  telas.
- **RF-022**: As mudanças feitas no admin NÃO DEVEM persistir após recarregar a página nem afetar o
  site público.
- **RF-023**: O admin DEVE funcionar em telas de computador e de celular, com menu recolhível e lista
  em cartões no celular.
- **RF-024**: Endereços inexistentes do admin, de projetos e de sistemas DEVEM mostrar uma mensagem
  de não encontrado com atalho de volta.
- **RF-025**: O admin NÃO DEVE aparecer nos resultados de busca (não indexável).

### Entidades principais

- **Projeto**: um item do portfólio. Tem endereço curto único, título, resumo e conteúdo em português
  e inglês, categoria (mobile, web, automação), status (produção, MVP, em evolução, proposta), stack,
  capa, galeria, links de repositório e demo, destaque, publicado e ordem. É o mesmo modelo usado pelo
  site público.
- **Sistema monitorado**: um sistema do autor exibido na central (RookHub, RookMTR, Fazendo Comuns,
  Zona Sul Urgente). Tem nome, ícone, situação (no ar ou em breve) e um resumo de status de exemplo.
  Os dados reais e o painel detalhado ficam para a especificação 002.
- **Imagem em pré-visualização**: imagem escolhida no formulário para capa ou galeria, mantida só na
  tela, com nome, tamanho e posição na galeria. Não é enviada a lugar nenhum nesta entrega.

## Critérios de sucesso *(obrigatório)*

### Resultados mensuráveis

- **CS-001**: O autor chega a qualquer tela do admin a partir do login em no máximo 2 cliques.
- **CS-002**: O autor cria um projeto completo, com capa e galeria, em menos de 5 minutos.
- **CS-003**: Todas as 5 histórias podem ser percorridas do começo ao fim sem nenhuma gravação
  externa e sem nenhuma mudança visível no site público.
- **CS-004**: 100% das ações de mudança (salvar, publicar, destacar, ordenar, excluir) mostram uma
  confirmação e refletem o resultado na tela em até 1 segundo.
- **CS-005**: Todas as telas mantêm contraste legível e foco visível nos temas claro e escuro, e
  funcionam em tela de celular sem rolagem lateral.
- **CS-006**: Ao fim da revisão, o autor consegue listar quais campos, telas e ações ficam e quais
  saem, gerando a lista de funções da integração real.

## Premissas

- O autor é o único usuário do admin; não há cadastro, perfis nem permissões diferentes.
- O admin fica fora das rotas com idioma (`/pt`, `/en`) e é todo em português, como previsto na
  especificação do projeto.
- Os dados iniciais são os 5 projetos atuais do site (RookHub, App do Motorista, RookMTR, Fazendo
  Comuns e Telecarga), carregados em memória a cada abertura.
- Os resumos de status dos sistemas são inventados e marcados como exemplo, porque as fontes de dados
  reais ainda não foram definidas.
- Os ícones dos sistemas usam a inicial ou um ícone genérico enquanto o autor não enviar os logos.
- Autenticação real, gravação no banco, envio de imagens ao espaço de imagens, atualização do site
  ao salvar, painéis detalhados dos sistemas e qualquer coleta de analytics ficam fora desta entrega,
  e só começam depois de o autor revisar e aprovar estas telas (princípio VII).
