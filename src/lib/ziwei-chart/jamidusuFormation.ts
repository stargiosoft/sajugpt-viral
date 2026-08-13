// src/lib/ziwei-chart/jamidusuFormation.ts

export class JamidusuFormation {
  static readonly _jijiList = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  static scanFormations(twelveGung: Record<string, any>, targetGungName: string): string {
    const buffer: string[] = [];
    const detectedFormations: string[] = [];

    try {
      let targetJiJi = "";
      for (const [k, v] of Object.entries(twelveGung)) {
        if (v['선천궁명'] === targetGungName) targetJiJi = k;
      }

      if (!targetJiJi) return "";

      const oppJiJi = this._getOpposite(targetJiJi);
      const trineJiJi = this._getTrine(targetJiJi);
      const flankJiJi = this._getFlanking(targetJiJi);

      const mainStars = this._getStarsInPalace(twelveGung, targetJiJi);
      const sanFangSiZhengStars = [
        ...mainStars,
        ...this._getStarsInPalace(twelveGung, oppJiJi),
        ...this._getStarsInPalace(twelveGung, trineJiJi[0]),
        ...this._getStarsInPalace(twelveGung, trineJiJi[1]),
      ];
      const flankStars = [
        ...this._getStarsInPalace(twelveGung, flankJiJi[0]),
        ...this._getStarsInPalace(twelveGung, flankJiJi[1]),
      ];

      const main14Stars = ['자미','천기','태양','무곡','천동','염정','천부','태음','탐랑','거문','천량','칠살','파군','천상'];
      const isGongGung = !mainStars.some(s => main14Stars.includes(s));

      if (mainStars.includes('자미')) {
        const hasBoPil = sanFangSiZhengStars.includes('좌보') || sanFangSiZhengStars.includes('우필') || flankStars.includes('좌보') || flankStars.includes('우필');
        if (hasBoPil) {
          detectedFormations.push("[백관조공(百官朝拱)]: 자미가 보필을 보았음. (원전: 제왕이 백관의 보좌를 받아 위엄과 영도력을 발휘하는 진정한 성군의 명). -> (AI 지시: 살성의 방해 유무를 살펴 대업을 이루는 명인지 통변할 것)");
        } else {
          detectedFormations.push("[고군(孤君)]: 자미가 보필을 보지 못함. (원전: 독단독행하며 고독하고 겉만 화려할 뿐 실속이 없음). -> (AI 지시: 록권과나 길성의 구제가 없다면 파동이 많은 고독한 리더임을 통변할 것)");
        }
      }

      if (sanFangSiZhengStars.includes('천부') && sanFangSiZhengStars.includes('천상')) {
        detectedFormations.push("[부상조원격(府相朝垣格)]: 명궁 삼방에서 천부와 천상 회조. (원전: 록존/문성을 보면 명예 후 부(富)를 이룸). -> (AI 지시: 성격인지 파격인지 스캔하여 썰을 풀 것)");
      }

      if ((targetJiJi === '寅' || targetJiJi === '申') && mainStars.includes('자미') && mainStars.includes('천부')) {
        detectedFormations.push("[자부동궁격(紫府同宮格)]: 寅/申궁 자미 천부 동궁. (원전: 부귀쌍전 길격이나 피차 견제/모순 우려). -> (AI 지시: 제왕의 그릇인지 고립된 명인지 판별할 것)");
      }

      if ((targetJiJi === '丑' || targetJiJi === '未') && mainStars.includes('무곡') && mainStars.includes('탐랑')) {
        detectedFormations.push("[무탐동행격(武貪同行格)]: 丑/未궁 무곡 탐랑 동궁. (원전: 대기만성(선빈후부) 명). -> (AI 지시: 중년 이후 대발하는지 파격인지 판별할 것)");
      }

      if ((targetJiJi === '寅' || targetJiJi === '申') && mainStars.includes('칠살')) {
        detectedFormations.push("[칠살조두격(七殺朝斗格)]: 寅/申궁 칠살 독좌. (원전: 권력과 맹렬한 추진력). -> (AI 지시: 파격인지 권귀의 명인지 통변할 것)");
      }

      if ((targetJiJi === '子' || targetJiJi === '午') && mainStars.includes('파군')) {
        detectedFormations.push("[영성입묘격(英星入廟格)]: 子/午궁 파군 입묘. (원전: 권위를 얻고 대업을 이룸). -> (AI 지시: 무관/사업가 대발인지 헛고생인지 짚어낼 것)");
      }

      if (targetJiJi === '午' && mainStars.includes('천량')) {
        detectedFormations.push("[수성입묘격(壽星入廟格)]: 午궁 천량 독좌. (원전: 학문과 직위가 최고조에 달함). -> (AI 지시: 귀격인지 고단한 명인지 판별할 것)");
      }

      if ((targetJiJi === '未' || targetJiJi === '申') && mainStars.includes('염정')) {
        detectedFormations.push("[웅수조원격(雄宿朝垣格)]: 未/申궁 염정 수명. (원전: 부귀와 명망을 떨침). -> (AI 지시: 성격인지 파격인지 명확히 짚어 썰을 풀 것)");
      }

      if (targetJiJi === '午' && mainStars.includes('경양')) {
        detectedFormations.push("[마두대검격(馬頭帶劍格)]: 午궁 화가 경양 제련. (원전: 위진변강의 정격이 되어 만인을 다스림). -> (AI 지시: 거상이 되는 명인지 팩트 폭행할 것)");
      }

      if (targetJiJi === '寅' && mainStars.includes('거문') && mainStars.includes('태양')) {
        detectedFormations.push("[거일동궁격(巨日同宮格)]: 寅궁 거문/태양. (원전: 학문/명예 최고. 관봉삼대). -> (AI 지시: 대길격이 되었는지 판별할 것)");
      }

      if (targetJiJi === '卯' && mainStars.includes('태양')) {
        detectedFormations.push("[일조뇌문격(日照雷門格)]: 卯궁 태양. (원전: 일생 부귀하고 소년 급제). -> (AI 지시: 대길격인지 살기로 깨졌는지 통변할 것)");
      }

      if (targetJiJi === '亥' && mainStars.includes('태음')) {
        detectedFormations.push("[월랑천문격(月朗天門格)]: 亥궁 태음. (원전: 대부대귀격이나 살기를 극도로 꺼림). -> (AI 지시: 명리쌍전인지 흉사 파격인지 판별할 것)");
      }

      if (sanFangSiZhengStars.includes('태양') && sanFangSiZhengStars.includes('천량') && sanFangSiZhengStars.includes('문창') && (sanFangSiZhengStars.includes('화록') || sanFangSiZhengStars.includes('록존'))) {
        detectedFormations.push("[양양창록격(陽梁昌祿格)]: 태양, 천량, 문창, 록성 동회. (원전: 고시 합격 및 학문 연구 정점). -> (AI 지시: 고시/전문인재 대성을 통변할 것)");
      }

      if ((targetJiJi === '辰' && mainStars.includes('태양')) || (targetJiJi === '戌' && mainStars.includes('태음')) || (targetJiJi === '巳' && mainStars.includes('태양')) || (targetJiJi === '酉' && mainStars.includes('태음'))) {
        detectedFormations.push("[단지계지격(丹墀桂墀格)]: 진사 태양, 술유 태음 입묘. (원전: 과명과 벼슬이 높음). -> (AI 지시: 귀격인지 판별할 것)");
      }

      if ((targetJiJi === '丑' || targetJiJi === '未') && mainStars.includes('태양') && mainStars.includes('태음')) {
        detectedFormations.push("[일월병명격(日月並明格)]: 丑/未궁 일월 동궁. (원전: 귀를 주관하나 살성에 민감). -> (AI 지시: 파동 많은 명인지 귀격인지 판별할 것)");
      }

      if ((targetJiJi === '丑' || targetJiJi === '未') && isGongGung && sanFangSiZhengStars.includes('태양') && sanFangSiZhengStars.includes('태음')) {
        detectedFormations.push("[일월회명격(日月會明格)]: 명궁 공궁, 대궁 일월 조명. (원전: 보좌 시 부귀, 살기 시 파동). -> (AI 지시: 대부대귀 명인지 판별할 것)");
      }

      if (sanFangSiZhengStars.includes('천기') && sanFangSiZhengStars.includes('태음') && sanFangSiZhengStars.includes('천동') && sanFangSiZhengStars.includes('천량')) {
        detectedFormations.push("[기월동량격(機月同梁格)]: 기월동량 삼방 회조. (원전: 두뇌 활동 전문직 대성). -> (AI 지시: 참모로 대성하는 성격인지 판별할 것)");
      }

      if ((targetJiJi === '子' || targetJiJi === '午') && mainStars.includes('거문')) {
        detectedFormations.push("[석중은옥격(石中隱玉格)]: 子/午궁 거문 독좌. (원전: 돌 속에 숨겨진 옥. 2인자로 부귀). -> (AI 지시: 상격인지 흉살 파격인지 판별할 것)");
      }

      if (sanFangSiZhengStars.includes('화록') && sanFangSiZhengStars.includes('화권') && sanFangSiZhengStars.includes('화과')) {
        detectedFormations.push("[삼기가회격(三奇加會格)]: 록권과 모두 회조. (원전: 명예, 재물, 권위를 쥐는 최고 길격). -> (AI 지시: 길격이 온전한지 살성에 흠집이 났는지 짚어낼 것)");
      }

      if (targetJiJi === '午' && mainStars.includes('태양')) {
        detectedFormations.push("[금찬광휘격(金燦光輝格)]: 午궁 태양. (원전: 호방/도량으로 부귀 얻으나 살기 중하면 파격). -> (AI 지시: 대성하는 명인지 판별할 것)");
      }

      if (sanFangSiZhengStars.includes('탐랑') && (sanFangSiZhengStars.includes('화성') || sanFangSiZhengStars.includes('영성'))) {
        detectedFormations.push("[화탐/영탐격(火貪/鈴貪格)]: 탐랑이 화성/영성 만남. (원전: 의외의 횡발. 살기 시 횡발횡파). -> (AI 지시: 횡발하는지 횡발횡파인지 짚어낼 것)");
      }

      if (sanFangSiZhengStars.includes('화록') && sanFangSiZhengStars.includes('록존')) {
        detectedFormations.push("[쌍록조원/록합원앙격(雙祿朝垣/祿合鴛鴦格)]: 화록과 록존 회조. (원전: 재적으로 횡발하는 대부격). -> (AI 지시: 대부격임을 통변할 것)");
      }

      if (sanFangSiZhengStars.includes('천괴') || sanFangSiZhengStars.includes('천월')) {
        detectedFormations.push("[귀성공명격(貴星拱命格)]: 괴월 회조. -> (AI 지시: 윗사람/국가의 조력 운을 통변할 것)");
      }
      if (sanFangSiZhengStars.includes('좌보') || sanFangSiZhengStars.includes('우필')) {
        detectedFormations.push("[좌우공명격(左右拱命格)]: 보필 회조. -> (AI 지시: 주변 인적 자원과 동료 조력 짚어낼 것)");
      }
      if (sanFangSiZhengStars.includes('문창') || sanFangSiZhengStars.includes('문곡')) {
        detectedFormations.push("[문성공명격(文星拱命格)]: 창곡 회조. -> (AI 지시: 학식과 명예 귀현 짚어낼 것)");
      }

      if (targetJiJi === '子' && mainStars.includes('천동') && mainStars.includes('태음')) {
        detectedFormations.push("[수징계악격(水澄桂萼格)]: 子궁 동월. (원전: 청렴한 직책, 주귀하는 상격). -> (AI 지시: 공직 명예 스캔할 것)");
      }

      if ((sanFangSiZhengStars.includes('화록') || sanFangSiZhengStars.includes('록존')) && sanFangSiZhengStars.includes('천마')) {
        detectedFormations.push("[록마교치격(祿馬交馳格)]: 록존/화록과 천마 조우. (원전: 타향에서 횡발). -> (AI 지시: 타지 발복 운 판별할 것)");
      }

      if (targetGungName === '명궁' && isGongGung) {
        detectedFormations.push("[명무정요격(命無正曜格)]: 명궁 정성 없음. (원전: 길성 구제 시 무방, 살기 시 치명적). -> (AI 지시: 구제받은 명인지 판별할 것)");
      }

      if (sanFangSiZhengStars.includes('무곡') && sanFangSiZhengStars.includes('염정') && sanFangSiZhengStars.includes('화기')) {
        detectedFormations.push("[재여수구격(財與囚仇格)]: 무곡/염정이 화기와 얽힘. (원전: 파산/관재 당하는 빈천국). -> (AI 지시: 치명적 파국 패국을 경고할 것)");
      }

      if (sanFangSiZhengStars.includes('영성') && sanFangSiZhengStars.includes('문창') && sanFangSiZhengStars.includes('타라') && sanFangSiZhengStars.includes('무곡')) {
        detectedFormations.push("[영창타무격(鈴昌陀武格)]: 영/창/타/무 삼방 만남. (원전: 극심한 손재/사고 파동). -> (AI 지시: 흉격 뇌관 터졌는지 경고할 것)");
      }

      if ((targetJiJi === '丑' || targetJiJi === '未') && mainStars.includes('염정') && mainStars.includes('칠살')) {
        detectedFormations.push("[노상매시격(路上埋屍格)]: 丑/未궁 염살. (원전: 객사/교통사고 흉사 우려 대흉격). -> (AI 지시: 살기 파격인지 구제 성격인지 극적 통변할 것)");
      }

      if (detectedFormations.length > 0) {
        buffer.push("\n▶ [🌟 1차 격국 레이더: 고서(원전) 기준 특수 격국 뼈대 스캔 완료]");
        buffer.push(" (AI는 아래 제공된 원전 해석과 성격/파격 조건을 숙지한 뒤, 내담자의 록(祿)/살(殺) 기운과 대조하여 최종 통변에 강력히 인용할 것.)");
        for (const formation of detectedFormations) {
          buffer.push(`  - ${formation}`);
        }
      }

    } catch (e) {
      buffer.push(`격국 판별 중 오류 발생: ${e}`);
    }

    return buffer.join('\n');
  }

