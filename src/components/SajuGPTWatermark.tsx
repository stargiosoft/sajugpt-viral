import type { CSSProperties } from 'react';
import { trackSajuGPTClick, type FeatureType } from '@/lib/analytics';

interface Props {
  featureType: FeatureType;
  resultId?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: number;
  marginTop?: string;
  letterSpacing?: string;
  textUnderlineOffset?: string;
  textAlign?: CSSProperties['textAlign'];
}

// 결과 카드 하단 사주GPT 워터마크 링크 — 색상/여백만 카드별로 다르다.
export default function SajuGPTWatermark({
  featureType,
  resultId,
  color = '#7A38D8',
  fontSize = '13px',
  fontWeight = 700,
  marginTop,
  letterSpacing,
  textUnderlineOffset = '3px',
  textAlign = 'center',
}: Props) {
  return (
    <a
      href="https://www.sajugpt.co.kr/"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackSajuGPTClick(featureType, resultId)}
      style={{
        display: 'block',
        fontSize,
        fontWeight,
        color,
        textAlign,
        marginTop,
        letterSpacing,
        textDecoration: 'underline',
        textUnderlineOffset,
      }}
    >
      sajugpt.co.kr
    </a>
  );
}
