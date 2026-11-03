-- 우리 아이 사용설명서(child-personality) 결과 저장 테이블
-- 공유 링크(/child-personality/{resultId})로 들어온 사람에게 같은 결과를 보여주기 위해 사용한다.
-- 생년월일 등 입력 정보는 저장하지 않고, 화면에 보여줄 결과만 저장한다.

create table if not exists public.child_personality_results (
  id uuid default gen_random_uuid() primary key,
  result_id text not null unique,
  result jsonb not null,
  created_at timestamptz default now() not null
);

create index if not exists idx_child_personality_results_created_at
on public.child_personality_results(created_at desc);

alter table public.child_personality_results enable row level security;

-- 결과 조회는 Edge Function(service_role)에서만 처리한다.
-- 저장도 Edge Function(service_role)에서만 처리한다.
drop policy if exists "child_personality_results_service_all"
on public.child_personality_results;

create policy "child_personality_results_service_all"
on public.child_personality_results
for all
to service_role
using (true)
with check (true);
