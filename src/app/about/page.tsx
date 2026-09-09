'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import Link from 'next/link';
import PolicyLayout from '@/components/policy/PolicyLayout';
import { MOAMOA_ORANGE } from '@/constants/theme';

function Highlight({ children }: { children: ReactNode }) {
  return (
    <strong style={{ color: MOAMOA_ORANGE, fontWeight: 700 }}>
      {children}
    </strong>
  );
}

export default function AboutPage() {
  const router = useRouter();

  // 화투패 뒤집기 상태 관리
  const [isFlipped, setIsFlipped] = useState(false);

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
      <style jsx global>{`
        .hwatu-flip-card {
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-style: preserve-3d;
          will-change: transform;
        }
        .hwatu-flip-card.flipped {
          transform: rotateY(180deg) scale(1.02);
        }
        .hwatu-card-side {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          transform-style: preserve-3d;
          -webkit-font-smoothing: subpixel-antialiased;
        }
      `}</style>

      <div className="flex flex-col items-center w-full max-w-xl mx-auto px-4 pt-3 pb-28">

        {/* 1. Hero Banner */}
        <div className="w-full relative overflow-hidden rounded-3xl bg-linear-to-b from-red-50 via-orange-50/40 to-white p-6 border border-red-100 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => router.replace('/')}
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs"
            >
              ← 이전으로
            </button>
            <Link
              href="/"
              className="px-4 py-1.5 rounded-full text-sm font-bold text-white shadow-sm transition-transform active:scale-95"
              style={{ backgroundColor: MOAMOA_ORANGE }}
            >
              🏠 메인 홈
            </Link>
          </div>

          <div className="text-center py-2">
            <div className="relative inline-block mb-3">
              <img
                src="/about/gwangpil-character.png"
                alt="광필연구소 캐릭터 광필이"
                className="w-36 h-auto mx-auto drop-shadow-md"
              />
              <span className="absolute -top-1 -right-3 px-2.5 py-0.5 rounded-full text-xs font-extrabold text-white bg-red-500 shadow-sm animate-pulse">
                HOT
              </span>
            </div>

            <h2 className="text-2xl font-black text-gray-900 leading-snug tracking-tight mb-2">
              무거운 점 대신, <br />
              <span style={{ color: MOAMOA_ORANGE }}>화투패 뒤집듯</span> 즐거운 놀이터
            </h2>
            <p className="text-base font-medium text-gray-600">
              사주와 심리, 성향을 위트 있게 풀어내는 공간입니다.
            </p>
          </div>
        </div>

        {/* 2. Quick Spec Badges */}
        <div className="grid grid-cols-3 gap-3 w-full mb-8">
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-2xl mb-1.5">⚡</div>
            <div className="text-sm font-bold text-gray-800">NO 회원가입</div>
            <div className="text-xs text-gray-500 mt-1">3초 빠른 시작</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-2xl mb-1.5">🎴</div>
            <div className="text-sm font-bold text-gray-800">화투패 위트</div>
            <div className="text-xs text-gray-500 mt-1">유쾌한 해석</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-2xl mb-1.5">📸</div>
            <div className="text-sm font-bold text-gray-800">결과 공유</div>
            <div className="text-xs text-gray-500 mt-1">카드 이미지 저장</div>
          </div>
        </div>

        {/* 3. Hwatu Flip Card */}
        <div className="w-full mb-8">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="group relative w-full cursor-pointer select-none perspective-distant active:scale-95 transition-transform duration-150"
          >
            <div
              className={`hwatu-flip-card relative w-full rounded-2xl border-2 border-red-200 shadow-lg bg-white ${
                isFlipped ? 'flipped' : ''
              }`}
            >
              <div className="hwatu-card-side w-full overflow-hidden rounded-2xl">
                <img
                  src="/about/brand-card.png"
                  alt="광필연구소 브랜드 이미지"
                  className="w-full h-auto block transform-gpu"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent flex items-end justify-end p-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 text-white text-sm font-black shadow-lg animate-bounce border border-red-300">
                    🎴 찰싹! 패 뒤집기
                  </span>
                </div>
              </div>

              <div className="hwatu-card-side absolute inset-0 w-full h-full overflow-hidden rounded-2xl bg-white transform-[rotateY(180deg)]">
                <img
                  src="/about/content-preview.png"
                  alt="광필연구소 다양한 테스트 결과 미리보기"
                  className="w-full h-full block object-contain rounded-2xl transform-gpu"
                />
                <div className="absolute bottom-4 right-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-900/90 backdrop-blur-md text-white text-sm font-bold shadow-md border border-gray-700">
                    🔄 패 다시 뒤집기
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-3 flex items-center justify-center gap-1.5 font-medium">
            <span>{isFlipped ? '✨ 대표 콘텐츠 미리보기' : '🎴 광필연구소 브랜드 카드'}</span>
            <span className="text-gray-400">(터치해서 화투패를 뒤집어보세요)</span>
          </p>
        </div>

        {/* 4. Service Intro */}
        <section className="w-full bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6 space-y-4 text-left">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <span>✨</span> 광필연구소는 이런 곳이에요
          </h3>
          <p className="text-base text-gray-700 leading-loose">
            광필연구소는 사주와 심리, 성향을 소재로 한 <Highlight>다양한 테스트와 콘텐츠를 한곳에 모아둔 놀이터</Highlight>예요.
            진지하고 무겁게 점을 보는 대신, 화투패 한 장 뒤집어보듯 가볍게 웃고 즐길 수 있는 테스트들을 매일 연구하며 채워가고 있어요.
          </p>
          <p className="text-base text-gray-700 leading-loose">
            회원가입 절차 없이 간단한 정보만 입력하면 곧바로 결과를 확인할 수 있고,
            결과는 <Highlight>예쁜 카드 이미지로 저장하거나 친구들과 자유롭게 공유</Highlight>할 수 있습니다.
          </p>
        </section>

        {/* 5. Grid Concept Story Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
          <div className="bg-gray-50/90 rounded-2xl p-5 border border-gray-100 text-left">
            <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded">NAME</span>
            <h4 className="text-lg font-bold text-gray-900 mt-2 mb-2">왜 이름이 '광필연구소'인가요?</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              화투에서 가장 반가운 패를 뜻하는 <Highlight>&quot;광(光)&quot;</Highlight>에, 마음을 풀어쓴다는 &quot;필(筆)&quot;과
              정성을 담겠다는 &quot;연구소&quot;를 더했습니다.
            </p>
          </div>

          <div className="bg-gray-50/90 rounded-2xl p-5 border border-gray-100 text-left">
            <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded">DESIGN</span>
            <h4 className="text-lg font-bold text-gray-900 mt-2 mb-2">위트 있는 로고와 디자인</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              &quot;광필연구소&quot; 글자 중 &quot;필&quot;과 &quot;구&quot;가 살짝 기울어진 것은 진지함과 유쾌함을 오가는 위트 있는 태도를 보여줍니다.
              화투패의 강렬함을 현대적으로 풀어냈어요.
            </p>
          </div>
        </div>

        {/* 6. AI Tech & Color Story */}
        <div className="w-full space-y-4 mb-6 text-left">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>🎨</span> 시선을 사로잡는 브랜드 컬러
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              광필연구소의 메인 컬러는 에너지 넘치는 <Highlight>레드핑크(#fc3e4d)</Highlight>예요.
              차분한 기존 사주 서비스들과 달리 화끈하고 즐거운 분위기를 전달하기 위해 선택했습니다.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>🤖</span> 사주GPT와 만들어가는 재미
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              자체 구축한 사주 데이터와 AI 기술을 결합하여, 무겁지 않으면서도 오싹할 정도로 정확하고
              흥미진진한 콘텐츠를 계속 개발해 나가고 있습니다.
            </p>
          </div>
        </div>

      </div>

      {/* 7. Floating Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 z-50 flex justify-center">
        <div className="w-full max-w-xl">
          <Link
            href="/"
            className="w-full py-3.5 rounded-2xl text-center font-bold text-white text-base shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2"
            style={{ backgroundColor: MOAMOA_ORANGE }}
          >
            <span>🎯</span> 광필연구소 다양한 테스트하러 가기
          </Link>
        </div>
      </div>
    </PolicyLayout>
  );
}