import type { AppDispatch } from "@/app/store";
import { setPlayers, startGame } from "@/features/game/gameSlice";
import type { Chess, Color } from "chess.js";
import type { SetStateAction } from "react";

export default function initLocalGame(
  dispatch: AppDispatch,
  gameRef: React.RefObject<Chess>,
  playerColorFromLS: string | null,
  setIsInGame: React.Dispatch<SetStateAction<boolean>>,
  timeInMS: string | null,
) {
  setIsInGame(true);

  const savedPlayersFromLS = localStorage.getItem("players");
  const parsedPlayers = savedPlayersFromLS && JSON.parse(savedPlayersFromLS);

  // temp hard coded
  const player1 = {
    name: "player1",
    timeLeft: parsedPlayers?.players?.player1 ?? Number(timeInMS),
    color: "w" as Color,
    imgUrl: "https://avatars.githubusercontent.com/u/132806487?v=4",
  };
  const player2 = {
    name: "player2",
    timeLeft: parsedPlayers?.players?.player2 ?? Number(timeInMS),
    color: "b" as Color,
    imgUrl: "https://github.com/shadcn.png",
  };

  dispatch(
    startGame({
      board: gameRef.current.board(),
      playerColor: (playerColorFromLS as Color) ?? "w",
    }),
  );
  dispatch(setPlayers([player1, player2]));
}
