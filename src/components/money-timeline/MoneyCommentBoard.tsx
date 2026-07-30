'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PressableButton from '@/components/PressableButton';
import { getFingerprint } from '@/lib/fingerprint';
import { fetchComments, likeComment, postComment, unlikeComment, type CommentEntry } from '@/lib/comments';
import { MONEY_COLORS as C } from '@/constants/moneyTimelineTheme';

const MAX_LENGTH = 100;
const LIKED_STORAGE_KEY = 'money_timeline_liked_comments';
const INITIAL_VISIBLE_COUNT = 5;

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

const ANON_TAG = '방문자';

function getLikedSet(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    return new Set(JSON.parse(window.localStorage.getItem(LIKED_STORAGE_KEY) ?? '[]'));
  } catch {
    return new Set();
  }
}

function saveLikedSet(set: Set<string>) {
  window.localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify([...set]));
}

export default function MoneyCommentBoard() {
  const [comments, setComments] = useState<CommentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setLikedIds(getLikedSet());
    fetchComments('money_timeline').then(data => {
      setComments(data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    const content = input.trim();
    if (!content || content.length > MAX_LENGTH || submitting) return;

    setSubmitting(true);
    const clientId = getFingerprint();
    const created = await postComment('money_timeline', content, clientId);
    setSubmitting(false);

    if (created) {
      setComments(prev => [created, ...prev]);
      setInput('');
    }
  }, [input, submitting]);

  const handleToggleLike = useCallback(async (id: string) => {
    const alreadyLiked = likedIds.has(id);
    setComments(prev => prev.map(c => (c.id === id ? { ...c, likes: c.likes + (alreadyLiked ? -1 : 1) } : c)));

    const nextLiked = new Set(likedIds);
    if (alreadyLiked) {
      nextLiked.delete(id);
      await unlikeComment(id);
    } else {
      nextLiked.add(id);
      await likeComment(id);
    }
    setLikedIds(nextLiked);
    saveLikedSet(nextLiked);
  }, [likedIds]);

  return (
    <div style={{ backgroundColor: C.panelBg, borderRadius: '18px', boxShadow: '0 8px 24px rgba(124, 92, 252, 0.16)', padding: '20px' }}>
      <p style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginBottom: '10px', paddingLeft: '2px' }}>
        다녀간 사람들의 한마디
      </p>

      <div className="flex items-center" style={{ gap: '10px', marginBottom: '16px' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value.slice(0, MAX_LENGTH))}
          placeholder="내 돈복은 어떤가요?"
          rows={1}
          style={{
            flex: 1,
            resize: 'none',
            fontSize: '15px',
            color: C.text,
            background: '#f7f7f7',
            border: 'none',
            borderRadius: '12px',
            padding: '11px 12px 10px 12px',
            outline: 'none',
          }}
        />
        <div style={{ width: '76px', flexShrink: 0 }}>
          <PressableButton
            label={submitting ? '등록 중...' : '등록'}
            onClick={handleSubmit}
            disabled={!input.trim() || submitting}
            style={{ height: '44px' }}
            bgStyle={{ background: input.trim() ? C.gold : '#f6f6f6', borderRadius: '12px' }}
            hoverBackground="rgb(126, 106, 244)"
            textStyle={{ fontSize: '14.5px', fontWeight: 500, color: input.trim() ? C.textOnGold : C.placeholder, paddingTop: '1.5px', WebkitTextStroke: `0.3px ${input.trim() ? C.textOnGold : C.placeholder}` }}
          />
        </div>
      </div>

      <div className="flex flex-col" style={{ gap: '12px', paddingLeft: '4px', paddingRight: '4px' }}>
        {loading && <p style={{ fontSize: '13px', color: C.textTertiary, textAlign: 'center' }}>불러오는 중...</p>}

        {!loading && comments.length === 0 && (
          <p style={{ fontSize: '13px', color: C.textTertiary, textAlign: 'center', padding: '8px 0' }}>
            아직 댓글이 없어요. 첫 한마디를 남겨보세요!
          </p>
        )}

        {(showAll ? comments : comments.slice(0, INITIAL_VISIBLE_COUNT)).map(comment => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ borderBottom: '1px solid rgb(243, 243, 243)', paddingBottom: '12px', paddingLeft: '2px' }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 400, color: C.gold, WebkitTextStroke: `0.3px ${C.gold}` }}>{ANON_TAG}</span>
              <span style={{ fontSize: '12px', color: C.textTertiary }}>{timeAgo(comment.created_at)}</span>
            </div>
            <p style={{ fontSize: '15px', color: 'rgb(48, 48, 48)', lineHeight: 1.55, marginBottom: '6px' }}>
              {comment.content}
            </p>
            <button
              type="button"
              onClick={() => handleToggleLike(comment.id)}
              className="flex items-center"
              style={{ gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill={likedIds.has(comment.id) ? '#FF4081' : 'none'} stroke={likedIds.has(comment.id) ? '#FF4081' : C.textTertiary} strokeWidth="2" style={{ position: 'relative', top: '-1.5px' }}>
                <path d="M12 21s-6.7-4.35-9.3-8.1C1 10.1 1.6 6.6 4.5 5.1 6.9 3.85 9.7 4.6 12 7c2.3-2.4 5.1-3.15 7.5-1.9 2.9 1.5 3.5 5 1.8 7.8C18.7 16.65 12 21 12 21z" />
              </svg>
              <span style={{ fontSize: '13px', color: C.textTertiary, fontWeight: 500 }}>{comment.likes}</span>
            </button>
          </motion.div>
        ))}

        {!showAll && comments.length > INITIAL_VISIBLE_COUNT && (
          <motion.button
            type="button"
            onClick={() => setShowAll(true)}
            whileHover={{ backgroundColor: 'rgb(238, 235, 255)' }}
            transition={{ duration: 0.15 }}
            style={{
              fontSize: '13px',
              fontWeight: 400,
              WebkitTextStroke: '0.5px rgb(115, 94, 242)',
              color: 'rgb(115, 94, 242)',
              background: '#FFFFFF',
              border: 'none',
              outline: 'none',
              borderRadius: '12px',
              padding: '10px',
              cursor: 'pointer',
            }}
          >
            <span style={{ display: 'inline-block', paddingTop: '1.5px' }}>더 보기</span>
          </motion.button>
        )}
      </div>
    </div>
  );
}
