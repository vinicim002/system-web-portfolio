# Especificação: Integração real da área admin

**Branch**: `main` (sem branch própria da funcionalidade)

**Criada em**: 2026-11-12

**Status**: Rascunho

**Entrada**: segunda entrega da área admin, depois da revisão das telas da especificação 001
(aprovadas como estão em 2026-11-12, `specs/001-admin-telas/review.md`). O autor, único admin,
passa a entrar de verdade no admin, com senha e um segundo fator por aplicativo autenticador, e a
gerenciar os projetos do portfólio com os dados reais. O site público reflete as mudanças logo
depois de salvar, e o admin, hoje escondido no site publicado, entra no ar ao final.

**Referências**: `.specify/memory/constitution.md` (princípios III, IV e VII),
`specs/001-admin-telas/` (telas, contratos dos serviços e revisão), `.claude/context/supabase.md`
e `.claude/context/cloudflare.md`.

## Cenários de uso e testes *(obrigatório)*

### História 1: Entrar no admin com senha e segundo fator (Prioridade: P1)

O autor abre o login do admin e entra com e-mail e senha. No primeiro acesso, o admin pede que ele
cadastre um aplicativo autenticador lendo um QR code e confirme com o código de 6 dígitos gerado
pelo aplicativo. Nos acessos seguintes, depois da senha, o admin pede o código do aplicativo. Só
então as telas abrem. O admin recomenda cadastrar um segundo aplicativo ou aparelho para não perder
o acesso, e há um botão para sair.

**Por que esta prioridade**: sem entrada segura não há como liberar nenhuma gravação real. É a base
de todas as outras histórias.

**Teste independente**: com uma conta de admin sem fator cadastrado, entrar, cadastrar o fator,
sair e entrar de novo informando o código; tentar abrir qualquer tela do admin sem estar logado ou
sem ter informado o código e conferir que ela não abre.

**Cenários de aceite**:

1. **Dado** o login do admin, **quando** o autor informa e-mail e senha corretos pela primeira vez,
   **então** o admin mostra um QR code e um código para digitar manualmente, e só libera as telas
   depois que um código de 6 dígitos válido for confirmado.
2. **Dado** um admin com fator cadastrado, **quando** ele informa e-mail e senha corretos, **então**
   o admin pede o código do aplicativo antes de abrir qualquer tela.
3. **Dado** a etapa do código, **quando** o autor digita um código errado ou vencido, **então** o
   admin informa que o código é inválido e permite tentar de novo, sem revelar outros detalhes.
4. **Dado** e-mail ou senha errados, **quando** o autor tenta entrar, **então** o admin mostra uma
   mensagem única de "e-mail ou senha inválidos", sem dizer qual dos dois está errado.
5. **Dado** uma conta que consegue entrar mas não é admin, **quando** ela tenta abrir o admin,
   **então** vê uma mensagem de acesso negado e é desconectada.
6. **Dado** qualquer tela do admin, **quando** o autor clica em Sair, **então** a sessão termina e o
   login aparece; voltar pelo navegador não reabre as telas.
7. **Dado** alguém sem sessão, ou com sessão sem o código confirmado, **quando** abre diretamente o
   endereço de uma tela do admin, **então** é levado ao login (ou à etapa do código) e, depois de
   concluir, volta para a tela que tentou abrir.
8. **Dado** um admin com apenas um fator, **quando** ele entra, **então** o admin mostra um lembrete
   para cadastrar um segundo fator, com o atalho para fazer isso.

---

### História 2: Gerenciar os projetos com os dados reais (Prioridade: P2)

Com o admin aberto, o autor vê os projetos reais do portfólio e usa as mesmas telas já aprovadas
para criar, editar, excluir, publicar ou despublicar, destacar e reordenar. Tudo fica salvo de
forma permanente. O banco só aceita essas mudanças de quem é admin e concluiu o segundo fator,
mesmo que alguém tente gravar sem passar pelas telas.

**Por que esta prioridade**: é o motivo de existir o admin. Depende só da entrada segura.

