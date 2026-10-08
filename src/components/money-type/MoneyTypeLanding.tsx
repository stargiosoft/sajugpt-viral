"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import LandingCTAButton from "@/components/LandingCTAButton";
import SajuGPTLinkButton from "@/components/SajuGPTLinkButton";
import CommentBoard from "@/components/CommentBoard";
import ShareRow from "@/components/ShareRow";
import TestTopNav from "@/components/TestTopNav";
import { LANDING_GAPS } from "@/constants/layoutGaps";

interface MoneyTypeLandingProps {
  onStart: () => void;
}

export default function MoneyTypeLanding({
  onStart,
}: MoneyTypeLandingProps) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div style={{ backgroundColor: '#FFF9F2', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* 폰트 정의 */}
      <style jsx global>{`
        .font-keris {
          font-family: 'KerisKeduLine', sans-serif;
        }
      `}</style>

      {/* 0. 상단 브랜드 네비게이션 배너 */}
      <TestTopNav
        bgColor="transparent"
        logoColor="#493C35"
        xColor="#493C35"
      />

      <div className="mx-auto flex w-full max-w-130 flex-col items-center px-5 pb-12">

        {/* 메인 타이틀 및 소개 영역 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-2 text-center"
        >
          <h1 className="font-keris mt-3.5 text-[32px] font-black tracking-[-0.02em] text-[#493C35] leading-tight">
            내 안에 숨겨진 
            <span className="text-[#E98C72]"> 돈 버는 방식</span> 찾기
          </h1>
          <p className="mt-3 text-[15px] font-medium leading-[1.6] text-[#8C7D75]">
            사주 데이터로 정밀하게 분석하는<br />
            나만의 재물 성향과 부자 되는 법
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="relative my-6 w-full overflow-hidden rounded-4xl border border-[#F0E5DB] bg-white px-6 py-7 shadow-[0_12px_40px_rgba(73,60,53,0.06)] flex items-center justify-center"
        >
          {/* 빛나는 배경 효과 */}
          <div className="absolute h-44 w-44 rounded-full bg-[#FFEFEA] opacity-70 blur-3xl pointer-events-none" />

          <Image
            src="/money-type/money-title.png"
            alt="내 돈 버는 방식 테스트"
            width={500}
            height={400}
            className="h-auto w-full max-w-125 object-contain drop-shadow-sm"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="relative my-2 w-full flex items-center justify-center"
        >
          <div className="absolute h-44 w-44 rounded-full bg-[#FFEFEA] opacity-70 blur-3xl pointer-events-none" />

          <Image
            src="/money-type/money-types-grid.png"
            alt="6가지 돈 버는 방식 유형"
            width={500}
            height={600}
            className="h-auto w-full max-w-125 object-contain"
          />
        </motion.div>

        {/* 하단 CTA 및 공유/소통 영역 */}
        <div className="w-full flex flex-col items-center" style={{ padding: `${LANDING_GAPS.heroToCta}px 0 0` }}>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="w-full"
            style={{ marginBottom: LANDING_GAPS.ctaToShare }}
          >
            <LandingCTAButton
              onClick={onStart}
              label="내 돈 버는 방식 알아보기"
              background="#E98C72"
              color="#FFFFFF"
              hoverBackground="#D87B61"
              height="58px"
              borderRadius="18px"
              textStyle={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.02em' }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="w-full flex flex-col gap-3"
          >
            <ShareRow
              shareContent={{
                featureType: 'money_type',
                testId: 'money-type',
                title: '내 돈 버는 방식 테스트',
                description: '사주로 알아보는 나만의 돈 버는 방식과 재물 성향',
                shareUrl: origin ? `${origin}/money-type` : '',
                imageUrl: origin ? `${origin}/money-type/og-share.png` : '/money-type/og-share.png',
              }}
              copyColor="#E98C72"
              copyHoverColor="#D87B61"
              copyIconColor="#FFFFFF"
            />
            <SajuGPTLinkButton
              featureType="money_type"
              color="#B9AAA1"
              hoverColor="#E98C72"
              label="사주GPT 재물상담하기"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="w-full"
            style={{
              marginTop: LANDING_GAPS.shareToComment,
              marginBottom: '40px',
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              padding: '24px 18px',
              boxShadow: '0 12px 40px rgba(73,60,53,0.06)',
              border: '1px solid #F0E5DB',
            }}
          >
            <CommentBoard
              featureType="money_type"
              storageKey="money_type_liked_comments"
              placeholder="내 돈 버는 방식은 어떤가요? 한 마디 남겨보세요!"
              themeColor="#E98C72"
              inputBg="#FAF6F0"
              inputBorder="1px solid #F0E5DB"
              disabledBg="#DCE0E5"
            />
          </motion.div>
        </div>

        <p className="text-center text-xs font-medium text-[#B9AAA1]">
          생년월일만 입력하면 무료로 확인할 수 있어요. ✨
        </p>
      </div>
    </div>
  );
}