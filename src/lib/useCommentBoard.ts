'use client';

import { useCallback, useEffect, useState } from 'react';
import { getFingerprint } from '@/lib/fingerprint';
import { fetchComments, likeComment, postComment, unlikeComment, type CommentEntry } from '@/lib/comments';
import type { FeatureType } from '@/lib/analytics';

const MAX_LENGTH = 100;

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

export function anonTag(): string {
  return '익명';
}

export function darkenHex(hex: string, amount: number): string {
  // undefined / null / 문자열이 아닌 경우 기본값(#8B5FC7) 지정
  const safeHex = typeof hex === 'string' && hex ? hex : '#8B5FC7';
  const clean = safeHex.replace('#', '');
  
  if (clean.length < 6) {
    return 'rgb(139, 95, 199)';
  }

  const r = Math.max(0, parseInt(clean.slice(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(clean.slice(2, 4), 16) - amount);
  const b = Math.max(0, parseInt(clean.slice(4, 6), 16) - amount);
  return `rgb(${r}, ${g}, ${b})`;
}

export function tintHex(hex: string, opacity: number): string {
  const safeHex = typeof hex === 'string' && hex ? hex : '#8B5FC7';
  const clean = safeHex.replace('#', '');

  if (clean.length < 6) {
    return `rgba(139, 95, 199, ${opacity})`;
  }

  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function getLikedSet(storageKey: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    return new Set(JSON.parse(window.localStorage.getItem(storageKey) ?? '[]'));
  } catch {
    return new Set();
  }
}

function saveLikedSet(storageKey: string, set: Set<string>) {
  window.localStorage.setItem(storageKey, JSON.stringify([...set]));
}

// 댓글 게시판 공용 로직
export function useCommentBoard(featureType: FeatureType, storageKey: string) {
  const [comments, setComments] = useState<CommentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setLikedIds(getLikedSet(storageKey));
    fetchComments(featureType).then(data => {
      setComments(data);
      setLoading(false);
    });
  }, [featureType, storageKey]);

  const handleSubmit = useCallback(async () => {
    const content = input.trim();
    if (!content || content.length > MAX_LENGTH || submitting) return;

    setSubmitting(true);
    const clientId = getFingerprint();
    const created = await postComment(featureType, content, clientId);
    setSubmitting(false);

    if (created) {
      setComments(prev => [created, ...prev]);
      setInput('');
    }
  }, [featureType, input, submitting]);

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
    saveLikedSet(storageKey, nextLiked);
  }, [likedIds, storageKey]);

  return {
    comments,
    loading,
    input,
    setInput,
    submitting,
    likedIds,
    showAll,
    setShowAll,
    handleSubmit,
    handleToggleLike,
    maxLength: MAX_LENGTH,
  };
}