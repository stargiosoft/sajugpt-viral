// src/lib/ziwei-chart/calendarEngine.ts

import { TableData } from './jamidusuTable';

export class CalendarEngine {
  static bisectString(list: string[], value: string): number {
    let low = 0;
    let high = list.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (list[mid] <= value) low = mid + 1;
      else high = mid;
    }
    return low;
  }

  static getYeonJu(dt: Date): string {
    if (TableData.jeolGiTable.length === 0) return "";
    const strDate = `${dt.getUTCFullYear()}${(dt.getUTCMonth() + 1).toString().padStart(2, '0')}${dt.getUTCDate().toString().padStart(2, '0')}`;
    let index = this.bisectString(TableData.jeolGiTable, strDate) - 1;
    if (index < 0) index = 0;
    const years = Math.floor(index / 12) + 36;
    return TableData.hjChunJiTable[years % 60];
  }

  static getWolJu(dt: Date): string {
    if (TableData.jeolGiTable.length === 0) return "";
    const fromYeonGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const toWolGan = ['丙', '戊', '庚', '壬', '甲', '丙', '戊', '庚', '壬', '甲'];

    const strDate = `${dt.getUTCFullYear().toString().padStart(4, '0')}${(dt.getUTCMonth() + 1).toString().padStart(2, '0')}${dt.getUTCDate().toString().padStart(2, '0')}${dt.getUTCHours().toString().padStart(2, '0')}${dt.getUTCMinutes().toString().padStart(2, '0')}`;
    let jgIndex = this.bisectString(TableData.jeolGiTable, strDate) - 1;
    if (jgIndex < 0) jgIndex = 0;
    const sjMonth = jgIndex % 12;
    const years = Math.floor(jgIndex / 12) + 36;

    const yeonGan = TableData.hjChunJiTable[years % 60][0];
    const wjIndex = fromYeonGan.indexOf(yeonGan);
    const wgIndex = TableData.hjChunGanTable.indexOf(toWolGan[wjIndex]);

    const wolGan = TableData.hjChunGanTable[(wgIndex + sjMonth) % 10];
    const wolJi = TableData.hjJiJiTable[(sjMonth + 2) % 12];
    return wolGan + wolJi;
  }

  static getIlJu(dt: Date): string {
    if (TableData.hjChunJiTable.length === 0) return "";
    const iDate = Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate());
    const base = Date.UTC(1901, 0, 1);
    const days = Math.floor((iDate - base) / (1000 * 60 * 60 * 24)) + 15;
    return TableData.hjChunJiTable[((days % 60) + 60) % 60];
  }

  static getSiJu(dt: Date): string {
    if (TableData.hjChunJiTable.length === 0) return "";
    const fromIlGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const toSiGan = ['甲子', '丙子', '戊子', '庚子', '壬子', '甲子', '丙子', '戊子', '庚子', '壬子'];
    const siTable = ['0000', '0200', '0400', '0600', '0800', '1000', '1200', '1400', '1600', '1800', '2000', '2200', '2400'];

    const sjIlJu = this.getIlJu(dt);
    const ilGan = sjIlJu[0];
    const sIndex = fromIlGan.indexOf(ilGan);
    const sgIndex = TableData.hjChunJiTable.indexOf(toSiGan[sIndex]);

    const strTime = `${dt.getUTCHours().toString().padStart(2, '0')}${dt.getUTCMinutes().toString().padStart(2, '0')}`;
    let sjHour = this.bisectString(siTable, strTime) - 1;
    if (sjHour < 0) sjHour = 0;

    return TableData.hjChunJiTable[(sgIndex + sjHour) % 60];
  }

  static isSummerTime(dt: Date): boolean {
    if (TableData.summerTimeTable.length === 0) return false;
    const strDate = `${dt.getUTCFullYear()}${(dt.getUTCMonth() + 1).toString().padStart(2, '0')}${dt.getUTCDate().toString().padStart(2, '0')}${dt.getUTCHours().toString().padStart(2, '0')}${dt.getUTCMinutes().toString().padStart(2, '0')}`;
    const index = this.bisectString(TableData.summerTimeTable, strDate);
    return (index % 2) === 1;
  }

  static isKoreanLongitude(dt: Date): boolean {
    if (TableData.koreanTimeTable.length === 0) return false;
    const strDate = `${dt.getUTCFullYear()}${(dt.getUTCMonth() + 1).toString().padStart(2, '0')}${dt.getUTCDate().toString().padStart(2, '0')}${dt.getUTCHours().toString().padStart(2, '0')}${dt.getUTCMinutes().toString().padStart(2, '0')}`;
    const index = this.bisectString(TableData.koreanTimeTable, strDate);
    return (index % 2) === 1;
  }

  static getSaJuYaJaSiJoJaSi(dateTime: Date): string[] {
    let adjDt = new Date(dateTime.getTime());
    if (this.isSummerTime(adjDt)) adjDt = new Date(adjDt.getTime() - 60 * 60 * 1000);
    if (this.isKoreanLongitude(adjDt)) adjDt = new Date(adjDt.getTime() + 30 * 60 * 1000);

    const saju: string[] = [];
    saju.push(this.getSiJu(new Date(adjDt.getTime() + 30 * 60 * 1000))); // 시주

    const yajasiFlag = adjDt.getUTCHours() === 23;
    if (yajasiFlag) {
      saju.push(this.getIlJu(new Date(adjDt.getTime() - 30 * 60 * 1000))); // 일주
    } else {
      saju.push(this.getIlJu(new Date(adjDt.getTime() + 30 * 60 * 1000))); // 일주
    }

    saju.push(this.getWolJu(adjDt)); // 월주
    saju.push(this.getYeonJu(adjDt)); // 년주
    return saju;
  }
}