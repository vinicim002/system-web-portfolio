-- Dados iniciais: os projetos que estavam no mock do front.
-- Gerado a partir de src/lib/api/projects.ts. Rodar de novo é seguro (upsert por slug).

insert into public.projects (slug, title_pt, title_en, summary_pt, summary_en, content_pt, content_en, category, status, tech_stack, cover_url, gallery_urls, repo_url, demo_url, featured, published, sort_order)
values (
  $md$rookhub$md$,
  $md$RookHub$md$,
  $md$RookHub$md$,
  $md$Plataforma SaaS de gestão de frotas: telemetria, mapas, manutenção e indicadores.$md$,
  $md$Fleet management SaaS: telemetry, maps, maintenance and KPIs.$md$,
  $md$O RookHub é uma plataforma SaaS de gestão de frotas desenvolvida para unificar dados operacionais, manutenção, telemetria, mapas, jornada e indicadores gerenciais. O projeto combina uma interface React/TypeScript com backend Java/Spring Boot, PostgreSQL/TimescaleDB, autenticação JWT e recursos de visualização de dados e geolocalização.

## O problema

Informações e processos de operação de frota costumam ficar espalhados entre sistemas distintos. O RookHub centraliza esses dados para apoiar gestores e operadores no dia a dia.

## Funcionalidades

- Mapa ao vivo com filtro por filial e melhoria de rotas e pontos de parada.
- Jornada de trabalho com destaque de exceções para veículos que ultrapassam limites operacionais.
- Módulos de manutenção, nota fiscal e checklist.
- Tela do operário com multas, abastecimento e clientes.
- Dashboards, gráficos, indicadores e alertas para tomada de decisão.
- Carga e atualização de dados por arquivos Excel.
- Integrações com telemetria, multas, abastecimento, câmera e nota fiscal.

## Decisões técnicas

- Segmentação por filial considerada desde o desenho da solução, para evitar retrabalho.
- TimescaleDB para séries temporais de telemetria sobre o PostgreSQL.
- Spring Security com OAuth2 Resource Server e JWT para autenticação e autorização.$md$,
  $md$RookHub is a fleet management SaaS platform built to unify operational data, maintenance, telemetry, maps, work shifts and management KPIs. It combines a React/TypeScript interface with a Java/Spring Boot backend, PostgreSQL/TimescaleDB, JWT authentication and data visualization and geolocation features.

## The problem

Fleet operation data and processes are usually scattered across different systems. RookHub centralizes them to support managers and operators day to day.

## Features

- Live map filtered by branch, with improved routes and stops.
- Work shift tracking highlighting vehicles that exceed operational limits.
- Maintenance, invoice and checklist modules.
- Operator screen with fines, fueling and customers.
- Dashboards, charts, KPIs and alerts for decision making.
- Data loading and updates through Excel files.
- Integrations with telemetry, fines, fueling, cameras and invoices.

## Technical decisions

- Branch segmentation considered from the start of the design to avoid rework.
- TimescaleDB for telemetry time series on top of PostgreSQL.
- Spring Security with OAuth2 Resource Server and JWT for authentication and authorization.$md$,
  $md$web$md$,
  $md$in_progress$md$,
  array[$md$React$md$, $md$TypeScript$md$, $md$Java$md$, $md$Spring Boot$md$, $md$PostgreSQL$md$, $md$TimescaleDB$md$]::text[],
  $md$/images/projects/rookhub/dashboard.webp$md$,
  array[$md$/images/projects/rookhub/hub-ia.webp$md$, $md$/images/projects/rookhub/assistente-voz.webp$md$, $md$/images/projects/rookhub/login.webp$md$]::text[],
  null,
  $md$https://rookhub.com.br/$md$,
  true,
  true,
  1
)
on conflict (slug) do update set
  title_pt = excluded.title_pt,
  title_en = excluded.title_en,
  summary_pt = excluded.summary_pt,
  summary_en = excluded.summary_en,
  content_pt = excluded.content_pt,
  content_en = excluded.content_en,
  category = excluded.category,
  status = excluded.status,
  tech_stack = excluded.tech_stack,
  cover_url = excluded.cover_url,
  gallery_urls = excluded.gallery_urls,
  repo_url = excluded.repo_url,
  demo_url = excluded.demo_url,
  featured = excluded.featured,
  published = excluded.published,
  sort_order = excluded.sort_order;

