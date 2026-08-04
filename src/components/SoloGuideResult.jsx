import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 초기화 (프로젝트 환경변수 사용)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SoloGuideResult() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Supabase Edge Function 'analyze-solo-guide' 호출
      const { data, error: funcError } = await supabase.functions.invoke('analyze-solo-guide', {
        body: {
          name: '김성아',
          birthday: '1995-08-15',
          birthTime: '오후 02:30',
          gender: 'female',
          calendarType: 'solar'
        }
      });

      if (funcError) {
        throw new Error(funcError.message || 'Edge Function 호출 실패');
      }

      if (!data.success) {
        throw new Error(data.message || '분석 데이터를 불러오지 못했습니다.');
      }

      // Edge Function이 크롤링 및 파싱 완료 후 정형화하여 보내준 데이터 저장
      setResult(data);
    } catch (err) {
      console.error('분석 요청 에러:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>솔로 가이드 분석 결과</h2>
      
      <button 
        onClick={handleAnalyze} 
        disabled={loading}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: '#4A90E2',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Edge Function에서 분석 중...' : '솔로 원인 분석하기'}
      </button>

      {error && (
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#FFE6E6', color: '#D8000C', borderRadius: '6px' }}>
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '24px', padding: '20px', backgroundColor: '#F8F9FA', borderRadius: '12px', border: '1px solid #E9ECEF' }}>
          <h3>📌 {result.name}님의 분석 결과</h3>
          <p><strong>페이지 제목:</strong> {result.title}</p>
          <p><strong>수신된 텍스트 길아:</strong> {result.rawTextLength} 자</p>
          
          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #DEE2E6' }} />
          
          <h4>요약 결과 (크롤링 데이터):</h4>
          <p style={{ lineHeight: '1.6', color: '#495057', backgroundColor: '#FFF', padding: '12px', borderRadius: '6px' }}>
            {result.summary}
          </p>
        </div>
      )}
    </div>
  );
}