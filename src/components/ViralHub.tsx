'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import MoaMoaHeader from './home/MoaMoaHeader';
import HeroBanner from './home/HeroBanner';
import RankingPanel from './home/RankingPanel';
import AdBannerStrip from './home/AdBannerStrip';
import EditorPickSection from './home/EditorPickSection';
import NewTestsSection from './home/NewTestsSection';
import Footer from './home/Footer';
import { TEST_CATALOG } from '@/constants/testCatalog';
import type { TestCatalogItem } from '@/types/testCatalog';

const SAJUGPT_URL = 'https://www.sajugpt.co.kr/';

// 모아모아 홈 — 오케스트레이터. 데이터/스타일 세부사항은 하위 컴포넌트가 소유하고,
// 여기서는 조립만 담당한다.
export default function ViralHub() {
  const router = useRouter();

  const handleSelectItem = useCallback((item: TestCatalogItem) => {
    if (!item.ready) return;
    router.push(item.href);
  }, [router]);

  return (
    <div className="fixed inset-0 flex justify-center" style={{ backgroundColor: '#ffffff' }}>
      <div className="w-full max-w-[768px] md:max-w-[900px] lg:max-w-[1040px] h-full flex flex-col" style={{ backgroundColor: '#ffffff' }}>
        <div className="flex-1 overflow-auto w-full">
          <MoaMoaHeader />

          <div className="pt-1 px-4 md:px-6 lg:px-8 lg:grid lg:grid-cols-[1fr_235px] lg:gap-3 lg:items-start">
            <HeroBanner />
            <div className="flex flex-col mt-4 lg:mt-0" style={{ gap: '12px' }}>
              <RankingPanel items={TEST_CATALOG} onSelect={handleSelectItem} />
              <motion.a
                href={SAJUGPT_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ opacity: 0.9 }}
                whileTap={{ scale: 0.995, backgroundColor: '#E8600A' }}
                transition={{ duration: 0.12, ease: 'easeOut' }}
                className="flex items-center justify-center shrink-0 transform-gpu"
                style={{
                  height: '48px',
                  borderRadius: '16px',
                  backgroundColor: '#FF7A1A',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
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
                  style={{ position: 'relative', top: '1px' }}
                  animate={{ x: 4 }}
                  transition={{
                    duration: 0.9,
                    ease: [0.45, 0, 0.15, 1],
                    repeat: Infinity,
                    repeatType: 'mirror',
                    repeatDelay: 0.6,
                  }}
                >
                  <path d="M16.1713 13.0008L11.2713 17.9008C11.0713 18.1008 10.9753 18.3341 10.9833 18.6008C10.9913 18.8674 11.0956 19.1008 11.2963 19.3008C11.4963 19.4841 11.7296 19.5801 11.9963 19.5888C12.2629 19.5974 12.4963 19.5014 12.6963 19.3008L19.2963 12.7008C19.3963 12.6008 19.4673 12.4924 19.5093 12.3758C19.5513 12.2591 19.5716 12.1341 19.5703 12.0008C19.5689 11.8674 19.5479 11.7424 19.5073 11.6258C19.4666 11.5091 19.3959 11.4008 19.2953 11.3008L12.6953 4.70078C12.5119 4.51745 12.2826 4.42578 12.0073 4.42578C11.7319 4.42578 11.4946 4.51745 11.2953 4.70078C11.0953 4.90078 10.9953 5.13845 10.9953 5.41378C10.9953 5.68911 11.0953 5.92645 11.2953 6.12578L16.1713 11.0008H4.99625C4.71292 11.0008 4.47525 11.0968 4.28325 11.2888C4.09125 11.4808 3.99558 11.7181 3.99625 12.0008C3.99692 12.2834 4.09292 12.5211 4.28425 12.7138C4.47558 12.9064 4.71292 13.0021 4.99625 13.0008H16.1713Z" fill="currentColor" />
                </motion.svg>
              </motion.a>
            </div>
          </div>

          <div className="pt-5 px-4 md:px-6 lg:px-8">
            <AdBannerStrip
              backgroundColor="#FFF1E6"
              title="사주GPT 프리미엄"
              subtitle="지금 가입하면 첫 상담 무료"
              imageSrc="/home/ghost.png"
            />
          </div>

          <EditorPickSection items={TEST_CATALOG} onSelect={handleSelectItem} />

          <NewTestsSection items={TEST_CATALOG} onSelect={handleSelectItem} />

          <div style={{ height: '100px' }} />

          <div className="px-4 md:px-6 lg:px-8 pb-6">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
