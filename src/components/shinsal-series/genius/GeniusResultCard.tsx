'use client';

import { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FADE_UP } from '@/constants/shinsalGeniusTheme';
import type { ShinsalGeniusResult } from '@/types/shinsal-series';

interface Props {
  result: ShinsalGeniusResult;
}

const CONDITION_ICON: Record<string, string> = {
  gwimun: '🌀',
  hyeonchim: '🪡',
  wonjin: '🎭',
  gwaegang: '🐯',
  siksang: '🗣️',
  pyeonin: '🔭',
};

const FORMAL_NAME: Record<string, string> = {
  gwimun: '귀문관살 (鬼門關殺)',
  hyeonchim: '현침살 (懸針殺)',
  wonjin: '원진살 (怨嗔殺)',
  gwaegang: '괴강·백호살 (魁罡·白虎)',
  siksang: '식상발달 (食傷發達)',
  pyeonin: '편인발달 (偏印發達)',
};

const SHORT_LABEL: Record<string, string> = {
  gwimun: '생각과다',
  hyeonchim: '팩폭러',
  wonjin: '감정꼬임',
  gwaegang: '반골기질',
  siksang: '표현과다',
  pyeonin: '덕후기질',
};

const GENE_SUBTITLE: Record<string, string> = {
  gwimun: '새벽 2시에 "우주 끝엔 뭐가 있을까" 진지하게 고민함',
  hyeonchim: '틀린 말은 절대 안 하는데, 들으면 뼈가 와작코 내려앉음',
  wonjin: '"쟤 왜 저러지?" 하다가 어느새 스며들어 있는 애증 봇',
  gwaegang: '평소엔 보살인데 건드리면 그날로 바로 전투력 맥스 찍음',
  siksang: '머릿속에 떠오른 걸 0.1초 만에 입 밖으로 내뱉어야 직성이 풀림',
  pyeonin: '한 분야에 꽂히면 위키백과를 능가하는 박사급 인간 지식창고',
};

const GENE_STORY: Record<string, string> = {
  gwimun: '남들은 그냥 스쳐 지나가는 사소한 포인트에 엄청나게 과몰입합니다. 가끔은 이 상상력이 예술이나 창작으로 터져 나와 대박을 치지만, 혼자서 북치고 장구치다 영혼이 탈탈 털릴 때도 많아요.',
  hyeonchim: '눈치 없어서 바른 소릴 하는 게 아니라, 상대의 급소를 찌르는 정확한 논리를 장착하고 있습니다. 돌려 말하는 재주가 없어서 본의 아니게 주변 사람들을 덜덜 떨게 만드는 재주가 있어요.',
  wonjin: '상대방이 미치도록 좋다가도 갑자기 뚝 식어버리는 마성의 감정 롤러코스터를 타요. 이유 없이 상대의 행동이 거슬리다가도, 막상 없으면 또 신경 쓰이는 복잡미묘한 관계를 자주 만듭니다.',
  gwaegang: '평소에는 유순하고 다정하게 잘 맞춰주지만, 내 피 같은 선을 넘거나 불합리한 상황을 마주하면 눈이 뒤집힙니다. 굽히고 들어가기보단 차라리 판을 갈아엎는 게 편한 상남자·상여자 재질.',
  siksang: '아이디어가 솟구치면 가만히 앉아있질 못합니다. 생각한 즉시 행동으로 옮겨야 직성이 풀리고, 내 안에 있는 에너지를 밖으로 뿜어내야 비로소 살아있음을 느끼는 타입이에요.',
  pyeonin: '대중적인 것보다 마이너하고 깊이 있는 장르에 환장합니다. 한번 파기 시작하면 끝장을 봐야 직성이 풀려서, 주변에서 "도대체 그걸 왜 알아?" 하는 소릴 자주 듣는 덕후 오브 덕후.',
};

