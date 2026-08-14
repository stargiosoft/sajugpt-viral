import * as amplitude from '@amplitude/analytics-browser';

import { supabase } from '@/lib/supabase';
import { getFingerprint } from '@/lib/fingerprint';

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

const AMPLITUDE_KEY = process.env.NEXT_PUBLIC_VIRAL_AMPLITUDE_KEY;
export const IS_PROD = process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_VERCEL_ENV !== 'preview';

let analyticsInitialized = false;
let capturedUTM: UTMParams | null = null;

export function initViralAnalytics(): void {
  if (analyticsInitialized || typeof window === 'undefined' || !IS_PROD) return;
  analyticsInitialized = true;

  capturedUTM = parseUTM();

  if (AMPLITUDE_KEY) {
    amplitude.init(AMPLITUDE_KEY, { autocapture: false });

    const identify = new amplitude.Identify();
    if (capturedUTM.utmSource) identify.set('utm_source', capturedUTM.utmSource);
    if (capturedUTM.utmMedium) identify.set('utm_medium', capturedUTM.utmMedium);
    if (capturedUTM.utmCampaign) identify.set('utm_campaign', capturedUTM.utmCampaign);
    amplitude.identify(identify);

    amplitude.track('page_view', { path: window.location.pathname, ...capturedUTM });
  }
}

function sendToThirdParty(eventName: string, properties?: Record<string, unknown>): void {
  if (!IS_PROD) return;
  const mergedProperties = { ...capturedUTM, ...properties };
  if (AMPLITUDE_KEY) {
    amplitude.track(eventName, mergedProperties);
  }
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
  | 'deang_saju'
  | 'love_chat'
  | 'mental_worldcup'
  | 'money_timeline'
  | 'oheng'
  | 'solo_guide'
  | 'couple_guide'
  | 'love_spot'
  | 'loving_season';

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

export function trackShare(featureType: FeatureType, shareMethod: ShareMethod, resultId?: string, metadata?: Record<string, unknown>): void {
  trackViralEvent({
    featureType,
    eventType: 'share_click',
    shareMethod,
    resultId,
    metadata,
  });
}

export function trackSajuGPTClick(featureType: FeatureType, resultId?: string): void {
  trackViralEvent({
    featureType,
    eventType: 'sajugpt_link_click',
    resultId,
  });
}

export function trackReferralVisit(featureType: FeatureType, referrerId: string): void {
  trackViralEvent({
    featureType,
    eventType: 'referral_visit',
    referrerId,
  });
}

export function trackLandingVisit(featureType: FeatureType): void {
  trackViralEvent({
    featureType,
    eventType: 'landing_visit',
  });
}