**Teste independente**: criar um projeto, recarregar a página e conferir que ele continua lá;
editar, publicar, destacar, reordenar e excluir, recarregando a cada passo; tentar gravar com uma
sessão sem o segundo fator e conferir que a gravação é recusada.

**Cenários de aceite**:

1. **Dado** o admin aberto, **quando** a lista carrega, **então** aparecem os projetos reais,
   inclusive os rascunhos, na ordem do site.
2. **Dado** o formulário de novo projeto preenchido, **quando** o autor salva, **então** o projeto
   fica gravado e continua na lista depois de recarregar a página ou entrar de outro aparelho.
3. **Dado** um endereço curto já usado por outro projeto, **quando** o autor tenta salvar, **então**
   o salvamento é impedido e o campo mostra o motivo, como já acontece nas telas.
4. **Dado** ações de publicar, destacar, reordenar ou excluir, **quando** o autor as executa,
   **então** o resultado aparece na hora e continua igual depois de recarregar.
5. **Dado** uma sessão sem o segundo fator concluído, ou de alguém que não é admin, **quando** uma
   gravação é tentada por qualquer meio, **então** ela é recusada e nada muda nos dados.
6. **Dado** uma falha de conexão ou do servidor ao salvar, **quando** ela acontece, **então** o admin
   mostra uma mensagem clara, mantém o que foi digitado e permite tentar de novo.
7. **Dado** a troca da implementação local pela real, **quando** as telas são usadas, **então** elas
   funcionam sem mudança de layout ou de comportamento em relação à entrega 001.

---

### História 3: Enviar e manter as imagens dos projetos (Prioridade: P3)

No formulário, o autor escolhe a capa e as imagens da galeria. Elas passam a ser enviadas de verdade
e aparecem no site. Imagens removidas do projeto, trocadas ou de projetos excluídos deixam de ocupar
espaço.

**Por que esta prioridade**: os projetos já podem ser gravados sem imagem nova; o envio completa o
cadastro e depende da História 2.

**Teste independente**: criar um projeto com capa e duas imagens de galeria, conferir que elas
aparecem no site; trocar a capa, remover uma imagem da galeria e excluir o projeto, conferindo que
as imagens antigas não ficam guardadas.

**Cenários de aceite**:

1. **Dado** uma imagem de até 5 MB, **quando** o autor salva o projeto, **então** a imagem é enviada
   e passa a aparecer na lista, na edição e na página do projeto no site.
2. **Dado** um arquivo que não é imagem ou maior que 5 MB, **quando** o autor o escolhe, **então** ele
   é recusado com o motivo, antes de qualquer envio.
3. **Dado** um envio que falha no meio, **quando** o autor salva, **então** o projeto não fica salvo
   pela metade: o admin avisa qual imagem falhou e mantém o formulário para tentar de novo.
4. **Dado** uma capa trocada, uma imagem removida da galeria ou um projeto excluído, **quando** a
   mudança é salva, **então** as imagens que deixaram de ser usadas são apagadas do armazenamento.
5. **Dado** as imagens atuais do site (já publicadas antes desta entrega), **quando** um projeto que
   as usa é editado, **então** elas continuam aparecendo e não são apagadas.

---

### História 4: Ver as mudanças no site logo depois de salvar (Prioridade: P4)

Depois de salvar, publicar, despublicar, destacar, reordenar ou excluir no admin, o autor abre o
site público e já vê o resultado, sem esperar horas nem publicar o site de novo.

**Por que esta prioridade**: completa o ciclo de trabalho; sem ela as gravações só aparecem no site
quando o cache expira.

**Teste independente**: despublicar um projeto no admin e, em seguida, abrir a lista de projetos e a
página inicial do site publicado, conferindo que ele sumiu; publicar de novo e conferir que voltou.

**Cenários de aceite**:

1. **Dado** um projeto publicado, **quando** o autor o despublica, **então** em até 1 minuto ele some
   da página inicial, da lista de projetos e a página dele deixa de abrir no site.
2. **Dado** um projeto editado, **quando** o autor salva, **então** em até 1 minuto o site mostra o
   texto, as imagens e a ordem novos, em português e em inglês.
3. **Dado** o site publicado no ambiente de produção, **quando** essas mudanças são feitas, **então**
   o comportamento é o mesmo do ambiente de desenvolvimento.

