const HEART_PATH =
  'M19.88,4.86a5.15,5.15,0,0,0-4-1.18A5.56,5.56,0,0,0,12.06,6L12,6.05,11.94,6A5.56,5.56,0,0,0,8.12,3.68a5.15,5.15,0,0,0-4,1.18,5.27,5.27,0,0,0-.32,7.77L11.19,20a1.16,1.16,0,0,0,1.62,0l7.39-7.4a5.27,5.27,0,0,0-.32-7.77Z';

/** GenderSelect의 icon 슬롯에 넣는 하트 아이콘 — 성별 미선택/선택 상태에 따라 색이 바뀝니다. */
export default function GenderHeartIcon({
  filled,
  unselectedColor = 'rgb(190 190 190)',
}: {
  filled: boolean;
  unselectedColor?: string;
}) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill={filled ? '#FFFFFF' : unselectedColor} d={HEART_PATH} />
    </svg>
  );
}
