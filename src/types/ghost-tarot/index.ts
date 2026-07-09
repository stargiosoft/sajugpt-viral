export interface GhostCardData {
  id: string;
  card_name: string;
  front_image: string;
}

export type GhostCard = GhostCardData;

export interface GhostResult {
  id: string;
  card_name: string;
  front_image: string;
  july_title: string;
  july_message: string;
  july_summary: string;
  august_title: string;
  august_message: string;
  august_summary: string;
  solution_title: string;
  solution_message: string;
  created_at?: string;
}