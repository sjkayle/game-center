import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { IGame } from '../../config/games';

const initialState: GameState = {
  isGameOver: false,
  isGameStarted: false,
  isLevelCompleted: false,
  level: 1,
  numOfLevels: 1,
  selectedGame: '<name>',
  description: '',
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
      state.selectedGame = action.payload.label!;
      state.description = action.payload.description!;
      state.numOfLevels = action.payload.levels!;
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
  description: string;
}

export const isGameOver = (state: RootState) => state.game.isGameOver;

export const isGameStarted = (state: RootState) => state.game.isGameStarted;

export const isLevelCompleted = (state: RootState) =>
  state.game.isLevelCompleted;

export const level = (state: RootState) => state.game.level;

export const numOfLevels = (state: RootState) => state.game.numOfLevels;

export const selectedGame = (state: RootState) => state.game.selectedGame;

export const description = (state: RootState) => state.game.description;

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
