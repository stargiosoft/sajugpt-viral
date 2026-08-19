'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PressableButton from '@/components/PressableButton';
import { useCommentBoard, timeAgo, anonTag as defaultAnonTag, darkenHex, tintHex } from '@/lib/useCommentBoard';
import type { FeatureType } from '@/lib/analytics';

const INITIAL_VISIBLE_COUNT = 5;

// 밝은 배경용 라이트 테마
const LIGHT_GRAY = {
  text: '#191F28',
  textSecondary: '#4E5968',
  textTertiary: '#7C8794',
  placeholder: '#B0B8C1',
  divider: 'rgba(25, 31, 40, 0.08)',
  inputBg: 'rgb(244, 246, 247)',
  disabledBg: '#EDEFF2',
  heartIdle: '#C7CCD3',
};

// 어두운 배경용 다크 테마
const DARK_GRAY = {
  text: '#FFFFFF',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  placeholder: '#8E8E93',
  divider: 'rgba(255, 255, 255, 0.12)',
  inputBg: 'rgba(255, 255, 255, 0.08)',
  disabledBg: 'rgba(255, 255, 255, 0.15)',
  heartIdle: '#636366',
};

const HEART_PATH = 'M21.5,4c-1.82,0-3.7.89-5.5,2.58-1.8-1.69-3.68-2.58-5.5-2.58-4.69,0-8.5,3.81-8.5,8.5,0,6.17,5.48,12.38,13.65,15.44.11.04.23.06.35.06s.24-.02.35-.06c8.16-3.06,13.65-9.26,13.65-15.44,0-4.69-3.81-8.5-8.5-8.5Z';

function HeartIcon({ filled, idleColor = '', size = 14 }: { filled: boolean; idleColor?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <path fill={filled ? '#FF3B30' : idleColor} d={HEART_PATH} />
    </svg>
  );
}

function HeartBurst({ onDone }: { onDone: () => void }) {
  const [particles] = useState(() =>
    Array.from({ length: 4 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 22,
      delay: i * 0.06,
      size: 9 + Math.random() * 6,
    }))
  );

  return (
    <>
      {particles.map((p, idx) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }}
          animate={{ opacity: 0, y: -26, x: p.x, scale: 1 }}
          transition={{ duration: 0.65, delay: p.delay, ease: 'easeOut' }}
          onAnimationComplete={idx === particles.length - 1 ? onDone : undefined}
          style={{ position: 'absolute', left: '1px', bottom: '2px', pointerEvents: 'none' }}
        >
          <HeartIcon filled size={p.size} />
        </motion.div>
      ))}
    </>
  );
}

interface Props {
  featureType: FeatureType;
  storageKey: string;
  placeholder: string;
  themeColor: string;
  dark?: boolean;
  inputBg?: string;
  disabledBg?: string;
  emptyStateColor?: string;
  metaColor?: string;
  heartIdleColor?: string;
  moreButtonFontSize?: string;
  moreButtonHoverBg?: string;
  submitButtonHoverBg?: string;
  anonTag?: (clientId: string) => string;
}

