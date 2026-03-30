import { toPng } from 'html-to-image';

export async function captureCardImage(element: HTMLElement): Promise<Blob> {
  const dataUrl = await toPng(element, {
    quality: 0.95,
    pixelRatio: 2,
    cacheBust: true,
  });

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

export async function shareNative(element: HTMLElement, headcount: number): Promise<boolean> {
  if (!navigator.share) return false;

  try {
    const blob = await captureCardImage(element);
    const file = new File([blob], '색기배틀_결과.png', { type: 'image/png' });

    await navigator.share({
      title: `색기 배틀 — 나한테 꼬인 남자 ${headcount}명 🔥`,
      text: `넌 몇 명이나 꼬이나 해봐 ㅋㅋ`,
      files: [file],
    });
    return true;
  } catch {
    return false;
  }
}
