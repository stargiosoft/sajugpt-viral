'use client';

import { useRouter } from 'next/navigation';

interface ViralItem {
  title: string;
  description: string;
  href: string;
  emoji: string;
  bgColor: string;
  ready: boolean;
  tag?: string;
  tagColor?: string;
}

const ITEMS: ViralItem[] = [
  {
    title: '색기 배틀',
    description: '사주로 페로몬 등급 판정, 나한테 꼬인 남자는 몇 명?',
    href: '/sexy-battle',
    emoji: '🔥',
    bgColor: '#FFF0F3',
    ready: true,
  },
  {
    title: '사주 부검실',
    description: '전남친 사주를 부검하고 사망진단서를 발급합니다',
    href: '/autopsy',
    emoji: '🔬',
    bgColor: '#FFF5F5',
    ready: true,
  },
  {
    title: '주가 조작단',
    description: '저평가된 연애운, 주가 조작 작전을 세워드립니다',
    href: '/stock',
    emoji: '📈',
    bgColor: '#ECFDF5',
    ready: true,
  },
  {
    title: '사주 법정',
    description: '연애 못한 이유를 사주로 기소, 형량이 곧 매력',
    href: '/court',
    emoji: '⚖️',
    bgColor: '#EFF6FF',
    ready: true,
  },
  {
    title: '기생 시뮬레이션',
    description: '사주 기반 기생 능력치로 선비 3명을 몰래 관리',
    href: '/gisaeng',
    emoji: '🏮',
    bgColor: '#FDF2F8',
    ready: true,
  },
  {
    title: '밤 설명서',
    description: '사주 기반 체질 평가와 시종들의 난상토론',
    href: '/night-manual',
    emoji: '🌙',
    bgColor: '#F5F3FF',
    ready: true,
  },
  {
    title: '데이트 시뮬레이션',
    description: '사주 궁합 기반 AI 캐릭터와 5턴 데이트 대화',
    href: '/dating-sim',
    emoji: '💘',
    bgColor: '#FFFBEB',
    ready: true,
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
              {/* 이모지 아이콘 */}
              <div className="shrink-0 flex items-center justify-center" style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: item.bgColor,
              }}>
                <span style={{ fontSize: '26px', lineHeight: 1 }}>{item.emoji}</span>
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
