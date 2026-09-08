'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { SkillAnalysisResult } from '@/types/shinsal-series/skill-item';
import { SKILL_ITEM_COLORS as C } from '@/constants/shinsalItemTheme';
import TestTopNav from '@/components/TestTopNav';
import SkillResultCard from './SkillResultCard';

interface Props {
  resultId: string;
}

export default function SkillResultContainer({ resultId }: Props) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const [result, setResult] = useState<SkillAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingImage, setSavingImage] = useState(false);

  useEffect(() => {
    if (!resultId) {
      setLoading(false);
      return;
    }

    try {
      const savedData = localStorage.getItem(`result_${resultId}`);

      if (savedData) {
        setResult(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('결과 데이터를 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  }, [resultId]);

  // 1. 다시하기 핸들러
  const handleRestart = () => {
    router.push('/shinsal-series/skill-item');
  };

  // 2. 이미지 저장 핸들러
  const handleSaveImage = async () => {
    if (!cardRef.current || savingImage) return;

    try {
      setSavingImage(true);

      const { toPng } = await import('html-to-image');

      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: C.cardBg || '#FFFFFF',
        fetchRequestInit: {
          mode: 'cors',
        },
      });

      // 다운로드 링크 생성 및 트리거
      const link = document.createElement('a');
      link.download = `shinsal-result-${resultId || 'skill'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('이미지 저장에 실패했습니다:', error);
      alert('이미지 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setSavingImage(false);
    }
  };

  // 3. 공유 핸들러
  const handleShare = async () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '나의 12신살 결과',
          text: '사주로 알아보는 나의 12신살을 확인해보세요!',
          url: shareUrl,
        });
      } catch {
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('결과 링크가 클립보드에 복사되었습니다!');
    } catch (error) {
      console.error('공유 링크 복사 실패:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-dvh bg-[#0B0710] flex items-center justify-center">
        <p className="text-sm text-gray-400">
          결과를 불러오는 중...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="w-full min-h-dvh bg-[#0B0710] flex flex-col items-center justify-center px-6">
        <p className="text-sm text-gray-400 text-center">
          결과를 불러오지 못했습니다.
        </p>

        <button
          type="button"
          onClick={handleRestart}
          className="mt-5 px-5 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-bold"
        >
          다시 분석하기
        </button>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-dvh"
      style={{
        backgroundColor: '#F6F1FA',
        fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
      }}
    >
      <header className="sticky top-0 z-50 w-full">
        <div className="w-full max-w-110 mx-auto">
          <TestTopNav
            bgColor="#FFFFFF"
            logoColor="#000000"
            xColor="#000000"
          />
        </div>
      </header>

      <main className="w-full max-w-110 mx-auto">
        <SkillResultCard
          ref={cardRef}
          result={result}
          onShare={handleShare}
          onRestart={handleRestart}
          onSaveImage={handleSaveImage}
          savingImage={savingImage}
        />
      </main>
    </div>
  );
}