'use client';

import { useState, type RefObject } from 'react';
import { toPng } from 'html-to-image';
import { trackShare } from '@/lib/analytics';
import { DEANG_COLORS as C } from '@/constants/deangTheme';

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
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: C.cardBg });
      const link = document.createElement('a');
      link.download = `댕댕사주_${breedName}.png`;
      link.href = dataUrl;
      link.click();
      trackShare('deang_saju', 'image_save', resultId);
    } catch {
    } finally {
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
