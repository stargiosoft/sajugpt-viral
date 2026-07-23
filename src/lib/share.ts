import { domToBlob } from 'modern-screenshot';

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (params: Record<string, unknown>) => void;
      };
    };
  }
}

function ensureKakaoInit(): boolean {
  if (!window.Kakao) return false;
  if (!window.Kakao.isInitialized()) {
    const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!key) return false;
    window.Kakao.init(key);
  }
  return true;
}

export function shareKakao(params: {
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
  buttonText?: string;
}): boolean {
  if (!ensureKakaoInit()) return false;
  window.Kakao!.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: params.title,
      description: params.description,
      imageUrl: params.imageUrl ?? '',
      link: {
        mobileWebUrl: params.link,
        webUrl: params.link,
      },
    },
    buttons: [
      {
        title: params.buttonText ?? '나도 해보기',
        link: {
          mobileWebUrl: params.link,
          webUrl: params.link,
        },
      },
    ],
  });
  return true;
}

// 캡처 대상 안의 <img>들이 실제로 로드 완료됐는지 콘솔에 남김 — 모바일 캡처 실패 원인 추적용
function logImageStates(element: HTMLElement, label: string) {
  const images = Array.from(element.querySelectorAll('img'));
  images.forEach((img) => {
    console.log(`[captureCardImage:${label}]`, {
      src: img.currentSrc || img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
    });
  });
  return images;
}

// 실패한 이미지들의 실제 fetch 응답(상태 코드/CORS 헤더)을 다시 확인해 진짜 원인을 로그로 남김
async function logImageFetchDiagnostics(images: HTMLImageElement[]) {
  await Promise.all(
    images.map(async (img) => {
      const src = img.currentSrc || img.src;
      if (!src || src.startsWith('data:')) return;
      try {
        const res = await fetch(src, { mode: 'cors', cache: 'no-store' });
        console.error('[captureCardImage:fetchCheck]', {
          src,
          status: res.status,
          contentType: res.headers.get('content-type'),
          corsAllowOrigin: res.headers.get('access-control-allow-origin'),
        });
      } catch (fetchErr) {
        console.error('[captureCardImage:fetchCheck failed]', { src, fetchErr });
      }
    })
  );
}

// html-to-image는 Safari/WebKit에서 <img src="data:image/svg+xml">를 drawImage하기 전에
// 디코딩이 끝나지 않아 이미지 영역이 흰 채로 캡처되는 고질적 버그가 있음
// (https://bugs.webkit.org/show_bug.cgi?id=201243). modern-screenshot은 이를 fixSvgXmlDecode
// 옵션(기본 활성화)으로 Safari에서 drawImage를 여러 번 재시도해 우회하므로 라이브러리를 교체함
export async function captureCardImage(element: HTMLElement): Promise<Blob> {
  // Bookk Myungjo(@font-face)/East Sea Dokdo(Google Fonts)가 아직 파싱 중일 때 캡처하면
  // 폴백 시스템 폰트로 렌더링된 화면이 그대로 굳어버림 — 캡처 전 폰트 로딩 완료를 보장
  await document.fonts.ready;

  const rect = element.getBoundingClientRect();
  // 모바일 bleed용 음수 마진은 화면상 부모 패딩을 상쇄하기 위한 것이라 고립된 캡처에서는
  // 의미가 없고, 오히려 콘텐츠를 좌측으로 밀어 우측에 투명 여백을 남긴다 — 캡처 시엔 0으로 리셋
  const prevMarginLeft = element.style.marginLeft;
  const prevMarginRight = element.style.marginRight;
  element.style.marginLeft = '0px';
  element.style.marginRight = '0px';

  const images = logImageStates(element, 'before');
  console.log('[captureCardImage:size]', {
    width: rect.width,
    height: rect.height,
    scale: 2,
    devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : null,
  });

  try {
    const blob = await domToBlob(element, {
      type: 'image/png',
      quality: 0.95,
      scale: 2,
      width: rect.width,
      height: rect.height,
      fetch: { bypassingCache: true },
    });
    console.log('[captureCardImage] domToBlob resolved', { size: blob.size });
    return blob;
  } catch (err) {
    console.error('[captureCardImage] domToBlob failed', err);
    await logImageFetchDiagnostics(images);
    throw err;
  } finally {
    element.style.marginLeft = prevMarginLeft;
    element.style.marginRight = prevMarginRight;
  }
}

export async function saveImage(element: HTMLElement, filename = '색기배틀_결과.png', preCapturedBlob?: Blob): Promise<void> {
  const blob = preCapturedBlob ?? await captureCardImage(element);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Safari/WebKit은 다운로드를 비동기로 시작하므로 click() 직후 바로 revoke하면
  // 아직 blob을 읽기 전에 URL이 무효화돼 다운로드가 조용히 실패함 — 잠시 지연 후 해제
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function shareX(text: string, url: string): void {
  const params = new URLSearchParams({ text, url });
  window.open(`https://twitter.com/intent/tweet?${params.toString()}`, '_blank', 'noopener,noreferrer');
}

export function shareFacebook(url: string): void {
  const params = new URLSearchParams({ u: url });
  window.open(`https://www.facebook.com/sharer/sharer.php?${params.toString()}`, '_blank', 'noopener,noreferrer');
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  }
}

export function getShareText(headcount: number, battleId: string): string {
  const baseUrl = window.location.origin;
  return `🔥 색기 배틀 — 나한테 꼬인 남자 ${headcount}명\n넌 몇 명이나 꼬이나 해봐 ㅋㅋ\n👉 ${baseUrl}/sexy-battle/${battleId}`;
}

/** 모바일 여부 판별 — PC에서는 네이티브 공유 사용하지 않음 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || ('ontouchstart' in window && navigator.maxTouchPoints > 1);
}

export async function shareNative(element: HTMLElement, headcount: number, battleId?: string): Promise<boolean> {
  if (!navigator.share || !isMobileDevice()) return false;

  try {
    const blob = await captureCardImage(element);
    const file = new File([blob], '색기배틀_결과.png', { type: 'image/png' });

    const shareData: ShareData = {
      title: `색기 배틀 — 나한테 꼬인 남자 ${headcount}명 🔥`,
      text: `넌 몇 명이나 꼬이나 해봐 ㅋㅋ`,
      files: [file],
    };

    if (battleId) {
      const baseUrl = window.location.origin;
      shareData.url = `${baseUrl}/sexy-battle/${battleId}`;
    }

    await navigator.share(shareData);
    return true;
  } catch {
    return false;
  }
}
