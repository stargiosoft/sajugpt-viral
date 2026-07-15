import { PLACEHOLDER_BORDER, PLACEHOLDER_BG, PLACEHOLDER_TEXT_MUTED, PLACEHOLDER_TEXT_FAINT, PLACEHOLDER_ICON_OPACITY } from '@/constants/theme';

// 홈에서 숨긴 테스트 자리를 채우는 범용 "준비 중" 카드 — 실제 제목/썸네일을 노출하지 않고
// 자리만 차지해 그리드가 허전해 보이지 않게 한다. 클릭 불가, 데이터 없음.
export default function PlaceholderTestCard() {
  return (
    <div className="w-full" style={{ cursor: 'default' }}>
      <div
        className="relative w-full aspect-[4/3] flex flex-col items-center justify-center"
        style={{
          borderRadius: '16px',
          border: `1.5px solid ${PLACEHOLDER_BORDER}`,
          backgroundColor: PLACEHOLDER_BG,
          gap: '4px',
        }}
      >
        <img src="/home/fire-gray.svg" alt="" style={{ width: '24px', height: '24px', opacity: PLACEHOLDER_ICON_OPACITY }} />
        <span style={{ fontSize: '12px', fontWeight: 500, color: PLACEHOLDER_TEXT_MUTED }}>준비 중</span>
      </div>
      <div style={{ padding: '10px 2px 0' }}>
        <p style={{ fontSize: '13px', fontWeight: 700, color: PLACEHOLDER_TEXT_FAINT, letterSpacing: '-0.3px', lineHeight: '1.3', marginBottom: '-1px' }}>
          다음 테스트
        </p>
        <span style={{ fontSize: '11px', fontWeight: 500, color: PLACEHOLDER_TEXT_FAINT, letterSpacing: '-0.2px' }}>준비 중</span>
      </div>
    </div>
  );
}
