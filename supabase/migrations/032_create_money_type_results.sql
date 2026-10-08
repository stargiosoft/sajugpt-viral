create table if not exists public.money_type_results (
  id uuid default gen_random_uuid() primary key,
  result_id text not null unique,
  type_code text not null,
  scores jsonb not null default '{}'::jsonb,
  gender text,
  birth_date text,
  birth_time text,
  calendar_type text,
  created_at timestamptz default now() not null
);

/* =========================================================
 * 인덱스
 * ======================================================= */

create index if not exists idx_money_type_results_result_id
on public.money_type_results(result_id);

create index if not exists idx_money_type_results_type_code
on public.money_type_results(type_code);

create index if not exists idx_money_type_results_created_at
on public.money_type_results(created_at desc);


/* =========================================================
 * RLS
 * ======================================================= */

alter table public.money_type_results enable row level security;


/* =========================================================
 * 결과 조회
 *
 * 로그인 없이 결과 URL을 공유할 수 있어야 하므로
 * result_id를 알고 있는 경우 조회 허용
 * ======================================================= */

drop policy if exists "money_type_results_public_read"
on public.money_type_results;

create policy "money_type_results_public_read"
on public.money_type_results
for select
using (true);


/* =========================================================
 * INSERT는 Edge Function의 service_role로만 처리
 *
 * 일반 anon/authenticated 사용자는 직접 결과를 생성하지 못하게 함
 * ======================================================= */

drop policy if exists "money_type_results_public_insert"
on public.money_type_results;

-- service_role만 insert를 수행할 수 있도록 정책을 설정하거나, 
-- anon/authenticated 사용자에게 직접 insert를 막으려면 아래와 같이 설정할 수 있습니다.
create policy "money_type_results_service_insert"
on public.money_type_results
for insert
to service_role
with check (true);