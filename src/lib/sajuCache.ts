import type { Gender } from '@/types/autopsy';

export interface SajuCacheData {
  birthDate: string;
  birthTime: string;
  unknownTime: boolean;
  gender: Gender;
}

const SELF_KEY = 'saju_input_self';
const TARGET_KEY = 'saju_input_target';

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

export function loadSelfSaju(): SajuCacheData | null {
  return load(SELF_KEY);
}

export function saveSelfSaju(data: SajuCacheData) {
  save(SELF_KEY, data);
}

export function removeSelfSaju() {
  remove(SELF_KEY);
}

export function loadTargetSaju(): SajuCacheData | null {
  return load(TARGET_KEY);
}

export function saveTargetSaju(data: SajuCacheData) {
  save(TARGET_KEY, data);
}
