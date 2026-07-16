// 귀신타로 댓글: 로그인 없이 브라우저에 저장되는 익명 식별자 + 스팸/도배 방지 유틸

const CLIENT_ID_KEY = 'ghost_tarot_client_id';
const LIKED_KEY = 'ghost_tarot_liked_comments';
const DISLIKED_KEY = 'ghost_tarot_disliked_comments';

export const COMMENT_MAX_LENGTH = 100;

export function getClientId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}

function readIdSet(key: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function addToIdSet(key: string, id: string) {
  const set = readIdSet(key);
  set.add(id);
  localStorage.setItem(key, JSON.stringify(Array.from(set)));
}

function removeFromIdSet(key: string, id: string) {
  const set = readIdSet(key);
  set.delete(id);
  localStorage.setItem(key, JSON.stringify(Array.from(set)));
}

export const getLikedIds = () => readIdSet(LIKED_KEY);
export const markLiked = (id: string) => addToIdSet(LIKED_KEY, id);
export const unmarkLiked = (id: string) => removeFromIdSet(LIKED_KEY, id);
export const getDislikedIds = () => readIdSet(DISLIKED_KEY);
export const markDisliked = (id: string) => addToIdSet(DISLIKED_KEY, id);
export const unmarkDisliked = (id: string) => removeFromIdSet(DISLIKED_KEY, id);

// 최소한의 금칙어 필터 — 완전한 욕설 차단은 아니지만 노골적인 케이스는 걸러냄
const BANNED_WORDS = [
  '시발', '씨발', '씨팔', '개새끼', '병신', '지랄', '좆', '느금', '엠창', 'ㅅㅂ', 'ㅄ',
  'fuck', 'shit', 'bitch', 'asshole',
];

export function containsProfanity(text: string): boolean {
  const normalized = text.toLowerCase().replace(/\s+/g, '');
  return BANNED_WORDS.some((word) => normalized.includes(word));
}

export function isBlankOrTooLong(text: string): 'blank' | 'too_long' | null {
  if (text.trim().length === 0) return 'blank';
  if (text.length > COMMENT_MAX_LENGTH) return 'too_long';
  return null;
}

// "방금 전" / "3분 전" / "1시간 전" / "2일 전"
export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}
