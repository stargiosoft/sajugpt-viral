'use client';

const STAR_DICTIONARY: Record<string, any> = {
  '자미': { 분류: '14정성', 오행: '음토', 특성: '제왕, 관록, 존귀, 통솔, 체면' },
  '천기': { 분류: '14정성', 오행: '음목', 특성: '모신책사, 지혜, 형제, 임기응변' },
  '태양': { 분류: '14정성', 오행: '양화', 특성: '명예, 관록, 광명정대, 공직' },
  '무곡': { 분류: '14정성', 오행: '음금', 특성: '재백, 결단력, 강인함, 고독' },
  '천동': { 분류: '14정성', 오행: '양수', 특성: '복덕, 온화, 안락, 수명연장' },
  '염정': { 분류: '14정성', 오행: '음화', 특성: '차도화, 관록, 사교, 승부근성' },
  '천부': { 분류: '14정성', 오행: '양토', 특성: '재고(財庫), 자비, 안정지향, 보수' },
  '태음': { 분류: '14정성', 오행: '음수', 특성: '재백, 낭만, 전택, 예술적 기질' },
  '탐랑': { 분류: '14정성', 오행: '양목', 특성: '정도화, 화복, 물욕, 기호, 횡발' },
  '거문': { 분류: '14정성', 오행: '음수', 특성: '암성, 시비구설, 비판, 구변' },
  '천상': { 분류: '14정성', 오행: '양수', 특성: '인성(印星), 신용, 봉사, 의리' },
  '천량': { 분류: '14정성', 오행: '양토', 특성: '음(蔭)/수(壽), 원칙, 흉을 길로 화해' },
  '칠살': { 분류: '14정성', 오행: '음금', 특성: '장성, 위엄, 결단, 고독, 외로움' },
  '파군': { 분류: '14정성', 오행: '음수', 특성: '모(耗), 파괴와 창조, 변동, 돌파' },
  '좌보': { 분류: '보좌길성', 오행: '양토', 특성: '직접적이고 적극적인 평배 귀인의 조력' },
  '우필': { 분류: '보좌길성', 오행: '음수', 특성: '간접적이고 숨은 귀인의 조력' },
  '문창': { 분류: '보좌길성', 오행: '음금', 특성: '정통 학문, 문서, 명성, 학위' },
  '문곡': { 분류: '보좌길성', 오행: '음수', 특성: '구류술사, 기예, 예체능, 구변' },
  '천괴': { 분류: '보좌길성', 오행: '양화', 특성: '양의 귀인, 눈에 띄는 실질적 혜택' },
  '천월': { 분류: '보좌길성', 오행: '음화', 특성: '음의 귀인, 보이지 않는 곳의 천거' },
  '록존': { 분류: '보좌길성', 오행: '음토', 특성: '재물, 안정, 보수성, 보호' },
  '천마': { 분류: '보좌길성', 오행: '양화', 특성: '이동, 변동, 역마, 활동력 증가' },
  '경양': { 분류: '육살/형성', 오행: '양금', 특성: '폭력, 형벌, 투쟁, 경쟁, 수술' },
  '타라': { 분류: '육살/기성', 오행: '음금', 특성: '지연, 암투, 시비, 우울증' },
  '화성': { 분류: '육살성', 오행: '양화', 특성: '갑작스러운 폭발, 재난, 파동' },
  '영성': { 분류: '육살성', 오행: '음화', 특성: '내부의 분노, 집착, 은밀한 파동' },
  '지공': { 분류: '육살/공망', 오행: '음화', 특성: '반전통적 사상, 정신적 공허, 손모' },
  '지겁': { 분류: '육살/공망', 오행: '양화', 특성: '물질적 타격, 횡파, 좌절' },
  '천형': { 분류: '살/형요성', 오행: '양화', 특성: '형벌, 고독, 의료, 엄격한 규율' },
  '천요': { 분류: '도화/살성', 오행: '음수', 특성: '풍류, 도화, 기예, 교태' },
  '홍란': { 분류: '도화성', 오행: '음수', 특성: '혼인, 희경사, 도화' },
  '천희': { 분류: '도화성', 오행: '양수', 특성: '생육, 희경사, 기쁨' },
  '함지': { 분류: '도화성', 오행: '음수', 특성: '불량도화, 주색, 호색' },
  '대모': { 분류: '모성(손재)', 오행: '양화', 특성: '손재, 소모, 도화성 동궁 시 주색 파재' },
  '절공': { 분류: '공망성', 오행: '-', 특성: '중단, 단절, 허무' },
  '순공': { 분류: '공망성', 오행: '-', 특성: '허무, 공허, 외로움' },
  '천공': { 분류: '공망성', 오행: '음화', 특성: '고독, 재물의 공허함' },
  '은광': { 분류: '귀인성', 오행: '양화', 특성: '영예, 원호, 광채' },
  '천귀': { 분류: '귀인성', 오행: '양토', 특성: '성명, 지위, 조력' },
  '삼태': { 분류: '귀인성', 오행: '양토', 특성: '지위, 명예, 지원' },
  '팔좌': { 분류: '귀인성', 오행: '음토', 특성: '지위, 명예, 지원' },
  '용지': { 분류: '귀인성', 오행: '양수', 특성: '재예, 총명, 기예, 무(武)적 속성' },
  '봉각': { 분류: '귀인성', 오행: '양토', 특성: '문예, 총명, 지위, 문(文)적 속성' },
  '고진': { 분류: '고극성', 오행: '양화', 특성: '고독, 형극, 무정, 육친궁 흉' },
  '과숙': { 분류: '고극성', 오행: '음화', 특성: '고독, 무정, 육친궁 흉' },
  '천월(天月)': { 분류: '질병성', 오행: '-', 특성: '만성질병, 유행병' },
  '태보': { 분류: '제길성', 오행: '양토', 특성: '지위, 명예, 보호' },
  '봉고': { 분류: '제길성', 오행: '음토', 특성: '지위, 표창, 칭송' },
  '화개': { 분류: '제길성', 오행: '양목', 특성: '철리, 종교, 고독, 고상함' }
};

