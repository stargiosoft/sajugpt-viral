'use client';

import { useState, type RefObject } from 'react';
import { motion } from 'framer-motion';
import type { NightManualResult, ServantType, InterventionChoice } from '@/types/night-manual';
import {
  SERVANTS, REJECTION_LINES, ONE_LINER_MAP,
  STAT_LABELS, getCompatibility,
} from '@/constants/night-manual';
import { saveImage, copyToClipboard } from '@/lib/share';

interface Props {
  result: NightManualResult;
  selectedServant: ServantType;
  interventionChoice: InterventionChoice | null;
  cardRef: RefObject<HTMLDivElement | null>;
  onReset: () => void;
}

const SERVANT_COLORS: Record<ServantType, string> = {
  beast: '#ff6b6b',
  poet: '#6bb5ff',
  butler: '#7ce08a',
};

export default function NightResultCard({ result, selectedServant, cardRef, onReset }: Props) {
  const [copied, setCopied] = useState(false);

  const servant = SERVANTS[selectedServant];
  const compatibility = getCompatibility(result.stats, selectedServant);
  const oneLiner = ONE_LINER_MAP[result.constitution.type][selectedServant];

  const rejectedServants = (['beast', 'poet', 'butler'] as ServantType[]).filter(t => t !== selectedServant);

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/night-manual/${result.nightManualId}`;
  const shareText = `🌙 밤(夜) 설명서 — ${result.constitution.name} 체질\n총 매혹력 ${result.totalCharm}/500 | ${servant.name}(${servant.label})을 선택\n시종 3명이 쟁탈전 중ㅋㅋ 너도 해봐\n👉 ${shareUrl}`;

  const handleCopy = async () => {
    const ok = await copyToClipboard(shareText);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveImage = async () => {
    if (cardRef.current) {
      await saveImage(cardRef.current, `밤설명서_${result.constitution.name}.png`);
    }
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `밤(夜) 설명서 — ${result.constitution.name}`, text: shareText });
      } catch { /* user cancelled */ }
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: '24px 24px 40px', minHeight: '100dvh' }}
    >
      {/* 탈락 시종 반응 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ marginBottom: '24px' }}
      >
        {rejectedServants.map((type, i) => (
          <div
            key={type}
            style={{
              padding: '14px 16px',
              marginBottom: '8px',
              borderRadius: '12px',
              backgroundColor: '#1a1530',
              border: '1px solid #2a2440',
            }}
          >
            <div className="flex items-center gap-2" style={{ marginBottom: '6px' }}>
              <span style={{ fontSize: '14px' }}>{SERVANTS[type].emoji}</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: SERVANT_COLORS[type] }}>
                {SERVANTS[type].name}
              </span>
              <span style={{ fontSize: '11px', color: '#4a4460' }}>탈락</span>
            </div>
            <p style={{ fontSize: '13px', color: '#8b7aaa', lineHeight: '1.6', wordBreak: 'keep-all' }}>
              "{REJECTION_LINES[type]}"
            </p>
          </div>
        ))}
      </motion.div>

      {/* 결산 카드 (캡처 대상) */}
      <motion.div
        ref={cardRef}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          padding: '28px 24px',
          borderRadius: '20px',
          backgroundColor: '#1a1530',
          border: '1px solid #2a2440',
        }}
      >
        {/* 헤더 */}
        <div className="text-center" style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '12px', color: '#6b6080', letterSpacing: '3px' }}>밤(夜) 설명서 — 결산</p>
        </div>

        {/* 체질 + 시종 */}
        <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
          <div>
            <p style={{ fontSize: '13px', color: '#8b7aaa' }}>체질</p>
            <p style={{ fontSize: '20px', fontWeight: 800, color: '#f0e6ff' }}>{result.constitution.name}</p>
          </div>
          <span
            style={{
              fontSize: '18px', fontWeight: 800,
              color: result.constitution.grade === 'S' ? '#FFD700' : '#7A38D8',
              padding: '4px 12px', borderRadius: '8px',
              backgroundColor: 'rgba(122, 56, 216, 0.15)',
            }}
          >
            {result.constitution.grade}
          </span>
        </div>

        <div className="flex items-center gap-2" style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '14px', color: '#9990ad' }}>
            선택한 시종: <span style={{ color: SERVANT_COLORS[selectedServant], fontWeight: 700 }}>
              {servant.name} ({servant.label})
            </span>
          </p>
          <span style={{
            fontSize: '12px', fontWeight: 700,
            color: compatibility.grade === 'S' ? '#FFD700' : '#c4b5d9',
            padding: '2px 6px', borderRadius: '4px',
            backgroundColor: 'rgba(122, 56, 216, 0.1)',
          }}>
            궁합 {compatibility.grade}
          </span>
        </div>

        {/* 능력치 그리드 */}
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(122, 56, 216, 0.06)',
            border: '1px solid #2a2440',
            marginBottom: '12px',
          }}
        >
          <div className="grid grid-cols-2 gap-y-1 gap-x-4">
            {(Object.entries(result.stats) as [keyof typeof result.stats, number][]).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span style={{ fontSize: '13px', color: '#8b7aaa' }}>{STAT_LABELS[key]}</span>
                <span style={{ fontSize: '13px', color: '#f0e6ff', fontWeight: 700 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 신살 + 매혹력 */}
        <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
          <div className="flex gap-2">
            {result.doHwaSal && <span style={{ fontSize: '12px', color: '#ff6b6b' }}>🔥 도화살</span>}
            {result.hongYeomSal && <span style={{ fontSize: '12px', color: '#ff4444' }}>💀 홍염살</span>}
          </div>
          <p style={{ fontSize: '14px', color: '#f0e6ff', fontWeight: 700 }}>
            매혹력 {result.totalCharm} / 500
          </p>
        </div>

        {/* 한 줄 서사 */}
        <div
          style={{
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(122, 56, 216, 0.1)',
            border: '1px solid rgba(122, 56, 216, 0.15)',
          }}
        >
          <p style={{
            fontSize: '14px', color: '#c4b5d9', lineHeight: '1.7',
            fontWeight: 500, textAlign: 'center', wordBreak: 'keep-all',
          }}>
            "{oneLiner}"
          </p>
        </div>

        {/* 워터마크 */}
        <p className="text-center" style={{ fontSize: '11px', color: '#3d3055', marginTop: '16px' }}>
          sajugpt.co.kr
        </p>
      </motion.div>

      {/* 공유 버튼 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col gap-3"
        style={{ marginTop: '24px' }}
      >
        <button
          onClick={handleShareNative}
          style={{
            width: '100%', height: '52px', borderRadius: '14px',
            backgroundColor: '#7A38D8', border: 'none', cursor: 'pointer',
            fontSize: '16px', fontWeight: 700, color: '#fff',
            boxShadow: '0 4px 24px rgba(122, 56, 216, 0.4)',
          }}
        >
          🌙 친구의 밤도 열어주기
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1"
            style={{
              height: '48px', borderRadius: '12px',
              backgroundColor: '#1e1a2e', border: '1px solid #2a2440',
              cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#c4b5d9',
            }}
          >
            {copied ? '복사됨!' : '🔗 링크 복사'}
          </button>
          <button
            onClick={handleSaveImage}
            className="flex-1"
            style={{
              height: '48px', borderRadius: '12px',
              backgroundColor: '#1e1a2e', border: '1px solid #2a2440',
              cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#c4b5d9',
            }}
          >
            💾 이미지 저장
          </button>
        </div>

        {/* 리플레이 */}
        <button
          onClick={onReset}
          style={{
            width: '100%', height: '44px', borderRadius: '12px',
            backgroundColor: 'transparent', border: '1px solid #2a2440',
            cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#6b6080',
            marginTop: '8px',
          }}
        >
          다시 진단받기
        </button>
      </motion.div>
    </motion.div>
  );
}
