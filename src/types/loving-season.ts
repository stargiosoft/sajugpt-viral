export type Gender = 'male' | 'female';

export interface LovingSeasonInput {
  name?: string;
  birthday: string;
  birthTime: string;
  gender: Gender;
}

export interface LovingSeasonApiResponse {
  success: boolean;
  firstSeason: string;
  allSeasons: string[];
  requestId: string;
}

export interface LovingSeasonRecord {
  resultId: string;
  gender: Gender;
  birthday: string;
  birthTime: string | null;
  firstSeason: string;
  allSeasons: string[];
  createdAt: string;
}