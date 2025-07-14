import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Color, type PieceSymbol, type Square } from "chess.js";

export interface GameState {
  player1: {
    name: string;
    timeLeft: number;
    color: Color;
    imgUrl: string;
  } | null;
  player2: {
    name: string;
    timeLeft: number;
    color: Color;
    imgUrl: string;
  } | null;
  board:
    | ({
        square: Square;
        type: PieceSymbol;
        color: Color;
      } | null)[][]
    | null;
  gameStatus: { isGameOver: boolean; message: string };
  playerColor: Color | null;
  fen: string;
}

const savedStateFromLS = localStorage.getItem("chessGame");
const parsedGame = savedStateFromLS ? JSON.parse(savedStateFromLS) : null;

const initialState: GameState = {
  player1: null,
  player2: null,
  board: null,
  gameStatus: localStorage.getItem("gameOver")
    ? JSON.parse(localStorage.getItem("gameOver")!)
    : {
        isGameOver: false,
        message: "",
      },

  playerColor: null,
  fen:
    parsedGame?.fen ??
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
};

export const gameSlice = createSlice({
  name: "game",

  initialState,
  reducers: {
    setGameStatus: (
      state,
      action: PayloadAction<{ isGameOver: boolean; message: string }>,
    ) => {
      state.gameStatus.isGameOver = action.payload.isGameOver;
      state.gameStatus.message = action.payload.message;
    },
    setFen: (state, action: PayloadAction<string>) => {
      state.fen = action.payload;
    },
    setPlayerColor: (state, action: PayloadAction<Color>) => {
      state.playerColor = action.payload;
    },
    setPlayers: (
      state,
      action: PayloadAction<
        { name: string; timeLeft: number; color: Color; imgUrl: string }[]
      >,
    ) => {
      state.player1 = action.payload[0];
      state.player2 = action.payload[1];
    },
    setBoard: (
      state,
      action: PayloadAction<
        ({
          square: Square;
          type: PieceSymbol;
          color: Color;
        } | null)[][]
      >,
    ) => {
      state.board = action.payload;
    },
    decrementTimeout: (state, action: PayloadAction<"p1" | "p2">) => {
      if (action.payload === "p1" && state.player1) {
        state.player1.timeLeft -= 1000;
      } else if (state.player2) {
        state.player2.timeLeft -= 1000;
      }
    },
    resetGame: (state, action: PayloadAction<Color>) => {
      state.board = null;
      state.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      state.gameStatus = {
        isGameOver: false,
        message: "",
      };
      state.playerColor = action.payload;
      state.player1 = null;
      state.player2 = null;
    },
    startGame: (
      state,
      action: PayloadAction<{
        board: ({
          square: Square;
          type: PieceSymbol;
          color: Color;
        } | null)[][];
        playerColor: Color;
      }>,
    ) => {
      state.board = action.payload.board;
      state.playerColor = action.payload.playerColor;
    },
  },
});

export const {
  setGameStatus,
  setFen,
  setPlayerColor,
  setBoard,
  startGame,
  resetGame,
  setPlayers,
  decrementTimeout,
} = gameSlice.actions;

// selector
export const selectFen = (state: RootState) => state.game.fen;
export const selectBoard = (state: RootState) => state.game.board;
export const selectPlayerColor = (state: RootState) => state.game.playerColor;
export const selectGameStatus = (state: RootState) => state.game.gameStatus;

export const selectPlayers = createSelector(
  [
    (state: RootState) => state.game.player1,
    (state: RootState) => state.game.player2,
  ],
  (player1, player2) => [player1, player2],
);

export default gameSlice.reducer;
