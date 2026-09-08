import React from 'react';
import { SkillItem } from '@/types/shinsal-series/skill-item';

interface SkillItemBadgeProps {
  item: SkillItem;
  onClick?: () => void;
}

export default function SkillItemBadge({ item, onClick }: SkillItemBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-900/40 border border-purple-500/30 hover:border-pink-400 transition-all text-left"
    >
      <span className="text-lg">✨</span>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-pink-300">{item.name}</span>
        <span className="text-[10px] text-gray-400">{item.statText}</span>
      </div>
    </button>
  );
}