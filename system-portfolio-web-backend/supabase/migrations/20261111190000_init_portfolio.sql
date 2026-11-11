-- Estrutura inicial do portfólio (spec, seção 6) + campo status (dossiê).
-- Leitura pública só de projetos publicados; escrita só para admins.

-- ---------------------------------------------------------------------------
-- Admins: quem pode escrever (o próprio autor). Cadastro público fica desligado.
-- ---------------------------------------------------------------------------
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Cada admin consegue ver a própria linha (usado pelo front para checar acesso)
create policy "admins_read_self" on public.admins
  for select to authenticated
  using (user_id = (select auth.uid()));

-- security definer: consulta admins sem depender das policies da própria tabela
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Projetos
-- ---------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_pt text not null,
  title_en text not null,
  summary_pt text,
  summary_en text,
  content_pt text,            -- markdown
  content_en text,            -- markdown
  category text check (category in ('mobile', 'web', 'automation')),
  status text not null default 'in_progress'
    check (status in ('production', 'mvp', 'in_progress', 'proposal')),
  tech_stack text[] not null default '{}',
  cover_url text,
  gallery_urls text[] not null default '{}',
  repo_url text,
  demo_url text,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_published_order_idx on public.projects (published, sort_order);

-- Mantém updated_at em dia
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

alter table public.projects enable row level security;

create policy "projects_public_read" on public.projects
  for select to anon, authenticated
  using (published or (select public.is_admin()));

create policy "projects_admin_insert" on public.projects
  for insert to authenticated
  with check ((select public.is_admin()));

create policy "projects_admin_update" on public.projects
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "projects_admin_delete" on public.projects
  for delete to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Storage: bucket público para leitura, upload restrito ao admin
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images',
  'project-images',
  true,
  5242880, -- 5 MB
  array['image/webp', 'image/png', 'image/jpeg', 'image/avif']
)
on conflict (id) do nothing;

create policy "project_images_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'project-images' and (select public.is_admin()));

create policy "project_images_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'project-images' and (select public.is_admin()))
  with check (bucket_id = 'project-images' and (select public.is_admin()));

create policy "project_images_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'project-images' and (select public.is_admin()));
