'use client';

import SkyBackground from './SkyBackground';
import ScrollFrame from './ScrollFrame';
import { ElementIcon } from './icons';
import LandingThumbnail from './LandingThumbnail';
import ShareButtons from './ShareButtons';

export default function Landing({ onStart, thumbnailSrc }: { onStart: () => void; thumbnailSrc?: string }) {
  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 52px)', padding: '48px 20px 40px' }}>
      <SkyBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-10px', left: '20px', zIndex: 2 }}>
            <ElementIcon elementKey="火" size={40} />
          </div>
          <div style={{ position: 'absolute', top: '-14px', right: '24px', zIndex: 2 }}>
            <ElementIcon elementKey="木" size={40} />
          </div>
          <ScrollFrame>
            <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
              <h1 style={{ fontSize: '34px', fontWeight: 800, lineHeight: 1.2, color: '#2B2013', letterSpacing: '-0.5px' }}>
                내 오행<br />처방전
              </h1>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#8A5A2B', marginTop: '6px' }}>테스트</p>
              <div style={{ margin: '18px 0' }}>
                <LandingThumbnail imageSrc={thumbnailSrc} />
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#5C4A2E' }}>
                내 사주에 부족한 기운,<br />무엇으로 채워야 할까?
              </p>
            </div>
          </ScrollFrame>
        </div>

        <div
          style={{
            marginTop: '28px',
            backgroundColor: '#FBF3E1',
            border: '1.5px solid #2B2013',
            borderRadius: '16px',
            padding: '14px 18px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#2B2013',
          }}
        >
          나와 함께 부족한 기운을 찾아볼 텐가?
        </div>

        <button
          type="button"
          onClick={onStart}
          style={{
            marginTop: '14px',
            width: '100%',
            height: '58px',
            borderRadius: '16px',
            backgroundColor: '#2B2013',
            color: '#F3E7C9',
            fontSize: '15px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          시작하기
        </button>

        <div style={{ marginTop: '36px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#2B2013', marginBottom: '14px' }}>테스트 공유하기</p>
          <ShareButtons shareText="내 오행 처방전 테스트 — 내 사주에 부족한 기운은?" />
        </div>
      </div>
    </div>
  );
}
