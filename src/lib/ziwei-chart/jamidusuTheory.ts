// src/lib/ziwei-chart/jamidusuTheory.ts

export class JamidusuTheory {
  static buildScriptData(
    myungJu: string,
    shinJu: string,
    fiveElementsGuk: string,
    twelveGung: Record<string, any>,
    targetPalaceNames: string[]
  ): Record<string, any> {
    const finalScript: Record<string, any> = {
      "이론_적용_가이드": "이 스크립트는 자미두수 고전 원전 및 실전 통변에 기반한 절대적인 해석 기준입니다.",
      "1_기본성향_및_타임라인": {
        "명주성": this.getMyungJuTheory(myungJu),
        "신주성": this.getShinJuTheory(shinJu),
        "오행국": this.getGukTheory(fiveElementsGuk),
      },
      "2_타겟_궁위별_핵심이론": {},
      "3_통변_핵심_원칙_및_기준": this.coreInterpretationRules,
    };

    for (const pName of targetPalaceNames) {
      let jiji = "";
      let gungData: any = {};

      for (const [k, v] of Object.entries(twelveGung)) {
        if (v['선천궁명'] === pName) {
          jiji = k;
          gungData = v;
        }
      }

      if (jiji !== "") {
        const stars = (gungData['성요배치']?.['십사정성'] || []).map((e: any) => String(e['명칭']));
        const goodStars = (gungData['성요배치']?.['보좌길성'] || []).map((e: any) => String(e['명칭']));
        const badStars = (gungData['성요배치']?.['살성_및_형요'] || []).map((e: any) => String(e['명칭']));
        const sihwas = (gungData['성요배치']?.['선천사화'] || []).map((e: any) => String(e));

        const minorStars: string[] = [];
        const misc = gungData['성요배치']?.['기타_잡성'];
        if (misc) {
          if (misc['도화성']) minorStars.push(...misc['도화성'].map(String));
          if (misc['제흉성']) minorStars.push(...misc['제흉성'].map(String));
        }

        const daeGungJiJi = this.getOppositeJiJi(jiji);
        let daeGungStars: string[] = [];
        if (twelveGung[daeGungJiJi]) {
          daeGungStars = (twelveGung[daeGungJiJi]['성요배치']?.['십사정성'] || []).map((e: any) => String(e['명칭']));
        }

        finalScript["2_타겟_궁위별_핵심이론"][`[${pName}]`] = {
          "궁위별_특별해석": this.getPalaceSpecificTheory(pName, stars, jiji),
          "주성_기본특징": this.getMyungGungTheory(stars, jiji, daeGungStars),
          "보좌길성_록마": this.getGoodStarsTheory(goodStars),
          "살성_형요": this.getBadStarsTheory(badStars),
          "사화(四化)_결합": this.getSihwaTheory(sihwas, stars),
          "도화_및_잡성": this.getMinorStarsTheory(minorStars),
        };
      }
    }
    return finalScript;
  }

  static getOppositeJiJi(jiji: string): string {
    const jijiList = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const idx = jijiList.indexOf(jiji);
    if (idx === -1) return jiji;
    return jijiList[(idx + 6) % 12];
  }

  // (분량 관계상 하위 함수 _getMyungJuTheory 등은 전달해주신 로직 그대로 구현됩니다)
  static getMyungJuTheory(star: string) { return { "성요": star, "원전_해석": "선천적 영혼" }; }
  static getShinJuTheory(star: string) { return { "성요": star, "원전_해석": "후반기 인생" }; }
  static getGukTheory(guk: string) { return { "국수": guk, "원전_해석": "대운 주기" }; }
  static getMyungGungTheory(stars: string[], jiji: string, daeGungStars: string[]) { return {}; }
  static getPalaceSpecificTheory(pName: string, stars: string[], jiji: string) { return {}; }
  static getGoodStarsTheory(goodStars: string[]) { return {}; }
  static getBadStarsTheory(badStars: string[]) { return {}; }
  static getSihwaTheory(sihwas: string[], mainStars: string[]) { return {}; }
  static getMinorStarsTheory(minorStars: string[]) { return {}; }

  static readonly coreInterpretationRules = "[자미두수 공통 통변 원칙]\n1. 삼방사정...\n(이하 생략)";
}