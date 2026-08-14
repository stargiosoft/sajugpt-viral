'use client';

const STAR_DICTIONARY: Record<string, any> = {
  '자미': { 분류: '14정성', 오행: '음토', 특성: '제왕, 관록, 존귀, 통솔' },
  '천기': { 분류: '14정성', 오행: '음목', 특성: '지혜, 형제, 선(善), 책사' },
  '태양': { 분류: '14정성', 오행: '양화', 특성: '명예, 관록, 광명정대' },
  '무곡': { 분류: '14정성', 오행: '음금', 특성: '재백, 결단력, 재부, 고독' },
  '천동': { 분류: '14정성', 오행: '양수', 특성: '복덕, 온화, 친화력, 수명연장' },
  '염정': { 분류: '14정성', 오행: '음화', 특성: '차도화/수(囚), 관록, 사교, 경쟁' },
  '천부': { 분류: '14정성', 오행: '양토', 특성: '재고, 현능, 자비, 관용' },
  '태음': { 분류: '14정성', 오행: '음수', 특성: '재백, 낭만, 결백, 전택' },
  '탐랑': { 분류: '14정성', 오행: '양목', 특성: '정도화, 화복, 물욕, 유흥' },
  '거문': { 분류: '14정성', 오행: '음수', 특성: '암(暗), 시비, 구설, 비판' },
  '천상': { 분류: '14정성', 오행: '양수', 특성: '인(印), 신용, 봉사, 선성' },
  '천량': { 분류: '14정성', 오행: '양토', 특성: '음(蔭)/수(壽), 원칙, 노인성' },
  '칠살': { 분류: '14정성', 오행: '음금', 특성: '장성, 위엄, 기백, 결단' },
  '파군': { 분류: '14정성', 오행: '음수', 특성: '모(耗), 변동, 파괴, 창조' },
  '좌보': { 분류: '보좌길성', 오행: '양토', 특성: '직접적이고 적극적인 귀인의 조력' },
  '우필': { 분류: '보좌길성', 오행: '음수', 특성: '간접적이고 숨은 귀인의 조력' },
  '문창': { 분류: '보좌길성', 오행: '음금', 특성: '정통 학문, 문서, 명성' },
  '문곡': { 분류: '보좌길성', 오행: '음수', 특성: '구류술사, 기예, 예체능' },
  '천괴': { 분류: '보좌길성', 오행: '양화', 특성: '양의 귀인, 눈에 보이는 강력한 도움' },
  '천월': { 분류: '보좌길성', 오행: '음화', 특성: '음의 귀인, 보이지 않는 곳에서의 천거' },
  '록존': { 분류: '보좌길성', 오행: '음토', 특성: '재물, 안정, 보수성' },
  '천마': { 분류: '보좌길성', 오행: '양화', 특성: '이동, 변동, 역마' },
  '경양': { 분류: '육살성', 오행: '양금', 특성: '드러난 폭력, 형벌, 경쟁' },
  '타라': { 분류: '육살성', 오행: '음금', 특성: '숨겨진 지연, 암투, 우울증' },
  '화성': { 분류: '육살성', 오행: '양화', 특성: '갑작스러운 폭발, 재난, 파동' },
  '영성': { 분류: '육살성', 오행: '음화', 특성: '내부에서 타오르는 분노, 집착' },
  '지공': { 분류: '공망성', 오행: '음화', 특성: '반전통적 사상, 정신적 공허함, 손모' },
  '지겁': { 분류: '공망성', 오행: '양화', 특성: '물질적 타격, 횡파' },
  '천형': { 분류: '형요성', 오행: '양화', 특성: '형벌, 고독, 의료, 엄격함' },
  '천요': { 분류: '도화성', 오행: '음수', 특성: '풍류, 도화, 기예, 유혹' },
  '홍란': { 분류: '도화성', 오행: '음수', 특성: '혼인, 희경사, 도화' },
  '천희': { 분류: '도화성', 오행: '양수', 특성: '생육, 희경사, 도화' },
  '함지': { 분류: '도화성', 오행: '음수', 특성: '불량도화, 주색, 호색' },
  '대모': { 분류: '도화/모성', 오행: '양화', 특성: '손재, 도화, 소모' },
  '절공': { 분류: '공망성', 오행: '-', 특성: '중단, 단절' },
  '순공': { 분류: '공망성', 오행: '-', 특성: '허무, 공허' },
  '천공': { 분류: '공망성', 오행: '음화', 특성: '고독, 허무' },
  '화록': { 분류: '사화성', 오행: '음토', 특성: '재물, 복덕, 풍요, 발생' },
  '화권': { 분류: '사화성', 오행: '양목', 특성: '권세, 완고, 주관, 지배' },
  '화과': { 분류: '사화성', 오행: '양수', 특성: '성명, 학문, 명예, 시험' },
  '화기': { 분류: '사화성', 오행: '양수', 특성: '재화, 구설, 시비, 손재, 집착' },
  '은광': { 분류: '귀인성', 오행: '양화', 특성: '영예, 원호, 광채' },
  '천귀': { 분류: '귀인성', 오행: '양토', 특성: '성명, 지위, 조력' },
  '삼태': { 분류: '귀인성', 오행: '양토', 특성: '지위, 명예, 지원' },
  '팔좌': { 분류: '귀인성', 오행: '음토', 특성: '지위, 명예, 지원' },
  '용지': { 분류: '귀인성', 오행: '양수', 특성: '재예, 총명, 기예, 우아함' },
  '봉각': { 분류: '귀인성', 오행: '양토', 특성: '문예, 총명, 지위, 화려함' },
  '천관': { 분류: '귀인성', 오행: '양토', 특성: '영예, 청귀' },
  '천복': { 분류: '귀인성', 오행: '양토', 특성: '복수, 영화, 안락' },
  '고진': { 분류: '고극성', 오행: '양화', 특성: '고독, 형극, 분가, 단절' },
  '과숙': { 분류: '고극성', 오행: '음화', 특성: '고독, 무정, 단절' },
  '비렴': { 분류: '제흉성', 오행: '화', 특성: '구설, 시비, 고독' },
  '천상': { 분류: '제흉성', 오행: '양수', 특성: '파재, 지체, 질병' },
  '천사': { 분류: '제흉성', 오행: '음수', 특성: '손재, 구설, 지체' },
  '음살': { 분류: '제흉성', 오행: '-', 특성: '소인의 음해, 시기, 보이지 않는 방해' },
  '겁살': { 분류: '제흉성', 오행: '양화', 특성: '손해, 장애, 사기, 도난' },
  '재살': { 분류: '제흉성', 오행: '수', 특성: '실물, 재난, 질병' },
  '천월(天月)': { 분류: '질병성계', 오행: '-', 특성: '만성질병, 유행병' },
  '병부': { 분류: '질병성계', 오행: '수', 특성: '재병, 질병' },
  '태보': { 분류: '제길성', 오행: '양토', 특성: '지위, 명예, 보호' },
  '봉고': { 분류: '제길성', 오행: '음토', 특성: '지위, 표창, 칭송' },
  '천재': { 분류: '제길성', 오행: '음목', 특성: '재예, 기획, 총명, 민첩' },
  '천수': { 분류: '제길성', 오행: '양토', 특성: '장수, 충후, 온화, 연장자' },
  '천무': { 분류: '제길성', 오행: '-', 특성: '영예, 상속, 학문, 신비주의' },
  '해신': { 분류: '제길성', 오행: '-', 특성: '해액, 분쟁완화, 액땜' },
  '화개': { 분류: '제길성', 오행: '양목', 특성: '철리, 종교, 고독, 고상함' }
};

