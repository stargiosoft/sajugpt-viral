'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PressableButton from '@/components/PressableButton';
import { getFingerprint } from '@/lib/fingerprint';
import { fetchComments, likeComment, postComment, unlikeComment, type CommentEntry } from '@/lib/comments';

const MAX_LENGTH = 100;
const LIKED_STORAGE_KEY = 'love_chat_liked_comments';
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

function anonTag(clientId: string): string {
  const suffix = clientId.slice(-4).toUpperCase();
  return `방문자#${suffix}`;
}

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

export default function CommentBoard() {
  const [comments, setComments] = useState<CommentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setLikedIds(getLikedSet());
    fetchComments('love_chat').then(data => {
      setComments(data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    const content = input.trim();
    if (!content || content.length > MAX_LENGTH || submitting) return;

    setSubmitting(true);
    const clientId = getFingerprint();
    const created = await postComment('love_chat', content, clientId);
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
    <div style={{ background: '#fff', border: '1px solid #E3EBFA', borderRadius: '18px', padding: '20px' }}>
      <p style={{ fontSize: '22px', fontWeight: 500, color: '#1C2333', marginBottom: '10px', paddingLeft: '2px', fontFamily: "'Ongeulip Minmi', sans-serif" }}>
        다녀간 사람들의 한마디
      </p>

      <div className="flex items-center" style={{ gap: '10px', marginBottom: '16px' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value.slice(0, MAX_LENGTH))}
          placeholder="여러분은 어떤 카톡 스타일인가요?"
          rows={1}
          style={{
            flex: 1,
            resize: 'none',
            fontSize: '15.5px',
            color: '#26314D',
            background: '#F5F8FD',
            border: '1px solid #E3EBFA',
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
            bgStyle={{ background: input.trim() ? '#3D6FE0' : '#CBD6EE', borderRadius: '10px' }}
            textStyle={{ fontSize: '16px', fontWeight: 500, color: '#fff', paddingTop: '1.5px' }}
          />
        </div>
      </div>

      <div className="flex flex-col" style={{ gap: '12px' }}>
        {loading && <p style={{ fontSize: '13px', color: '#8A93A6', textAlign: 'center' }}>불러오는 중...</p>}

        {!loading && comments.length === 0 && (
          <p style={{ fontSize: '13px', color: '#8A93A6', textAlign: 'center', padding: '8px 0' }}>
            아직 댓글이 없어요. 첫 한마디를 남겨보세요!
          </p>
        )}

        {(showAll ? comments : comments.slice(0, INITIAL_VISIBLE_COUNT)).map(comment => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ borderBottom: '1px solid #EEF3FB', paddingBottom: '12px', paddingLeft: '2px' }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#3D6FE0' }}>{anonTag(comment.client_id)}</span>
              <span style={{ fontSize: '12px', color: '#B0B8C6' }}>{timeAgo(comment.created_at)}</span>
            </div>
            <p style={{ fontSize: '15.5px', color: '#26314D', lineHeight: 1.55, marginBottom: '6px' }}>
              {comment.content}
            </p>
            <button
              type="button"
              onClick={() => handleToggleLike(comment.id)}
              className="flex items-center"
              style={{ gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <span style={{ fontSize: '13px' }}>{likedIds.has(comment.id) ? '❤️' : '🤍'}</span>
              <span style={{ fontSize: '13px', color: '#8A93A6', fontWeight: 500 }}>{comment.likes}</span>
            </button>
          </motion.div>
        ))}

        {!showAll && comments.length > INITIAL_VISIBLE_COUNT && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            style={{
              fontSize: '15px',
              fontWeight: 500,
              letterSpacing: 0,
              color: '#3D6FE0',
              background: '#F5F8FD',
              border: 'none',
              borderRadius: '10px',
              padding: '10px',
              cursor: 'pointer',
            }}
          >
            더 보기
          </button>
        )}
      </div>
    </div>
  );
}
