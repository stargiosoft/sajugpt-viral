'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, CSSProperties, RefObject } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  dislikeComment,
  fetchComments,
  insertComment,
  likeComment,
  undislikeComment,
  unlikeComment,
  type CommentFeatureType,
  type CommentSort,
  type GhostComment,
} from '@/lib/ghost-tarot/comments';
import {
  COMMENT_MAX_LENGTH,
  containsProfanity,
  formatRelativeTime,
  getClientId,
  getDislikedIds,
  getLikedIds,
  isBlankOrTooLong,
  markDisliked,
  markLiked,
  unmarkDisliked,
  unmarkLiked,
} from '@/lib/ghost-tarot/commentUtils';

// 색상만 바꾸면 다른 테마(다른 타로/기능)에도 그대로 재사용할 수 있도록 팔레트를 prop으로 분리
export interface CommentSectionColors {
  /** 강조색 — 좋아요/싫어요/선택된 정렬 탭/전송 버튼 활성 색상 */
  accent: string;
  /** 댓글 본문 등 기본 텍스트 색상 */
  text: string;
  /** 닉네임/시간/비선택 상태 텍스트 색상 */
  dim: string;
  /** dim보다 살짝 더 어두운 톤 — 비선택 정렬 탭 등에 사용 */
  dimStrong: string;
  /** 좋아요/싫어요 아이콘의 비활성(안 누른) fill 색상 */
  faint: string;
}

export const DEFAULT_COMMENT_COLORS: CommentSectionColors = {
  accent: 'rgb(179,47,23)',
  text: '#d5d5d5',
  dim: '#8e8e8e',
  dimStrong: 'rgb(117,117,117)',
  faint: '#4a4a4a',
};

const THUMB_BASE_PATH =
  'M4.25 8h-2.5C.785 8 0 8.785 0 9.75v11.5C0 22.215.785 23 1.75 23h2.5C5.215 23 6 22.215 6 21.25V9.75C6 8.785 5.215 8 4.25 8z';
const THUMB_BODY_PATH =
  'M20.001 8.75h-4.72s.75-1.5.75-4c0-3-2.25-4-3.25-4s-1.5.5-1.5 3c0 2.376-2.301 4.288-3.781 5.273v12.388c1.601.741 4.806 1.839 9.781 1.839h1.6c1.95 0 3.61-1.4 3.94-3.32l1.12-6.5a3.998 3.998 0 0 0-3.94-4.68z';

const ThumbsUpIcon = ({ active, colors }: { active: boolean; colors: CommentSectionColors }) => (
  <svg width="13" height="13" viewBox="0 0 24 24">
    <path d={THUMB_BASE_PATH} fill={active ? colors.accent : colors.faint} />
    <path d={THUMB_BODY_PATH} fill={active ? colors.accent : colors.faint} />
  </svg>
);

const ThumbsDownIcon = ({ active, colors }: { active: boolean; colors: CommentSectionColors }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" style={{ transform: 'rotate(180deg)' }}>
    <path d={THUMB_BASE_PATH} fill={active ? colors.accent : colors.faint} />
    <path d={THUMB_BODY_PATH} fill={active ? colors.accent : colors.faint} />
  </svg>
);

