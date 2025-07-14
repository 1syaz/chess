import { Chess, type Color } from "chess.js";
import GameButtons from "./GameButtons";
import notifyAudio from "@/assets/sounds/GenericNotify.mp3";
import GameOverButtons from "./GameOverButtons";
import { type SetStateAction } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  resetGame,
  selectGameStatus,
  setBoard,
  setGameStatus,
  setPlayers,
} from "@/features/game/gameSlice";
import PlayerPanel from "../ui/PlayerPanel";

interface PlayerInfoProps {
  toggleResignPopup: React.Dispatch<SetStateAction<boolean>>;
  updateGame: (game: Chess) => void;
}

function PlayerInfo({ toggleResignPopup, updateGame }: PlayerInfoProps) {
  const dispatch = useAppDispatch();
  const gameStatus = useAppSelector(selectGameStatus);
  const notifySound = new Audio(notifyAudio);

  const handleDraw = () => {
    console.log("draw");
  };

  const handleTakeback = () => {
    console.log("takeback");
  };

  const handlePlayAgain = () => {
    notifySound.play();
    localStorage.removeItem("gameOver");
    localStorage.removeItem("players");
    localStorage.removeItem("chessGame");
    const newGame = new Chess();
    const savedPlayersFromLS = localStorage.getItem("players");
    const turn = newGame.turn();
    const parsedPlayers = savedPlayersFromLS
      ? JSON.parse(savedPlayersFromLS)
      : null;

    // temp hard coded
    const player1 = {
      name: "player1",
      timeLeft: parsedPlayers?.players?.player1 ?? 600000,
      color: "w" as Color,
      imgUrl: "https://avatars.githubusercontent.com/u/132806487?v=4",
    };
    const player2 = {
      name: "player2",
      timeLeft: parsedPlayers?.players?.player2 ?? 600000,
      color: "b" as Color,
      imgUrl: "https://github.com/shadcn.png",
    };

    updateGame(newGame);
    dispatch(resetGame(turn));
    dispatch(setBoard(newGame.board()));
    dispatch(setPlayers([player1, player2]));
    dispatch(
      setGameStatus({
        isGameOver: false,
        message: "",
      }),
    );
  };

  return (
    <section className="flex flex-col w-full gap-4 relative h-fit lg:max-w-[300px]">
      <PlayerPanel />
      {!gameStatus.isGameOver ? (
        <GameButtons
          toggleResignPopup={toggleResignPopup}
          handleDraw={handleDraw}
          handleTakeback={handleTakeback}
        />
      ) : (
        <GameOverButtons handlePlayAgain={handlePlayAgain} />
      )}
    </section>
  );
}

export default PlayerInfo;
