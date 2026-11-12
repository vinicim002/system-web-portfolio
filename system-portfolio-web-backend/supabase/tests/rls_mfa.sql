-- Testes de RLS da spec 002: admin sem (aal1) e com (aal2) segundo fator, usuário comum e anônimo.
-- Roda numa transação desfeita no fim (rollback): não deixa nada no banco.
-- Uso (Supabase local): docker exec -i supabase_db_<projeto> psql -U postgres -f - < tests/rls_mfa.sql

\set ON_ERROR_STOP 1
begin;

-- Permite apagar de storage.objects por SQL só dentro deste teste
set local storage.allow_delete_query = 'true';

create temp table results (name text, ok boolean) on commit drop;
grant all on results to anon, authenticated;

-- Contas de teste
insert into auth.users (id, instance_id, aud, role, email)
values
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin-teste@example.com'),
  ('00000000-0000-0000-0000-0000000000b2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'comum-teste@example.com');
insert into public.admins (user_id) values ('00000000-0000-0000-0000-0000000000a1');

-- Um rascunho conhecido para os testes de leitura
insert into public.projects (id, slug, title_pt, title_en, published, sort_order)
values ('00000000-0000-0000-0000-00000000d001', 'rascunho-teste', 'Rascunho', 'Draft', false, 999);

-- Um arquivo no bucket para os testes de Storage
insert into storage.objects (bucket_id, name)
values ('project-images', 'projects/teste/arquivo.webp');

-- ---------------------------------------------------------------------------
-- Anônimo
-- ---------------------------------------------------------------------------
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
insert into results
select 'anon não vê rascunho', not exists (select 1 from public.projects where slug = 'rascunho-teste');
insert into results
select 'anon vê publicados', exists (select 1 from public.projects where published);
reset role;

-- ---------------------------------------------------------------------------
-- Admin SEM segundo fator (aal1)
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated","aal":"aal1"}';

insert into results select 'aal1: is_admin() falso', not public.is_admin();
insert into results select 'aal1: lê a própria linha em admins', exists (select 1 from public.admins);
insert into results
select 'aal1: não vê rascunho', not exists (select 1 from public.projects where slug = 'rascunho-teste');

do $$ begin
  insert into public.projects (slug, title_pt, title_en) values ('nao-pode-aal1', 'X', 'X');
  insert into results values ('aal1: insert recusado', false);
exception when insufficient_privilege then
  insert into results values ('aal1: insert recusado', true);
end $$;

with changed as (update public.projects set title_pt = 'Mudou' where published returning 1)
insert into results select 'aal1: update não altera nada', count(*) = 0 from changed;

with gone as (delete from public.projects where published returning 1)
insert into results select 'aal1: delete não apaga nada', count(*) = 0 from gone;

do $$ begin
  perform public.reorder_projects(array(select id from public.projects));
  insert into results values ('aal1: reorder recusado', false);
exception when insufficient_privilege then
  insert into results values ('aal1: reorder recusado', true);
end $$;

do $$ begin
  insert into storage.objects (bucket_id, name) values ('project-images', 'projects/teste/aal1.webp');
  insert into results values ('aal1: upload recusado', false);
exception when insufficient_privilege then
  insert into results values ('aal1: upload recusado', true);
end $$;

insert into results
select 'aal1: não lista o bucket', not exists (select 1 from storage.objects where bucket_id = 'project-images');

with gone as (delete from storage.objects where bucket_id = 'project-images' returning 1)
insert into results select 'aal1: não apaga do bucket', count(*) = 0 from gone;
reset role;

-- ---------------------------------------------------------------------------
-- Usuário comum (não admin) mesmo com aal2
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated","aal":"aal2"}';
insert into results select 'comum aal2: is_admin() falso', not public.is_admin();
insert into results select 'comum aal2: não lê admins', not exists (select 1 from public.admins);
do $$ begin
  insert into public.projects (slug, title_pt, title_en) values ('nao-pode-comum', 'X', 'X');
  insert into results values ('comum aal2: insert recusado', false);
exception when insufficient_privilege then
  insert into results values ('comum aal2: insert recusado', true);
end $$;
reset role;

-- ---------------------------------------------------------------------------
-- Admin COM segundo fator (aal2)
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated","aal":"aal2"}';

insert into results select 'aal2: is_admin() verdadeiro', public.is_admin();
insert into results
select 'aal2: vê rascunho', exists (select 1 from public.projects where slug = 'rascunho-teste');

insert into public.projects (slug, title_pt, title_en) values ('pode-aal2', 'Pode', 'Can');
insert into results select 'aal2: insert aceito', exists (select 1 from public.projects where slug = 'pode-aal2');

with changed as (update public.projects set title_pt = 'Mudou' where slug = 'pode-aal2' returning 1)
insert into results select 'aal2: update aceito', count(*) = 1 from changed;

-- Nova ordem: inverte todos e confere numeração contínua sem repetir
select public.reorder_projects(array(select id from public.projects order by sort_order desc, id));
insert into results
select 'aal2: reorder numera 0..n-1',
  (select array_agg(sort_order order by sort_order) from public.projects)
  = (select array_agg(n) from generate_series(0, (select count(*) - 1 from public.projects)::int) as n);

do $$ begin
  perform public.reorder_projects(array(select id from public.projects limit 1));
  insert into results values ('aal2: reorder incompleto recusado', false);
exception when invalid_parameter_value then
  insert into results values ('aal2: reorder incompleto recusado', true);
end $$;

insert into storage.objects (bucket_id, name) values ('project-images', 'projects/teste/aal2.webp');
insert into results
select 'aal2: upload e listagem aceitos',
  (select count(*) from storage.objects where bucket_id = 'project-images' and name like 'projects/teste/%') = 2;

with gone as (delete from storage.objects where bucket_id = 'project-images' and name like 'projects/teste/%' returning 1)
insert into results select 'aal2: delete no bucket aceito', count(*) = 2 from gone;

with gone as (delete from public.projects where slug = 'pode-aal2' returning 1)
insert into results select 'aal2: delete aceito', count(*) = 1 from gone;
reset role;

-- ---------------------------------------------------------------------------
select case when ok then 'ok     ' else 'FALHOU ' end as resultado, name as caso from results;
select count(*) filter (where ok) as passaram, count(*) filter (where not ok) as falharam from results;

rollback;
