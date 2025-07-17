import { Chess, type Color } from "chess.js";
import GameButtons from "./GameButtons";
import notifyAudio from "@/assets/sounds/GenericNotify.mp3";
import GameOverButtons from "./GameOverButtons";
import { useRef, type SetStateAction } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  resetGame,
  selectGameStatus,
  selectPlayerColor,
  setBoard,
  setGameStatus,
  setPlayers,
} from "@/features/game/gameSlice";
import PlayerPanel from "../ui/PlayerPanel";

interface PlayerInfoProps {
  toggleResignPopup: React.Dispatch<SetStateAction<boolean>>;
  gameRef: React.RefObject<Chess>;
  timeInMS: string | null;
}

function MatchPanel({ toggleResignPopup, gameRef, timeInMS }: PlayerInfoProps) {
  const dispatch = useAppDispatch();
  const gameStatus = useAppSelector(selectGameStatus);
  const playerColor = useAppSelector(selectPlayerColor);
  const notifySound = new Audio(notifyAudio);
  const lowTimePlayedTrackRef = useRef({ p1: false, p2: false });

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
    const turn = newGame.turn();
    const savedPlayersFromLS = localStorage.getItem("players");
    const parsedPlayers = savedPlayersFromLS
      ? JSON.parse(savedPlayersFromLS)
      : null;

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

    lowTimePlayedTrackRef.current = { p1: false, p2: false };
    gameRef.current = newGame;
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

  const handleFinishTimeGameOver = () => {
    const notifySound = new Audio(notifyAudio);
    notifySound.play();

    const message = `${playerColor === "w" ? "Black" : "White"} wins — ${playerColor === "b" ? "Black" : "White"} ran out of time.`;
    dispatch(setGameStatus({ isGameOver: true, message }));
    localStorage.setItem(
      "gameOver",
      JSON.stringify({ isGameOver: true, message }),
    );
  };

  return (
    <section className="flex flex-col w-full gap-4 relative h-fit lg:max-w-[300px]">
      <PlayerPanel
        lowTimePlayedTrack={lowTimePlayedTrackRef}
        handleFinishTimeGameOver={handleFinishTimeGameOver}
      />
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

export default MatchPanel;
