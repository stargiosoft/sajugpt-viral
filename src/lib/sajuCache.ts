import type { Gender } from '@/types/autopsy';

export interface SajuCacheData {
  birthDate: string;
  birthTime: string;
  unknownTime: boolean;
  gender: Gender;
}

function load(key: string): SajuCacheData | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function save(key: string, data: SajuCacheData) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* noop */ }
}

function remove(key: string) {
  try { localStorage.removeItem(key); } catch { /* noop */ }
}

export function loadSelfSaju(feature: string): SajuCacheData | null {
  return load(`saju_input_self_${feature}`);
}

export function saveSelfSaju(feature: string, data: SajuCacheData) {
  save(`saju_input_self_${feature}`, data);
}

export function removeSelfSaju(feature: string) {
  remove(`saju_input_self_${feature}`);
}

export function loadTargetSaju(feature: string): SajuCacheData | null {
  return load(`saju_input_target_${feature}`);
}

export function saveTargetSaju(feature: string, data: SajuCacheData) {
  save(`saju_input_target_${feature}`, data);
}