import type { Gender } from '@/types/battle';

export type DeangStep = 'landing' | 'input' | 'analyzing' | 'result';

export type DayStemKey =
  | 'gap'
  | 'eul'
  | 'byeong'
  | 'jeong'
  | 'mu'
  | 'gi'
  | 'gyeong'
  | 'sin'
  | 'im'
  | 'gye';

export type DogCode =
  | 'jindo'
  | 'pomeranian'
  | 'welsh_corgi'
  | 'papillon'
  | 'great_pyrenees'
  | 'shiba'
  | 'doberman'
  | 'maltese'
  | 'golden_retriever'
  | 'poodle';

export interface DeangStats {
  leadership: number;
  affection: number;
  perceptiveness: number;
  independence: number;
  attachment: number;
}

export interface DeangBreed {
  code: DogCode;
  key: DayStemKey;
  stemName: string;
  breedName: string;
  title: string;
  hashtags: string[];
  baseStats: DeangStats;
  temperament: string;
  socialStyle: string;
  loveStyle: string;
  workStyle: string;
  quips: string[];
}

export interface DeangProfileData {
  breed: DeangBreed;
  stats: DeangStats;
  bestMatch: DeangBreed;
  worstMatch: DeangBreed;
  quip: string;
}

export interface DeangResult {
  resultId: string;
  birthDate: string;
  birthTime: string;
  unknownTime: boolean;
  gender: Gender;
  profile: DeangProfileData;
  createdAt: string;
}
