import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGame } from '../../config/games';

const initialState: GameState = {
  isGameOver: false,
  isGameStarted: false,
  isLevelCompleted: false,
  level: 1,
  numOfLevels: 1,
  selectedGame: '<name>',
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    completeLevel: (state) => {
      state.level++;
      state.isLevelCompleted = true;
    },
    newGame: (state) => {
      state.isGameOver = false;
      state.isGameStarted = false;
      state.isLevelCompleted = false;
      state.level = 1;
    },
    finishGame: (state) => {
      state.isGameOver = true;
    },
    startGame: (state) => {
      state.isGameStarted = true;
    },
    startLevel: (state) => {
      state.isLevelCompleted = false;
    },
    setGame: (state, action: PayloadAction<Partial<IGame>>) => {
      state.numOfLevels = action.payload.levels!;
      state.selectedGame = action.payload.label!;
    },
    reset: () => initialState,
  },
});

interface GameState {
  isGameOver: boolean;
  isGameStarted: boolean;
  isLevelCompleted: boolean;
  level: number;
  numOfLevels: number;
  selectedGame: string;
}

export const {
  completeLevel,
  finishGame,
  newGame,
  startGame,
  startLevel,
  setGame,
  reset,
} = gameSlice.actions;

export default gameSlice.reducer;
