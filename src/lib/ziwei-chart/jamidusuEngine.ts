// src/lib/ziwei-chart/jamidusuEngine.ts

import { TableData } from './jamidusuTable';
import { LunarCalendar } from './lunarCalendar';
import { CalendarEngine } from './calendarEngine';

export class JamidusuEngine {
  static mod(a: number, b: number): number {
    return ((a % b) + b) % b;
  }

  static palaceLayout(idx: number): Record<string, string> {
    const layout: Record<string, string> = {};
    const palaces = ['명궁', '형제궁', '부처궁', '자녀궁', '재백궁', '질액궁', '천이궁', '노복궁', '관록궁', '전택궁', '복덕궁', '부모궁'];
    for (let i = 0; i < palaces.length; i++) {
      const branchIdx = this.mod(idx - i, 12);
      layout[TableData.hjJiJiTable[branchIdx]] = palaces[i];
    }
    return layout;
  }

  static makePurpleStarTable(dateTime: Date, sex: number): Record<string, any> {
    const gender = sex === 1 ? 1 : 0;
    const jamidusuData: Record<string, any> = { '기본정보': {} };
    jamidusuData['기본정보']['성별'] = gender === 1 ? '남성' : '여성';

    const today = new Date();
    jamidusuData['기본정보']['나이'] = today.getFullYear() - dateTime.getFullYear() + 1;
    jamidusuData['기본정보']['조회일자'] = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const twelveGung: Record<string, any> = {};
    for (const key of TableData.hjJiJiTable) {
      twelveGung[key] = {};
    }

    const saju = CalendarEngine.getSaJuYaJaSiJoJaSi(dateTime);
    const sajuFull: Record<string, string> = {};
    const labels = ['시', '일', '월', '년'];
    for (let i = 0; i < 4; i++) {
      const hjCol = saju[i];
      if (!hjCol) continue;
      const index = TableData.hjChunJiTable.indexOf(hjCol);
      if (index >= 0) {
        const krCol = TableData.krChunJiTable[index];
        sajuFull[labels[i]] = `${krCol}(${hjCol})`;
      } else {
        sajuFull[labels[i]] = hjCol;
      }
    }
    jamidusuData['기본정보']['사주'] = sajuFull;

    const yeongan = saju[3] ? saju[3][0] : '甲';
    const twelveChungan = TableData.twelveChunganTable[yeongan] || TableData.twelveChunganTable['甲'];

    for (let i = 0; i < TableData.hjJiJiTable.length; i++) {
      const hjGanji = twelveChungan[i] + TableData.hjJiJiTable[i];
      twelveGung[TableData.hjJiJiTable[i]]['궁위간지'] = hjGanji;
    }

    const tempBirthLun = LunarCalendar.sol2Lun(dateTime.getFullYear(), dateTime.getMonth() + 1, dateTime.getDate());
    const lunDateTime = tempBirthLun || { year: dateTime.getFullYear(), month: dateTime.getMonth() + 1, day: dateTime.getDate(), isLeap: false };

    jamidusuData['기본정보']['양력생일'] = [dateTime.getFullYear(), dateTime.getMonth() + 1, dateTime.getDate()];
    jamidusuData['기본정보']['음력생일'] = [lunDateTime.year, lunDateTime.month, lunDateTime.day, lunDateTime.isLeap ? '윤달' : '평달'];

    const injiIndex = TableData.hjJiJiTable.indexOf('寅');
    let wolNumber = lunDateTime.month - 1;
    if (lunDateTime.isLeap && lunDateTime.day >= 16) wolNumber += 1;

    const siganIndex = saju[0] ? TableData.hjJiJiTable.indexOf(saju[0][1]) : 0;
    const bornGungIndex = this.mod(injiIndex + wolNumber - siganIndex, 12);
    const bornGung = TableData.hjJiJiTable[bornGungIndex];

    const sinGungIndex = this.mod(injiIndex + wolNumber + siganIndex, 12);
    const sinGung = TableData.hjJiJiTable[sinGungIndex];

    const bIndex = TableData.hjJiJiTable.indexOf(bornGung);
    jamidusuData['기본정보']['명궁지지'] = `${TableData.krJiJiTable[bIndex]}(${bornGung})`;

    const sIndex = TableData.hjJiJiTable.indexOf(sinGung);
    jamidusuData['기본정보']['신궁지지'] = `${TableData.krJiJiTable[sIndex]}(${sinGung})`;

    jamidusuData['기본정보']['명주성'] = TableData.myungJuStarMap[bornGung] || '알수없음';
    jamidusuData['기본정보']['신주성'] = saju[3] ? (TableData.sinJuStarMap[saju[3][1]] || '알수없음') : '알수없음';

    const bornGungLayout = this.palaceLayout(bornGungIndex);
    for (const [key, value] of Object.entries(bornGungLayout)) {
      twelveGung[key]['선천궁명'] = value;
    }

    const gungPos = twelveGung[TableData.hjJiJiTable[bornGungIndex]]['궁위간지'];
    let daeHan = '水';
    for (const [key, list] of Object.entries(TableData.jami5Hang)) {
      if (list.includes(gungPos)) daeHan = key;
    }

    const tYear = this.mod(lunDateTime.year - 1984 + 12000, 60);
    const daeHan5Hang = (tYear % 2) ^ gender;

    const startingAge = TableData.jami5HangAge[daeHan] || 2;
    jamidusuData['기본정보']['오행국'] = TableData.jami5HangGuk[daeHan] || '수2국';

    const daeHanAges: Record<string, number[]> = {};
    if (daeHan5Hang === 1) {
      for (let i = 0; i < TableData.hjJiJiTable.length; i++) {
        const offset = this.mod(12 + i - bornGungIndex, 12);
        daeHanAges[TableData.hjJiJiTable[i]] = [startingAge + offset * 10, startingAge + 9 + offset * 10];
      }
    } else {
      for (let i = 0; i < TableData.hjJiJiTable.length; i++) {
        const offset = this.mod(12 - i + bornGungIndex, 12);
        daeHanAges[TableData.hjJiJiTable[i]] = [startingAge + offset * 10, startingAge + 9 + offset * 10];
      }
    }

    let nayeum = '알수없음';
    for (const data of Object.values(twelveGung)) {
      if (data['선천궁명'] === '명궁') {
        const hjGanJi = data['궁위간지'];
        const krGanJiIndex = TableData.hjChunJiTable.indexOf(hjGanJi);
        if (krGanJiIndex >= 0) {
          nayeum = TableData.nayinTable[krGanJiIndex][1];
        }
      }
    }
    jamidusuData['기본정보']['납음오행'] = nayeum;

    const birthDay = lunDateTime.day;
    let complement = 0;
    for (let i = 0; i <= startingAge; i++) {
      if ((birthDay + i) % startingAge === 0) {
        complement = i;
        break;
      }
    }
    const quotient = Math.floor((birthDay + complement) / startingAge);
    let jamiIndex;
    if (complement % 2 === 1) {
      jamiIndex = this.mod(injiIndex + quotient - 1 - complement, 12);
    } else {
      jamiIndex = this.mod(injiIndex + quotient - 1 + complement, 12);
    }

    const chunbuIndex = (jamiIndex > 4) ? 16 - jamiIndex : 4 - jamiIndex;

    for (const jiji of TableData.hjJiJiTable) {
      twelveGung[jiji]['십사정성'] = [];
      twelveGung[jiji]['6길성'] = [];
      twelveGung[jiji]['6살성'] = [];
    }

    for (let i = 0; i < TableData.hjJiJiTable.length; i++) {
      if (TableData.jami6Stars[i] !== '공백') twelveGung[TableData.hjJiJiTable[this.mod(jamiIndex - i, 12)]]['십사정성'].push(TableData.jami6Stars[i]);
      if (TableData.chunbu8Stars[i] !== '공백') twelveGung[TableData.hjJiJiTable[this.mod(chunbuIndex + i, 12)]]['십사정성'].push(TableData.chunbu8Stars[i]);
    }

    const yearIndex = saju[3] ? TableData.hjJiJiTable.indexOf(saju[3][1]) : 0;
    const hourIndex = saju[0] ? TableData.hjJiJiTable.indexOf(saju[0][1]) : 0;
    const lunarMonthNumber = lunDateTime.month - 1;
    const yearGanIndex = saju[3] ? TableData.hjChunGanTable.indexOf(saju[3][0]) : 0;

    twelveGung[TableData.chunGoiHjChunganTable[yearGanIndex]]['6길성'].push('천괴');
    twelveGung[TableData.chunWolHjChunganTable[yearGanIndex]]['6길성'].push('천월');
    twelveGung[TableData.hjJiJiTable[this.mod(4 + lunarMonthNumber, 12)]]['6길성'].push('좌보');
    twelveGung[TableData.hjJiJiTable[this.mod(10 - lunarMonthNumber, 12)]]['6길성'].push('우필');
    twelveGung[TableData.hjJiJiTable[this.mod(10 - hourIndex, 12)]]['6길성'].push('문창');
    twelveGung[TableData.hjJiJiTable[this.mod(4 + hourIndex, 12)]]['6길성'].push('문곡');

    const nokKey = TableData.nokHjChunganTable[yearGanIndex];
    const nokIndex = TableData.hjJiJiTable.indexOf(nokKey);
    twelveGung[TableData.hjJiJiTable[this.mod(nokIndex, 12)]]['6길성'].push('록존');
    twelveGung[TableData.hjJiJiTable[this.mod(nokIndex + 1, 12)]]['6살성'].push('경양');
    twelveGung[TableData.hjJiJiTable[this.mod(nokIndex - 1, 12)]]['6살성'].push('타라');

    if (saju[3]) twelveGung[TableData.chunMaTable[saju[3][1]]!]['6길성'].push('천마');

    const hwaIndex = saju[3] ? TableData.hjJiJiTable.indexOf(TableData.hwaKeyTable[saju[3][1]]!) : 0;
    twelveGung[TableData.hjJiJiTable[this.mod(hwaIndex + hourIndex, 12)]]['6살성'].push('화성');

    const youngIndex = saju[3] ? TableData.hjJiJiTable.indexOf(TableData.youngKeyTable[saju[3][1]]!) : 0;
    twelveGung[TableData.hjJiJiTable[this.mod(youngIndex + hourIndex, 12)]]['6살성'].push('영성');

    twelveGung[TableData.hjJiJiTable[this.mod(11 - hourIndex, 12)]]['6살성'].push('지공');
    twelveGung[TableData.hjJiJiTable[this.mod(11 + hourIndex, 12)]]['6살성'].push('지겁');
    twelveGung[TableData.hjJiJiTable[this.mod(9 + lunarMonthNumber, 12)]]['6살성'].push('천형');
    twelveGung[TableData.hjJiJiTable[this.mod(1 + lunarMonthNumber, 12)]]['6살성'].push('천요');

    const lunarDay = lunDateTime.day;
    const jogongsung12: Record<string, string[]> = {};
    for (const p of TableData.hjJiJiTable) jogongsung12[p] = [];
    jogongsung12[TableData.hjJiJiTable[this.mod(6 + hourIndex, 12)]].push('태보');
    jogongsung12[TableData.hjJiJiTable[this.mod(2 + hourIndex, 12)]].push('봉고');
    jogongsung12[TableData.hjJiJiTable[this.mod(4 + lunarMonthNumber + lunarDay - 1, 12)]].push('삼태');
    jogongsung12[TableData.hjJiJiTable[this.mod(10 - lunarMonthNumber - lunarDay + 1, 12)]].push('팔좌');
    jogongsung12[TableData.hjJiJiTable[this.mod(10 - hourIndex + lunarDay - 2, 12)]].push('은광');
    jogongsung12[TableData.hjJiJiTable[this.mod(4 + hourIndex + lunarDay - 2, 12)]].push('천귀');
    jogongsung12[TableData.hjJiJiTable[this.mod(4 + yearIndex, 12)]].push('용지');
    jogongsung12[TableData.hjJiJiTable[this.mod(10 - yearIndex, 12)]].push('봉각');

    const dohwasung12: Record<string, string[]> = {};
    for (const p of TableData.hjJiJiTable) dohwasung12[p] = [];
    dohwasung12[TableData.hjJiJiTable[this.mod(3 - yearIndex, 12)]].push('홍란');
    dohwasung12[TableData.hjJiJiTable[this.mod(9 - yearIndex, 12)]].push('천희');
    if (saju[3]) {
      dohwasung12[TableData.hamJiTable[saju[3][1]]!].push('함지');
      dohwasung12[TableData.hongYeomTable[saju[3][0]]!].push('홍염');
      dohwasung12[TableData.daeMoTable[saju[3][1]]!].push('대모');
    }

    const jegilsung12: Record<string, string[]> = {};
    for (const p of TableData.hjJiJiTable) jegilsung12[p] = [];
    if (saju[3]) {
      jegilsung12[TableData.chunGuanTable[saju[3][0]]!].push('천관');
      jegilsung12[TableData.chunBokTable[saju[3][0]]!].push('천복');
      jegilsung12[TableData.chunJuTable[saju[3][0]]!].push('천주');
    }
    jegilsung12[TableData.hjJiJiTable[this.mod(bornGungIndex + yearIndex, 12)]].push('천재');
    jegilsung12[TableData.hjJiJiTable[this.mod(sinGungIndex + yearIndex, 12)]].push('천수');
    jegilsung12[TableData.chunMuTable[lunarMonthNumber]].push('천무');
    jegilsung12[TableData.haeSinTable[lunDateTime.month - 1]].push('해신');

    const jeheungsung12: Record<string, string[]> = {};
    for (const p of TableData.hjJiJiTable) jeheungsung12[p] = [];
    jeheungsung12[TableData.hjJiJiTable[this.mod(10 - yearIndex, 12)]].push('년해');
    jeheungsung12[TableData.hjJiJiTable[this.mod(6 - yearIndex, 12)]].push('천곡');
    jeheungsung12[TableData.hjJiJiTable[this.mod(6 + yearIndex, 12)]].push('천허');
    jeheungsung12[TableData.umSalTable[lunarMonthNumber]].push('음살');
    if (saju[3]) {
      jeheungsung12[TableData.geopSalTable[saju[3][1]]!].push('겁살');
      jeheungsung12[TableData.goJinTable[saju[3][1]]!].push('고진');
      jeheungsung12[TableData.guaSukTable[saju[3][1]]!].push('과숙');
      jeheungsung12[TableData.paSueTable[saju[3][1]]!].push('파쇄');
    }
    jeheungsung12[TableData.chunWolTable[lunDateTime.month - 1]].push('천월');
    jeheungsung12[TableData.beeRyomTable[yearIndex]].push('비렴');

    for (const gung of Object.keys(twelveGung)) {
      if (twelveGung[gung]['선천궁명'] === '노복궁') jeheungsung12[gung].push('천상');
      if (twelveGung[gung]['선천궁명'] === '질액궁') jeheungsung12[gung].push('천사');
    }

    for (const gung of Object.keys(twelveGung)) {
      twelveGung[gung]['삼방사정'] = {};
      const mIndex = TableData.hjJiJiTable.indexOf(gung);
      twelveGung[gung]['삼방사정']['대궁'] = TableData.hjJiJiTable[this.mod(mIndex + 6, 12)];
      twelveGung[gung]['삼방사정']['협궁'] = [TableData.hjJiJiTable[this.mod(mIndex - 1, 12)], TableData.hjJiJiTable[this.mod(mIndex + 1, 12)]];
      let samHapGung: string[] = [];
      for (const hap of TableData.samHapTableList) {
        if (hap.includes(gung)) samHapGung = [...hap];
      }
      samHapGung = samHapGung.filter(g => g !== gung);
      twelveGung[gung]['삼방사정']['삼합궁'] = samHapGung;
    }

    const gongmang12: Record<string, string[]> = {};
    for (const p of TableData.hjJiJiTable) gongmang12[p] = [];
    if (saju[3]) gongmang12[TableData.jeolGongTable[saju[3][0]]!].push('절공');

    const chunJiIndex = saju[3] ? TableData.hjChunJiTable.indexOf(saju[3]) : 0;
    const isYangYear = chunJiIndex % 2 === 0;
    const soonGong = isYangYear ? TableData.soonGongTable[Math.floor(chunJiIndex / 10)]![0] : TableData.soonGongTable[Math.floor(chunJiIndex / 10)]![1];
    gongmang12[soonGong].push('순공');
    gongmang12[TableData.hjJiJiTable[this.mod(1 + yearIndex, 12)]].push('천공');

    for (const gung of Object.keys(twelveGung)) {
      twelveGung[gung]['사화성(四化星)'] = [];
    }
    const fourHwa = saju[3] ? TableData.fourHwaTable[saju[3][0]]! : [];

    for (const gung of Object.keys(twelveGung)) {
      const combinedStars = [...twelveGung[gung]['십사정성'], ...twelveGung[gung]['6길성']];
      if (fourHwa.length > 0) {
        if (combinedStars.includes(fourHwa[0])) twelveGung[gung]['사화성(四化星)'].push('화록');
        if (combinedStars.includes(fourHwa[1])) twelveGung[gung]['사화성(四化星)'].push('화권');
        if (combinedStars.includes(fourHwa[2])) twelveGung[gung]['사화성(四化星)'].push('화과');
        if (combinedStars.includes(fourHwa[3])) twelveGung[gung]['사화성(四化星)'].push('화기');
      }

      twelveGung[gung]['궁간비성'] = {};
      const gungGan = twelveGung[gung]['궁위간지'][0];
      twelveGung[gung]['궁간비성']['천간'] = gungGan;
      twelveGung[gung]['궁간비성']['화록'] = {};
      twelveGung[gung]['궁간비성']['화권'] = {};
      twelveGung[gung]['궁간비성']['화과'] = {};
      twelveGung[gung]['궁간비성']['화기'] = {};

      const gung4Hwa = TableData.fourHwaTable[gungGan]!;
      twelveGung[gung]['궁간비성']['화록']['성요'] = gung4Hwa[0];
      twelveGung[gung]['궁간비성']['화권']['성요'] = gung4Hwa[1];
      twelveGung[gung]['궁간비성']['화과']['성요'] = gung4Hwa[2];
      twelveGung[gung]['궁간비성']['화기']['성요'] = gung4Hwa[3];

      for (const gung4 of Object.keys(twelveGung)) {
        const comb4 = [...twelveGung[gung4]['십사정성'], ...twelveGung[gung4]['6길성']];
        if (comb4.includes(gung4Hwa[0])) twelveGung[gung]['궁간비성']['화록']['화입궁'] = gung4;
        if (comb4.includes(gung4Hwa[1])) twelveGung[gung]['궁간비성']['화권']['화입궁'] = gung4;
        if (comb4.includes(gung4Hwa[2])) twelveGung[gung]['궁간비성']['화과']['화입궁'] = gung4;
        if (comb4.includes(gung4Hwa[3])) twelveGung[gung]['궁간비성']['화기']['화입궁'] = gung4;
      }
    }

    const yearZhi = saju[3] ? saju[3][1] : '子';
    const rokZhi = TableData.hjJiJiTable[this.mod(nokIndex, 12)];
    const isYangYearFor12 = saju[3] ? ['甲', '丙', '戊', '庚', '壬'].includes(saju[3][0]) : true;

    const baksa12: Record<string, string[]> = {};
    for (const p of TableData.hjJiJiTable) baksa12[p] = [];
    const isForward = (isYangYearFor12 && gender === 1) || (!isYangYearFor12 && gender === 0);
    const startIdx = TableData.hjJiJiTable.indexOf(rokZhi);
    for (let i = 0; i < TableData.drTwelve.length; i++) {
      const currIdx = isForward ? this.mod(startIdx + i, 12) : this.mod(startIdx - i, 12);
      baksa12[TableData.hjJiJiTable[currIdx]].push(TableData.drTwelve[i]);
    }

    const jangjeon12: Record<string, string[]> = {};
    for (const p of TableData.hjJiJiTable) jangjeon12[p] = [];
    const jiStartIdx = TableData.hjJiJiTable.indexOf(TableData.jiStartMap[yearZhi]!);
    for (let i = 0; i < TableData.jiTwelve.length; i++) {
      jangjeon12[TableData.hjJiJiTable[this.mod(jiStartIdx + i, 12)]].push(TableData.jiTwelve[i]);
    }

    const segeon12: Record<string, string[]> = {};
    for (const p of TableData.hjJiJiTable) segeon12[p] = [];
    const segeonStartIdx = TableData.hjJiJiTable.indexOf(yearZhi);
    for (let i = 0; i < TableData.segeonNames.length; i++) {
      segeon12[TableData.hjJiJiTable[this.mod(segeonStartIdx + i, 12)]].push(TableData.segeonNames[i]);
    }

    const jangsaeng12: Record<string, string[]> = {};
    for (const p of TableData.hjJiJiTable) jangsaeng12[p] = [];
    const luckStartIdx = TableData.hjJiJiTable.indexOf(TableData.startMapLuck[startingAge]!);
    for (let i = 0; i < TableData.luckNames.length; i++) {
      const currIdx = isForward ? this.mod(luckStartIdx + i, 12) : this.mod(luckStartIdx - i, 12);
      jangsaeng12[TableData.hjJiJiTable[currIdx]].push(TableData.luckNames[i]);
    }

    for (const gung of Object.keys(twelveGung)) {
      twelveGung[gung]['궁_속성'] = {
        '공궁_여부': twelveGung[gung]['십사정성'].length === 0 ? 'true' : 'false',
        '신궁_포함여부': gung === sinGung ? 'true' : 'false',
      };

      twelveGung[gung]['성요배치'] = {
        '십사정성': [],
        '보좌길성': [],
        '살성_및_형요': [],
        '4대_십이신살': {
          '박사십이신': baksa12[gung],
          '장전십이신': jangjeon12[gung],
          '태세십이신': segeon12[gung],
          '장생십이신': jangsaeng12[gung],
        },
        '기타_잡성': {
          '도화성': dohwasung12[gung],
          '백관조공성': jogongsung12[gung],
          '제길성': jegilsung12[gung],
          '제흉성': jeheungsung12[gung],
          '공망성계': gongmang12[gung],
        },
        '선천사화': twelveGung[gung]['사화성(四化星)']
      };

      for (const star of twelveGung[gung]['십사정성']) {
        const strInfo = TableData.strengthTable[star] ? TableData.strengthTable[star][gung] : '';
        twelveGung[gung]['성요배치']['십사정성'].push({ '명칭': star, '묘왕지': strInfo || '' });
      }
      for (const star of twelveGung[gung]['6길성']) {
        const strInfo = TableData.strengthTable[star] ? TableData.strengthTable[star][gung] : '';
        twelveGung[gung]['성요배치']['보좌길성'].push({ '명칭': star, '묘왕지': strInfo || '' });
      }
      for (const star of twelveGung[gung]['6살성']) {
        const strInfo = TableData.strengthTable[star] ? TableData.strengthTable[star][gung] : '';
        twelveGung[gung]['성요배치']['살성_및_형요'].push({ '명칭': star, '묘왕지': strInfo || '' });
      }

      delete twelveGung[gung]['십사정성'];
      delete twelveGung[gung]['6길성'];
      delete twelveGung[gung]['6살성'];
      delete twelveGung[gung]['사화성(四化星)'];
    }

    jamidusuData['선천명반_12궁'] = twelveGung;
    return jamidusuData;
  }
}