type ElementKey = '木' | '火' | '土' | '金' | '水';

const ELEMENT_ICON_BG: Record<ElementKey, string> = {
  木: '#DCE9CE',
  火: '#F3D3C6',
  土: '#EDDCAE',
  金: '#EDE6C9',
  水: '#CFDAE8',
};

export function ElementIcon({ elementKey, size = 56 }: { elementKey: ElementKey; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: ELEMENT_ICON_BG[elementKey],
        border: '2px solid #2B2013',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="none">
        {elementKey === '火' && (
          <path
            d="M12 2c1 3-2 4-2 7a4 4 0 108 0c0-1-.5-2-1-2 .5 2-1 3-2 2 1-2-1-3-1-5 0-1 0-2-2-2z"
            fill="#C4432B" stroke="#2B2013" strokeWidth="0.6" strokeLinejoin="round"
          />
        )}
        {elementKey === '水' && (
          <path
            d="M12 2s6 7 6 12a6 6 0 11-12 0c0-5 6-12 6-12z"
            fill="#2B3A67" stroke="#2B2013" strokeWidth="0.6" strokeLinejoin="round"
          />
        )}
        {elementKey === '土' && (
          <path
            d="M4 17l4-9 4 5 3-4 5 8z"
            fill="#8A6A3A" stroke="#2B2013" strokeWidth="0.6" strokeLinejoin="round"
          />
        )}
        {elementKey === '木' && (
          <path
            d="M12 3c3 2 5 5 5 8a5 5 0 01-4 5v3h-2v-3a5 5 0 01-4-5c0-3 2-6 5-8z"
            fill="#4C8C4A" stroke="#2B2013" strokeWidth="0.6" strokeLinejoin="round"
          />
        )}
        {elementKey === '金' && (
          <rect x="4" y="4" width="16" height="16" rx="3" fill="#B8860B" stroke="#2B2013" strokeWidth="0.6" />
        )}
      </svg>
    </div>
  );
}

export function ElementPentagon({ weakest, size = 220 }: { weakest: ElementKey; size?: number }) {
  const order: ElementKey[] = ['火', '金', '木', '水', '土'];
  const positions = [
    { top: '0%', left: '50%' },
    { top: '30%', left: '92%' },
    { top: '78%', left: '75%' },
    { top: '78%', left: '25%' },
    { top: '30%', left: '8%' },
  ];
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 220 220" style={{ position: 'absolute', inset: 0 }}>
        {positions.map((_, i) =>
          positions.slice(i + 1).map((_, j) => {
            const a = pointAt(positions[i], size);
            const b = pointAt(positions[i + j + 1], size);
            return (
              <line
                key={`${i}-${j}`}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="#B99A5B" strokeWidth="1" strokeDasharray="3 4"
              />
            );
          })
        )}
      </svg>
      {order.map((el, i) => {
        const pos = positions[i];
        const active = el === weakest;
        return (
          <div
            key={el}
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              transform: 'translate(-50%, -50%)',
              opacity: active ? 1 : 0.55,
              filter: active ? 'none' : 'grayscale(0.3)',
            }}
          >
            <ElementIcon elementKey={el} size={56} />
          </div>
        );
      })}
    </div>
  );
}

function pointAt(pos: { top: string; left: string }, size: number) {
  return { x: (parseFloat(pos.left) / 100) * size, y: (parseFloat(pos.top) / 100) * size };
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