  static _getStarsInPalace(twelveGung: Record<string, any>, jiji: string): string[] {
    if (!twelveGung[jiji]) return [];
    const allStars: string[] = [];
    const gungData = twelveGung[jiji]['성요배치'];
    if (!gungData) return [];

    if (gungData['십사정성']) allStars.push(...gungData['십사정성'].map((e: any) => String(e['명칭'])));
    if (gungData['보좌길성']) allStars.push(...gungData['보좌길성'].map((e: any) => String(e['명칭'])));
    if (gungData['살성_및_형요']) allStars.push(...gungData['살성_및_형요'].map((e: any) => String(e['명칭'])));
    if (gungData['선천사화']) allStars.push(...gungData['선천사화'].map(String));

    return allStars;
  }

  static _getOpposite(jiji: string): string {
    const idx = this._jijiList.indexOf(jiji);
    return idx === -1 ? jiji : this._jijiList[(idx + 6) % 12];
  }

  static _getTrine(jiji: string): string[] {
    const idx = this._jijiList.indexOf(jiji);
    return idx === -1 ? [] : [this._jijiList[(idx + 4) % 12], this._jijiList[(idx + 8) % 12]];
  }

  static _getFlanking(jiji: string): string[] {
    const idx = this._jijiList.indexOf(jiji);
    if (idx === -1) return [];
    const prev = (idx - 1) < 0 ? 11 : idx - 1;
    const next = (idx + 1) % 12;
    return [this._jijiList[prev], this._jijiList[next]];
  }
}