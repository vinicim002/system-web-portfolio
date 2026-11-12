# Pesquisa: Telas da área admin

Decisões da Fase 0. Nenhuma pendência de esclarecimento ficou aberta.

## 1. Onde o admin mora nas rotas

- **Decisão**: `src/app/admin/layout.tsx` como **segundo layout raiz** (o outro é
  `src/app/[locale]/layout.tsx`; não existe `src/app/layout.tsx`). Dentro dele, dois grupos de rota:
  `(auth)` para o login, sem moldura, e `(painel)` com a moldura do admin (menu, barra superior e
  aviso de dados de exemplo).
- **Motivo**: o admin não tem idioma na rota (spec, Premissas) e precisa de `<html>`/`<body>`
  próprios. Com um layout raiz separado, o site público não carrega nada do admin. A doc do
  Next 16.4.6 confirma o suporte a vários layouts raiz; navegar entre eles recarrega a página
  inteira, o que é aceitável porque o autor entra no admin de propósito.
- **Alternativas**: colocar o admin dentro de `[locale]` (descartado: obrigaria `/pt/admin` e
  misturaria o bundle do admin com o site público); criar um `app/layout.tsx` comum (descartado:
  exigiria refazer o layout atual do site, que lê o idioma da rota).

## 2. Proxy, idioma e indexação

- **Decisão**: manter o `matcher` atual de `src/proxy.ts`, que já ignora `/admin`. Nenhuma proteção
  de rota nesta entrega. O layout do admin exporta `robots: { index: false, follow: false }`.
- **Motivo**: o princípio VII proíbe autenticação real e bloqueio de rotas antes da revisão das
  telas (RF-002). O `noindex` cumpre o RF-025.
- **Alternativas**: bloquear `/admin` no proxy com uma senha fixa (descartado: seria autenticação
  falsa e contraria o princípio VII).

## 3. Textos da interface

- **Decisão**: os textos do admin ficam no namespace `admin` de `messages/pt.json`. O layout do
  admin passa ao `NextIntlClientProvider` o idioma fixo `pt` e só as mensagens desse namespace.
  `messages/en.json` não recebe o namespace, porque o admin é só em português.
- **Motivo**: o princípio I proíbe texto de interface direto nos componentes, mesmo sem tradução.
  Sem idioma na rota, o `getRequestConfig` atual já cai no idioma padrão (`pt`). Passar só o
  namespace `admin` evita mandar ao navegador os textos do site público.
- **Alternativas**: um arquivo separado `messages/admin.pt.json` (descartado: perde os tipos das
  chaves, que hoje vêm de `messages/pt.json` em `src/types/next-intl.d.ts`).

## 4. Camada de dados com implementação local

- **Decisão**: contratos em `src/lib/api/admin/` (`AdminProjectsService` e `AdminSystemsService`),
  com implementação local em memória. O estado de projetos começa como cópia profunda
  (`structuredClone`) de `mockProjects` (`src/lib/api/projects.mock.ts`). As funções são
  assíncronas e simulam uma pequena espera (~150 ms) para as telas já tratarem carregamento.
- **Motivo**: os princípios III e VII exigem que as telas só conheçam o contrato, para que a troca
  pelo Supabase não mude os componentes (RF-021). O estado vive no módulo do navegador: sobrevive à
  navegação dentro do admin e volta ao inicial ao recarregar, como pede o RF-022.
- **Alternativas**: `localStorage` (descartado: a spec pede que nada persista); reaproveitar as
  funções públicas de `src/lib/api/projects.ts` (descartado: elas usam `"use cache"`, rodam no
  servidor e só leem publicados).

## 5. Estado das telas

- **Decisão**: instalar `@tanstack/react-query` e criar hooks em `src/hooks/admin/`
  (`useAdminProjects`, `useAdminProject`, `useSaveProject`, `useDeleteProject`, `useReorderFeatured`,
  `useAdminSystems`). Cada mudança invalida a lista de projetos.
- **Motivo**: o TanStack Query já é a escolha da constituição para o admin. Com ele, a lista, o
  Início e o formulário se atualizam sozinhos depois de cada mudança (CS-004), e os mesmos hooks
  continuam valendo quando a implementação local virar Supabase.
- **Alternativas**: `useState` e um contexto próprio (descartado: teria que ser reescrito na
  integração real).

## 6. Formulário e validação

- **Decisão**: React Hook Form + Zod, com o esquema em `src/lib/validations/project.ts`. Regras:
  endereço curto `^[a-z0-9]+(-[a-z0-9]+)*$` (mesma regra do banco) e único (consulta ao serviço);
  títulos pt/en obrigatórios; links opcionais, mas válidos quando preenchidos; ordem inteira ≥ 0.
  O endereço curto é sugerido por `slugify` (`src/lib/slugify.ts`), que remove acentos.