const GENE_MEME: Record<string, string> = {
  gwimun: '"도대체 평소에 머릿속으로 무슨 생각을 하는 거야...?"',
  hyeonchim: '"아니, 내 말이 틀렸어? 사실만 말한 건데 왜 그래..."',
  wonjin: '"좋아하는 건 맞는데, 솔직히 좀 피곤하기도 하고..."',
  gwaegang: '"오늘 진짜 마지막 경고다. 더 이상은 나도 참아줄 생각이 없어."',
  siksang: '"이거 완전 대박 아니냐? 일단 당장 질러보자고!"',
  pyeonin: '"잠깐만요, 제가 그쪽 분야는 조금 잘 아는데 말이죠..."',
};

const SHINSAL_ORDER = ['gwimun', 'hyeonchim', 'wonjin', 'gwaegang', 'siksang', 'pyeonin'];

const MONO = "'JetBrains Mono', 'Chakra Petch', 'Courier New', monospace";
const MAIN_FONT = "var(--font-jandari), 'Pretendard', sans-serif";

// 🌙 다크 테마 기반 색상 정의 (CommentBoard의 DARK_GRAY 감성 적용)
const DARK_GRAY = {
  text: '#FFFFFF',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  panel: 'rgba(20, 20, 24, 0.92)', // 어두운 배경에 맞는 모던 다크 패널
  cardBg: 'rgba(255, 255, 255, 0.04)',
  border: 'rgba(255, 255, 255, 0.12)',
};

