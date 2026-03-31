-- ============================================================
-- 007: viral_events — 바이럴 기능별 이벤트 트래킹
-- ============================================================

CREATE TABLE IF NOT EXISTS viral_events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_type  text NOT NULL,          -- sexy_battle | saju_autopsy | saju_court | gisaeng | night_manual | dating | saju_stock
  event_type    text NOT NULL,          -- share_click | sajugpt_link_click | referral_visit
  share_method  text,                   -- kakao | clipboard | native | image_save (nullable, share_click 전용)
  fingerprint   text NOT NULL,          -- 브라우저 핑거프린트 해시
  result_id     text,                   -- 해당 결과 ID (nullable)
  referrer_id   text,                   -- 레퍼럴 방문 시 공유된 결과 ID
  metadata      jsonb DEFAULT '{}'::jsonb,  -- 추가 컨텍스트 (headcount, tier 등)
  created_at    timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT check_feature_type CHECK (
    feature_type IN ('sexy_battle', 'saju_autopsy', 'saju_court', 'gisaeng', 'night_manual', 'dating', 'saju_stock')
  ),
  CONSTRAINT check_event_type CHECK (
    event_type IN ('share_click', 'sajugpt_link_click', 'referral_visit')
  )
);

-- 인덱스
CREATE INDEX idx_viral_events_feature_type ON viral_events (feature_type);
CREATE INDEX idx_viral_events_event_type ON viral_events (event_type);
CREATE INDEX idx_viral_events_created_at ON viral_events (created_at DESC);
CREATE INDEX idx_viral_events_fingerprint ON viral_events (fingerprint);

-- RLS
ALTER TABLE viral_events ENABLE ROW LEVEL SECURITY;

-- anon INSERT 허용 (프론트에서 직접 기록)
CREATE POLICY "anon_insert_viral_events"
  ON viral_events FOR INSERT
  TO anon
  WITH CHECK (true);

-- anon SELECT 차단 (집계 뷰로만 조회)
-- 관리자용 서비스 키로는 전체 조회 가능

-- ============================================================
-- 집계 뷰: 기능별 공유 클릭 / 사주GPT 링크 클릭 / 레퍼럴 유입 유저 수
-- ============================================================

CREATE OR REPLACE VIEW viral_analytics_summary AS
SELECT
  feature_type,
  COUNT(*) FILTER (WHERE event_type = 'share_click')
    AS share_clicks,
  COUNT(*) FILTER (WHERE event_type = 'sajugpt_link_click')
    AS sajugpt_link_clicks,
  COUNT(DISTINCT fingerprint) FILTER (WHERE event_type = 'referral_visit')
    AS referral_unique_users,
  -- 공유 방법별 breakdown
  COUNT(*) FILTER (WHERE event_type = 'share_click' AND share_method = 'kakao')
    AS share_kakao,
  COUNT(*) FILTER (WHERE event_type = 'share_click' AND share_method = 'clipboard')
    AS share_clipboard,
  COUNT(*) FILTER (WHERE event_type = 'share_click' AND share_method = 'native')
    AS share_native,
  COUNT(*) FILTER (WHERE event_type = 'share_click' AND share_method = 'image_save')
    AS share_image_save
FROM viral_events
GROUP BY feature_type;

-- 일별 트렌드 뷰
CREATE OR REPLACE VIEW viral_analytics_daily AS
SELECT
  feature_type,
  date_trunc('day', created_at)::date AS event_date,
  COUNT(*) FILTER (WHERE event_type = 'share_click')
    AS share_clicks,
  COUNT(*) FILTER (WHERE event_type = 'sajugpt_link_click')
    AS sajugpt_link_clicks,
  COUNT(DISTINCT fingerprint) FILTER (WHERE event_type = 'referral_visit')
    AS referral_unique_users
FROM viral_events
GROUP BY feature_type, date_trunc('day', created_at)::date
ORDER BY event_date DESC, feature_type;
