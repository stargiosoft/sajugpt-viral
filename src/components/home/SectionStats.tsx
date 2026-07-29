interface SectionStatsProps {
  plays: string;
  shares: string;
}

// 섹션 타이틀 아래 붙는 참여/공유 수치 뱃지 — 플레이 수(재생 아이콘)와 공유 수(공유 아이콘)를 구분선으로 나눠 보여준다
export default function SectionStats({ plays, shares }: SectionStatsProps) {
  return (
    <div className="flex items-center" style={{ gap: '6px', marginTop: '2px' }}>
      <span className="flex items-center" style={{ gap: '4px' }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="#b0b0b5" style={{ display: 'block' }}>
          <path d="M19.1085 11.4445C19.113 11.7893 19.0413 12.1307 18.8985 12.4445C18.7485 12.7765 18.5185 13.0645 18.2285 13.2845L8.57846 20.7945C8.23875 21.0536 7.83362 21.2128 7.40847 21.2545H7.17847C6.83085 21.2547 6.48816 21.1724 6.17847 21.0145C5.80268 20.83 5.48466 20.546 5.25899 20.1934C5.03332 19.8408 4.90862 19.4331 4.89847 19.0145V5.01454C4.89639 4.60129 5.01076 4.19581 5.22847 3.84454C5.43914 3.4933 5.74093 3.20561 6.10183 3.01195C6.46274 2.8183 6.86931 2.7259 7.27847 2.74454C7.69047 2.76454 8.09047 2.89254 8.43847 3.11454L18.0985 9.55454C18.3925 9.75854 18.6385 10.0245 18.8185 10.3345C19.0085 10.6745 19.1085 11.0555 19.1085 11.4445Z" />
        </svg>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#8a8a90', letterSpacing: '-0.1px', lineHeight: '1', display: 'block' }}>{plays}</span>
      </span>
      <span className="flex items-center" style={{ gap: '4px' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9d9da2" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
          <path d="M12 5V13.5M15 7L12 4L9 7M5 12V17C5 17.5304 5.21071 18.0391 5.58579 18.4142C5.96086 18.7893 6.46957 19 7 19H17C17.5304 19 18.0391 18.7893 18.4142 18.4142C18.7893 18.0391 19 17.5304 19 17V12" />
        </svg>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#8a8a90', letterSpacing: '-0.1px', lineHeight: '1', display: 'block' }}>{shares}</span>
      </span>
    </div>
  );
}
