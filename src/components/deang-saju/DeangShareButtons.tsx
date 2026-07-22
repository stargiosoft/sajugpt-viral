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
    try {
      await saveImage(cardRef.current, `댕댕사주_${breedName}.png`);
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
