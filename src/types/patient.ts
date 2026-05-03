export interface GameSession {
  date: string;
  duration: number; // minutes
  score: number;
  gameName: string;
  exerciseType: string;
}

export interface Patient {
  id: string;
  name: string;
  condition: string;
  startDate: string;
  age: number;
  weekSessions: number;
  avgTimeMins: number;
  scoreBefore: number;
  scoreNow: number;
  gameHistory: GameSession[];
  notes: string;
}
