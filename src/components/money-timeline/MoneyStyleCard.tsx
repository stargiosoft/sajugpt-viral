'use client';

import type { MoneyStyleInfo, SipsungCategory } from '@/types/money-timeline';
import { BODY_TEXT_STYLE } from '@/constants/moneyTimelineTheme';

interface Props {
  moneyStyle: MoneyStyleInfo;
}

const STYLE_IMAGE: Record<SipsungCategory, string> = {
  재성: '/money-timeline/style-jaeseong.png',
  식상: '/money-timeline/style-siksang.png',
  관성: '/money-timeline/style-gwanseong.png',
  비겁: '/money-timeline/style-bigyeop.png',
  인성: '/money-timeline/style-inseong.png',
};

export function BulletRow({ text }: { text: string }) {
  return (
    <div className="flex items-start" style={{ gap: '10px' }}>
      <img src="/money-timeline/star-bullet.png" alt="" style={{ width: '18px', height: '18px', flexShrink: 0, marginTop: '3px' }} />
      <p style={{ flex: 1, textAlign: 'left', ...BODY_TEXT_STYLE }}>{text}</p>
    </div>
  );
}

export default function MoneyStyleCard({ moneyStyle }: Props) {
  return (
    <div style={{ padding: '12px 0 0', textAlign: 'center' }}>
      <p style={{ fontSize: '14px', color: 'rgb(13, 13, 13)', marginBottom: '6px', padding: '0 20px', WebkitTextStroke: '0.3px rgb(13, 13, 13)' }}>나의 재물 성향은</p>
      <p
        style={{
          fontSize: '34px',
          fontWeight: 800,
          color: '#7C5CFC',
          marginBottom: '8px',
          padding: '0 20px 2px',
          letterSpacing: '-1px',
          WebkitTextStroke: '0.5px #7C5CFC',
        }}
      >
        {moneyStyle.title}
      </p>

      <div
        style={{
          borderRadius: '20px',
          backgroundImage: 'url(/money-timeline/style-panel-pattern-v2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '20px 20px 20px',
        }}
      >
        <img
          src={STYLE_IMAGE[moneyStyle.category]}
          alt={moneyStyle.title}
          style={{ display: 'block', width: '240px', height: '240px', margin: '-8px auto -8px', objectFit: 'contain' }}
        />
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 12px rgba(124, 92, 252, 0.10)', padding: '18px 16px 16px' }}>
          <div style={{ marginBottom: '16px' }}>
            <BulletRow text={moneyStyle.description} />
          </div>

          <div style={{ marginBottom: '16px', borderTop: '1px dashed rgb(229, 227, 249)' }} />

          <BulletRow text={`“${moneyStyle.yongsinNote.replace(/^다만\s*/, '')}”`} />
        </div>
      </div>
    </div>
  );
}
