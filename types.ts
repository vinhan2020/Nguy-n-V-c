
export interface Player {
  id: string;
  name: string;
  isDealer: boolean;
}

export interface Round {
  id: number;
  dealerId: string;
  scores: Record<string, number>; // playerId -> score in that round
}

export interface PlayerStats {
  id: string;
  name: string;
  isDealer: boolean;
  total: number;
}
