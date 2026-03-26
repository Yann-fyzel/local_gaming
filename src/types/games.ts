export interface IGame {
  id: string;
  gameType: "tictactoe" | "hangman" | "battleship" | "sudoku" | "minesweeper";
  players: Player[];
  winner: string | null; // null si match nul ou solo
  status: "playing" | "finished" | "abandoned";
  resultData: {
    score?: number; // Pour le Démineur (temps en secondes)
    moves?: number; // Nombre de coups
    board?: unknown | null; // État final du plateau
  };
  duration: number; // Durée totale en secondes
  playedAt: Date;
}

export interface Player {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

export interface StatSGames {
  total: number;
  win: number;
  ratio: number;
}