insert into public.projects (slug, title_pt, title_en, summary_pt, summary_en, content_pt, content_en, category, status, tech_stack, cover_url, gallery_urls, repo_url, demo_url, featured, published, sort_order)
values (
  $md$app-motorista$md$,
  $md$RookHub · App do Motorista$md$,
  $md$RookHub · Driver App$md$,
  $md$App mobile do motorista: checklist de saída, abastecimentos e histórico do veículo.$md$,
  $md$Driver mobile app: pre-trip checklist, fueling and vehicle history.$md$,
  $md$Aplicativo mobile do ecossistema RookHub usado pelos motoristas no dia a dia. Os dados registrados no app alimentam o painel de gestão da frota.

## Funcionalidades

- Acesso por CPF e senha.
- Início com o veículo vinculado ao motorista e opção de desvincular quando troca de caminhão.
- Checklist de saída do veículo antes de deixar o pátio.
- Histórico de checklists enviados, com itens não conformes e indicação quando o caminhão foi parado.
- Registro de abastecimentos, com acompanhamento da conferência da nota pela operação.$md$,
  $md$Mobile app in the RookHub ecosystem used by drivers day to day. The data recorded in the app feeds the fleet management dashboard.

## Features

- Sign in with CPF (Brazilian ID) and password.
- Home screen with the driver's assigned vehicle and an option to unassign when switching trucks.
- Pre-trip vehicle checklist before leaving the yard.
- History of submitted checklists, with non-compliant items and a flag when the truck was stopped.
- Fueling records, tracking the operation's review of each receipt.$md$,
  $md$mobile$md$,
  $md$production$md$,
  '{}'::text[],
  $md$/images/projects/app-motorista/inicio.webp$md$,
  array[$md$/images/projects/app-motorista/checklists.webp$md$, $md$/images/projects/app-motorista/abastecer.webp$md$, $md$/images/projects/app-motorista/login.webp$md$]::text[],
  null,
  null,
  true,
  true,
  2
)
on conflict (slug) do update set
  title_pt = excluded.title_pt,
  title_en = excluded.title_en,
  summary_pt = excluded.summary_pt,
  summary_en = excluded.summary_en,
  content_pt = excluded.content_pt,
  content_en = excluded.content_en,
  category = excluded.category,
  status = excluded.status,
  tech_stack = excluded.tech_stack,
  cover_url = excluded.cover_url,
  gallery_urls = excluded.gallery_urls,
  repo_url = excluded.repo_url,
  demo_url = excluded.demo_url,
  featured = excluded.featured,
  published = excluded.published,
  sort_order = excluded.sort_order;

insert into public.projects (slug, title_pt, title_en, summary_pt, summary_en, content_pt, content_en, category, status, tech_stack, cover_url, gallery_urls, repo_url, demo_url, featured, published, sort_order)
values (
  $md$rookmtr$md$,
  $md$RookMTR$md$,
  $md$RookMTR$md$,
  $md$Sistema da RookHub para MTRs: previsão, emissão em lote, cofre e portal do cliente.$md$,
  $md$RookHub system for waste manifests (MTR): forecasting, batch issuing, vault and client portal.$md$,
  $md$App do ecossistema RookHub para a gestão de MTRs (Manifestos de Transporte de Resíduos).

## Funcionalidades

- Emissão em lote: os MTRs do período saem de uma vez no portal do INEA, a partir do modelo de cada filial, com um robô no portal do órgão ambiental.
- Previsão, emissão, cofre de documentos e portal do cliente num sistema só.
- Acesso por e-mail e senha ou por link enviado por e-mail, com convite feito pelo gestor da filial.$md$,
  $md$App in the RookHub ecosystem for managing MTRs (Brazilian waste transport manifests).

## Features

- Batch issuing: all manifests for the period are issued at once on the INEA portal, based on each branch's template, using a bot on the environmental agency's portal.
- Forecasting, issuing, document vault and client portal in a single system.
- Sign in with email and password or a magic link, with invitations sent by the branch manager.$md$,
  $md$automation$md$,
  $md$production$md$,
  '{}'::text[],
  $md$/images/projects/rookmtr/login.webp$md$,
  '{}'::text[],
  null,
  $md$https://rookmtr.com.br/$md$,
  true,
  true,
  3
)
on conflict (slug) do update set
  title_pt = excluded.title_pt,
  title_en = excluded.title_en,
  summary_pt = excluded.summary_pt,
  summary_en = excluded.summary_en,
  content_pt = excluded.content_pt,
  content_en = excluded.content_en,
  category = excluded.category,
  status = excluded.status,
  tech_stack = excluded.tech_stack,
  cover_url = excluded.cover_url,
  gallery_urls = excluded.gallery_urls,
  repo_url = excluded.repo_url,
  demo_url = excluded.demo_url,
  featured = excluded.featured,
  published = excluded.published,
  sort_order = excluded.sort_order;

