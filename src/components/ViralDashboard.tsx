'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts';

// ─── 타입 ───

interface SummaryRow {
  feature_type: string;
  landing_visits: number;
  share_clicks: number;
  sajugpt_link_clicks: number;
  referral_unique_users: number;
  share_kakao: number;
  share_clipboard: number;
  share_native: number;
  share_image_save: number;
}

interface DailyRow {
  feature_type: string;
  event_date: string;
  landing_visits: number;
  share_clicks: number;
  sajugpt_link_clicks: number;
  referral_unique_users: number;
}

interface TodayRow {
  feature_type: string;
  event_type: string;
  share_method: string | null;
  cnt: number;
}

interface TotalRow {
  total_landings: number;
  total_shares: number;
  total_sajugpt_clicks: number;
  total_referral_users: number;
  total_unique_users: number;
}

// ─── 상수 ───

const FEATURE_LABELS: Record<string, string> = {
  sexy_battle: '색기 배틀',
  saju_autopsy: '사주 부검실',
  saju_court: '사주 법정',
  gisaeng: '기생 시뮬',
  night_manual: '밤 설명서',
  dating: '데이트 시뮬',
  saju_stock: '주가 조작단',
};

const FEATURE_EMOJI: Record<string, string> = {
  sexy_battle: '🔥',
  saju_autopsy: '🔬',
  saju_court: '⚖️',
  gisaeng: '🏮',
  night_manual: '🌙',
  dating: '💘',
  saju_stock: '📈',
};

const COLORS = ['#7A38D8', '#E8507B', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#6366F1'];

const EVENT_TYPE_LABELS: Record<string, string> = {
  landing_visit: '랜딩 유입',
  share_click: '공유',
  sajugpt_link_click: '사주GPT 클릭',
  referral_visit: '레퍼럴 유입',
};

const METHOD_LABELS: Record<string, string> = {
  kakao: '카카오톡',
  clipboard: '링크 복사',
  native: '네이티브',
  image_save: '이미지 저장',
};

type Tab = 'overview' | 'trend' | 'share' | 'conversion' | 'today';

const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: 'overview', label: '전체 집계', emoji: '📊' },
  { key: 'trend', label: '7일 추세', emoji: '📈' },
  { key: 'share', label: '공유 분석', emoji: '📤' },
  { key: 'conversion', label: '전환율', emoji: '🎯' },
  { key: 'today', label: '오늘 실시간', emoji: '⚡' },
];

// ─── 스타일 ───

const S = {
  font: 'Pretendard Variable, sans-serif',
  bg: '#f9f9f9',           // Surface Secondary
  card: '#ffffff',          // Surface
  primary: '#7A38D8',      // Brand Primary
  primaryDark: '#6B2FC2',  // Brand Primary Dark
  primaryLight: '#F7F2FA', // Brand Primary Light
  primaryTint: '#EDE5F7',  // Brand Primary Tint
  primarySurface: '#FAF8FC', // Brand Primary Surface
  text: '#151515',         // Text Primary
  textSecondary: '#525252', // Text Secondary
  textTertiary: '#6d6d6d', // Text Tertiary
  label: '#848484',        // Text Caption
  disabled: '#b7b7b7',     // Text Disabled
  border: '#e7e7e7',       // Border Default
  borderLight: '#f3f3f3',  // Border Divider
  green: '#10B981',
  red: '#d4183d',          // Destructive
  amber: '#F59E0B',
  info: '#3B82F6',         // Info
};

// ─── 헬퍼 ───

function featureLabel(ft: string): string {
  return `${FEATURE_EMOJI[ft] ?? ''} ${FEATURE_LABELS[ft] ?? ft}`;
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{
      backgroundColor: S.card,
      borderRadius: '16px',
      padding: '16px',
      flex: 1,
      minWidth: 0,
    }}>
      <p style={{ fontFamily: S.font, fontSize: '12px', fontWeight: 400, lineHeight: '16px', letterSpacing: '-0.24px', color: S.label, marginBottom: '4px' }}>{label}</p>
      <p style={{ fontFamily: S.font, fontSize: '24px', fontWeight: 600, lineHeight: '35.5px', letterSpacing: '-0.48px', color: S.text }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {sub && <p style={{ fontFamily: S.font, fontSize: '11px', fontWeight: 400, color: S.label, marginTop: '2px' }}>{sub}</p>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{
      fontFamily: S.font, fontSize: '16px', fontWeight: 600, lineHeight: '25px', letterSpacing: '-0.32px',
      color: S.text, margin: '24px 0 12px',
    }}>
      {children}
    </h3>
  );
}