interface DetailProps {
  viewMode: 'base' | 'daehan' | 'yunyeon';
  activeData: any;
  basePalaces: Record<string, string>;
  daehanPalaces: Record<string, string>;
  yunyeonPalaces: Record<string, string>;
  activeJiJi: string;
  daehanGan: string;
  luckInfo: any;
  selectedYunyeon: any;
  onYunyeonSelect: (yn: any) => void;
  gungData: any;
  PALACE_NAMES: string[];
}

export default function ZiweiDetailTable({ viewMode, activeData, basePalaces, daehanPalaces, yunyeonPalaces, activeJiJi, daehanGan, luckInfo, selectedYunyeon, onYunyeonSelect, gungData, PALACE_NAMES }: DetailProps) {
  const getCategorizedStars = (data: any) => {
    if (!data) return [];
    const categorizedList: any[] = [];

    const addStars = (stars: any[], defaultCategory: string) => {
      if (!stars) return;
      stars.forEach(starObj => {
        const sName = typeof starObj === 'string' ? starObj : starObj.명칭;
        const sStr = typeof starObj === 'string' ? '' : starObj.묘왕지;
        if (!sName) return;
        const dictInfo = STAR_DICTIONARY[sName] || { 분류: defaultCategory, 오행: '-', 특성: '해당 성요의 특성 데이터 없음' };
        categorizedList.push({ sName, sStr, ...dictInfo });
      });
    };

    addStars(data['성요배치']['십사정성'], '14정성');
    addStars(data['성요배치']['보좌길성'], '보좌길성');
    addStars(data['성요배치']['살성_및_형요'], '살성/형요');
    
    const minor = data['성요배치']['기타_잡성'];
    if (minor) {
      addStars(minor['도화성'] || [], '도화성');
      addStars(minor['공망성계'] || [], '공망성');
      addStars(minor['제길성'] || [], '제길성');
      addStars(minor['제흉성'] || [], '제흉성');
      addStars(minor['백관조공성'] || [], '귀인성');
    }
    
    const shinsal = data['성요배치']['4대_십이신살'];
    if (shinsal) {
      addStars(shinsal['장생십이신'] || [], '장생12신');
      addStars(shinsal['태세십이신'] || [], '태세12신');
      addStars(shinsal['장전십이신'] || [], '장전12신');
      addStars(shinsal['박사십이신'] || [], '박사12신');
    }

    if (data['성요배치']['선천사화']) {
       addStars(data['성요배치']['선천사화'], '사화성');
    }

    return categorizedList;
  };

  return (
    <div className="mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-300">
      
      {viewMode === 'base' && (
        <div className="flex flex-col gap-6">
          <div className="border-b border-gray-800 pb-2">
            <h3 className="text-[16px] font-bold text-blue-900 tracking-tight">선천 12궁 전면 분석 데이터</h3>
          </div>
          {PALACE_NAMES.map((palaceName) => {
            const jiji = Object.keys(basePalaces).find(k => basePalaces[k] === palaceName) || '子';
            const data = gungData[jiji];
            if (!data) return null;

            const starDetails = getCategorizedStars(data);
            const biseong = data['궁간비성'];

            return (
              <div key={jiji} className="flex flex-col gap-2 bg-gray-50 p-3 border border-gray-200 rounded">
                <div className="font-bold text-[14px] text-gray-800 flex justify-between items-center border-b pb-1">
                  <span>{palaceName} ({jiji}궁) - 간지: {data['궁위간지']}</span>
                </div>
                
                <table className="w-full text-left text-[12px] border-collapse border border-gray-300 bg-white">
                  <thead className="bg-gray-100 text-gray-800 font-bold">
                    <tr>
                      <th className="border border-gray-300 p-1.5 w-[15%] text-center">분류</th>
                      <th className="border border-gray-300 p-1.5 w-[15%] text-center">성요(묘왕지)</th>
                      <th className="border border-gray-300 p-1.5 w-[15%] text-center">오행</th>
                      <th className="border border-gray-300 p-1.5 w-[55%] text-left">핵심 특성</th>
                    </tr>
                  </thead>
                  <tbody>
                    {starDetails.length > 0 ? starDetails.map((star: any, idx: number) => (
                      <tr key={idx} className="hover:bg-yellow-50 transition-colors">
                        <td className="border border-gray-300 p-1.5 text-center text-gray-600">{star.분류}</td>
                        <td className="border border-gray-300 p-1.5 text-center font-bold text-blue-900">
                          {star.sName} <span className="text-red-600 font-normal text-[10px]">{star.sStr ? `(${star.sStr})` : ''}</span>
                        </td>
                        <td className="border border-gray-300 p-1.5 text-center font-bold">{star.오행}</td>
                        <td className="border border-gray-300 p-1.5 text-gray-700 break-keep leading-relaxed">{star.특성}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="border border-gray-300 p-2 text-center text-gray-500">배치된 주요 성요가 없는 공궁입니다.</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="mt-1">
                  <span className="text-[11px] font-bold text-gray-700 block mb-1">궁간비성 (이 궁의 천간 {biseong['천간']}이 발생시키는 사화)</span>
                  <div className="flex gap-2 text-[11px]">
                    <div className="bg-green-50 px-2 py-1 border rounded w-1/4">
                      <span className="text-green-700 font-bold">화록:</span> {biseong['화록']['성요']} ({biseong['화록']['화입궁']}궁)
                    </div>
                    <div className="bg-blue-50 px-2 py-1 border rounded w-1/4">
                      <span className="text-blue-700 font-bold">화권:</span> {biseong['화권']['성요']} ({biseong['화권']['화입궁']}궁)
                    </div>
                    <div className="bg-purple-50 px-2 py-1 border rounded w-1/4">
                      <span className="text-purple-700 font-bold">화과:</span> {biseong['화과']['성요']} ({biseong['화과']['화입궁']}궁)
                    </div>
                    <div className="bg-red-50 px-2 py-1 border rounded w-1/4">
                      <span className="text-red-700 font-bold">화기:</span> {biseong['화기']['성요']} ({biseong['화기']['화입궁']}궁)
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'daehan' && activeData && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-[15px] font-bold text-green-800">
              [대한] {activeData['대한_연령대']?.[0]} ~ {activeData['대한_연령대']?.[1]}세 대운 분석
            </h3>
            <span className="text-xs text-gray-500">대한 명궁: {activeJiJi}궁 ({basePalaces[activeJiJi]})</span>
          </div>

          <div>
            <span className="block text-[12px] font-bold text-gray-800 mb-1">대한 사화 (현재 10년을 지배하는 기운 / 천간: {daehanGan})</span>
            <table className="w-full text-center text-[12px] border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-200 p-1.5 text-green-700">대록</th>
                  <th className="border border-gray-200 p-1.5 text-blue-700">대권</th>
                  <th className="border border-gray-200 p-1.5 text-purple-700">대과</th>
                  <th className="border border-gray-200 p-1.5 text-red-700">대기</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-2 font-bold bg-green-50">{activeData['궁간비성']['화록']['성요']} <span className="text-gray-500 font-normal text-[10px]">({activeData['궁간비성']['화록']['화입궁']}궁)</span></td>
                  <td className="border border-gray-200 p-2 font-bold bg-blue-50">{activeData['궁간비성']['화권']['성요']} <span className="text-gray-500 font-normal text-[10px]">({activeData['궁간비성']['화권']['화입궁']}궁)</span></td>
                  <td className="border border-gray-200 p-2 font-bold bg-purple-50">{activeData['궁간비성']['화과']['성요']} <span className="text-gray-500 font-normal text-[10px]">({activeData['궁간비성']['화과']['화입궁']}궁)</span></td>
                  <td className="border border-gray-200 p-2 font-bold text-red-600 bg-red-50">{activeData['궁간비성']['화기']['성요']} <span className="text-red-400 font-normal text-[10px]">({activeData['궁간비성']['화기']['화입궁']}궁)</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          {getCategorizedStars(activeData).length > 0 && (
            <div className="mt-2">
              <span className="block text-[12px] font-bold text-gray-800 mb-1">선택된 궁위 상세 분석</span>
              <table className="w-full text-left text-[12px] border-collapse border border-gray-300">
                <thead className="bg-gray-100 text-gray-800 font-bold">
                  <tr>
                    <th className="border border-gray-300 p-1.5 w-[15%] text-center">분류</th>
                    <th className="border border-gray-300 p-1.5 w-[15%] text-center">성요(묘왕지)</th>
                    <th className="border border-gray-300 p-1.5 w-[15%] text-center">오행</th>
                    <th className="border border-gray-300 p-1.5 w-[55%] text-left">핵심 특성</th>
                  </tr>
                </thead>
                <tbody>
                  {getCategorizedStars(activeData).map((star: any, idx: number) => (
                    <tr key={idx} className="hover:bg-yellow-50 transition-colors">
                      <td className="border border-gray-300 p-1.5 text-center text-gray-600">{star.분류}</td>
                      <td className="border border-gray-300 p-1.5 text-center font-bold text-blue-900">
                        {star.sName} <span className="text-red-600 font-normal text-[10px]">{star.sStr ? `(${star.sStr})` : ''}</span>
                      </td>
                      <td className="border border-gray-300 p-1.5 text-center font-bold">{star.오행}</td>
                      <td className="border border-gray-300 p-1.5 text-gray-700 break-keep leading-relaxed">{star.특성}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-2">
            <span className="block text-[12px] font-bold text-gray-800 mb-1">속해있는 유년(1년 운) 리스트 (클릭하면 유년 명반으로 전환됩니다)</span>
            <div className="flex flex-wrap gap-2">
              {luckInfo['유년_목록']
                .filter((yn: any) => activeData['대한_연령대']?.[0] <= yn['나이'] && yn['나이'] <= activeData['대한_연령대']?.[1])
                .map((yn: any, idx: number) => (
                  <button
                    key={idx} onClick={() => onYunyeonSelect(yn)}
                    className="px-3 py-1.5 border border-orange-200 bg-orange-50 text-orange-800 rounded hover:bg-orange-500 hover:text-white transition-colors text-[11px] font-bold"
                  >
                    {yn['해당년도']}년 ({yn['나이']}세)
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'yunyeon' && selectedYunyeon && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-[15px] font-bold text-orange-700">
              [유년] {selectedYunyeon['해당년도']}년 ({selectedYunyeon['나이']}세) 운세 분석
            </h3>
            <span className="text-xs text-gray-500">
              유년 명궁: {Object.keys(selectedYunyeon['십이궁_배치']).find(k => selectedYunyeon['십이궁_배치'][k] === '명궁')}궁 
            </span>
          </div>

          <div>
            <span className="block text-[12px] font-bold text-gray-800 mb-1">유년 사화 (올해 1년을 지배하는 발생 기운 / 천간: {selectedYunyeon['천간']})</span>
            <table className="w-full text-center text-[12px] border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-200 p-1.5 text-green-700">년록</th>
                  <th className="border border-gray-200 p-1.5 text-blue-700">년권</th>
                  <th className="border border-gray-200 p-1.5 text-purple-700">년과</th>
                  <th className="border border-gray-200 p-1.5 text-red-700">년기 (주의!)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-2 font-bold bg-green-50">{selectedYunyeon['유년사화']['화록']['성요']} <span className="text-gray-500 font-normal text-[10px]">({selectedYunyeon['유년사화']['화록']['화입궁']}궁)</span></td>
                  <td className="border border-gray-200 p-2 font-bold bg-blue-50">{selectedYunyeon['유년사화']['화권']['성요']} <span className="text-gray-500 font-normal text-[10px]">({selectedYunyeon['유년사화']['화권']['화입궁']}궁)</span></td>
                  <td className="border border-gray-200 p-2 font-bold bg-purple-50">{selectedYunyeon['유년사화']['화과']['성요']} <span className="text-gray-500 font-normal text-[10px]">({selectedYunyeon['유년사화']['화과']['화입궁']}궁)</span></td>
                  <td className="border border-gray-200 p-2 font-bold text-red-600 bg-red-50">{selectedYunyeon['유년사화']['화기']['성요']} <span className="text-red-400 font-normal text-[10px]">({selectedYunyeon['유년사화']['화기']['화입궁']}궁)</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <span className="block text-[11px] text-gray-500 mb-1">다른 연도 보기</span>
            <div className="flex flex-wrap gap-1">
              {luckInfo['유년_목록'].map((yn: any, idx: number) => (
                <button
                  key={idx} onClick={() => onYunyeonSelect(yn)}
                  className={`px-2 py-1 border text-[10px] rounded ${yn['해당년도'] === selectedYunyeon['해당년도'] ? 'bg-orange-500 text-white border-orange-600 font-bold' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
                >
                  {yn['해당년도']}년
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}