insert into public.projects (slug, title_pt, title_en, summary_pt, summary_en, content_pt, content_en, category, status, tech_stack, cover_url, gallery_urls, repo_url, demo_url, featured, published, sort_order)
values (
  $md$fazendo-comuns$md$,
  $md$Fazendo Comuns$md$,
  $md$Fazendo Comuns$md$,
  $md$Site do projeto de pesquisa e intervenção da UFRJ sobre o recreio nas escolas públicas.$md$,
  $md$Website for a UFRJ research and outreach project about recess in public schools.$md$,
  $md$Site do Fazendo Comuns, projeto de pesquisa e intervenção social coordenado pelo Instituto de Psicologia da UFRJ, com foco no recreio nas escolas públicas — "a educação como projeto intra e co-geracional".

## Conteúdo do site

- Apresentação do projeto, equipe, colaboradores, produções e parceiros.
- Multimídia com podcast, vídeos e fotos.
- Eventos, editoriais, notícias e livros.
- Contato com formulário e links para as redes do projeto.$md$,
  $md$Website for Fazendo Comuns, a research and social outreach project coordinated by UFRJ's Institute of Psychology, focused on recess in public schools.

## Site content

- Project overview, team, collaborators, publications and partners.
- Multimedia section with podcast, videos and photos.
- Events, editorials, news and books.
- Contact form and links to the project's social media.$md$,
  $md$web$md$,
  $md$production$md$,
  '{}'::text[],
  $md$/images/projects/fazendo-comuns/home.webp$md$,
  '{}'::text[],
  null,
  $md$https://www.fazendocomuns.com.br/$md$,
  true,
  true,
  4
)
on conflict (slug) do update set
  title_pt = excluded.title_pt,
  title_en = excluded.title_en,
  summary_pt = excluded.summary_pt,
  summary_en = excluded.summary_en,
  content_pt = excluded.content_pt,
  content_en = excluded.content_en,
  category = excluded.category,
  status = excluded.status,
  tech_stack = excluded.tech_stack,
  cover_url = excluded.cover_url,
  gallery_urls = excluded.gallery_urls,
  repo_url = excluded.repo_url,
  demo_url = excluded.demo_url,
  featured = excluded.featured,
  published = excluded.published,
  sort_order = excluded.sort_order;

insert into public.projects (slug, title_pt, title_en, summary_pt, summary_en, content_pt, content_en, category, status, tech_stack, cover_url, gallery_urls, repo_url, demo_url, featured, published, sort_order)
values (
  $md$telecarga$md$,
  $md$Telecarga Logística$md$,
  $md$Telecarga Logística$md$,
  $md$Arquitetura proposta para portal de rastreio com integração à API SSW.$md$,
  $md$Proposed architecture for a tracking portal integrated with the SSW API.$md$,
  $md$Proposta técnica e arquitetura de produto para a evolução do portal web da Telecarga Logística. Este case mostra o trabalho de transformar uma necessidade comercial em plano técnico: organizar escopo, desenhar a arquitetura e planejar a implementação.

## Escopo projetado

- Evolução do portal web com Next.js e TypeScript.
- Backend em Java e Spring Boot, com PostgreSQL.
- Spring Security com JWT, mantendo credenciais sensíveis no servidor.
- Integração com a API SSW para rastreio e dados operacionais.
- Endpoints de rastreio, coleta de eventos, agregações e auditoria.
- Histórico com filtros por período, status e destinatário.
- Suporte a múltiplos CNPJs no mesmo perfil corporativo.

## Arquitetura proposta

Cloudflare para DNS e SSL, Nginx como reverse proxy e containers Docker em VPS. O ciclo previsto inclui testes, Actuator, homologação, treinamento e entrega.$md$,
  $md$Technical proposal and product architecture for the evolution of Telecarga Logística's web portal. This case shows the work of turning a business need into a technical plan: organizing scope, designing the architecture and planning the implementation.

## Planned scope

- Web portal evolution with Next.js and TypeScript.
- Java and Spring Boot backend with PostgreSQL.
- Spring Security with JWT, keeping sensitive credentials on the server.
- Integration with the SSW API for tracking and operational data.
- Endpoints for tracking, event collection, aggregations and auditing.
- History filtered by period, status and recipient.
- Support for multiple company IDs (CNPJs) in the same corporate profile.

## Proposed architecture

Cloudflare for DNS and SSL, Nginx as reverse proxy and Docker containers on a VPS. The planned cycle includes tests, Actuator, staging, training and delivery.$md$,
  $md$web$md$,
  $md$proposal$md$,
  array[$md$Next.js$md$, $md$TypeScript$md$, $md$Java$md$, $md$Spring Boot$md$, $md$PostgreSQL$md$, $md$Docker$md$]::text[],
  null,
  '{}'::text[],
  null,
  null,
  true,
  true,
  5
)
on conflict (slug) do update set
  title_pt = excluded.title_pt,
  title_en = excluded.title_en,
  summary_pt = excluded.summary_pt,
  summary_en = excluded.summary_en,
  content_pt = excluded.content_pt,
  content_en = excluded.content_en,
  category = excluded.category,
  status = excluded.status,
  tech_stack = excluded.tech_stack,
  cover_url = excluded.cover_url,
  gallery_urls = excluded.gallery_urls,
  repo_url = excluded.repo_url,
  demo_url = excluded.demo_url,
  featured = excluded.featured,
  published = excluded.published,
  sort_order = excluded.sort_order;

