import { toPng } from 'html-to-image';

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

export async function captureCardImage(element: HTMLElement): Promise<Blob> {
  const rect = element.getBoundingClientRect();
  // 모바일 bleed용 음수 마진은 화면상 부모 패딩을 상쇄하기 위한 것이라 고립된 캡처에서는
  // 의미가 없고, 오히려 콘텐츠를 좌측으로 밀어 우측에 투명 여백을 남긴다 — 캡처 시엔 0으로 리셋
  const prevMarginLeft = element.style.marginLeft;
  const prevMarginRight = element.style.marginRight;
  element.style.marginLeft = '0px';
  element.style.marginRight = '0px';

  const dataUrl = await toPng(element, {
    quality: 0.95,
    pixelRatio: 2,
    cacheBust: true,
    width: rect.width,
    height: rect.height,
  });

  element.style.marginLeft = prevMarginLeft;
  element.style.marginRight = prevMarginRight;

  const response = await fetch(dataUrl);
  return response.blob();
}

export async function saveImage(element: HTMLElement, filename = '색기배틀_결과.png'): Promise<void> {
  const blob = await captureCardImage(element);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
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
