// src/lib/ziwei-chart/lunarCalendar.ts

import { TableData } from './jamidusuTable';

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
}

export class LunarCalendar {
  static readonly baseYear = 1881;
  static readonly dateFrom = 686686;

  static bisectRight(a: number[], x: number): number {
    let lo = 0;
    let hi = a.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (a[mid] <= x) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  static sol2Lun(year: number, month: number, day: number, leap = false): LunarDate | null {
    if (TableData.monthTable.length === 0) return null; // 테이블 데이터 없을 시 방어 로직

    const target = Date.UTC(year, month - 1, day);
    const base = Date.UTC(1881, 0, 30);
    const diffTime = target - base;
    let days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + this.dateFrom;

    if (days < this.dateFrom) return null;

    days -= this.dateFrom;
    const mIdx = this.bisectRight(TableData.monthTable, days) - 1;
    const yIdx = this.bisectRight(TableData.yearTable, mIdx) - 1;

    let lunMonth = mIdx - TableData.yearTable[yIdx] + 1;
    const lunDay = days - TableData.monthTable[mIdx] + 1;
    let isLeap = false;

    const leapM = TableData.leapTable[yIdx];
    const effectiveLeapMonth = leapM === 0 ? 13 : leapM;

    if (effectiveLeapMonth < lunMonth) {
      lunMonth -= 1;
      isLeap = (leapM === lunMonth);
    }

    return { year: yIdx + this.baseYear, month: lunMonth, day: lunDay, isLeap };
  }
}