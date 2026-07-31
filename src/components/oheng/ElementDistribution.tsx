import { ElementIcon, ELEMENT_COLOR, ELEMENT_ORDER } from './icons';
import { OHENG_COLORS as C } from '@/constants/ohengTheme';
import type { ElementKey } from '@/types/oheng';

export default function ElementDistribution({
  distribution,
}: {
  distribution: Record<ElementKey, number>;
}) {
  return (
    <div>
      <div style={{ display: 'flex', gap: '6px' }}>
        {ELEMENT_ORDER.map(key => {
          const value = distribution[key] ?? 0;
          return (
            <div
              key={key}
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                padding: '14px 6px 12px',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                <ElementIcon elementKey={key} size={36} />
              </div>
              <p style={{ fontSize: '10px', fontWeight: 400, color: C.textTertiary, marginBottom: '4px' }}>{key}</p>
              <p style={{ fontSize: '13px', fontWeight: 800, color: C.text, marginBottom: '10px' }}>
                {Math.round(value)}%
              </p>
              <div style={{ height: '5px', borderRadius: '3px', backgroundColor: C.panelBg, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, Math.max(0, value))}%`,
                    backgroundColor: ELEMENT_COLOR[key],
                    borderRadius: '3px',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
