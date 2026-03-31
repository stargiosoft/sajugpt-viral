import { supabase } from '@/lib/supabase';
import { getFingerprint } from '@/lib/fingerprint';

export interface UTMParams {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  birthday: string | null;
  gender: string | null;
}

export function parseUTM(): UTMParams {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source'),
    utmMedium: params.get('utm_medium'),
    utmCampaign: params.get('utm_campaign'),
    birthday: params.get('birthday'),
    gender: params.get('gender'),
  };
}

export function trackEvent(eventName: string, properties?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}`, properties);
  }
  // 향후 GA4 / Mixpanel 연동 지점
}

// ─── 바이럴 이벤트 트래킹 (Supabase) ───

export type FeatureType =
  | 'sexy_battle'
  | 'saju_autopsy'
  | 'saju_court'
  | 'gisaeng'
  | 'night_manual'
  | 'dating'
  | 'saju_stock';

export type EventType = 'share_click' | 'sajugpt_link_click' | 'referral_visit';

export type ShareMethod = 'kakao' | 'clipboard' | 'native' | 'image_save';

interface TrackViralEventParams {
  featureType: FeatureType;
  eventType: EventType;
  shareMethod?: ShareMethod;
  resultId?: string;
  referrerId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * viral_events 테이블에 이벤트 기록 (fire-and-forget)
 * 실패해도 UX를 차단하지 않음
 */
export function trackViralEvent(params: TrackViralEventParams): void {
  const fingerprint = getFingerprint();
  if (!fingerprint) return;

  const row = {
    feature_type: params.featureType,
    event_type: params.eventType,
    share_method: params.shareMethod ?? null,
    fingerprint,
    result_id: params.resultId ?? null,
    referrer_id: params.referrerId ?? null,
    metadata: params.metadata ?? {},
  };

  // fire-and-forget — 에러 발생해도 사용자 경험 차단하지 않음
  supabase.from('viral_events').insert(row).then(({ error }) => {
    if (error && process.env.NODE_ENV === 'development') {
      console.error('[ViralEvent] insert failed:', error.message);
    }
  });
}

/**
 * 공유 클릭 트래킹 헬퍼
 */
export function trackShare(featureType: FeatureType, shareMethod: ShareMethod, resultId?: string, metadata?: Record<string, unknown>): void {
  trackViralEvent({
    featureType,
    eventType: 'share_click',
    shareMethod,
    resultId,
    metadata,
  });
}

/**
 * 사주GPT 링크 클릭 트래킹 헬퍼
 */
export function trackSajuGPTClick(featureType: FeatureType, resultId?: string): void {
  trackViralEvent({
    featureType,
    eventType: 'sajugpt_link_click',
    resultId,
  });
}

/**
 * 레퍼럴 방문 트래킹 헬퍼 (공유 링크로 진입 시)
 */
export function trackReferralVisit(featureType: FeatureType, referrerId: string): void {
  trackViralEvent({
    featureType,
    eventType: 'referral_visit',
    referrerId,
  });
}
