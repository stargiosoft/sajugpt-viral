'use client';

interface Props {
  onBack: () => void;
}

export default function KakaoResultHeader({ onBack }: Props) {
  return (
    <div style={{ background: '#D1E0F5' }}>
      <div className="flex items-center" style={{ height: '48px', padding: '0 8px' }}>
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className="flex items-center justify-center"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
        >
          <img src="/love-chat/icons/arrow-left.svg" alt="" style={{ width: '26px', height: '26px' }} />
        </button>
        <div style={{ flex: 1 }} />
      </div>
    </div>
  );
}
