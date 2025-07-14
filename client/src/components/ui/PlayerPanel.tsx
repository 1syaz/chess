import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  decrementTimeout,
  selectGameStatus,
  selectPlayers,
} from "@/features/game/gameSlice";
import { handleTimeFormat } from "@/utils/handleTimeFormat";
import { useEffect, useRef } from "react";

function PlayerPanel() {
  const dispatch = useAppDispatch();
  const { player1, player2, playerColor } = useAppSelector(
    (state) => state.game,
  );
  const players = useAppSelector(selectPlayers);
  const gameStatus = useAppSelector(selectGameStatus);
  const player1Ref = useRef(player1);
  const player2Ref = useRef(player2);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!gameStatus.isGameOver) {
      interval = setInterval(
        () => dispatch(decrementTimeout(playerColor === "w" ? "p1" : "p2")),
        1000,
      );
    }
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, playerColor, gameStatus.isGameOver]);

  useEffect(() => {
    player1Ref.current = player1;
    player2Ref.current = player2;
  }, [player1, player2]);

  // save time in localstorage before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem(
        "players",
        JSON.stringify({
          players: {
            player1: player1Ref.current?.timeLeft,
            player2: player2Ref.current?.timeLeft,
          },
        }),
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  if (!player1 || !player2) return null;
  return (
    <div className="flex flex-row lg:flex-col justify-between  gap-4 border bg-custom-grey border-white/20 rounded-lg p-4">
      {players.map((player) => (
        <div
          key={player?.color}
          className="flex lg:flex-row flex-col-reverse items-center justify-between gap-4 "
        >
          <div className="flex gap-4 items-center">
            <img
              className="rounded-full w-10 h-10 lg:w-14 lg:h-14"
              src={player?.imgUrl}
              alt="Player 2"
            />
            <h3 className="font-medium text-xs lg:text-base">
              {player?.name ?? "player1"}
            </h3>
          </div>
          <div className="w-[60px] inline-block text-right text-lg font-semibold">
            {handleTimeFormat(player?.timeLeft ?? 1)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlayerPanel;
