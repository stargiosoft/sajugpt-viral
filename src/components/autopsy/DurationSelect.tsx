'use client';

import type { RelationshipDuration } from '@/types/autopsy';
import { RELATIONSHIP_DURATIONS } from '@/constants/autopsy';

interface Props {
  value: RelationshipDuration | null;
  onChange: (v: RelationshipDuration) => void;
}

export default function DurationSelect({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>
        얼마나 만났어?
      </p>
      <div className="flex gap-2 flex-wrap">
        {RELATIONSHIP_DURATIONS.map((item) => {
          const selected = value === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              style={{
                padding: '10px 18px',
                borderRadius: '20px',
                border: selected ? '2px solid #7A38D8' : '2px solid #eee',
                backgroundColor: selected ? '#F7F2FA' : '#fff',
                color: selected ? '#7A38D8' : '#666',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