const SendButton = ({
  active,
  onClick,
  disabled,
  colors,
}: {
  active: boolean;
  onClick: () => void;
  disabled: boolean;
  colors: CommentSectionColors;
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    disabled={disabled}
    whileHover={disabled ? undefined : { backgroundColor: active ? colors.accent : 'rgba(255,255,255,0.2)' }}
    transition={{ duration: 0.15 }}
    style={{
      width: 30,
      height: 30,
      flexShrink: 0,
      borderRadius: 10,
      border: 'none',
      backgroundColor: active ? colors.accent : '#1c1c1c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 2,
      cursor: disabled ? 'default' : 'pointer',
    }}
  >
    <svg width="30" height="30" viewBox="0 0 34 34">
      <path
        d="M17 22v-9M12.5 17.5 17 13l4.5 4.5"
        fill="none"
        stroke={active ? '#f5ebe0' : '#5a5a5a'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </motion.button>
);

const ChevronIcon = ({ up }: { up: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ transform: up ? 'rotate(180deg)' : 'none' }}>
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 메인 댓글 입력창과 답글 입력창이 서로 다르게 동작하지 않도록 하나의 컴포넌트로 통일
function CommentComposer({
  value,
  onValueChange,
  onSubmit,
  submitting,
  placeholder,
  autoFocus,
  textareaRef,
  style,
  colors,
}: {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  placeholder: string;
  autoFocus?: boolean;
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
  style?: CSSProperties;
  colors: CommentSectionColors;
}) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const disabled = submitting || value.trim().length === 0;
  const active = !submitting && value.trim().length > 0;

  return (
    <div className="flex items-end" style={{ gap: 6, borderRadius: 12, backgroundColor: 'rgb(19,19,19)', padding: '6px 8px 8px 16px', ...style }}>
      <textarea
        ref={textareaRef}
        autoFocus={autoFocus}
        value={value}
        onChange={handleChange}
        maxLength={COMMENT_MAX_LENGTH}
        rows={1}
        placeholder={placeholder}
        className="ghost-comment-textarea"
        style={{ flex: 1, resize: 'none', border: 'none', outline: 'none', background: 'transparent', color: colors.text, fontSize: 16, fontWeight: 500, lineHeight: 1.4, fontFamily: 'inherit', maxHeight: 120, padding: '6px 0' }}
      />
      <SendButton active={active} disabled={disabled} onClick={onSubmit} colors={colors} />
    </div>
  );
}

interface CommentRowProps {
  comment: GhostComment;
  isReply: boolean;
  isLast: boolean;
  likedIds: Set<string>;
  dislikedIds: Set<string>;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  replyCount?: number;
  panelOpen: boolean;
  onTogglePanel: () => void;
  colors: CommentSectionColors;
}

function CommentRow({
  comment,
  isReply,
  isLast,
  likedIds,
  dislikedIds,
  onLike,
  onDislike,
  replyCount,
  panelOpen,
  onTogglePanel,
  colors,
}: CommentRowProps) {
  const liked = likedIds.has(comment.id);
  const disliked = dislikedIds.has(comment.id);

  return (
    <div
      style={{
        padding: isReply ? '8px 4px 8px 20px' : '9px 4px',
        borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center">
        {isReply && <span style={{ color: colors.dim, fontSize: 12.5, fontWeight: 500, marginRight: 9 }}>└</span>}
        <div className="flex items-center" style={{ gap: 5 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'rgb(63,63,63)' }}>익명</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'rgb(63,63,63)' }}>·</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'rgb(63,63,63)' }}>{formatRelativeTime(comment.created_at)}</span>
        </div>
      </div>

      <p
        style={{
          marginTop: 2,
          paddingLeft: isReply ? 22 : 0,
          fontSize: 15,
          fontWeight: 500,
          lineHeight: 1.5,
          color: colors.text,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {comment.content}
      </p>

      <div className="flex items-center justify-between" style={{ marginTop: isReply ? 5 : 9, paddingLeft: 6, paddingRight: 13 }}>
        {isReply ? (
          <span />
        ) : (
          <motion.button
            type="button"
            onClick={onTogglePanel}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            transition={{ duration: 0.15 }}
            style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 13.5, fontWeight: 500, color: panelOpen ? colors.accent : 'rgb(101,101,101)', backgroundColor: 'transparent', borderRadius: 8, border: 'none', cursor: 'pointer', padding: '4px 6px 4px 10px', margin: '-4px -6px -4px -10px' }}
          >
            {`답글 ${replyCount ?? 0}`}
            <ChevronIcon up={panelOpen} />
          </motion.button>
        )}

        <div className="flex items-center" style={{ gap: 14 }}>
          <motion.button
            type="button"
            onClick={() => onLike(comment.id)}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            transition={{ duration: 0.15 }}
            style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12.5, color: liked ? colors.accent : colors.dim, backgroundColor: 'transparent', borderRadius: 8, border: 'none', cursor: 'pointer', padding: '6px 7px 6px 8px', margin: '-6px -7px -6px -8px' }}
          >
            <span style={{ position: 'relative', top: -2, display: 'inline-flex' }}>
              <ThumbsUpIcon active={liked} colors={colors} />
            </span>
            {comment.likes > 0 && <span style={{ lineHeight: 1 }}>{comment.likes}</span>}
          </motion.button>

          <motion.button
            type="button"
            onClick={() => onDislike(comment.id)}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            transition={{ duration: 0.15 }}
            style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12.5, color: disliked ? colors.accent : colors.dim, backgroundColor: 'transparent', borderRadius: 8, border: 'none', cursor: 'pointer', padding: '6px 8px 6px 8px', margin: '-6px -8px -6px -8px' }}
          >
            <ThumbsDownIcon active={disliked} colors={colors} />
            {comment.dislikes > 0 && <span style={{ lineHeight: 1 }}>{comment.dislikes}</span>}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

