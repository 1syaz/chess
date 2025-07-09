import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "@/features/game/gameSlice";

export const store = configureStore({
  reducer: {
    game: gameReducer,
  },
});

// infering type from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
