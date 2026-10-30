'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import Link from 'next/link';
import PolicyLayout, { InfoSection } from '@/components/policy/PolicyLayout';
import HwatuPick from '@/components/about/HwatuPick';
import { MOAMOA_ORANGE } from '@/constants/theme';

function Highlight({ children }: { children: ReactNode }) {
  return (
    <strong style={{ color: '#0d0d0d', fontWeight: 700 }}>
      {children}
    </strong>
  );
}

export default function AboutPage() {
  const router = useRouter();

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      router.replace('/');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  return (
    <PolicyLayout title="광필연구소 소개">
      <section>
        <div className="flex items-center" style={{ gap: 'clamp(14px, calc((100vw - 320px) * 0.4 + 14px), 30px)' }}>
          <img
            src="/about/gwangpil-character.png"
            alt="광필연구소 캐릭터 광필이"
            style={{ width: 'clamp(72px, 24vw, 96px)', height: 'auto', flexShrink: 0 }}
          />
          <div className="min-w-0" style={{ position: 'relative', top: '8px' }}>
            <p style={{ fontSize: 'clamp(14px, 4vw, 20px)', fontWeight: 800, color: '#0d0d0d', letterSpacing: '-0.4px', lineHeight: 1.4, marginBottom: '6px', whiteSpace: 'nowrap' }}>
              무거운 점 대신,<br />화투패 뒤집듯 즐거운 놀이터
            </p>
            <p style={{ fontSize: '13px', color: '#66666C', letterSpacing: '-0.1px', lineHeight: 1.6 }}>
              사주와 심리, 성향을 위트 있게 풀어내는 공간입니다.
            </p>
          </div>
        </div>
      </section>

      <HwatuPick />

      <InfoSection
        title="광필연구소는 이런 곳이에요"
        paragraphs={[
          <>
            사주와 심리, 성향을 소재로 한 <Highlight>다양한 테스트와 콘텐츠를 한곳에 모아둔 놀이터</Highlight>예요.
            진지하고 무겁게 점을 보는 대신, 화투패 한 장 뒤집어보듯 가볍게 웃고 즐길 수 있는 테스트들을 매일 연구하며 채워가고 있어요.
          </>,
          <>
            회원가입 없이 간단한 정보만 입력하면 곧바로 결과를 확인할 수 있고,
            결과는 <Highlight>예쁜 카드 이미지로 저장하거나 친구들과 자유롭게 공유</Highlight>할 수 있습니다.
          </>,
        ]}
      />

      <InfoSection
        title="왜 이름이 '광필연구소'인가요?"
        paragraphs={[
          <>
            화투에서 가장 반가운 패를 뜻하는 <Highlight>&quot;광(光)&quot;</Highlight>에, 마음을 풀어쓴다는 &quot;필(筆)&quot;과
            정성을 담겠다는 &quot;연구소&quot;를 더했습니다.
          </>,
        ]}
      />

      <InfoSection
        title="위트 있는 로고와 디자인"
        paragraphs={[
          <>
            &quot;광필연구소&quot; 글자 중 &quot;필&quot;과 &quot;구&quot;가 살짝 기울어진 것은 진지함과 유쾌함을 오가는 위트 있는 태도를 보여줍니다.
            화투패의 강렬함을 현대적으로 풀어냈어요.
          </>,
        ]}
      />

      <InfoSection
        title="브랜드 컬러"
        paragraphs={[
          <>
            광필연구소의 메인 컬러는 군더더기 없는 <Highlight>블랙</Highlight>이에요.
            알록달록한 썸네일과 결과 카드가 한층 돋보이도록, 담백하고 선명한 색으로 중심을 잡았습니다.
          </>,
        ]}
      />

      <InfoSection
        title="사주GPT와 만들어가는 재미"
        paragraphs={[
          '자체 구축한 사주 데이터와 AI 기술을 결합하여, 무겁지 않으면서도 오싹할 정도로 정확하고 흥미진진한 콘텐츠를 계속 개발해 나가고 있습니다.',
        ]}
      />

      <section>
        <Link
          href="/"
          className="flex items-center justify-center transition-opacity active:opacity-80"
          style={{
            width: '100%',
            padding: '14px 0',
            borderRadius: '12px',
            backgroundColor: MOAMOA_ORANGE,
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 700,
            letterSpacing: '-0.2px',
            textDecoration: 'none',
          }}
        >
          다른 테스트 둘러보기
        </Link>
      </section>
    </PolicyLayout>
  );
}
