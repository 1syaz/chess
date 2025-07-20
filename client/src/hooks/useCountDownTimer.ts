import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  decrementTimeout,
  selectGameStatus,
  selectPlayerColor,
} from "@/features/game/gameSlice";
import { useEffect } from "react";

export const useCountDownTime = () => {
  const playerColor = useAppSelector(selectPlayerColor);
  const gameStatus = useAppSelector(selectGameStatus);
  const dispatch = useAppDispatch();
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!gameStatus.isGameOver) {
      interval = setInterval(
        () => dispatch(decrementTimeout(playerColor === "w" ? "p1" : "p2")),
        1000
      );
    }
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, playerColor, gameStatus.isGameOver]);
};