interface GhostCommentSectionProps {
  colors?: Partial<CommentSectionColors>;
  featureType?: CommentFeatureType;
}

export default function GhostCommentSection({ colors: colorOverrides, featureType = 'ghost_tarot' }: GhostCommentSectionProps = {}) {
  const colors: CommentSectionColors = { ...DEFAULT_COMMENT_COLORS, ...colorOverrides };
  const [comments, setComments] = useState<GhostComment[]>([]);
  const [sort, setSort] = useState<CommentSort>('latest');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [dislikedIds, setDislikedIds] = useState<Set<string>>(new Set());
  const [openPanelId, setOpenPanelId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [, forceTick] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const clientIdRef = useRef('');

  useEffect(() => {
    clientIdRef.current = getClientId();
    setLikedIds(getLikedIds());
    setDislikedIds(getDislikedIds());
  }, []);

  const load = useCallback(async (s: CommentSort) => {
    try {
      const data = await fetchComments(s, featureType);
      setComments(data);
    } catch {
      setNotice('댓글을 불러오지 못했어요.');
    }
  }, [featureType]);

  useEffect(() => {
    load(sort);
    setVisibleCount(5);
  }, [sort, load]);

  // 상대 시간("3분 전" 등) 표시를 1분마다 갱신
  useEffect(() => {
    const timer = setInterval(() => forceTick((n) => n + 1), 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  const { topLevel, repliesByParent } = useMemo(() => {
    const top: GhostComment[] = [];
    const replies: Record<string, GhostComment[]> = {};
    for (const c of comments) {
      if (c.parent_id) {
        (replies[c.parent_id] ??= []).push(c);
      } else {
        top.push(c);
      }
    }
    Object.values(replies).forEach((list) => list.sort((a, b) => a.created_at.localeCompare(b.created_at)));
    return { topLevel: top, repliesByParent: replies };
  }, [comments]);

  const validateText = (value: string): string | null => {
    const trimmed = value.trim();
    const invalid = isBlankOrTooLong(value);
    if (invalid === 'blank') return '내용을 입력해주세요.';
    if (invalid === 'too_long') return `최대 ${COMMENT_MAX_LENGTH}자까지 가능해요.`;
    if (containsProfanity(trimmed)) return '부적절한 표현이 포함되어 있어요.';
    return null;
  };

  const handleSubmit = async () => {
    const errorMessage = validateText(text);
    if (errorMessage) {
      setNotice(errorMessage);
      return;
    }

    setSubmitting(true);
    try {
      const created = await insertComment(text.trim(), clientIdRef.current, featureType);
      setText('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
      setComments((prev) => (sort === 'latest' ? [created, ...prev] : [...prev, created]));
    } catch {
      setNotice('등록에 실패했어요. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePanel = (id: string) => {
    setOpenPanelId((prev) => (prev === id ? null : id));
    setReplyText('');
  };

  const handleReplySubmit = async (parentId: string) => {
    const errorMessage = validateText(replyText);
    if (errorMessage) {
      setNotice(errorMessage);
      return;
    }

    setReplySubmitting(true);
    try {
      const created = await insertComment(replyText.trim(), clientIdRef.current, featureType, parentId);
      setReplyText('');
      setComments((prev) => [...prev, created]);
      setOpenPanelId(parentId);
    } catch {
      setNotice('등록에 실패했어요. 다시 시도해주세요.');
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    const alreadyLiked = likedIds.has(id);
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, likes: Math.max(0, c.likes + (alreadyLiked ? -1 : 1)) } : c)));
    if (alreadyLiked) {
      unmarkLiked(id);
    } else {
      markLiked(id);
    }
    setLikedIds(getLikedIds());
    try {
      await (alreadyLiked ? unlikeComment(id) : likeComment(id));
    } catch {
      // 낙관적 업데이트 유지 — 실패해도 사용자 경험에 영향 없음
    }
  };

  const handleDislike = async (id: string) => {
    const alreadyDisliked = dislikedIds.has(id);
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, dislikes: Math.max(0, c.dislikes + (alreadyDisliked ? -1 : 1)) } : c)));
    if (alreadyDisliked) {
      unmarkDisliked(id);
    } else {
      markDisliked(id);
    }
    setDislikedIds(getDislikedIds());
    try {
      await (alreadyDisliked ? undislikeComment(id) : dislikeComment(id));
    } catch {
      // 낙관적 업데이트 유지 — 실패해도 사용자 경험에 영향 없음
    }
  };

  const renderReplyInput = (parentId: string) => (
    <div style={{ margin: '12px 4px 20px 4px' }}>
      <CommentComposer
        value={replyText}
        onValueChange={setReplyText}
        onSubmit={() => handleReplySubmit(parentId)}
        submitting={replySubmitting}
        placeholder="너 생각이 궁금해!"
        autoFocus
        textareaRef={replyTextareaRef}
        colors={colors}
      />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 8, paddingLeft: 2, paddingRight: 2 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>
          댓글 <span style={{ fontWeight: 900, color: colors.accent }}>{comments.length}</span>
        </span>
        <div className="flex items-center" style={{ gap: 10, paddingRight: 2 }}>
          {(['latest', 'likes'] as const).map((s) => (
            <motion.button
              key={s}
              type="button"
              onClick={() => setSort(s)}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              transition={{ duration: 0.15 }}
              style={{
                fontSize: 13,
                fontWeight: 400,
                backgroundColor: 'transparent',
                borderRadius: 8,
                border: 'none',
                padding: '4px 6px 4px 7px',
                margin: '-4px -6px -4px -7px',
                color: sort === s ? colors.accent : colors.dimStrong,
                cursor: 'pointer',
              }}
            >
              {s === 'latest' ? '최신순' : '공감순'}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 입력창 */}
      <CommentComposer
        value={text}
        onValueChange={setText}
        onSubmit={handleSubmit}
        submitting={submitting}
        placeholder="너 생각이 궁금해!"
        textareaRef={textareaRef}
        style={{ marginBottom: 24 }}
        colors={colors}
      />

      {notice && (
        <p style={{ marginTop: 6, fontSize: 11.5, color: '#ffb199', textAlign: 'center' }}>{notice}</p>
      )}

      {/* 댓글 목록 — 카드 없이 타임스탬프+본문만 촘촘히 쌓는 채팅 로그 스타일 */}
      <div style={{ marginTop: 8 }}>
        <AnimatePresence initial={false}>
        {topLevel.slice(0, visibleCount).map((c, i, visible) => {
          const replies = repliesByParent[c.id] ?? [];
          const panelOpen = openPanelId === c.id;
          return (
            <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
              <CommentRow
                comment={c}
                isReply={false}
                isLast={i === visible.length - 1 && !panelOpen}
                likedIds={likedIds}
                dislikedIds={dislikedIds}
                onLike={handleLike}
                onDislike={handleDislike}
                replyCount={replies.length}
                panelOpen={panelOpen}
                onTogglePanel={() => handleTogglePanel(c.id)}
                colors={colors}
              />
              <AnimatePresence initial={false}>
                {panelOpen && (
                  <motion.div
                    key="panel"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <AnimatePresence initial={false}>
                      {replies.map((r) => (
                        <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
                          <CommentRow
                            comment={r}
                            isReply
                            isLast={false}
                            likedIds={likedIds}
                            dislikedIds={dislikedIds}
                            onLike={handleLike}
                            onDislike={handleDislike}
                            panelOpen={panelOpen}
                            onTogglePanel={() => handleTogglePanel(c.id)}
                            colors={colors}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {renderReplyInput(c.id)}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        </AnimatePresence>
      </div>

      {topLevel.length > visibleCount && (
        <motion.button
          type="button"
          onClick={() => setVisibleCount((prev) => prev + 5)}
          className="flex items-center justify-center"
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          transition={{ duration: 0.15 }}
          style={{
            width: '100%',
            gap: 4,
            marginTop: 8,
            padding: '11px 0',
            fontSize: 12,
            fontWeight: 500,
            color: colors.dim,
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
          }}
        >
          더 보기
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke={colors.dim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      )}
    </div>
  );
}
