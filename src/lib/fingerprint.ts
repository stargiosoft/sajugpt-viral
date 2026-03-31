/**
 * 경량 브라우저 핑거프린팅 — canvas + navigator 속성 조합
 * 외부 라이브러리 없이 동일 브라우저에서 안정적 해시 생성
 */

const STORAGE_KEY = 'vfp'; // viral fingerprint

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // 32bit integer
  }
  // 양수 hex로 변환 + 타임스탬프 없이 순수 브라우저 속성만 사용
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('fingerprint', 2, 15);
    ctx.fillStyle = 'rgba(102,204,0,0.7)';
    ctx.fillText('fingerprint', 4, 17);

    return canvas.toDataURL();
  } catch {
    return '';
  }
}

function collectSignals(): string {
  const signals = [
    navigator.userAgent,
    navigator.language,
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.hardwareConcurrency?.toString() ?? '',
    (navigator.maxTouchPoints ?? 0).toString(),
    getCanvasFingerprint(),
  ];
  return signals.join('|');
}

/**
 * 브라우저 핑거프린트 반환 (localStorage 캐싱)
 * SSR 환경에서는 빈 문자열 반환
 */
export function getFingerprint(): string {
  if (typeof window === 'undefined') return '';

  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) return cached;

  const raw = collectSignals();
  const fp = hashString(raw);

  localStorage.setItem(STORAGE_KEY, fp);
  return fp;
}
