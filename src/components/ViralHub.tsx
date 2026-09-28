'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import MoaMoaHeader from './home/MoaMoaHeader';
import AdBanner from './home/AdBanner';
import HeroBanner from './home/HeroBanner';
import RankingPanel from './home/RankingPanel';
import TestGridSection from './home/TestGridSection';
import Footer from './home/Footer';
import { TEST_CATALOG } from '@/constants/testCatalog';
import type { TestCatalogItem } from '@/types/testCatalog';
import { SAJUGPT_URL } from '@/constants/links';
import { MOAMOA_ORANGE, MOAMOA_ORANGE_DARK } from '@/constants/theme';
import { fetchTestStats, formatStatCount, incrementTestStat } from '@/lib/testStats';

// 모아모아 홈 — 오케스트레이터. 데이터/스타일 세부사항은 하위 컴포넌트가 소유하고,
// 여기서는 조립만 담당한다.
export default function ViralHub() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [catalog, setCatalog] = useState(TEST_CATALOG);
  const navigateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (navigateTimeoutRef.current) clearTimeout(navigateTimeoutRef.current);
  }, []);

  // 실제 플레이/공유 카운트를 붙여 홈 화면 표기 숫자를 라이브 데이터로 덮어쓴다 — 실패 시 정적 베이스라인 유지
  useEffect(() => {
    let cancelled = false;
    fetchTestStats().then((stats) => {
      if (cancelled || !stats || Object.keys(stats).length === 0) return;
      setCatalog((prev) => prev.map((item) => {
        const stat = stats[item.id];
        // stat이 없거나, 서버의 play 값이 실제로 존재하지/0보다 클 때만 덮어씀
        if (!stat || (stat.play === 0 && stat.share === 0)) return item;
        
        return {
          ...item,
          participantLabel: stat.play ? formatStatCount(stat.play) : item.participantLabel,
          shareLabel: stat.share ? formatStatCount(stat.share) : item.shareLabel,
        };
      }));
    });
    return () => { cancelled = true; };
  }, []);

  const handleSelectItem = useCallback((item: TestCatalogItem) => {
    if (!item.ready || navigateTimeoutRef.current) return;
    
    // 1. [클라이언트 측 낙관적 업데이트] 기존 값에서 안전하게 숫자를 추출해 1 증가
    setCatalog((prev) =>
      prev.map((catItem) => {
        if (catItem.id === item.id) {
          const originalLabel = catItem.participantLabel;
          let rawNum = 0;

          if (originalLabel.includes('만')) {
            const numPart = parseFloat(originalLabel.replace('만', '')) || 0;
            rawNum = Math.round(numPart * 10000) + 1;
          } else {
            const numPart = parseInt(originalLabel.replace(/,/g, ''), 10) || 0;
            rawNum = numPart + 1;
          }
          
          const newLabel = rawNum >= 10000 
            ? `${(rawNum / 10000).toFixed(1).replace(/\.0$/, '')}만` 
            : rawNum.toLocaleString('ko-KR');

          return { ...catItem, participantLabel: newLabel };
        }
        return catItem;
      })
    );

    // 2. [서버 연동] Supabase DB에 플레이 카운트 +1 증가 요청 전송
    incrementTestStat(item.id, 'play').catch((err) => {
      console.error('플레이 카운트 증가 실패:', err);
    });

    setSelectedId(item.id);
    navigateTimeoutRef.current = setTimeout(() => router.push(item.href), 180);
  }, [router]);

  return (
    <div className="fixed inset-0 flex justify-center" style={{ backgroundColor: '#ffffff' }}>
      <div className="w-full max-w-[768px] md:max-w-[900px] lg:max-w-[1040px] h-full flex flex-col" style={{ backgroundColor: '#ffffff' }}>
        <AdBanner />
        <div className="flex-1 overflow-auto w-full">
          <MoaMoaHeader />

          <div className="pt-1 px-3 md:px-6 lg:px-8 lg:grid lg:grid-cols-[1fr_235px] lg:gap-3 lg:items-start">
            <HeroBanner />
            <div className="flex flex-col mt-3 lg:mt-0" style={{ gap: '11px' }}>
              <RankingPanel items={catalog.filter((item) => item.visibleOnHome)} onSelect={handleSelectItem} selectedId={selectedId} />
              <motion.a
                href={SAJUGPT_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ opacity: 0.9 }}
                whileTap={{ scale: 0.995, backgroundColor: MOAMOA_ORANGE_DARK }}
                transition={{ duration: 0.12, ease: 'easeOut' }}
                className="flex items-center justify-center shrink-0 transform-gpu h-[52px] lg:h-[48px] text-[14px] lg:text-[13px]"
                style={{
                  borderRadius: '16px',
                  backgroundColor: MOAMOA_ORANGE,
                  color: '#ffffff',
                  fontWeight: 700,
                  letterSpacing: '0',
                  textDecoration: 'none',
                  gap: '6px',
                }}
              >
                사주GPT 바로가기
                <motion.svg
                  aria-hidden
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ position: 'relative', top: '0.5px' }}
                  animate={{ x: 4 }}
                  transition={{
                    duration: 0.9,
                    ease: [0.45, 0, 0.15, 1],
                    repeat: Infinity,
                    repeatType: 'mirror',
                    repeatDelay: 0.6,
                  }}
                >
                  <path d="M16.1713 13.0008L11.2713 17.9008C11.0713 18.1008 10.9753 18.3341 10.9833 18.6008C10.9913 18.8674 11.0956 19.1008 11.2963 19.3008C11.4963 19.4841 11.7296 19.5801 11.9963 19.5888C12.2629 19.5974 12.4963 19.5014 12.6963 19.3008L19.2963 12.7008C19.3963 12.6008 19.4673 12.4924 19.5093 12.3758C19.5513 12.2591 19.5716 12.1341 19.5703 12.0008C19.5689 11.8674 19.5479 11.7424 19.5073 11.6258C19.4666 11.5091 19.3959 11.4008 19.2953 11.3008L12.6953 4.70078C12.5119 4.51745 12.2826 4.42578 12.0073 4.42578C11.7319 4.42578 11.4946 4.51745 11.2953 4.70078C11.0953 4.90078 10.9953 5.13845 10.9953 5.41378C10.9953 5.68911 11.0953 5.92645 11.2953 6.12578L16.1713 11.0008H4.99625C4.71292 11.0008 4.47525 11.0968 4.28325 11.2888C4.09125 11.4808 3.99558 11.7181 3.99625 12.0008C3.99692 12.2834 4.09292 12.5211 4.28425 12.7138C4.47558 12.9064 4.71292 13.0021 4.99625 13.0008H16.1713Z" fill="currentColor" stroke="currentColor" strokeWidth="0.2" />
                </motion.svg>
              </motion.a>
            </div>
          </div>

          {/* 1. 에디터 추천 섹션 */}
          <TestGridSection
            title="🔥 에디터 추천 픽"
            items={catalog}
            filter={(item) => item.visibleOnHome && item.editorPick}
            paddingBottom={4}
            onSelect={handleSelectItem}
            selectedId={selectedId}
          />

          {/* 2. 설레는 연애 & 궁합 섹션 */}
          <TestGridSection
            title="💘 설레는 연애 & 궁합"
            items={catalog}
            filter={(item) => item.visibleOnHome && item.category === 'love' && !item.editorPick}
            paddingBottom={4}
            onSelect={handleSelectItem}
            selectedId={selectedId}
          />

          {/* 3. 심층 사주 & 분석 섹션 */}
          <TestGridSection
            title="✨ 심층 사주 & 운세"
            items={catalog}
            filter={(item) => item.visibleOnHome && item.category === 'analysis' && !item.editorPick}
            paddingBottom={200}
            onSelect={handleSelectItem}
            selectedId={selectedId}
          />

          <div className="px-3 md:px-6 lg:px-8 pb-6">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}