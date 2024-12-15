export interface User {
  eth_address: `0x${string}`;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface LoginData {
  token: string;
  expiry: string;
  user: User;
}

export interface KYMGameplay {
  id: number;
}

export interface KYMQuestion {
  id: number;
  gameplay_id: number;
  token_id: number;
  image_url: string;
  blurhash: string;
  color: string;
  title_options: string;
  artist_options: string;
  supply_options: string;
  season_options: string;
}

export interface KYMRevealedQuestion extends KYMQuestion {
  score: number;
  title: string;
  artist: string;
  supply: number;
  season: number;
  title_answer: string;
  artist_answer: string;
  supply_answer: number;
  season_answer: number;
  created_at: string;
  updated_at: string;
  gameplay: number;
}

export interface KYMGameplaySummary {
  id: number;
  score: number;
  questions: KYMRevealedQuestion[]
}

export interface Game {
  id: number;
  name: string;
  description: string;
  eth_address: `0x${string}`;
  url: string;
  nft_address: `0x${string}`;
  created_at: string;
  updated_at: string;
}

export interface Score {
  id: number;
  game: Game;
  score: number;
  created_at: string;
  updated_at: string;
}

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: string;
}

export type Paginated<T> = {
  count: number;
  next: string;
  previous: string;
  results: T[];
}