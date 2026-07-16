import { ElementIcon } from './icons';

const ORDER: Array<'木' | '火' | '土' | '金' | '水'> = ['木', '火', '土', '金', '水'];

interface Props {
  imageSrc?: string;
}

// imageSrc를 넘기면 실제 썸네일 이미지로 교체되고, 없으면 오행 아이콘 배너로 대체 표시.
export default function LandingThumbnail({ imageSrc }: Props) {
  if (imageSrc) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '4 / 3',
          borderRadius: '16px',
          border: '1.5px solid #2B2013',
          overflow: 'hidden',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt="내 오행 처방전" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '16px',
        border: '1.5px solid #2B2013',
        backgroundColor: '#EFE2C1',
        padding: '22px 12px 16px',
        overflow: 'hidden',
      }}
    >
      <svg
        width="100%"
        height="2"
        viewBox="0 0 240 2"
        preserveAspectRatio="none"
        style={{ position: 'absolute', top: '48px', left: 0, opacity: 0.6 }}
      >
        <line x1="20" y1="1" x2="220" y2="1" stroke="#B99A5B" strokeWidth="1.5" strokeDasharray="3 5" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
        {ORDER.map(key => (
          <ElementIcon key={key} elementKey={key} size={46} />
        ))}
      </div>
      <p style={{ marginTop: '14px', fontSize: '12px', color: '#8A5A2B', textAlign: 'center' }}>
        목 · 화 · 토 · 금 · 수 — 나에게 필요한 기운은?
      </p>
    </div>
  );
}
