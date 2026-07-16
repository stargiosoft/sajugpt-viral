'use client';

export default function TopNav({ onBack }: { onBack?: () => void }) {
  return (
    <div
      className="sticky top-0 z-20 flex items-center"
      style={{
        height: '52px',
        padding: '0 8px',
        backgroundColor: 'rgba(243,231,201,0.92)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        borderBottom: '1px solid #E3D3A8',
      }}
    >
      <div style={{ width: '40px' }}>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="뒤로가기"
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M15 5l-7 7 7 7" stroke="#2B2013" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      <p style={{ flex: 1, textAlign: 'center', fontSize: '14px', fontWeight: 700, color: '#2B2013' }}>
        내 오행 처방전
      </p>
      <div style={{ width: '40px' }} />
    </div>
  );
}