function EmptyState() {
  return (
    <div style={{
      textAlign: 'center', padding: '60px 20px',
      fontFamily: S.font, fontSize: '15px', fontWeight: 400, lineHeight: '20px',
      letterSpacing: '-0.45px', color: S.textTertiary,
    }}>
      아직 데이터가 없습니다.<br />
      유저가 공유/클릭하면 여기에 집계됩니다.
    </div>
  );
}

// ─── 메인 컴포넌트 ───

export default function ViralDashboard() {
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState('');

  // 데이터
  const [summary, setSummary] = useState<SummaryRow[]>([]);
  const [daily, setDaily] = useState<DailyRow[]>([]);
  const [today, setToday] = useState<TodayRow[]>([]);
  const [total, setTotal] = useState<TotalRow>({ total_landings: 0, total_shares: 0, total_sajugpt_clicks: 0, total_referral_users: 0, total_unique_users: 0 });

  // 인증 체크
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key');
    if (key === 'stargio2026') {
      setAuthed(true);
      localStorage.setItem('vd_auth', '1');
    } else if (localStorage.getItem('vd_auth') === '1') {
      setAuthed(true);
    }
  }, []);

  const handleLogin = () => {
    if (pwInput === 'stargio2026') {
      setAuthed(true);
      localStorage.setItem('vd_auth', '1');
    }
  };

  // 데이터 로드
  const loadData = useCallback(async () => {
    setLoading(true);

    const [summaryRes, dailyRes, todayRes, totalRes] = await Promise.all([
      supabase.from('viral_analytics_summary').select('*'),
      supabase.from('viral_analytics_daily').select('*').order('event_date', { ascending: false }).limit(100),
      supabase.rpc('get_today_viral_events'),
      supabase.rpc('get_viral_totals'),
    ]);

    // summary
    if (summaryRes.data) setSummary(summaryRes.data as SummaryRow[]);

    // daily
    if (dailyRes.data) setDaily(dailyRes.data as DailyRow[]);

    // today — RPC 실패 시 직접 쿼리
    if (todayRes.data) {
      setToday(todayRes.data as TodayRow[]);
    } else {
      const { data } = await supabase
        .from('viral_events')
        .select('feature_type, event_type, share_method')
        .gte('created_at', new Date().toISOString().split('T')[0]);
      if (data) {
        const grouped = new Map<string, TodayRow>();
        for (const row of data) {
          const key = `${row.feature_type}|${row.event_type}|${row.share_method ?? ''}`;
          const existing = grouped.get(key);
          if (existing) {
            existing.cnt++;
          } else {
            grouped.set(key, { ...row, cnt: 1 });
          }
        }
        setToday(Array.from(grouped.values()).sort((a, b) => b.cnt - a.cnt));
      }
    }

    // total — RPC 실패 시 직접 쿼리
    if (totalRes.data && Array.isArray(totalRes.data) && totalRes.data.length > 0) {
      setTotal(totalRes.data[0] as TotalRow);
    } else {
      const { count: landingCount } = await supabase
        .from('viral_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'landing_visit');
      const { count: shareCount } = await supabase
        .from('viral_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'share_click');
      const { count: gptCount } = await supabase
        .from('viral_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'sajugpt_link_click');
      const { data: refData } = await supabase
        .from('viral_events')
        .select('fingerprint')
        .eq('event_type', 'referral_visit');
      const { data: allFp } = await supabase
        .from('viral_events')
        .select('fingerprint');

      setTotal({
        total_landings: landingCount ?? 0,
        total_shares: shareCount ?? 0,
        total_sajugpt_clicks: gptCount ?? 0,
        total_referral_users: refData ? new Set(refData.map(r => r.fingerprint)).size : 0,
        total_unique_users: allFp ? new Set(allFp.map(r => r.fingerprint)).size : 0,
      });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  // ─── 로그인 화면 ───
  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: S.bg, fontFamily: S.font,
      }}>
        <div style={{
          backgroundColor: S.card, borderRadius: '20px', padding: '32px',
          width: '320px', textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>
          <p style={{ fontSize: '32px', marginBottom: '8px' }}>📊</p>
          <p style={{ fontFamily: S.font, fontSize: '18px', fontWeight: 600, lineHeight: '25.5px', letterSpacing: '-0.36px', color: S.text, marginBottom: '24px' }}>
            바이럴 애널리틱스
          </p>
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={pwInput}
            onChange={e => setPwInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%', height: '48px', borderRadius: '16px',
              border: `1px solid ${S.border}`, padding: '0 16px',
              fontFamily: S.font, fontSize: '15px', fontWeight: 400,
              lineHeight: '20px', letterSpacing: '-0.45px', color: S.text,
              outline: 'none', boxSizing: 'border-box',
              backgroundColor: '#f3f3f5',
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              width: '100%', height: '48px', borderRadius: '16px',
              backgroundColor: S.primary, color: '#fff', border: 'none',
              fontFamily: S.font, fontSize: '16px', fontWeight: 500,
              lineHeight: '25px', letterSpacing: '-0.32px',
              cursor: 'pointer', marginTop: '12px',
            }}
          >
            로그인
          </button>
        </div>
      </div>
    );
  }

  // ─── 데이터 가공 ───

  // 7일 트렌드 차트 데이터
  const last7Days = (() => {
    const dates: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates.map(date => {
      const dayRows = daily.filter(r => r.event_date === date);
      return {
        date: date.slice(5), // MM-DD
        landings: dayRows.reduce((s, r) => s + r.landing_visits, 0),
        shares: dayRows.reduce((s, r) => s + r.share_clicks, 0),
        gptClicks: dayRows.reduce((s, r) => s + r.sajugpt_link_clicks, 0),
        referrals: dayRows.reduce((s, r) => s + r.referral_unique_users, 0),
      };
    });
  })();

  // 전환율 데이터
  const conversionData = summary.map(r => ({
    name: FEATURE_LABELS[r.feature_type] ?? r.feature_type,
    emoji: FEATURE_EMOJI[r.feature_type] ?? '',
    landings: r.landing_visits,
    shareClicks: r.share_clicks,
    referralUsers: r.referral_unique_users,
    gptClicks: r.sajugpt_link_clicks,
    shareRate: r.landing_visits > 0 ? Math.round(r.share_clicks * 1000 / r.landing_visits) / 10 : 0,
    referralRate: r.share_clicks > 0 ? Math.round(r.referral_unique_users * 1000 / r.share_clicks) / 10 : 0,
    gptCtr: r.referral_unique_users > 0 ? Math.round(r.sajugpt_link_clicks * 1000 / r.referral_unique_users) / 10 : 0,
  })).sort((a, b) => b.landings - a.landings);

  // 공유 방법 차트 데이터
  const shareMethodData = summary.map(r => ({
    name: FEATURE_LABELS[r.feature_type] ?? r.feature_type,
    카카오: r.share_kakao,
    '링크 복사': r.share_clipboard,
    네이티브: r.share_native,
    '이미지 저장': r.share_image_save,
  })).sort((a, b) => {
    const totalA = a.카카오 + a['링크 복사'] + a.네이티브 + a['이미지 저장'];
    const totalB = b.카카오 + b['링크 복사'] + b.네이티브 + b['이미지 저장'];
    return totalB - totalA;
  });

  const hasData = summary.length > 0 || today.length > 0;

  // ─── 렌더링 ───

  return (
    <div style={{ minHeight: '100vh', backgroundColor: S.bg }}>
      <div style={{ maxWidth: '440px', margin: '0 auto', position: 'relative' }}>

        {/* 헤더 */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          backgroundColor: S.card, borderBottom: `1px solid ${S.border}`,
          padding: '16px 20px 12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <p style={{ fontFamily: S.font, fontSize: '18px', fontWeight: 600, lineHeight: '25.5px', letterSpacing: '-0.36px', color: S.text }}>
              📊 바이럴 애널리틱스
            </p>
            <button
              onClick={loadData}
              style={{
                backgroundColor: S.primaryLight, border: 'none', borderRadius: '12px',
                padding: '6px 12px', fontFamily: S.font, fontSize: '13px',
                fontWeight: 500, letterSpacing: '-0.26px',
                color: S.primary, cursor: 'pointer',
              }}
            >
              🔄 새로고침
            </button>
          </div>

          {/* 탭 */}
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: '6px 12px', borderRadius: '9999px', border: 'none',
                  fontFamily: S.font, fontSize: '13px', fontWeight: tab === t.key ? 600 : 400,
                  letterSpacing: '-0.26px',
                  backgroundColor: tab === t.key ? S.primary : 'transparent',
                  color: tab === t.key ? '#fff' : S.label,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 콘텐츠 */}
        <div style={{ padding: '0 16px 32px' }}>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: S.font, fontSize: '15px', fontWeight: 400, lineHeight: '20px', letterSpacing: '-0.45px', color: S.textTertiary }}>
              데이터 불러오는 중...
            </div>
          ) : !hasData && tab !== 'today' ? (
            <EmptyState />
          ) : (
            <>
              {/* ═══ 전체 집계 ═══ */}
              {tab === 'overview' && (
                <>
                  {/* 종합 요약 */}
                  <SectionTitle>종합 요약</SectionTitle>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <StatCard label="랜딩 유입" value={total.total_landings} />
                    <StatCard label="총 공유 클릭" value={total.total_shares} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <StatCard label="사주GPT 클릭" value={total.total_sajugpt_clicks} />
                    <StatCard label="레퍼럴 유저" value={total.total_referral_users} />
                  </div>

                  {/* 기능별 */}
                  <SectionTitle>기능별 집계</SectionTitle>
                  {summary.sort((a, b) => b.share_clicks - a.share_clicks).map((r, i) => (
                    <div key={r.feature_type} style={{
                      backgroundColor: S.card, borderRadius: '16px', padding: '16px',
                      marginBottom: '8px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontFamily: S.font, fontSize: '15px', fontWeight: 600, letterSpacing: '-0.3px', color: S.text }}>
                          {featureLabel(r.feature_type)}
                        </span>
                        <span style={{
                          fontFamily: S.font, fontSize: '11px', fontWeight: 600,
                          backgroundColor: COLORS[i % COLORS.length] + '18',
                          color: COLORS[i % COLORS.length],
                          padding: '2px 8px', borderRadius: '8px',
                        }}>
                          #{i + 1}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontFamily: S.font, fontSize: '12px', fontWeight: 400, lineHeight: '16px', letterSpacing: '-0.24px', color: S.label }}>랜딩</p>
                          <p style={{ fontFamily: S.font, fontSize: '18px', fontWeight: 600, letterSpacing: '-0.36px', color: S.info }}>{r.landing_visits.toLocaleString()}</p>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontFamily: S.font, fontSize: '12px', fontWeight: 400, lineHeight: '16px', letterSpacing: '-0.24px', color: S.label }}>공유</p>
                          <p style={{ fontFamily: S.font, fontSize: '18px', fontWeight: 600, letterSpacing: '-0.36px', color: S.text }}>{r.share_clicks.toLocaleString()}</p>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontFamily: S.font, fontSize: '12px', fontWeight: 400, lineHeight: '16px', letterSpacing: '-0.24px', color: S.label }}>GPT</p>
                          <p style={{ fontFamily: S.font, fontSize: '18px', fontWeight: 600, letterSpacing: '-0.36px', color: S.primary }}>{r.sajugpt_link_clicks.toLocaleString()}</p>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontFamily: S.font, fontSize: '12px', fontWeight: 400, lineHeight: '16px', letterSpacing: '-0.24px', color: S.label }}>레퍼럴</p>
                          <p style={{ fontFamily: S.font, fontSize: '18px', fontWeight: 600, letterSpacing: '-0.36px', color: S.green }}>{r.referral_unique_users.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {summary.length > 0 && (
                    <>
                      <SectionTitle>기능별 공유 클릭 비교</SectionTitle>
                      <div style={{ backgroundColor: S.card, borderRadius: '16px', padding: '16px 8px 8px' }}>
                        <ResponsiveContainer width="100%" height={220}>
                          <BarChart data={summary.sort((a, b) => b.share_clicks - a.share_clicks).map(r => ({
                            name: FEATURE_LABELS[r.feature_type] ?? r.feature_type,
                            value: r.share_clicks,
                          }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: S.font }} />
                            <YAxis tick={{ fontSize: 11, fontFamily: S.font }} />
                            <Tooltip
                              contentStyle={{ fontFamily: S.font, fontSize: '13px', borderRadius: '8px' }}
                              formatter={(v) => [Number(v).toLocaleString(), '공유 클릭']}
                            />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                              {summary.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* ═══ 7일 추세 ═══ */}
              {tab === 'trend' && (
                <>
                  <SectionTitle>최근 7일 추세</SectionTitle>
                  <div style={{ backgroundColor: S.card, borderRadius: '16px', padding: '16px 8px 8px' }}>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={last7Days}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: S.font }} />
                        <YAxis tick={{ fontSize: 11, fontFamily: S.font }} />
                        <Tooltip contentStyle={{ fontFamily: S.font, fontSize: '13px', borderRadius: '8px' }} />
                        <Legend wrapperStyle={{ fontFamily: S.font, fontSize: '12px' }} />
                        <Line type="monotone" dataKey="landings" name="랜딩 유입" stroke={S.info} strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="shares" name="공유 클릭" stroke={S.primary} strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="gptClicks" name="GPT 클릭" stroke={S.amber} strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="referrals" name="레퍼럴" stroke={S.green} strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 일별 기능별 상세 */}
                  <SectionTitle>일별 기능별 상세</SectionTitle>
                  {daily.length === 0 ? <EmptyState /> : (
                    <div style={{ backgroundColor: S.card, borderRadius: '16px', overflow: 'hidden' }}>
                      <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 44px 44px 44px 44px',
                        padding: '10px 12px', borderBottom: `1px solid ${S.border}`,
                        fontFamily: S.font, fontSize: '11px', fontWeight: 500, letterSpacing: '-0.22px', color: S.label,
                      }}>
                        <span>기능</span>
                        <span style={{ textAlign: 'right' }}>랜딩</span>
                        <span style={{ textAlign: 'right' }}>공유</span>
                        <span style={{ textAlign: 'right' }}>GPT</span>
                        <span style={{ textAlign: 'right' }}>레퍼럴</span>
                      </div>
                      {daily.slice(0, 30).map((r, i) => (
                        <div key={i} style={{
                          display: 'grid', gridTemplateColumns: '1fr 44px 44px 44px 44px',
                          padding: '10px 12px',
                          borderBottom: i < Math.min(daily.length, 30) - 1 ? `1px solid ${S.border}` : 'none',
                          fontFamily: S.font, fontSize: '13px',
                        }}>
                          <span style={{ color: S.text, fontWeight: 500 }}>
                            {FEATURE_EMOJI[r.feature_type]} {FEATURE_LABELS[r.feature_type]} <span style={{ color: S.label, fontWeight: 400 }}>{r.event_date.slice(5)}</span>
                          </span>
                          <span style={{ textAlign: 'right', color: S.info, fontWeight: 600 }}>{r.landing_visits}</span>
                          <span style={{ textAlign: 'right', color: S.text, fontWeight: 600 }}>{r.share_clicks}</span>
                          <span style={{ textAlign: 'right', color: S.primary, fontWeight: 600 }}>{r.sajugpt_link_clicks}</span>
                          <span style={{ textAlign: 'right', color: S.green, fontWeight: 600 }}>{r.referral_unique_users}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ═══ 공유 분석 ═══ */}
              {tab === 'share' && (
                <>
                  <SectionTitle>공유 방법별 분포</SectionTitle>
                  {shareMethodData.length === 0 ? <EmptyState /> : (
                    <>
                      <div style={{ backgroundColor: S.card, borderRadius: '16px', padding: '16px 8px 8px' }}>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={shareMethodData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis type="number" tick={{ fontSize: 11, fontFamily: S.font }} />
                            <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11, fontFamily: S.font }} />
                            <Tooltip contentStyle={{ fontFamily: S.font, fontSize: '13px', borderRadius: '8px' }} />
                            <Legend wrapperStyle={{ fontFamily: S.font, fontSize: '11px' }} />
                            <Bar dataKey="카카오" stackId="a" fill="#FEE500" />
                            <Bar dataKey="링크 복사" stackId="a" fill="#3B82F6" />
                            <Bar dataKey="네이티브" stackId="a" fill="#10B981" />
                            <Bar dataKey="이미지 저장" stackId="a" fill="#EC4899" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* 테이블 */}
                      <div style={{ backgroundColor: S.card, borderRadius: '16px', overflow: 'hidden', marginTop: '12px' }}>
                        <div style={{
                          display: 'grid', gridTemplateColumns: '1fr 50px 50px 50px 50px 50px',
                          padding: '10px 12px', borderBottom: `1px solid ${S.border}`,
                          fontFamily: S.font, fontSize: '10px', fontWeight: 600, color: S.label,
                        }}>
                          <span>기능</span>
                          <span style={{ textAlign: 'right' }}>카카오</span>
                          <span style={{ textAlign: 'right' }}>복사</span>
                          <span style={{ textAlign: 'right' }}>공유</span>
                          <span style={{ textAlign: 'right' }}>저장</span>
                          <span style={{ textAlign: 'right' }}>합계</span>
                        </div>
                        {summary.sort((a, b) => b.share_clicks - a.share_clicks).map((r, i) => (
                          <div key={r.feature_type} style={{
                            display: 'grid', gridTemplateColumns: '1fr 50px 50px 50px 50px 50px',
                            padding: '10px 12px',
                            borderBottom: i < summary.length - 1 ? `1px solid ${S.border}` : 'none',
                            fontFamily: S.font, fontSize: '13px',
                          }}>
                            <span style={{ fontWeight: 500, color: S.text }}>{FEATURE_EMOJI[r.feature_type]} {FEATURE_LABELS[r.feature_type]}</span>
                            <span style={{ textAlign: 'right', fontWeight: 600 }}>{r.share_kakao}</span>
                            <span style={{ textAlign: 'right', fontWeight: 600 }}>{r.share_clipboard}</span>
                            <span style={{ textAlign: 'right', fontWeight: 600 }}>{r.share_native}</span>
                            <span style={{ textAlign: 'right', fontWeight: 600 }}>{r.share_image_save}</span>
                            <span style={{ textAlign: 'right', fontWeight: 700, color: S.primary }}>{r.share_clicks}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}

              {/* ═══ 전환율 ═══ */}
              {tab === 'conversion' && (
                <>
                  <SectionTitle>공유 → 레퍼럴 → 사주GPT 전환</SectionTitle>
                  {conversionData.length === 0 ? <EmptyState /> : conversionData.map((r, i) => (
                    <div key={i} style={{
                      backgroundColor: S.card, borderRadius: '16px', padding: '16px',
                      marginBottom: '8px',
                    }}>
                      <p style={{ fontFamily: S.font, fontSize: '15px', fontWeight: 600, letterSpacing: '-0.3px', color: S.text, marginBottom: '12px' }}>
                        {r.emoji} {r.name}
                      </p>

                      {/* 퍼널 바 */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '12px' }}>
                        <div style={{
                          flex: Math.max(r.landings, 1), height: '28px', borderRadius: '6px',
                          backgroundColor: S.info, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          minWidth: '36px',
                        }}>
                          <span style={{ fontFamily: S.font, fontSize: '11px', fontWeight: 700, color: '#fff' }}>{r.landings}</span>
                        </div>
                        <span style={{ fontFamily: S.font, fontSize: '10px', color: S.label }}>→</span>
                        <div style={{
                          flex: Math.max(r.shareClicks, 0.5), height: '28px', borderRadius: '6px',
                          backgroundColor: S.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          minWidth: '36px',
                        }}>
                          <span style={{ fontFamily: S.font, fontSize: '11px', fontWeight: 700, color: '#fff' }}>{r.shareClicks}</span>
                        </div>
                        <span style={{ fontFamily: S.font, fontSize: '10px', color: S.label }}>→</span>
                        <div style={{
                          flex: Math.max(r.referralUsers, 0.2), height: '28px', borderRadius: '6px',
                          backgroundColor: S.green, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          minWidth: '36px',
                        }}>
                          <span style={{ fontFamily: S.font, fontSize: '11px', fontWeight: 700, color: '#fff' }}>{r.referralUsers}</span>
                        </div>
                        <span style={{ fontFamily: S.font, fontSize: '10px', color: S.label }}>→</span>
                        <div style={{
                          flex: Math.max(r.gptClicks, 0.1), height: '28px', borderRadius: '6px',
                          backgroundColor: S.amber, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          minWidth: '36px',
                        }}>
                          <span style={{ fontFamily: S.font, fontSize: '11px', fontWeight: 700, color: '#fff' }}>{r.gptClicks}</span>
                        </div>
                      </div>

                      {/* 전환율 수치 */}
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div>
                          <p style={{ fontFamily: S.font, fontSize: '12px', fontWeight: 400, lineHeight: '16px', letterSpacing: '-0.24px', color: S.label }}>랜딩→공유</p>
                          <p style={{ fontFamily: S.font, fontSize: '16px', fontWeight: 600, letterSpacing: '-0.32px', color: r.shareRate > 10 ? S.green : S.text }}>
                            {r.shareRate}%
                          </p>
                        </div>
                        <div>
                          <p style={{ fontFamily: S.font, fontSize: '12px', fontWeight: 400, lineHeight: '16px', letterSpacing: '-0.24px', color: S.label }}>공유→레퍼럴</p>
                          <p style={{ fontFamily: S.font, fontSize: '16px', fontWeight: 600, letterSpacing: '-0.32px', color: r.referralRate > 10 ? S.green : S.text }}>
                            {r.referralRate}%
                          </p>
                        </div>
                        <div>
                          <p style={{ fontFamily: S.font, fontSize: '12px', fontWeight: 400, lineHeight: '16px', letterSpacing: '-0.24px', color: S.label }}>레퍼럴→GPT</p>
                          <p style={{ fontFamily: S.font, fontSize: '16px', fontWeight: 600, letterSpacing: '-0.32px', color: r.gptCtr > 5 ? S.green : S.text }}>
                            {r.gptCtr}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* ═══ 오늘 실시간 ═══ */}
              {tab === 'today' && (
                <>
                  <SectionTitle>오늘 실시간 현황</SectionTitle>
                  {today.length === 0 ? (
                    <div style={{
                      textAlign: 'center', padding: '60px 20px', fontFamily: S.font,
                      fontSize: '15px', fontWeight: 400, lineHeight: '20px',
                      letterSpacing: '-0.45px', color: S.textTertiary,
                    }}>
                      오늘은 아직 이벤트가 없습니다.
                    </div>
                  ) : (
                    <div style={{ backgroundColor: S.card, borderRadius: '16px', overflow: 'hidden' }}>
                      <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 80px 80px 50px',
                        padding: '10px 12px', borderBottom: `1px solid ${S.border}`,
                        fontFamily: S.font, fontSize: '11px', fontWeight: 500, letterSpacing: '-0.22px', color: S.label,
                      }}>
                        <span>기능</span>
                        <span>이벤트</span>
                        <span>방법</span>
                        <span style={{ textAlign: 'right' }}>횟수</span>
                      </div>
                      {today.map((r, i) => (
                        <div key={i} style={{
                          display: 'grid', gridTemplateColumns: '1fr 80px 80px 50px',
                          padding: '10px 12px',
                          borderBottom: i < today.length - 1 ? `1px solid ${S.border}` : 'none',
                          fontFamily: S.font, fontSize: '13px',
                        }}>
                          <span style={{ fontWeight: 500, color: S.text }}>
                            {FEATURE_EMOJI[r.feature_type]} {FEATURE_LABELS[r.feature_type] ?? r.feature_type}
                          </span>
                          <span style={{ color: S.label, fontSize: '12px' }}>
                            {EVENT_TYPE_LABELS[r.event_type] ?? r.event_type}
                          </span>
                          <span style={{ color: S.label, fontSize: '12px' }}>
                            {r.share_method ? METHOD_LABELS[r.share_method] ?? r.share_method : '—'}
                          </span>
                          <span style={{ textAlign: 'right', fontWeight: 700, color: S.primary }}>{r.cnt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
