import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GameState {
  isGameOver: boolean;
  isGameStarted: boolean;
  isLevelCompleted: boolean;
  level: number;
  numOfLevels: number;
  passwords: string[];
}

const initialState: GameState = {
  isGameOver: false,
  isGameStarted: false,
  isLevelCompleted: false,
  level: 1,
  numOfLevels: 1,
  passwords: [],
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    completeLevel: (state, action: PayloadAction<string>) => {
      state.level++;
      state.isLevelCompleted = true;
      state.passwords.push(action.payload);
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
    setNumOfLevels: (state, action: PayloadAction<number>) => {
      state.numOfLevels = action.payload;
    },
    reset: () => initialState,
  },
});

export const {
  completeLevel,
  finishGame,
  startGame,
  startLevel,
  setNumOfLevels,
  reset,
} = gameSlice.actions;

export default gameSlice.reducer;
