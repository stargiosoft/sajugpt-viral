'use client';

import { useState, type RefObject } from 'react';
import { saveImage } from '@/lib/share';
import { trackShare } from '@/lib/analytics';

interface Props {
  cardRef: RefObject<HTMLDivElement | null>;
  resultId: string;
  breedName: string;
}

const DEFAULT_BG = '#58B889';
const HOVER_BG = '#4ba679';

export default function DeangShareButtons({ cardRef, resultId, breedName }: Props) {
  const [saving, setSaving] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleSaveImage = async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    // 캡처 라이브러리가 인용구 뱃지의 auto-height를 텍스트가 줄바꿈되기 전 값으로
    // 얼려버려 2줄일 때 박스 밖으로 텍스트가 튀어나가는 문제가 있어(로컬에선 재현 안 되고
    // 배포 환경에서만 발생) — 캡처 직전 실제 렌더된 높이를 읽어 고정값으로 박아둔다
    const badge = cardRef.current.querySelector<HTMLElement>('.deang-quip-badge');
    const prevHeight = badge?.style.height ?? '';
    if (badge) badge.style.height = `${badge.getBoundingClientRect().height}px`;
    try {
      await saveImage(cardRef.current, `댕댕사주_${breedName}.png`);
      trackShare('deang_saju', 'image_save', resultId);
    } catch {
    } finally {
      if (badge) badge.style.height = prevHeight;
      setSaving(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSaveImage}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        height: '54px',
        borderRadius: '16px',
        backgroundColor: hovered ? HOVER_BG : DEFAULT_BG,
        color: '#FFFFFF',
        fontSize: '17px',
        fontWeight: 500,
        WebkitTextStroke: '0.3px #FFFFFF',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease-out',
      }}
    >
      {saving ? '저장 중...' : '저장하기'}
    </button>
  );
}
