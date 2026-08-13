// src/components/ziwei-chart/ZiweiGrid.tsx
'use client';

import { ZIWEI_PALETTE as C } from '@/lib/ziwei-chart/theme';

export default function ZiweiGrid() {
  // 12궁을 그리기 위한 임의의 배열 (나중에 실제 데이터로 교체됨)
  const palaces = Array.from({ length: 12 }).map((_, i) => `궁 ${i + 1}`);

  return (
    <div 
      style={{ 
        width: '100%',
        maxWidth: '440px', // 모바일 퍼스트 기준
        margin: '0 auto',
        padding: '16px',
        backgroundColor: C.panel,
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.textMain, marginBottom: '16px', textAlign: 'center' }}>
        나의 자미두수 명반
      </h3>

      {/* 4x4 CSS 그리드를 사용해 12궁 배치 */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, minmax(80px, auto))',
          gap: '4px',
          backgroundColor: C.border,
          border: `1px solid ${C.border}`,
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        {palaces.map((palace, index) => {
          // 명반의 빈 공간(가운데 2x2)을 만들기 위한 로직
          let gridArea = 'auto';
          if (index === 0) gridArea = '1 / 1 / 2 / 2';
          else if (index === 1) gridArea = '1 / 2 / 2 / 3';
          else if (index === 2) gridArea = '1 / 3 / 2 / 4';
          else if (index === 3) gridArea = '1 / 4 / 2 / 5';
          else if (index === 4) gridArea = '2 / 4 / 3 / 5';
          else if (index === 5) gridArea = '3 / 4 / 4 / 5';
          else if (index === 6) gridArea = '4 / 4 / 5 / 5';
          else if (index === 7) gridArea = '4 / 3 / 5 / 4';
          else if (index === 8) gridArea = '4 / 2 / 5 / 3';
          else if (index === 9) gridArea = '4 / 1 / 5 / 2';
          else if (index === 10) gridArea = '3 / 1 / 4 / 2';
          else if (index === 11) gridArea = '2 / 1 / 3 / 2';

          return (
            <div 
              key={index} 
              style={{
                gridArea: gridArea,
                backgroundColor: '#FFF',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                fontSize: '12px',
              }}
            >
              <div style={{ color: C.textMain, fontWeight: 600 }}>{palace}</div>
              <div style={{ color: C.textSub, fontSize: '10px', textAlign: 'right' }}>데이터 엑박</div>
            </div>
          );
        })}

        {/* 가운데 정보 영역 (2행~3행, 2열~3열 병합) */}
        <div
          style={{
            gridArea: '2 / 2 / 4 / 4',
            backgroundColor: '#FAFAFA',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: C.textSub, fontSize: '12px' }}>생년월일 및 명국 정보</p>
          <p style={{ color: C.primary, fontSize: '14px', fontWeight: 700, marginTop: '4px' }}>신원 엑박 영역</p>
        </div>
      </div>
    </div>
  );
}