const PAIRED_STARS = [
  ['자미','천부'], ['자미','천상'], ['천부','천상'], ['태양','태음'], ['문창','문곡'],
  ['좌보','우필'], ['경양','타라'], ['화성','영성'], ['천괴','천월'], ['지공','지겁'],
  ['삼태','팔좌'], ['천곡','천허'], ['용지','봉각'], ['홍란','천희'], ['고신','과수'],
  ['은광','천귀'], ['록존','화록'], ['화록','화권'], ['화록','화과'], ['화권','화과'],
  ['화록','천마'], ['록존','천마']
];

interface DetailProps {
  viewMode: 'base' | 'daehan' | 'yunyeon';
  activeDaehanData: any;
  baseSihwaStars: string[];
  daehanSihwaStars: string[];
  yunyeonSihwaStars: string[];
  daehanGan: string;
  basePalaces: Record<string, string>;
  daehanPalaces: Record<string, string>;
  yunyeonPalaces: Record<string, string>;
  luckInfo: any;
  selectedYunyeon: any;
  onYunyeonSelect: (yn: any) => void;
  gungData: any;
  PALACE_NAMES: string[];
  JIJI_LIST: string[];
}

export default function ZiweiDetailTable({ viewMode, activeDaehanData, baseSihwaStars, daehanSihwaStars, yunyeonSihwaStars, daehanGan, basePalaces, daehanPalaces, yunyeonPalaces, luckInfo, selectedYunyeon, onYunyeonSelect, gungData, PALACE_NAMES, JIJI_LIST }: DetailProps) {
  
  const currentPalaces = viewMode === 'base' ? basePalaces : viewMode === 'daehan' ? daehanPalaces : yunyeonPalaces;
  const currentSihwaStars = viewMode === 'base' ? baseSihwaStars : viewMode === 'daehan' ? daehanSihwaStars : yunyeonSihwaStars;
  const modeTitle = viewMode === 'base' ? '선천' : viewMode === 'daehan' ? '대한' : '유년';
  const modeColor = viewMode === 'base' ? 'text-blue-900' : viewMode === 'daehan' ? 'text-green-800' : 'text-orange-700';
  const modeBorder = viewMode === 'base' ? 'border-blue-900' : viewMode === 'daehan' ? 'border-green-800' : 'border-orange-700';

  const getStarsForJiji = (pos: string) => {
    if (!gungData[pos]) return [];
    const g = gungData[pos];
    const stars = [
      ...g['성요배치']['십사정성'], ...g['성요배치']['보좌길성'], ...g['성요배치']['살성_및_형요'],
      ...(g['성요배치']['기타_잡성']['도화성'] || []), ...(g['성요배치']['기타_잡성']['공망성계'] || []),
      ...(g['성요배치']['기타_잡성']['제길성'] || []), ...(g['성요배치']['기타_잡성']['제흉성'] || []),
      ...(g['성요배치']['기타_잡성']['백관조공성'] || [])
    ].map(s => typeof s === 'string' ? s : s.명칭);

    if (currentSihwaStars.length > 0) {
      stars.forEach(s => {
        if (s === currentSihwaStars[0]) stars.push('화록');
        if (s === currentSihwaStars[1]) stars.push('화권');
        if (s === currentSihwaStars[2]) stars.push('화과');
        if (s === currentSihwaStars[3]) stars.push('화기');
      });
    }
    return stars;
  };

  const rankPairs = (jiji: string) => {
    const idx = JIJI_LIST.indexOf(jiji);
    const opp = JIJI_LIST[(idx + 6) % 12];
    const tri1 = JIJI_LIST[(idx + 4) % 12];
    const tri2 = JIJI_LIST[(idx + 8) % 12];
    const left = JIJI_LIST[(idx + 1) % 12];
    const right = JIJI_LIST[(idx + 11) % 12];

    const sBase = getStarsForJiji(jiji);
    const sOpp = getStarsForJiji(opp);
    const sTri1 = getStarsForJiji(tri1);
    const sTri2 = getStarsForJiji(tri2);
    const sLeft = getStarsForJiji(left);
    const sRight = getStarsForJiji(right);

    const has = (arr: string[], target: string) => arr.includes(target);
    const results: { pair: string, rank: number, desc: string }[] = [];

    PAIRED_STARS.forEach(([A, B]) => {
      const aBase = has(sBase, A), bBase = has(sBase, B);
      const aOpp = has(sOpp, A), bOpp = has(sOpp, B);
      const aTri = has(sTri1, A) || has(sTri2, A);
      const bTri = has(sTri1, B) || has(sTri2, B);
      const aHyeop = has(sLeft, A) || has(sRight, A);
      const bHyeop = has(sLeft, B) || has(sRight, B);

      let rank = 0; let desc = '';

      if (aBase && bBase) { rank = 1; desc = `동궁 (한 궁에 동시 존재)`; }
      else if (aOpp && bOpp) { rank = 2; desc = `대조 (대궁 ${opp}궁에서 동시 대조)`; }
      else if ((aBase && bOpp) || (bBase && aOpp)) { rank = 3; desc = `마주함 (본궁과 대궁 ${opp}궁에서 마주함)`; }
      else if ((has(sTri1, A) && has(sTri2, B)) || (has(sTri1, B) && has(sTri2, A)) || (aTri && bTri && A !== B)) { rank = 4; desc = `삼방 회조 (삼합궁에서 회조)`; }
      else if ((has(sLeft, A) && has(sRight, B)) || (has(sLeft, B) && has(sRight, A))) { rank = 5; desc = `협궁 (좌우 ${left}, ${right}궁에서 강력히 협함)`; }
      else if ((aBase && bTri) || (bBase && aTri)) { rank = 6; desc = `하나 본궁, 하나 삼방 회조`; }
      else if ((aOpp && bTri) || (bOpp && aTri)) { rank = 7; desc = `하나 대궁, 하나 삼방 회조`; }

      if (rank > 0) results.push({ pair: `${A}•${B}`, rank, desc });
    });

    return results.sort((a, b) => a.rank - b.rank);
  };

  const renderCategorizedStars = (data: any) => {
    if (!data) return null;
    const categorizedList: any[] = [];
    const addStars = (stars: any[], defaultCategory: string) => {
      if (!stars) return;
      stars.forEach(starObj => {
        const sName = typeof starObj === 'string' ? starObj : starObj.명칭;
        const sStr = typeof starObj === 'string' ? '' : starObj.묘왕지;
        if (!sName) return;
        const dictInfo = STAR_DICTIONARY[sName] || { 분류: defaultCategory, 오행: '-', 특성: '특성 데이터 없음' };
        categorizedList.push({ sName, sStr, ...dictInfo });
      });
    };

    addStars(data['성요배치']['십사정성'], '14정성');
    addStars(data['성요배치']['보좌길성'], '보좌/육길성');
    addStars(data['성요배치']['살성_및_형요'], '육살/형요성');
    const minor = data['성요배치']['기타_잡성'];
    if (minor) {
      addStars(minor['도화성'], '도화성');
      addStars(minor['공망성계'], '공망성');
      addStars(minor['제길성'], '잡성(길)');
      addStars(minor['제흉성'], '잡성(흉)');
    }

    if (categorizedList.length === 0) return <tr><td colSpan={4} className="border p-2 text-center text-gray-500">배치된 주요 성요가 없는 공궁입니다.</td></tr>;

    return categorizedList.map((star: any, idx: number) => (
      <tr key={idx} className="hover:bg-yellow-50 transition-colors">
        <td className="border border-gray-300 p-1.5 text-center text-gray-600 font-semibold">{star.분류}</td>
        <td className="border border-gray-300 p-1.5 text-center font-bold text-blue-900 text-[13px]">
          {star.sName} <span className="text-red-600 font-normal text-[11px]">{star.sStr ? `(${star.sStr})` : ''}</span>
        </td>
        <td className="border border-gray-300 p-1.5 text-center font-bold text-gray-700">{star.오행}</td>
        <td className="border border-gray-300 p-1.5 text-gray-700 break-keep leading-snug">{star.특성}</td>
      </tr>
    ));
  };

  return (
    <div className="mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
      <div className="flex flex-col gap-6">
        <div className={`border-b-2 pb-2 ${modeBorder}`}>
          <h3 className={`text-[16px] font-extrabold ${modeColor} tracking-tight`}>
            [{modeTitle}] 12궁 전면 분석 및 크로스체크(협/삼합 짝성)
          </h3>
          <p className="text-gray-500 text-[11px] mt-1">※ 본궁뿐만 아니라 양옆의 협궁(짝성)과 삼방사정의 간섭을 입체적으로 교차 검증합니다.</p>
        </div>

        {viewMode === 'daehan' && activeDaehanData && (
          <div className="bg-green-50 border border-green-200 p-3 rounded shadow-sm">
            <span className="block text-[13px] font-bold text-green-900 mb-2">🎯 대한 사화 (현재 10년의 성패를 좌우하는 발생 기운 / 천간: {daehanGan})</span>
            <table className="w-full text-center text-[12px] border-collapse border border-green-200 bg-white">
              <thead className="bg-green-100">
                <tr>
                  <th className="border border-green-200 p-2 text-green-800">대록 (발생/재물)</th>
                  <th className="border border-green-200 p-2 text-blue-800">대권 (권력/쟁취)</th>
                  <th className="border border-green-200 p-2 text-purple-800">대과 (명예/학문)</th>
                  <th className="border border-green-200 p-2 text-red-800">대기 (장애/집착)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-green-200 p-2 font-bold text-green-700">{activeDaehanData['대한사화']['화록']['성요']} <span className="text-gray-500 font-normal text-[10px]">({activeDaehanData['대한사화']['화록']['화입궁']}궁)</span></td>
                  <td className="border border-green-200 p-2 font-bold text-blue-700">{activeDaehanData['대한사화']['화권']['성요']} <span className="text-gray-500 font-normal text-[10px]">({activeDaehanData['대한사화']['화권']['화입궁']}궁)</span></td>
                  <td className="border border-green-200 p-2 font-bold text-purple-700">{activeDaehanData['대한사화']['화과']['성요']} <span className="text-gray-500 font-normal text-[10px]">({activeDaehanData['대한사화']['화과']['화입궁']}궁)</span></td>
                  <td className="border border-green-200 p-2 font-bold text-red-700 bg-red-50">{activeDaehanData['대한사화']['화기']['성요']} <span className="text-red-500 font-semibold text-[10px]">(선천 {gungData[activeDaehanData['대한사화']['화기']['화입궁']]['선천궁명']} 충파!)</span></td>
                </tr>
              </tbody>
            </table>
            <div className="mt-3 border-t border-green-200 pt-2">
              <span className="block text-[12px] font-bold text-green-800 mb-2">🗓️ 속해있는 유년(1년 운) 바로가기</span>
              <div className="flex flex-wrap gap-2">
                {luckInfo['유년_목록'].filter((yn: any) => activeDaehanData['연령대'][0] <= yn['나이'] && yn['나이'] <= activeDaehanData['연령대'][1]).map((yn: any, idx: number) => (
                  <button key={idx} onClick={() => onYunyeonSelect(yn)} className="px-2 py-1 bg-white border border-green-300 text-green-800 rounded hover:bg-green-500 hover:text-white transition-colors text-[11px] font-bold">
                    {yn['해당년도']}년
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'yunyeon' && selectedYunyeon && (
          <div className="bg-orange-50 border border-orange-200 p-3 rounded shadow-sm">
            <span className="block text-[13px] font-bold text-orange-900 mb-2">✨ 유년 사화 (올해 1년을 지배하는 단기 기운 / 천간: {selectedYunyeon['천간']})</span>
            <table className="w-full text-center text-[12px] border-collapse border border-orange-200 bg-white">
              <thead className="bg-orange-100">
                <tr>
                  <th className="border border-orange-200 p-2 text-green-700">년록 (시작/재물)</th>
                  <th className="border border-orange-200 p-2 text-blue-700">년권 (변화/지배)</th>
                  <th className="border border-orange-200 p-2 text-purple-700">년과 (명예/문서)</th>
                  <th className="border border-orange-200 p-2 text-red-700">년기 (사고/손재)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-orange-200 p-2 font-bold text-green-700">{selectedYunyeon['유년사화']['화록']['성요']} <span className="text-gray-500 font-normal text-[10px]">({selectedYunyeon['유년사화']['화록']['화입궁']}궁)</span></td>
                  <td className="border border-orange-200 p-2 font-bold text-blue-700">{selectedYunyeon['유년사화']['화권']['성요']} <span className="text-gray-500 font-normal text-[10px]">({selectedYunyeon['유년사화']['화권']['화입궁']}궁)</span></td>
                  <td className="border border-orange-200 p-2 font-bold text-purple-700">{selectedYunyeon['유년사화']['화과']['성요']} <span className="text-gray-500 font-normal text-[10px]">({selectedYunyeon['유년사화']['화과']['화입궁']}궁)</span></td>
                  <td className="border border-orange-200 p-2 font-bold text-red-700 bg-red-50">{selectedYunyeon['유년사화']['화기']['성요']} <span className="text-red-500 font-semibold text-[10px]">(선천 {gungData[selectedYunyeon['유년사화']['화기']['화입궁']]['선천궁명']} 충파!)</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 12궁 전면 루프 출력 */}
        {PALACE_NAMES.map((palaceName) => {
          const jiji = Object.keys(currentPalaces).find(k => currentPalaces[k] === palaceName) || '子';
          const data = gungData[jiji];
          if (!data) return null;

          const baseName = basePalaces[jiji];
          const biseong = data['궁간비성'];
          const pairResults = rankPairs(jiji);

          return (
            <div key={jiji} className="flex flex-col gap-2 bg-gray-50 p-3 border border-gray-300 rounded shadow-sm">
              <div className="font-bold text-[14px] text-gray-800 flex justify-between items-center border-b border-gray-200 pb-1">
                <div>
                  <span className={`${modeColor} text-[15px]`}>{modeTitle} {palaceName}</span>
                  <span className="text-gray-600 ml-2 font-medium">({jiji}궁 / 선천 {baseName})</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-2 rounded text-[11px] leading-relaxed mb-1">
                <span className="font-bold text-gray-800 block mb-1">🔍 [짝성 크로스체크] 주변 궁의 강력한 간섭</span>
                {pairResults.length > 0 ? (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1">
                    {pairResults.map((r, i) => (
                      <li key={i} className="text-gray-700">
                        <span className="font-bold text-indigo-700">[{r.pair}]</span> {r.desc} <span className="text-gray-400 text-[10px]">(영향 {r.rank}순위)</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-500">주변 궁에서 강력하게 개입하는 짝성이 없습니다.</span>
                )}
              </div>

              <table className="w-full text-left text-[12px] border-collapse border border-gray-300 bg-white">
                <thead className="bg-gray-200 text-gray-800 font-bold">
                  <tr>
                    <th className="border border-gray-300 p-1.5 w-[15%] text-center">분류</th>
                    <th className="border border-gray-300 p-1.5 w-[18%] text-center">성요(묘왕지)</th>
                    <th className="border border-gray-300 p-1.5 w-[12%] text-center">오행</th>
                    <th className="border border-gray-300 p-1.5 w-[55%] text-left">핵심 특성 (문서 기반)</th>
                  </tr>
                </thead>
                <tbody>
                  {renderCategorizedStars(data)}
                </tbody>
              </table>

              <div className="mt-1">
                <span className="text-[11px] font-bold text-gray-700 block mb-1">🎯 궁간비성 (이 궁의 천간 {biseong['천간']}이 날려보내는 사화 파동)</span>
                <div className="flex gap-2 text-[11px]">
                  <div className="bg-green-50 px-2 py-1 border border-green-200 rounded w-1/4">
                    <span className="text-green-700 font-bold">화록:</span> {biseong['화록']['성요']} <span className="text-gray-500">→ {biseong['화록']['화입궁']}궁</span>
                  </div>
                  <div className="bg-sky-50 px-2 py-1 border border-sky-200 rounded w-1/4">
                    <span className="text-sky-700 font-bold">화권:</span> {biseong['화권']['성요']} <span className="text-gray-500">→ {biseong['화권']['화입궁']}궁</span>
                  </div>
                  <div className="bg-purple-50 px-2 py-1 border border-purple-200 rounded w-1/4">
                    <span className="text-purple-700 font-bold">화과:</span> {biseong['화과']['성요']} <span className="text-gray-500">→ {biseong['화과']['화입궁']}궁</span>
                  </div>
                  <div className="bg-rose-50 px-2 py-1 border border-rose-200 rounded w-1/4">
                    <span className="text-rose-700 font-bold">화기:</span> {biseong['화기']['성요']} <span className="text-rose-500 font-semibold">→ {biseong['화기']['화입궁']}궁 충파!</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}