---

### História 5: Usar o admin no site publicado (Prioridade: P5)

Com as histórias anteriores prontas, o endereço do admin no site publicado deixa de ser escondido e
o autor passa a usá-lo de qualquer aparelho, com a mesma entrada segura.

**Por que esta prioridade**: é o último passo; só pode acontecer quando a entrada segura, a gravação,
as imagens e a atualização do site estiverem funcionando.

**Teste independente**: abrir o login do admin pelo endereço do site publicado, entrar com senha e
código e fazer uma alteração que aparece no site.

**Cenários de aceite**:

1. **Dado** o site publicado, **quando** o autor abre o endereço do admin, **então** o login aparece
   e funciona com senha e código, como no desenvolvimento.
2. **Dado** o admin liberado, **quando** buscadores visitam o site, **então** as telas do admin
   continuam fora dos resultados de busca.
3. **Dado** o admin liberado, **quando** alguém sem conta de admin tenta usá-lo, **então** não
   consegue ver nem alterar nada.

---

### Casos-limite

- Relógio do celular errado gera códigos recusados: a mensagem sugere conferir a hora automática do
  aparelho.
- Muitas tentativas erradas seguidas de senha ou de código são freadas pelo serviço de autenticação;
  o admin mostra uma mensagem de "tente novamente em alguns minutos".
- Perda de todos os fatores: o autor recupera o acesso removendo o fator pelo painel do serviço de
  dados (procedimento documentado, fora das telas).
- Sessão que expira durante a edição: ao salvar, o admin avisa que é preciso entrar de novo e mantém
  o formulário preenchido até a volta, quando possível.
- Dois aparelhos editando o mesmo projeto: vale a última gravação; o admin não faz mesclagem.
- Excluir um projeto que já tinha sido excluído em outro aparelho mostra "projeto não encontrado".
- Imagens com nome repetido não sobrescrevem as de outros projetos.
- Rascunhos nunca aparecem no site público, nem pelo endereço direto.
- A central de sistemas continua com dados de exemplo e marcada como exemplo.

## Requisitos *(obrigatório)*

### Requisitos funcionais

- **RF-001**: O login do admin DEVE autenticar por e-mail e senha; o cadastro público de contas DEVE
  continuar desligado.
- **RF-002**: Só contas registradas como admin DEVEM acessar o admin; outras contas autenticadas
  DEVEM ver acesso negado e ser desconectadas.
- **RF-003**: O admin DEVE exigir um segundo fator por aplicativo autenticador (código de 6 dígitos
  que muda com o tempo) em todo acesso.
- **RF-004**: No primeiro acesso sem fator, o admin DEVE guiar o cadastro com QR code e código
  manual, e só liberar as telas depois de confirmar um código válido.
- **RF-005**: O admin DEVE permitir cadastrar um segundo fator e DEVE lembrar o autor de fazê-lo
  enquanto houver apenas um.
- **RF-006**: Mensagens de erro de login NÃO DEVEM revelar se o e-mail existe nem qual dado está
  errado.
- **RF-007**: Nenhuma tela do admin DEVE abrir sem sessão válida com o segundo fator concluído;
  acessos diretos DEVEM levar ao login e voltar à tela pedida depois.
- **RF-008**: O admin DEVE ter um botão Sair, disponível em todas as telas, que encerra a sessão.
- **RF-009**: Toda gravação de projetos e imagens DEVE ser recusada pelos dados, não só pela tela,
  quando a sessão não for de admin com o segundo fator concluído.
- **RF-010**: O admin DEVE listar, abrir, criar, editar, excluir, publicar, despublicar, destacar e
  reordenar projetos com gravação permanente, mantendo as regras já definidas na entrega 001
  (endereço curto único, limites de texto, até 15 itens de stack, até 12 imagens de galeria, ordem
  sem repetição).
- **RF-011**: A troca da implementação local pela real NÃO DEVE exigir mudança nos componentes das
  telas da entrega 001.
- **RF-012**: Capa e galeria DEVEM ser enviadas de verdade ao armazenamento de imagens, aceitando só
  imagens de até 5 MB.
