-- Spec 002: o admin só grava (e só vê rascunhos) depois do segundo fator (TOTP).
-- O nível de garantia vem no token da sessão: auth.jwt() ->> 'aal' = 'aal2'.

-- ---------------------------------------------------------------------------
-- is_admin(): admin E sessão com segundo fator concluído.
-- Todas as policies de projects e de storage (project-images) já usam esta função.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  )
  and coalesce((select auth.jwt()) ->> 'aal', '') = 'aal2';
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- reorder_projects(ids): renumera sort_order de 0 em diante numa única transação.
-- security invoker: o update passa pelo RLS normal de projects (só admin aal2).
-- ---------------------------------------------------------------------------
create or replace function public.reorder_projects(ids uuid[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  total integer;
begin
  if not (select public.is_admin()) then
    raise exception 'apenas o admin com segundo fator pode reordenar'
      using errcode = '42501';
  end if;

  select count(*) into total from public.projects;
  if coalesce(array_length(ids, 1), 0) <> total
     or (select count(distinct id) from unnest(ids) as id) <> total
     or exists (
       select 1 from public.projects p where not (p.id = any (ids))
     ) then
    raise exception 'a nova ordem precisa conter todos os projetos, sem repetir'
      using errcode = '22023';
  end if;

  update public.projects p
  set sort_order = ordered.position - 1
  from unnest(ids) with ordinality as ordered(id, position)
  where p.id = ordered.id
    and p.sort_order is distinct from ordered.position - 1;
end;
$$;

revoke all on function public.reorder_projects(uuid[]) from public;
grant execute on function public.reorder_projects(uuid[]) to authenticated;

-- ---------------------------------------------------------------------------
-- Storage: o admin precisa de leitura para apagar e listar arquivos do bucket.
-- (a leitura pública das imagens é pela URL pública do bucket, sem RLS)
-- ---------------------------------------------------------------------------
create policy "project_images_admin_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'project-images' and (select public.is_admin()));