const CornerBrackets = ({ color, inset = 6 }: { color: string; inset?: number }) => (
  <>
    <div style={{ position: 'absolute', top: inset, left: inset, width: 10, height: 10, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
    <div style={{ position: 'absolute', top: inset, right: inset, width: 10, height: 10, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
    <div style={{ position: 'absolute', bottom: inset, left: inset, width: 10, height: 10, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
    <div style={{ position: 'absolute', bottom: inset, right: inset, width: 10, height: 10, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
  </>
);

const GeniusResultCard = forwardRef<HTMLDivElement, Props>(({ result }, ref) => {
  const { crazyScore, conditions } = result;
  const [viewMode, setViewMode] = useState<'summary' | 'detail'>('summary');
  const matched = conditions.filter((c) => c.exists);
  const [activeGeneId, setActiveGeneId] = useState<string>(matched.length > 0 ? matched[0].id : 'gwimun');

  const accent = '#E024FF';
  const accent2 = '#FF24A9';
  const accentSoft = '#E024FF25';

  const getShinsalScore = (id: string) => {
    const found = conditions.find((c) => c.id === id);
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return found?.exists ? 75 + (hash % 21) : 20 + (hash % 35);
  };

  const shinsalScores = SHINSAL_ORDER.map((id) => ({
    id,
    name: SHORT_LABEL[id],
    score: getShinsalScore(id),
    exists: conditions.find((c) => c.id === id)?.exists || false,
  }));

  const avgScore = Math.round(shinsalScores.reduce((sum, s) => sum + s.score, 0) / shinsalScores.length);

  const center = 130;
  const radius = 92;

  const points = shinsalScores
    .map((item, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const ratio = item.score / 100;
      return `${center + radius * ratio * Math.cos(angle)},${center + radius * ratio * Math.sin(angle)}`;
    })
    .join(' ');

  const getPolygonPoints = (ratio: number) =>
    SHINSAL_ORDER.map((_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      return `${center + radius * ratio * Math.cos(angle)},${center + radius * ratio * Math.sin(angle)}`;
    }).join(' ');

  const currentGeneData = conditions.find((c) => c.id === activeGeneId);

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden w-full max-w-lg md:max-w-2xl mx-auto"
      style={{
        backgroundImage: `url('/shinsal-series/images/background-image.png')`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: DARK_GRAY.text,
        boxShadow: `0 0 45px ${accent}30`,
        fontFamily: MAIN_FONT,
      }}
    >
      <div style={{ padding: '32px 28px 32px 28px', minHeight: '800px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {viewMode === 'summary' && (
            <motion.div variants={FADE_UP} initial="hidden" animate="visible" style={{ marginBottom: '30px', paddingLeft: '2px', textAlign: 'center' }}>
              <div style={{ width: '100%', maxWidth: '240px', margin: '0 auto 10px auto' }}>
                <motion.img
                  src="/shinsal-series/images/shinsal_subtitle.png"
                  alt="Shinsal Title"
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  animate={{
                    filter: [
                      `drop-shadow(0 0 6px ${accent}40)`,
                      `drop-shadow(0 0 14px ${accent}80)`,
                      `drop-shadow(0 0 6px ${accent}40)`,
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              <div style={{ width: '100%', maxWidth: '280px', margin: '10px auto 20px auto' }}>
                <motion.img
                  src="/shinsal-series/images/shinsal_title.png"
                  alt="사주 속 숨겨진 천재성 분석 - 내 안에 숨은 괴짜 천재력"
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  animate={{
                    filter: [
                      `drop-shadow(0 0 8px ${accent}50)`,
                      `drop-shadow(0 0 16px ${accent}90)`,
                      `drop-shadow(0 0 8px ${accent}50)`,
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              <div style={{ width: '100%', maxWidth: '190px', margin: '16px auto 0 auto', position: 'relative' }}>
                <motion.img
                  src="/shinsal-series/images/genius_brain.png"
                  alt="Genius Brain"
                  animate={{
                    scale: [1, 1.04, 1, 1.06, 1],
                    filter: [
                      `drop-shadow(0 0 10px ${accent}40)`,
                      `drop-shadow(0 0 20px ${accent}80)`,
                      `drop-shadow(0 0 10px ${accent}40)`,
                      `drop-shadow(0 0 25px ${accent}99)`,
                      `drop-shadow(0 0 10px ${accent}40)`,
                    ],
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {viewMode === 'summary' && (
              <motion.div key="summary" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                {/* 메인 스코어 박스 */}
                <motion.div
                  variants={FADE_UP}
                  initial="hidden"
                  animate="visible"
                  style={{
                    position: 'relative',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.3fr',
                    gap: '12px',
                    border: `2px solid ${accent}`,
                    backgroundColor: DARK_GRAY.panel,
                    padding: '30px 16px',
                    marginTop: '15px',
                    marginBottom: '20px',
                    boxShadow: `inset 0 0 15px ${accent}20, 0 0 20px ${accent}30`,
                  }}
                >
                  <CornerBrackets color={accent} inset={4} />
                  <div className="flex flex-col justify-center">
                    <div style={{ fontFamily: MONO, fontSize: '10px', fontWeight: 900, color: accent, letterSpacing: '1.5px', marginBottom: '4px' }}>
                      🔥 TOTAL POWER
                    </div>
                    <div style={{ 
                      fontFamily: MAIN_FONT, 
                      fontSize: '14px', 
                      fontWeight: 800, 
                      color: DARK_GRAY.textSecondary, 
                      letterSpacing: '0.5px',
                      marginTop: '8px', 
                      marginBottom: '4px'
                    }}>
                      나의 종합 천재 지수
                    </div>
                    <div style={{ 
                      fontFamily: MAIN_FONT, 
                      fontSize: '46px', 
                      fontWeight: 950, 
                      color: DARK_GRAY.text, 
                      lineHeight: 1, 
                      letterSpacing: '-1px',
                      textShadow: `0 0 20px ${accent}, 0 0 35px ${accent2}` 
                    }}>
                      {crazyScore}<span style={{ fontFamily: MAIN_FONT, fontSize: '20px', fontWeight: 900, color: accent, marginLeft: '2px' }}>점</span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between" style={{ position: 'relative', borderLeft: `1px solid ${accent}40`, paddingLeft: '14px' }}>
                    <div className="flex justify-between items-center" style={{ fontFamily: MONO, fontSize: '9.5px', color: `${accent}cc`, fontWeight: 700 }}>
                      <span>LEVEL: MAX</span>
                      <span style={{ color: DARK_GRAY.textTertiary }}>UNIQUE</span>
                    </div>
                    <div style={{ height: '36px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '0 4px', border: `1px solid ${accent}30` }}>
                      <svg width="100%" height="28" viewBox="0 0 100 28" preserveAspectRatio="none">
                        <path
                          d="M0,14 L8,24 L16,4 L24,26 L32,8 L40,22 L48,2 L56,25 L64,10 L72,20 L80,5 L88,24 L96,14 L100,14"
                          fill="none"
                          stroke={accent}
                          strokeWidth="2.5"
                          style={{ filter: `drop-shadow(0 0 6px ${accent})` }}
                        />
                      </svg>
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: '8.5px', color: DARK_GRAY.textTertiary, textAlign: 'right', letterSpacing: '0.8px' }}>STATUS: 1% UNIQUE TASTE</div>
                  </div>
                </motion.div>

                {/* 활성화된 성향 개수 안내 */}
                <motion.div
                  variants={FADE_UP}
                  initial="hidden"
                  animate="visible"
                  style={{
                    position: 'relative',
                    border: `1.5px solid ${accent}`,
                    backgroundColor: DARK_GRAY.panel,
                    padding: '16px 18px',
                    marginBottom: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <CornerBrackets color={accent} inset={4} />
                  <div>
                    <div style={{ 
                      fontFamily: MAIN_FONT, 
                      fontSize: '15px', 
                      fontWeight: 900, 
                      color: DARK_GRAY.text, 
                      letterSpacing: '0.5px'
                    }}>
                      내 사주에서 발견된 핵심 기질
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontFamily: MONO, fontSize: '26px', fontWeight: 900, color: accent, textShadow: `0 0 12px ${accent}`, lineHeight: 1 }}>
                      {matched.length}<span style={{ fontFamily: MAIN_FONT, fontSize: '13px', fontWeight: 800, color: DARK_GRAY.text, marginLeft: '2px' }}>개</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={FADE_UP} initial="hidden" animate="visible">
                  <motion.button
                    whileHover={{ scale: 1.01, boxShadow: `0 0 25px ${accent}50` }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      if (matched.length > 0) setActiveGeneId(matched[0].id);
                      setViewMode('detail');
                    }}
                    style={{
                      position: 'relative',
                      width: '100%',
                      padding: '16px 18px',
                      background: 'linear-gradient(90deg, #E024FF 0%, #FF24A9 100%)',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#070308',
                      fontSize: '16px',
                      fontWeight: 950,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 15px ${accent}40`,
                      fontFamily: MAIN_FONT,
                      letterSpacing: '0.5px',
                    }}
                  >
                    <span>6대 성향 분석표 자세히 보기 &rarr;</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}

            {viewMode === 'detail' && (
              <motion.div key="detail" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                  <span style={{ color: accent, fontSize: '9.5px', fontWeight: 900, fontFamily: MONO, letterSpacing: '1px' }}>6-AXIS ANALYSIS</span>
                </div>

                <div className="flex items-center justify-between" style={{ marginBottom: '10px', padding: '0 4px' }}>
                  <div>
                    <div style={{ width: '220px', maxWidth: '100%' }}>
                      <motion.img
                        src="/shinsal-series/images/genius_title.png"
                        alt="나의 6대 천재성 밸런스"
                        style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
                        animate={{
                          filter: [
                            `drop-shadow(0 0 6px ${accent}40)`,
                            `drop-shadow(0 0 12px ${accent}80)`,
                            `drop-shadow(0 0 6px ${accent}40)`,
                          ],
                        }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </div>
                    <div style={{ fontFamily: MAIN_FONT, color: DARK_GRAY.textTertiary, fontSize: '13px' }}>항목을 누르면 상세 설명과 밈을 볼 수 있어요</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: MONO, fontSize: '9px', color: accent, letterSpacing: '1px' }}>AVERAGE</div>
                    <div style={{ fontFamily: MONO, fontSize: '30px', marginTop: '10px', fontWeight: 900, color: accent, textShadow: `0 0 10px ${accent}90`, lineHeight: 1 }}>
                      {avgScore}점
                    </div>
                  </div>
                </div>

                {/* 레이더 차트 영역 */}
                <div style={{ position: 'relative', width: '260px', height: '260px', margin: '0 auto 16px auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${accent}30, transparent 65%)` }} />

                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: DARK_GRAY.panel,
                      borderRadius: '50%',
                      border: `2px solid ${accent}70`,
                      boxShadow: `0 0 30px ${accent}35, inset 0 0 25px ${accent}15`,
                    }}
                  >
                    <CornerBrackets color={accent} inset={-2} />
                  </div>

                  <svg width="260" height="260" style={{ position: 'relative', display: 'block', margin: '0 auto' }}>
                    <defs>
                      <radialGradient id="hexFill" cx="50%" cy="50%" r="65%">
                        <stop offset="0%" stopColor={accent2} stopOpacity="0.55" />
                        <stop offset="100%" stopColor={accent} stopOpacity="0.18" />
                      </radialGradient>
                    </defs>

                    <polygon points={getPolygonPoints(1)} fill="none" stroke={accent} strokeWidth="1" opacity="0.4" />
                    <polygon points={getPolygonPoints(0.66)} fill="none" stroke={accent} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.28" />
                    <polygon points={getPolygonPoints(0.33)} fill="none" stroke={accent} strokeWidth="0.8" opacity="0.2" />

                    {SHINSAL_ORDER.map((_, i) => {
                      const angle = (Math.PI / 3) * i - Math.PI / 2;
                      const x2 = center + radius * Math.cos(angle);
                      const y2 = center + radius * Math.sin(angle);
                      return <line key={i} x1={center} y1={center} x2={x2} y2={y2} stroke={accent} strokeWidth="0.8" opacity="0.28" />;
                    })}

                    <motion.polygon
                      points={points}
                      fill="url(#hexFill)"
                      stroke={accent2}
                      strokeWidth="2.5"
                      style={{ filter: `drop-shadow(0 0 10px ${accent})` }}
                      animate={{ opacity: [0.85, 1, 0.85] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {shinsalScores.map((item, i) => {
                      const angle = (Math.PI / 3) * i - Math.PI / 2;
                      const ratio = item.score / 100;
                      const x = center + radius * ratio * Math.cos(angle);
                      const y = center + radius * ratio * Math.sin(angle);
                      const isActive = activeGeneId === item.id;
                      const dotR = 3.5 + (item.score / 100) * 3.5;
                      return (
                        <g key={item.id}>
                          {isActive && (
                            <motion.circle
                              cx={x} cy={y} r={dotR + 6}
                              fill="none" stroke={accent2} strokeWidth="1.5"
                              animate={{ r: [dotR + 4, dotR + 10, dotR + 4], opacity: [0.8, 0, 0.8] }}
                              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                            />
                          )}
                          <circle
                            cx={x} cy={y} r={dotR}
                            fill={item.exists ? accent2 : '#ffffff55'}
                            stroke="#fff" strokeWidth="1"
                            style={{ filter: item.exists ? `drop-shadow(0 0 6px ${accent2})` : 'none', cursor: 'pointer' }}
                            onClick={() => setActiveGeneId(item.id)}
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {shinsalScores.map((item, i) => {
                    const angle = (Math.PI / 3) * i - Math.PI / 2;
                    const labelRadius = 118;
                    const isActive = activeGeneId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setActiveGeneId(item.id)}
                        style={{
                          position: 'absolute',
                          left: `calc(50% + ${labelRadius * Math.cos(angle)}px)`,
                          top: `calc(50% + ${labelRadius * Math.sin(angle)}px)`,
                          transform: 'translate(-50%, -50%)',
                          textAlign: 'center',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          background: isActive ? 'linear-gradient(90deg, #E024FF 0%, #FF24A9 100%)' : 'rgba(20,20,24,0.9)',
                          border: `1px solid ${isActive ? accent2 : accent + '60'}`,
                          whiteSpace: 'nowrap',
                          zIndex: 2,
                          boxShadow: isActive ? `0 0 14px ${accent}70` : 'none',
                        }}
                      >
                        <div style={{ fontSize: '12px', lineHeight: 1 }}>{CONDITION_ICON[item.id]}</div>
                        <div style={{ fontFamily: MAIN_FONT, fontSize: '12px', fontWeight: 950, color: isActive ? '#070308' : DARK_GRAY.text, marginTop: '2px' }}>{item.name}</div>
                      </div>
                    );
                  })}
                </div>

                {/* 하단 탭 버튼들 */}
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {shinsalScores.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveGeneId(item.id)}
                      style={{
                        flexShrink: 0,
                        padding: '7px 10px',
                        border: `1px solid ${activeGeneId === item.id ? accent : DARK_GRAY.border}`,
                        background: activeGeneId === item.id ? accentSoft : DARK_GRAY.cardBg,
                        color: activeGeneId === item.id ? accent : DARK_GRAY.textSecondary,
                        fontSize: '11px',
                        marginTop: '20px',
                        fontFamily: MAIN_FONT,
                        fontWeight: 950,
                        cursor: 'pointer',
                      }}
                    >
                      {CONDITION_ICON[item.id]} {item.name}
                    </button>
                  ))}
                </div>

                {/* 선택된 기질 상세 카드 */}
                {currentGeneData && (
                  <motion.div
                    key={currentGeneData.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ position: 'relative', marginTop: '12px', padding: '16px', background: DARK_GRAY.panel, border: `1px solid ${accent}50` }}
                  >
                    <CornerBrackets color={accent} inset={5} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '42px', height: '40px', background: accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '21px', border: `1px solid ${accent}40` }}>
                        {CONDITION_ICON[currentGeneData.id]}
                      </div>
                      <div>
                        <div style={{ color: accent, fontSize: '11px', fontWeight: 950, fontFamily: MAIN_FONT }}>{FORMAL_NAME[currentGeneData.id]}</div>
                        <div style={{ fontFamily: MAIN_FONT, color: DARK_GRAY.text, fontSize: '14.5px', fontWeight: 950, marginTop: '2px', lineHeight: 1.3 }}>{GENE_SUBTITLE[currentGeneData.id]}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: '12px', padding: '12px', background: accentSoft, borderLeft: `2px solid ${accent}` }}>
                      <div style={{ fontFamily: MAIN_FONT, color: accent, fontSize: '11px', fontWeight: 950, letterSpacing: '0.5px' }}>🔍 종족 특성 &amp; 행동 패턴</div>
                      <div style={{ fontFamily: MAIN_FONT, color: DARK_GRAY.textSecondary, fontSize: '13px', fontWeight: 700, marginTop: '4px', lineHeight: 1.5 }}>{GENE_STORY[currentGeneData.id]}</div>
                    </div>

                    <div style={{ marginTop: '12px', padding: '10px 12px', background: DARK_GRAY.cardBg, border: `1px solid ${DARK_GRAY.border}`, color: '#ffb9ff', fontFamily: MAIN_FONT, fontSize: '12px', fontWeight: 700, lineHeight: 1.4 }}>
                      💬 평소 자주 듣는 생각/반응: {GENE_MEME[currentGeneData.id]}
                    </div>

                    <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '11px', fontWeight: 950, fontFamily: MAIN_FONT, color: currentGeneData.exists ? accent : DARK_GRAY.textTertiary, letterSpacing: '0.5px' }}>
                      {currentGeneData.exists ? '🔥 내 사주에 진하게 발현된 활성 기질입니다' : '💤 현재는 잠재적으로 숨어 있는 비활성 기질입니다'}
                    </div>
                  </motion.div>
                )}

                <button
                  onClick={() => setViewMode('summary')}
                  style={{ width: '100%', marginTop: '14px', padding: '12px', background: 'transparent', color: DARK_GRAY.text, fontSize: '12px', fontWeight: 900, border: `1px solid ${DARK_GRAY.border}`, cursor: 'pointer', fontFamily: MAIN_FONT, letterSpacing: '1px' }}
                >
                  ◀ 요약 화면으로 돌아가기
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
});

GeniusResultCard.displayName = 'GeniusResultCard';
export default GeniusResultCard;