- **RF-013**: Um salvamento com envio de imagem que falhe NÃO DEVE deixar o projeto gravado pela
  metade nem perder o que foi digitado.
- **RF-014**: Imagens que deixam de ser usadas (capa trocada, imagem removida, projeto excluído)
  DEVEM ser apagadas do armazenamento; imagens anteriores a esta entrega NÃO DEVEM ser apagadas.
- **RF-015**: Depois de qualquer gravação, o site público DEVE mostrar o resultado em até 1 minuto,
  em português e em inglês, também no ambiente de produção.
- **RF-016**: Rascunhos NÃO DEVEM aparecer no site público em nenhuma página nem por endereço direto.
- **RF-017**: Falhas de conexão ou do servidor DEVEM mostrar uma mensagem clara e permitir tentar de
  novo sem perder dados digitados.
- **RF-018**: O aviso de "dados de exemplo" DEVE sair das telas de projetos e continuar apenas na
  central de sistemas, que segue com dados de exemplo.
- **RF-019**: O admin no site publicado DEVE ser liberado só depois de RF-001 a RF-017 estarem
  funcionando, e DEVE continuar fora dos resultados de busca.
- **RF-020**: O procedimento para recuperar o acesso em caso de perda de todos os fatores DEVE estar
  documentado para o autor.

### Entidades principais

- **Admin**: a conta do autor, com e-mail, senha e o registro de que é admin. É a única que acessa
  o admin.
- **Fator de autenticação**: aplicativo autenticador ligado à conta do admin, com nome amigável
  (ex.: "celular"); pode haver mais de um.
- **Sessão**: o acesso aberto depois do login, com a indicação de se o segundo fator foi concluído.
- **Projeto**: o mesmo item do portfólio da entrega 001, agora gravado de forma permanente.
- **Imagem do projeto**: arquivo de capa ou galeria guardado no armazenamento de imagens, ligado a
  um projeto e apagado quando deixa de ser usado.

## Critérios de sucesso *(obrigatório)*

### Resultados mensuráveis

- **CS-001**: O autor entra no admin (senha e código) em menos de 30 segundos nos acessos seguintes
  ao primeiro, e cadastra o fator no primeiro acesso em menos de 3 minutos.
- **CS-002**: 100% das tentativas de abrir telas do admin sem sessão completa (senha e código) são
  levadas ao login.
- **CS-003**: 100% das tentativas de gravar sem sessão de admin com segundo fator são recusadas,
  inclusive fora das telas.
- **CS-004**: Depois de salvar, publicar, despublicar, destacar, reordenar ou excluir, o site público
  mostra a mudança em até 1 minuto em 100% dos casos testados.
- **CS-005**: Um projeto completo com capa e galeria é cadastrado e aparece no site em menos de 5
  minutos.
- **CS-006**: Depois de trocar e remover imagens e excluir um projeto, não sobra nenhuma imagem sem
  uso no armazenamento criada por esta entrega.
- **CS-007**: As telas da entrega 001 continuam iguais em layout e comportamento; nenhuma regressão
  no roteiro de validação da 001.

## Premissas

- O autor é o único admin; a conta dele já existe e já está registrada como admin (feito em
  2026-11-11).
- O segundo fator é por aplicativo autenticador (padrão de códigos de 6 dígitos que mudam a cada 30
  segundos); SMS, chaves físicas e passkeys ficam fora desta entrega.
- Recuperação de senha por e-mail e login social ficam fora desta entrega; se o autor esquecer a
  senha, troca pelo painel do serviço de dados.
- A sessão segue o padrão do serviço de autenticação (renovada enquanto o admin é usado); cada novo
  login pede senha e código.
- As imagens atuais do site continuam onde estão; só as enviadas a partir desta entrega vão para o
  armazenamento de imagens e são gerenciadas por ele.
- O layout das telas não muda nesta entrega (revisão da 001); só entram os elementos necessários
  para a entrada segura (etapa do código, cadastro do fator, botão Sair, lembrete do segundo fator).
- A central de sistemas continua com dados de exemplo; o painel real é outra especificação.
- O site público continua lendo só projetos publicados.
