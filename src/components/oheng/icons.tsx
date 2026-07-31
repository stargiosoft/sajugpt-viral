import type { ElementKey } from '@/types/oheng';

export const ELEMENT_ORDER: ElementKey[] = ['木', '火', '土', '金', '水'];

export const ELEMENT_COLOR: Record<ElementKey, string> = {
  木: '#34C759',
  火: '#FF3B30',
  土: '#FF9500',
  金: '#FFD60A',
  水: '#0A84FF',
};

const ELEMENT_ICON_SRC: Record<ElementKey, string> = {
  木: '/oheng/elements/wood.png',
  火: '/oheng/elements/fire.png',
  土: '/oheng/elements/earth.png',
  金: '/oheng/elements/metal.png',
  水: '/oheng/elements/water.png',
};

export function ElementIcon({ elementKey, size = 56 }: { elementKey: ElementKey; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ELEMENT_ICON_SRC[elementKey]}
      alt={elementKey}
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
}

export function AnimalIllustration({ animal, size = 180 }: { animal: string; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 200 200' };
  switch (animal) {
    case '토끼':
      return (
        <svg {...common}>
          <ellipse cx="70" cy="50" rx="14" ry="40" fill="#F7EFE0" stroke="#2B2013" strokeWidth="3" />
          <ellipse cx="130" cy="50" rx="14" ry="40" fill="#F7EFE0" stroke="#2B2013" strokeWidth="3" />
          <ellipse cx="70" cy="52" rx="6" ry="28" fill="#EAC7C0" />
          <ellipse cx="130" cy="52" rx="6" ry="28" fill="#EAC7C0" />
          <circle cx="100" cy="120" r="55" fill="#F7EFE0" stroke="#2B2013" strokeWidth="3" />
          <circle cx="82" cy="112" r="5" fill="#2B2013" />
          <circle cx="118" cy="112" r="5" fill="#2B2013" />
          <path d="M92 132q8 8 16 0" stroke="#2B2013" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="100" cy="124" rx="5" ry="3.5" fill="#D98686" />
        </svg>
      );
    case '여우':
      return (
        <svg {...common}>
          <path d="M55 40l25 35h-38z" fill="#D9762E" stroke="#2B2013" strokeWidth="3" strokeLinejoin="round" />
          <path d="M145 40l-25 35h38z" fill="#D9762E" stroke="#2B2013" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="100" cy="120" r="55" fill="#D9762E" stroke="#2B2013" strokeWidth="3" />
          <path d="M100 105 L75 155 L125 155 Z" fill="#F7EFE0" stroke="#2B2013" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="82" cy="108" r="5" fill="#2B2013" />
          <circle cx="118" cy="108" r="5" fill="#2B2013" />
          <circle cx="100" cy="140" r="4" fill="#2B2013" />
        </svg>
      );
    case '곰':
      return (
        <svg {...common}>
          <circle cx="60" cy="55" r="20" fill="#8A6A45" stroke="#2B2013" strokeWidth="3" />
          <circle cx="140" cy="55" r="20" fill="#8A6A45" stroke="#2B2013" strokeWidth="3" />
          <circle cx="100" cy="120" r="58" fill="#A57C4F" stroke="#2B2013" strokeWidth="3" />
          <ellipse cx="100" cy="132" rx="22" ry="16" fill="#F7EFE0" stroke="#2B2013" strokeWidth="2.5" />
          <circle cx="82" cy="108" r="5" fill="#2B2013" />
          <circle cx="118" cy="108" r="5" fill="#2B2013" />
          <circle cx="100" cy="126" r="4" fill="#2B2013" />
        </svg>
      );
    case '호랑이':
      return (
        <svg {...common}>
          <path d="M52 35l16 30-24 4z" fill="#E0A93E" stroke="#2B2013" strokeWidth="3" strokeLinejoin="round" />
          <path d="M148 35l-16 30 24 4z" fill="#E0A93E" stroke="#2B2013" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="100" cy="120" r="56" fill="#E0A93E" stroke="#2B2013" strokeWidth="3" />
          <ellipse cx="100" cy="132" rx="24" ry="18" fill="#F7EFE0" stroke="#2B2013" strokeWidth="2" />
          <path d="M70 90q6-10 14-4M116 86q8-6 14 4M65 115q8-4 14 2M121 117q6-6 14-2" stroke="#2B2013" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="82" cy="108" r="5" fill="#2B2013" />
          <circle cx="118" cy="108" r="5" fill="#2B2013" />
          <circle cx="100" cy="126" r="4" fill="#2B2013" />
        </svg>
      );
    case '거북이':
    default:
      return (
        <svg {...common}>
          <ellipse cx="100" cy="120" rx="60" ry="48" fill="#5C8A5A" stroke="#2B2013" strokeWidth="3" />
          <path d="M100 78v84M64 90l72 60M136 90l-72 60" stroke="#2B2013" strokeWidth="2" opacity="0.5" />
          <circle cx="150" cy="95" r="22" fill="#8FBB80" stroke="#2B2013" strokeWidth="3" />
          <circle cx="158" cy="90" r="4" fill="#2B2013" />
        </svg>
      );
  }
}
