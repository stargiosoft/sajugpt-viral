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

function logImageStates(element: HTMLElement, label: string) {
  const images = Array.from(element.querySelectorAll('img'));
  if (process.env.NODE_ENV === 'development') {
    images.forEach((img) => {
      console.log(`[captureCardImage:${label}]`, {
        src: img.currentSrc || img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      });
    });
  }
  return images;
}

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

export async function captureCardImage(element: HTMLElement): Promise<Blob> {
  await document.fonts.ready;

  const rect = element.getBoundingClientRect();
  const prevMarginLeft = element.style.marginLeft;
  const prevMarginRight = element.style.marginRight;
  element.style.marginLeft = '0px';
  element.style.marginRight = '0px';

  const images = logImageStates(element, 'before');
  if (process.env.NODE_ENV === 'development') {
    console.log('[captureCardImage:size]', {
      width: rect.width,
      height: rect.height,
      scale: 2,
      devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : null,
    });
  }

  try {
    const blob = await domToBlob(element, {
      type: 'image/png',
      quality: 0.95,
      scale: 2,
      width: rect.width,
      height: rect.height,
      fetch: { bypassingCache: true },
    });
    if (process.env.NODE_ENV === 'development') {
      console.log('[captureCardImage] domToBlob resolved', { size: blob.size });
    }
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

  if (isMobileDevice() && navigator.share) {
    const file = new File([blob], filename, { type: 'image/png' });
    if (!navigator.canShare || navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
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

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || window.innerWidth < 600;
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
