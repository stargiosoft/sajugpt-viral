import * as amplitude from '@amplitude/analytics-browser';

import { supabase } from '@/lib/supabase';
import { getFingerprint } from '@/lib/fingerprint';

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

const AMPLITUDE_KEY = process.env.NEXT_PUBLIC_VIRAL_AMPLITUDE_KEY;
// 로컬 개발 서버(localhost)에서의 테스트가 실제 운영 Amplitude/GA4 데이터에 섞이지 않도록 차단
// (layout.tsx의 GTM 스크립트 렌더링도 이 값을 그대로 가져다 씀 — 두 곳이 따로 판단하면 어긋날 수 있음)
export const IS_PROD = process.env.NODE_ENV === 'production';

let analyticsInitialized = false;
let capturedUTM: UTMParams | null = null;

/**
 * 전체 바이럴 테스트 공용 GA4 + Amplitude 초기화 (feature_type으로 테스트별 구분)
 */
export function initViralAnalytics(): void {
  if (analyticsInitialized || typeof window === 'undefined' || !IS_PROD) return;
  analyticsInitialized = true;

  capturedUTM = parseUTM();

  if (AMPLITUDE_KEY) {
    amplitude.init(AMPLITUDE_KEY, { autocapture: false });

    // autocapture를 껐기 때문에 attribution(UTM) 자동 캡처도 꺼짐 — 유입 채널(SNS)별 성과 비교를 위해 수동으로 유저 속성에 기록
    const identify = new amplitude.Identify();
    if (capturedUTM.utmSource) identify.set('utm_source', capturedUTM.utmSource);
    if (capturedUTM.utmMedium) identify.set('utm_medium', capturedUTM.utmMedium);
    if (capturedUTM.utmCampaign) identify.set('utm_campaign', capturedUTM.utmCampaign);
    amplitude.identify(identify);

    // autocapture를 껐기 때문에 공유/전환 없이 이탈하는 방문도 세션으로 잡히도록 수동 기록
    amplitude.track('page_view', { path: window.location.pathname, ...capturedUTM });
  }

  // GA4는 layout.tsx에 설치된 Google 태그 관리자(GTM-WK59VS2L)가 담당 — 직접 gtag.js를
  // 로드하는 방식은 이 계정에서 브라우저발 히트가 전송되지 않는 문제가 있어 GTM으로 전환함
}

function sendToThirdParty(eventName: string, properties?: Record<string, unknown>): void {
  if (!IS_PROD) return;
  const mergedProperties = { ...capturedUTM, ...properties };
  if (AMPLITUDE_KEY) {
    amplitude.track(eventName, mergedProperties);
  }
  // GTM의 "GA4 이벤트" 태그(트리거: 커스텀 이벤트 .*)가 이 dataLayer 이벤트를 GA4로 전달함
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...mergedProperties });
  }
}

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
  sendToThirdParty(eventName, properties);
}

// ─── 바이럴 이벤트 트래킹 (Supabase) ───

export type FeatureType =
  | 'sexy_battle'
  | 'saju_autopsy'
  | 'saju_court'
  | 'gisaeng'
  | 'night_manual'
  | 'dating'
  | 'saju_stock'
  | 'ghost_tarot'
  | 'romance_tarot'
  | 'deang_saju';

export type EventType = 'share_click' | 'sajugpt_link_click' | 'referral_visit' | 'landing_visit';

export type ShareMethod = 'kakao' | 'clipboard' | 'native' | 'image_save' | 'x' | 'facebook';

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

  sendToThirdParty(params.eventType, {
    featureType: params.featureType,
    shareMethod: params.shareMethod,
    resultId: params.resultId,
    referrerId: params.referrerId,
    ...params.metadata,
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

/**
 * 랜딩 페이지 유입 트래킹 헬퍼
 */
export function trackLandingVisit(featureType: FeatureType): void {
  trackViralEvent({
    featureType,
    eventType: 'landing_visit',
  });
}
