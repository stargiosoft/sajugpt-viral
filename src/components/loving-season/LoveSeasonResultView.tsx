'use client';

import { useEffect, useState } from 'react';
import { LoveSeasonClient } from './LoveSeasonClient';
import type { LovingSeasonRecord } from '@/types/loving-season';

interface Props {
  resultId: string;
}

export default function LoveSeasonResultView({ resultId }: Props) {
  const [result, setResult] = useState<LovingSeasonRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resultId) {
      const cached = sessionStorage.getItem(`loving_season_${resultId}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);

          const normalizedRecord: LovingSeasonRecord = {
            ...parsed,
            firstSeason: parsed.firstSeason || parsed.first_season || '',
            allSeasons: parsed.allSeasons || parsed.all_seasons || [],
            first_season: parsed.first_season || parsed.firstSeason || '',
            all_seasons: parsed.all_seasons || parsed.allSeasons || [],
          };

          setResult(normalizedRecord);
        } catch (e) {
          console.error('세션 데이터 파싱 실패:', e);
        }
      }
    }
    setLoading(false);
  }, [resultId]);

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center' }}>
        <p style={{ color: '#666', fontSize: '16px' }}>결과를 불러오는 중이에요...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
          결과 정보를 찾을 수 없어요.
        </p>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
          다른 경로로 접속했거나 세션이 만료됐어요.
        </p>
        <a
          href="/loving-season"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#FF758F',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 700,
          }}
        >
          다시 검사하러 가기
        </a>
      </div>
    );
  }

  return <LoveSeasonClient result={result} />;
}