import { PLACEHOLDER_BORDER, PLACEHOLDER_BG, PLACEHOLDER_TEXT_MUTED, PLACEHOLDER_TEXT_FAINT, PLACEHOLDER_ICON_OPACITY } from '@/constants/theme';

interface Props {
  rank: number;
}

// 실시간 인기 순위 리스트에서 아직 노출하지 않는 테스트 자리를 채우는 "준비 중" 행
export default function PlaceholderRankingRow({ rank }: Props) {
  return (
    <div className="flex items-center w-full" style={{ gap: '10px', cursor: 'default' }}>
      <span
        className="relative flex shrink-0 items-center justify-center overflow-hidden aspect-[4/3]"
        style={{ width: '60px', borderRadius: '9px', border: `1.5px solid ${PLACEHOLDER_BORDER}`, backgroundColor: PLACEHOLDER_BG }}
      >
        <img src="/home/fire-gray.svg" alt="" style={{ width: '16px', height: '16px', opacity: PLACEHOLDER_ICON_OPACITY }} />
        <span
          className="absolute flex items-center justify-center"
          style={{
            top: 0,
            left: 0,
            minWidth: '15px',
            height: '15px',
            padding: '1px 4px',
            borderTopLeftRadius: '7.5px',
            borderBottomRightRadius: '6px',
            backgroundColor: 'rgba(161,161,170,0.72)',
            fontSize: '9px',
            fontWeight: 700,
            color: '#ffffff',
          }}
        >
          {rank}
        </span>
      </span>
      <span className="flex-1 min-w-0" style={{ position: 'relative', top: '1.5px' }}>
        <span className="block truncate" style={{ fontSize: 'calc(var(--rp-title-size) - 0.5px)', fontWeight: 600, color: PLACEHOLDER_TEXT_FAINT, letterSpacing: '-0.2px', marginBottom: '2px' }}>
          다음 테스트
        </span>
        <span className="block truncate" style={{ fontSize: '11.5px', fontWeight: 500, color: PLACEHOLDER_TEXT_MUTED, letterSpacing: '-0.2px', paddingLeft: '1px' }}>
          준비 중
        </span>
      </span>
    </div>
  );
}