- **Motivo**: cumpre os RF-011 a RF-014 com as mesmas regras que a tabela `projects` aplica,
  evitando surpresa na integração. As mensagens de erro são chaves de tradução, como já é feito
  no formulário de contato.
- **Alternativas**: validar só no envio (descartado: o RF-012 pede o motivo junto de cada campo).

## 7. Imagens de capa e galeria

- **Decisão**: `input type="file"` com `accept="image/*"`, recusando o que não é imagem ou passa de
  5 MB. A pré-visualização usa `URL.createObjectURL`, e as URLs são liberadas ao remover a imagem
  ou sair da tela. A galeria é reordenada com botões de subir e descer, acessíveis por teclado.
- **Motivo**: cumpre o RF-015 sem enviar nada, com o mesmo limite do bucket `project-images`.
- **Alternativas**: biblioteca de arrastar (`@dnd-kit`) (descartado nesta entrega: dependência a
  mais antes de saber se reordenar fica; botões já atendem o "ou" da história 5).

## 8. Pré-visualização do markdown

- **Decisão**: reaproveitar `ProjectContent` (`src/components/sections/project/ProjectContent.tsx`)
  numa aba "Pré-visualização" ao lado do campo de conteúdo.
- **Motivo**: o RF-016 pede a mesma formatação do site público; usar o mesmo componente garante
  isso. Ele não tem nada de servidor e funciona no navegador.

## 9. Alterações não salvas

- **Decisão**: `useUnsavedChanges(isDirty)` em `src/hooks/admin/`: liga o aviso `beforeunload` do
  navegador e intercepta os cliques nos links do menu e do "voltar" do admin, pedindo confirmação num
  diálogo.
- **Motivo**: o App Router não tem eventos de saída de rota; interceptar os links do próprio admin
  cobre o RF-017 sem truques no roteador.
- **Alternativas**: bloquear a navegação no roteador (descartado: não há API estável para isso no
  App Router).

## 10. Páginas com parâmetro e `cacheComponents`

- **Decisão**: `projetos/[id]` e `sistemas/[slug]` são Server Components mínimos que renderizam um
  Client Component dentro de `<Suspense>`. O Client Component lê o parâmetro com `useParams` e busca
  o item no serviço local; se não existir, mostra o estado "não encontrado" (RF-024).
- **Motivo**: os dados estão no navegador, então não há o que pré-renderizar por parâmetro. Ler o
  parâmetro dentro de `<Suspense>` segue a recomendação do Next para `cacheComponents` +
  `partialPrefetching` (mesma decisão já usada no case de projeto).

## 11. Não encontrado dentro do admin

- **Decisão**: rota `src/app/admin/[...missing]/page.tsx` que chama `notFound()`, e
  `src/app/admin/not-found.tsx` com a mensagem e o atalho para o Início.
- **Motivo**: com vários layouts raiz não existe um 404 único; a rota que captura o resto mantém o
  404 dentro do layout do admin, com tema e fontes certos, sem o recurso experimental
  `global-not-found`.

## 12. Componentes de interface

- **Decisão**: adicionar pelo shadcn os componentes que faltam: `alert-dialog`, `dialog`, `select`,
  `switch`, `checkbox`, `tabs`, `badge`, `sheet` (menu no celular), `dropdown-menu`, `separator`,
  `tooltip`, `table` e `sonner` (confirmações breves, RF-020). Ícones do `lucide-react`.
- **Motivo**: componentes acessíveis prontos, já no padrão do projeto. O `sonner` é a única
  dependência nova de interface.

## 13. Visual do admin

- **Decisão**: mesmos tokens, fonte Geist e `next-themes` do site, reaproveitando `Providers`.
  Moldura com menu lateral no computador e `sheet` no celular; lista de projetos em tabela no
  computador e cartões no celular (RF-023). Sem efeitos WebGL no admin.
- **Motivo**: princípio V e RF-004. O admin é ferramenta de trabalho: efeitos pesados não ajudam e
  gastariam contextos WebGL.

## 14. Testes

- **Decisão**: adicionar **Vitest** só para a lógica pura: serviço local de projetos (criar,
  editar, excluir, publicar, destacar, reordenar, slug único) e o esquema de validação. As telas são
  conferidas pelos cenários de aceite, pelo `quickstart.md` e por prints nos dois temas e no celular.
- **Motivo**: a constituição pede typecheck, lint, build e conferência visual; os testes da lógica
  garantem que a troca pelo Supabase possa ser comparada com o comportamento atual.
- **Alternativas**: testes de interface com Playwright no projeto (descartado nesta entrega:
  custo alto para telas que ainda vão mudar depois da revisão).
