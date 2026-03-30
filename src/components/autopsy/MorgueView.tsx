'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { CORONERS, DISCERNMENT_GRADES } from '@/constants/autopsy';
import { trackEvent } from '@/lib/analytics';
import type { DiscernmentGrade, CoronerId, MorgueStats, MorgueAutopsy } from '@/types/autopsy';

interface Props {
  targetSajuType: string;
  autopsyId: string;
  onBack: () => void;
  onReplay: () => void;
}

export default function MorgueView({ targetSajuType, autopsyId, onBack, onReplay }: Props) {
  const [stats, setStats] = useState<MorgueStats | null>(null);
  const [otherAutopsies, setOtherAutopsies] = useState<MorgueAutopsy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMorgueData() {
      setLoading(true);
      try {
        const [statsRes, autopsiesRes] = await Promise.all([
          supabase
            .from('autopsy_morgue_stats')
            .select('*')
            .eq('target_saju_type', targetSajuType)
            .single(),
          supabase
            .from('saju_autopsies')
            .select('id, cause_of_death_label, discernment_grade, regret_probability, coroner_id, created_at')
            .eq('target_saju_type', targetSajuType)
            .eq('is_archived', true)
            .neq('id', autopsyId)
            .order('created_at', { ascending: false })
            .limit(10),
        ]);

        if (statsRes.data) {
          setStats({
            targetSajuType: statsRes.data.target_saju_type,
            victimCount: statsRes.data.victim_count,
            topCauses: statsRes.data.top_causes ?? [],
          });
        }

        if (autopsiesRes.data) {
          setOtherAutopsies(autopsiesRes.data.map((row) => ({
            id: row.id,
            causeOfDeathLabel: row.cause_of_death_label,
            discernmentGrade: row.discernment_grade as DiscernmentGrade,
            regretProbability: row.regret_probability,
            coronerId: row.coroner_id as CoronerId,
            createdAt: row.created_at,
          })));
        }
      } catch (err) {
        console.error('영안실 데이터 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMorgueData();
    trackEvent('autopsy_morgue_view', { targetSajuType });
  }, [targetSajuType, autopsyId]);

  const getTimeSince = useCallback((dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return '방금 전';
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}일 전`;
    return `${Math.floor(days / 30)}개월 전`;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: '32px 20px 48px' }}
    >
      {/* 헤더 */}
      <div className="flex flex-col items-center" style={{ marginBottom: '28px' }}>
        <span style={{ fontSize: '36px', marginBottom: '8px' }}>🏥</span>
        <h2 style={{
          fontSize: '22px',
          fontWeight: 800,
          color: '#151515',
          letterSpacing: '-0.44px',
          textAlign: 'center',
        }}>
          전 연인 영안실
        </h2>
        <p style={{
          fontSize: '14px',
          fontWeight: 400,
          color: '#848484',
          marginTop: '6px',
          textAlign: 'center',
        }}>
          {targetSajuType} 일주 유형에게 피해 입은 사람들
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center" style={{ padding: '40px 0' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            style={{
              width: '32px',
              height: '32px',
              border: '3px solid #F7F2FA',
              borderTopColor: '#7A38D8',
              borderRadius: '50%',
            }}
          />
        </div>
      ) : (
        <>
          {/* 피해자 수 카운터 */}
          <div style={{
            backgroundColor: '#FAF8FC',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            marginBottom: '16px',
            border: '1px solid #EDE5F7',
          }}>
            <p style={{ fontSize: '13px', fontWeight: 500, color: '#848484', marginBottom: '8px' }}>
              이 사주 유형에게 피해 입은 사람
            </p>
            <p style={{
              fontSize: '40px',
              fontWeight: 900,
              color: '#7A38D8',
              letterSpacing: '-1px',
              lineHeight: '1',
            }}>
              {stats?.victimCount ?? 1}
              <span style={{ fontSize: '18px', fontWeight: 600, marginLeft: '4px' }}>명</span>
            </p>
          </div>

          {/* TOP 3 사망 원인 */}
          {stats && stats.topCauses.length > 0 && (
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px',
              border: '1px solid #f0f0f0',
            }}>
              <p style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#151515',
                marginBottom: '14px',
                letterSpacing: '-0.28px',
              }}>
                대표 사망 원인 TOP {Math.min(stats.topCauses.length, 3)}
              </p>
              <div className="flex flex-col gap-3">
                {stats.topCauses.slice(0, 3).map((cause, i) => {
                  const total = stats.topCauses.reduce((sum, c) => sum + c.count, 0);
                  const pct = total > 0 ? Math.round((cause.count / total) * 100) : 0;
                  return (
                    <div key={cause.cause} className="flex items-center gap-3">
                      <span style={{
                        fontSize: '14px',
                        fontWeight: 800,
                        color: i === 0 ? '#7A38D8' : '#b7b7b7',
                        width: '24px',
                        textAlign: 'center',
                      }}>
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center" style={{ marginBottom: '4px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
                            {cause.cause}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#7A38D8' }}>
                            {pct}%
                          </span>
                        </div>
                        <div style={{
                          height: '6px',
                          backgroundColor: '#f3f3f3',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${pct}%`,
                            backgroundColor: i === 0 ? '#7A38D8' : '#D4B8F0',
                            borderRadius: '3px',
                            transition: 'width 0.6s ease',
                          }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 다른 부검 결과 */}
          {otherAutopsies.length > 0 && (
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid #f0f0f0',
            }}>
              <p style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#151515',
                marginBottom: '14px',
                letterSpacing: '-0.28px',
              }}>
                다른 부검 결과
              </p>
              <div className="flex flex-col gap-3">
                {otherAutopsies.map((a) => {
                  const gradeInfo = DISCERNMENT_GRADES[a.discernmentGrade];
                  const coroner = CORONERS.find(c => c.id === a.coronerId);
                  return (
                    <div
                      key={a.id}
                      style={{
                        backgroundColor: '#f9f9f9',
                        borderRadius: '12px',
                        padding: '14px 16px',
                      }}
                    >
                      <div className="flex justify-between items-center" style={{ marginBottom: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#333' }}>
                          {a.causeOfDeathLabel}
                        </span>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: 800,
                          color: gradeInfo.color,
                        }}>
                          {a.discernmentGrade}등급
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{ fontSize: '12px', color: '#848484' }}>
                          후회 확률 {a.regretProbability}% · {coroner?.name ?? ''} 검시관
                        </span>
                        <span style={{ fontSize: '11px', color: '#b7b7b7' }}>
                          {getTimeSince(a.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 동질감 문구 */}
          <p style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#7A38D8',
            textAlign: 'center',
            marginBottom: '24px',
            letterSpacing: '-0.28px',
          }}>
            {stats && stats.victimCount > 1
              ? `"역시 나만 당한 게 아님ㅋㅋ"`
              : `"첫 번째 부검 기록이에요"`}
          </p>

          {/* 하단 버튼 */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                trackEvent('autopsy_morgue_replay');
                onReplay();
              }}
              style={{
                width: '100%',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#7A38D8',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              내 전남친도 부검하기
            </button>
            <button
              onClick={onBack}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '16px',
                backgroundColor: 'transparent',
                color: '#999',
                fontSize: '14px',
                fontWeight: 600,
                border: '1px solid #e7e7e7',
                cursor: 'pointer',
              }}
            >
              사망진단서로 돌아가기
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
