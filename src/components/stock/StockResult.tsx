'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { StockAnalysisResult } from '@/types/stock';
import { CREW_MEMBERS } from '@/constants/stock';
import { copyToClipboard, saveImage, captureCardImage } from '@/lib/share';
import { trackEvent } from '@/lib/analytics';

interface Props {
  result: StockAnalysisResult;
  reportCardRef: React.RefObject<HTMLDivElement | null>;
  onReset: () => void;
}

const ctaCrews = [
  {
    member: CREW_MEMBERS.kang,
    label: '강도현과 작전 실행하기',
    accentColor: '#DC2626',
    accentBg: 'rgba(220, 38, 38, 0.08)',
    accentBorder: 'rgba(220, 38, 38, 0.3)',
  },
  {
    member: CREW_MEMBERS.yoon,
    label: '윤서율과 1단계 시작하기',
    accentColor: '#2563EB',
    accentBg: 'rgba(37, 99, 235, 0.08)',
    accentBorder: 'rgba(37, 99, 235, 0.3)',
  },
  {
    member: CREW_MEMBERS.cha,
    label: '차민혁과 타이밍 잡기',
    accentColor: '#059669',
    accentBg: 'rgba(5, 150, 105, 0.08)',
    accentBorder: 'rgba(5, 150, 105, 0.3)',
  },
];

export default function StockResult({ result, reportCardRef, onReset }: Props) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const shareText = useCallback(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const price = result.stockReport.currentPrice.toLocaleString();
    return `📈 내 연애 주가: ${price}원\n주가 조작단이 분석한 내 종목 리포트\n👉 ${baseUrl}/stock/${result.id}`;
  }, [result]);

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(shareText());
    if (ok) {
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
      trackEvent('stock_share_clipboard', { stockId: result.id });
    }
  }, [shareText, result.id]);

  const handleSave = useCallback(async () => {
    if (!reportCardRef.current || saving) return;
    setSaving(true);
    try {
      await saveImage(reportCardRef.current, '사주증권_종목리포트.png');
      trackEvent('stock_share_save', { stockId: result.id });
    } catch (err) {
      console.error('이미지 저장 실패:', err);
    } finally {
      setSaving(false);
    }
  }, [reportCardRef, saving, result.id]);

  const handleNativeShare = useCallback(async () => {
    if (!navigator.share || !reportCardRef.current) {
      await handleCopy();
      return;
    }
    try {
      const blob = await captureCardImage(reportCardRef.current);
      const file = new File([blob], '사주증권_종목리포트.png', { type: 'image/png' });
      await navigator.share({
        title: `📈 내 연애 주가: ${result.stockReport.currentPrice.toLocaleString()}원`,
        text: '주가 조작단이 분석한 내 종목 리포트',
        files: [file],
      });
      trackEvent('stock_share_native', { stockId: result.id });
    } catch {
      await handleCopy();
    }
  }, [reportCardRef, result, handleCopy]);

  const btnStyle: React.CSSProperties = {
    flex: 1,
    height: '52px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
  };

  return (
    <div
      className="flex flex-col w-full"
      style={{
        minHeight: '100dvh',
        backgroundColor: '#0a0a14',
        padding: '0 20px',
        paddingBottom: '80px',
      }}
    >
      <div style={{ height: '48px' }} />

      {/* Section label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#7A38D8',
          letterSpacing: '-0.3px',
          marginBottom: '20px',
        }}
      >
        종목 리포트 공유
      </motion.p>

      {/* Share buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex flex-col gap-3"
        style={{ marginBottom: '32px' }}
      >
        {/* Primary share */}
        <button
          onClick={handleNativeShare}
          style={{
            ...btnStyle,
            flex: 'unset',
            width: '100%',
            backgroundColor: '#7A38D8',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 700,
          }}
        >
          📱 내 종목 리포트 공유하기
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            style={{
              ...btnStyle,
              backgroundColor: copied ? '#1a3a1a' : '#1a1a2e',
              color: copied ? '#4ADE80' : '#ccc',
              border: copied ? '1px solid #4ADE80' : '1px solid #2a2a3e',
            }}
          >
            {copied ? '✅ 복사됨' : '🔗 링크 복사'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              ...btnStyle,
              backgroundColor: '#1a1a2e',
              color: '#ccc',
              border: '1px solid #2a2a3e',
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? '저장 중...' : '💾 이미지 저장'}
          </button>
        </div>
      </motion.div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: '#2a2a3e', marginBottom: '32px' }} />

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <p
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.4px',
            marginBottom: '6px',
          }}
        >
          작전 실행하기
        </p>
        <p
          style={{
            fontSize: '13px',
            fontWeight: 400,
            color: '#888',
            marginBottom: '20px',
          }}
        >
          주가 조작단과 1:1 작전을 시작하세요
        </p>

        <div className="flex flex-col gap-3">
          {ctaCrews.map((crew, i) => (
            <motion.button
              key={crew.member.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.15, duration: 0.35 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3"
              style={{
                padding: '16px',
                borderRadius: '14px',
                backgroundColor: crew.accentBg,
                border: `1px solid ${crew.accentBorder}`,
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onClick={() => {
                trackEvent('stock_cta_crew', { crewId: crew.member.id });
                // Placeholder: will link to chat later
              }}
            >
              <span style={{ fontSize: '24px', flexShrink: 0 }}>{crew.member.emoji}</span>
              <div>
                <p
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: crew.accentColor,
                    marginBottom: '2px',
                  }}
                >
                  {crew.label}
                </p>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#888',
                  }}
                >
                  {crew.member.position} · {crew.member.faction}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Another analysis + reset */}
      <div
        className="flex flex-col gap-3"
        style={{ marginTop: '32px' }}
      >
        <button
          onClick={onReset}
          style={{
            width: '100%',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#1a1a2e',
            color: '#888',
            fontSize: '14px',
            fontWeight: 600,
            border: '1px solid #2a2a3e',
            cursor: 'pointer',
          }}
        >
          🔄 다른 종목 분석하기
        </button>

        <button
          onClick={onReset}
          style={{
            width: '100%',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'transparent',
            color: '#555',
            fontSize: '13px',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          처음으로
        </button>
      </div>
    </div>
  );
}