export default function CommentBoard({
  featureType,
  storageKey,
  placeholder,
  themeColor,
  dark = false,
  inputBg,
  disabledBg,
  emptyStateColor,
  metaColor,
  heartIdleColor,
  moreButtonFontSize,
  moreButtonHoverBg,
  submitButtonHoverBg,
  anonTag = defaultAnonTag,
}: Props) {
  const { comments, loading, input, setInput, submitting, likedIds, showAll, setShowAll, handleSubmit, handleToggleLike, maxLength } =
    useCommentBoard(featureType, storageKey);
  const [burstIds, setBurstIds] = useState<Set<string>>(new Set());

  // dark 여부에 따라 텍스트 및 기본 배경 색상 세트 결정
  const GRAY = {
    ...(dark ? DARK_GRAY : LIGHT_GRAY),
    ...(inputBg ? { inputBg } : {}),
    ...(disabledBg ? { disabledBg } : {}),
    ...(heartIdleColor ? { heartIdle: heartIdleColor } : {}),
  };

  const accentHover = submitButtonHoverBg ?? darkenHex(themeColor, 26);
  const moreBg = tintHex(themeColor, dark ? 0.15 : 0.08);
  const moreHoverBg = moreButtonHoverBg ?? tintHex(themeColor, dark ? 0.25 : 0.18);

  const handleLikeClick = (id: string) => {
    if (!likedIds.has(id)) {
      setBurstIds(prev => new Set(prev).add(id));
    }
    handleToggleLike(id);
  };

  const clearBurst = (id: string) => {
    setBurstIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <div style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}>
      {/* 타이틀 영역 */}
      <p style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px', marginBottom: '8px', paddingLeft: '2px' }}>
        <span style={{ fontSize: '17px', color: GRAY.text }}>댓글</span>
        <span style={{ fontSize: '17px', color: themeColor }}> {comments.length}</span>
      </p>

      {/* 댓글 입력 창 */}
      <div className="flex items-center" style={{ gap: '8px', marginBottom: '20px' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value.slice(0, maxLength))}
          placeholder={placeholder}
          rows={1}
          style={{
            flex: 1,
            resize: 'none',
            fontSize: '14.5px',
            lineHeight: '20px',
            letterSpacing: '-0.2px',
            color: GRAY.text,
            background: GRAY.inputBg,
            border: dark ? '1px solid rgba(255, 255, 255, 0.15)' : 'none',
            borderRadius: '14px',
            padding: '12px 14px',
            outline: 'none',
          }}
        />
        <div style={{ width: '68px', flexShrink: 0 }}>
          <PressableButton
            label={submitting ? '등록 중' : '등록'}
            onClick={handleSubmit}
            disabled={!input.trim() || submitting}
            style={{ height: '44px' }}
            bgStyle={{ background: input.trim() ? themeColor : GRAY.disabledBg, borderRadius: '12px' }}
            hoverBackground={accentHover}
            textStyle={{ fontSize: '13.5px', fontWeight: 600, letterSpacing: '0', color: input.trim() ? '#FFFFFF' : GRAY.placeholder }}
          />
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="flex flex-col">
        {loading && <p style={{ fontSize: '13px', color: GRAY.textSecondary, textAlign: 'center' }}>불러오는 중...</p>}

        {!loading && comments.length === 0 && (
          <p style={{ fontSize: '13px', color: emptyStateColor ?? GRAY.textSecondary, textAlign: 'center', padding: '8px 0' }}>
            아직 댓글이 없어요. 첫 한마디를 남겨보세요!
          </p>
        )}

        {(showAll ? comments : comments.slice(0, INITIAL_VISIBLE_COUNT)).map((comment, i) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              ease: 'easeOut',
              delay: i >= INITIAL_VISIBLE_COUNT ? (i - INITIAL_VISIBLE_COUNT) * 0.05 : 0,
            }}
            style={{
              padding: '0 6px',
              marginTop: i > 0 ? '10px' : 0,
              paddingTop: i > 0 ? '12px' : 0,
              borderTop: i > 0 ? `1px solid ${GRAY.divider}` : 'none',
            }}
          >
            <div className="flex items-center" style={{ gap: '6px', marginBottom: '5px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 500, letterSpacing: '-0.2px', color: metaColor ?? GRAY.textTertiary }}>{anonTag(comment.client_id)}</span>
              <span style={{ fontSize: '11px', letterSpacing: '-0.1px', color: metaColor ?? GRAY.textTertiary, paddingTop: '1px', paddingBottom: '1px' }}>{timeAgo(comment.created_at)}</span>
            </div>
            <p style={{ fontSize: '14.5px', fontWeight: 400, letterSpacing: '-0.2px', color: GRAY.text, lineHeight: '22px', marginBottom: '6px' }}>
              {comment.content}
            </p>
            <button
              type="button"
              onClick={() => handleLikeClick(comment.id)}
              className="flex items-center"
              style={{ gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 0 1px', position: 'relative' }}
            >
              <HeartIcon filled={likedIds.has(comment.id)} idleColor={GRAY.heartIdle} />
              <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '-0.1px', color: GRAY.textSecondary }}>{comment.likes}</span>
              {burstIds.has(comment.id) && <HeartBurst onDone={() => clearBurst(comment.id)} />}
            </button>
          </motion.div>
        ))}

        {!showAll && comments.length > INITIAL_VISIBLE_COUNT && (
          <PressableButton
            onClick={() => setShowAll(true)}
            label="더 보기"
            style={{ height: '40px', marginTop: '30px' }}
            bgStyle={{ background: moreBg, borderRadius: '14px' }}
            hoverBackground={moreHoverBg}
            textStyle={{ fontSize: moreButtonFontSize ?? '13.5px', fontWeight: 600, letterSpacing: '-0.2px', color: themeColor }}
          />
        )}
      </div>
    </div>
  );
}