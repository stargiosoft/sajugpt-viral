export interface CharacterMeta {
  id: string;
  name: string;
  archetype: string;
  thumbnail: string;
  triggerCondition: string;
  priority: number;
}

export const CHARACTERS: CharacterMeta[] = [
  {
    id: 'yoon-taesan',
    name: '윤태산',
    archetype: '야수형 짐승남',
    thumbnail: '/characters/yoon-taesan.webp',
    triggerCondition: 'doHwaSal_or_hongYeomSal',
    priority: 1,
  },
  {
    id: 'do-haegyeol',
    name: '도해결',
    archetype: '지적 엘리트 심리분석가',
    thumbnail: '/characters/do-haegyeol.webp',
    triggerCondition: 'pyeonGwan',
    priority: 2,
  },
  {
    id: 'seo-hwiyoon',
    name: '서휘윤',
    archetype: '치유형 연하남',
    thumbnail: '/characters/seo-hwiyoon.webp',
    triggerCondition: 'sangGwan',
    priority: 3,
  },
  {
    id: 'gi-jimun',
    name: '기지문',
    archetype: '무뚝뚝 경호원형',
    thumbnail: '/characters/gi-jimun.webp',
    triggerCondition: 'sikSin',
    priority: 4,
  },
  {
    id: 'choi-seolgye',
    name: '최설계',
    archetype: '도시형 전략가',
    thumbnail: '/characters/choi-seolgye.webp',
    triggerCondition: 'fire',
    priority: 5,
  },
];
