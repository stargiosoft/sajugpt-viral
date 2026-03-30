'use client';

import { useRouter } from 'next/navigation';

interface ViralItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  ready: boolean;
  tag?: string;
  tagColor?: string;
}

const ITEMS: ViralItem[] = [
  {
    title: '색기 배틀',
    description: '사주로 페로몬 등급 판정, 나한테 꼬인 남자는 몇 명?',
    href: '/sexy-battle',
    ready: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E85D75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: '사주 부검실',
    description: '전남친 사주를 부검하고 사망진단서를 발급합니다',
    href: '/autopsy',
    ready: true,
    tag: 'NEW',
    tagColor: '#ef6878',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7A38D8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    title: '사주 법정',
    description: '연애 못한 이유를 검사가 기소하고 변호사가 반박합니다',
    href: '/court',
    ready: true,
    tag: 'NEW',
    tagColor: '#4488FF',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4488FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  {
    title: '주가 조작단',
    description: '저평가된 당신의 연애운, 주가 조작 작전을 세워드립니다',
    href: '/stock',
    ready: true,
    tag: 'NEW',
    tagColor: '#22C55E',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    title: '데이트 시뮬레이션',
    description: '사주 궁합 기반 AI 캐릭터와 5턴 데이트 대화',
    href: '#',
    ready: false,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: '기생 시뮬레이션',
    description: '사주 기반 기생 능력치로 선비 3명을 몰래 관리',
    href: '/gisaeng',
    ready: true,
    tag: 'NEW',
    tagColor: '#EC4899',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    title: '밤 설명서',
    description: '사주 기반 체질 평가와 시종들의 난상토론',
    href: '#',
    ready: false,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
];

export default function ViralHub() {
  const router = useRouter();

  return (
    <div className="flex justify-center" style={{ minHeight: '100dvh', backgroundColor: '#fff' }}>
      <div className="w-full" style={{ maxWidth: '440px' }}>
        {/* 헤더 */}
        <div style={{ padding: '60px 20px 0' }}>
          <h1 style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#151515',
            lineHeight: '32px',
            letterSpacing: '-0.44px',
          }}>
            사주GPT 바이럴
          </h1>
          <p style={{
            fontSize: '14px',
            fontWeight: 400,
            color: '#848484',
            lineHeight: '20px',
            letterSpacing: '-0.28px',
            marginTop: '6px',
          }}>
            사주 기반 바이럴 콘텐츠 모음
          </p>
        </div>

        {/* 리스트 */}
        <div className="flex flex-col" style={{ padding: '24px 20px 40px', gap: '12px' }}>
          {ITEMS.map((item) => (
            <div
              key={item.title}
              onClick={() => {
                if (item.ready) router.push(item.href);
              }}
              className="flex items-center gap-4 cursor-pointer transform-gpu"
              style={{
                padding: '18px 16px',
                borderRadius: '16px',
                border: '1px solid #f0f0f0',
                backgroundColor: '#fff',
                boxShadow: '4px 4px 14px rgba(0,0,0,0.04)',
                opacity: item.ready ? 1 : 0.55,
                cursor: item.ready ? 'pointer' : 'default',
                transition: 'all 0.15s ease',
              }}
              onMouseDown={(e) => {
                if (!item.ready) return;
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onTouchStart={(e) => {
                if (!item.ready) return;
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {/* 아이콘 */}
              <div className="shrink-0 flex items-center justify-center" style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: '#f9f9f9',
              }}>
                {item.icon}
              </div>

              {/* 텍스트 */}
              <div className="flex-1" style={{ minWidth: 0 }}>
                <div className="flex items-center gap-2">
                  <p style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#151515',
                    letterSpacing: '-0.32px',
                  }}>
                    {item.title}
                  </p>
                  {item.tag && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      color: item.tagColor,
                      backgroundColor: item.tagColor ? `${item.tagColor}14` : undefined,
                      padding: '2px 6px',
                      borderRadius: '6px',
                      letterSpacing: '-0.2px',
                    }}>
                      {item.tag}
                    </span>
                  )}
                  {!item.ready && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      color: '#b7b7b7',
                      backgroundColor: '#f8f8f8',
                      padding: '2px 6px',
                      borderRadius: '6px',
                    }}>
                      준비 중
                    </span>
                  )}
                </div>
                <p style={{
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#848484',
                  letterSpacing: '-0.26px',
                  marginTop: '3px',
                  lineHeight: '18px',
                }}>
                  {item.description}
                </p>
              </div>

              {/* 화살표 */}
              {item.ready && (
                <div className="shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4d4d4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
