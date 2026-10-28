-- 인생 반전 시기(life-turning-point) 결과 저장 테이블
-- 공유 링크(/life-turning-point/{resultId})로 들어온 사람에게 같은 결과를 보여주기 위해 사용한다.
-- 생년월일 등 입력 정보는 저장하지 않고, 화면에 보여줄 결과만 저장한다.

create table if not exists public.life_turning_point_results (
  id uuid default gen_random_uuid() primary key,
  result_id text not null unique,
  result jsonb not null,
  created_at timestamptz default now() not null
);

create index if not exists idx_life_turning_point_results_created_at
on public.life_turning_point_results(created_at desc);

alter table public.life_turning_point_results enable row level security;

-- 결과 조회는 Edge Function(service_role)에서만 처리한다.
-- 저장도 Edge Function(service_role)에서만 처리한다.
drop policy if exists "life_turning_point_results_service_all"
on public.life_turning_point_results;

create policy "life_turning_point_results_service_all"
on public.life_turning_point_results
for all
to service_role
using (true)
with check (true);
