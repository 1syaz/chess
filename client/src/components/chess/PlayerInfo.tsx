import { Chess } from "chess.js";
import GameButtons from "./GameButtons";
import notifyAudio from "@/assets/sounds/GenericNotify.mp3";
import GameOverButtons from "./GameOverButtons";
import { type Dispatch, type SetStateAction } from "react";
import { useAppDispatch } from "@/app/hooks";
import { resetGame, setBoard } from "@/features/game/gameSlice";

interface PlayerInfoProps {
  toggleResignPopup: React.Dispatch<SetStateAction<boolean>>;
  updateGame: (game: Chess) => void;
  gameOver: {
    isGameOver: boolean;
    message: string;
  };
  setGameOver: Dispatch<
    SetStateAction<{ isGameOver: boolean; message: string }>
  >;
}

function PlayerInfo({
  toggleResignPopup,
  updateGame,
  gameOver,
  setGameOver,
}: PlayerInfoProps) {
  const dispatch = useAppDispatch();
  const notifySound = new Audio(notifyAudio);

  const handleDraw = () => {
    console.log("draw");
  };

  const handleTakeback = () => {
    console.log("takeback");
  };

  const handlePlayAgain = () => {
    notifySound.play();
    const newGame = new Chess();
    const turn = newGame.turn();
    updateGame(newGame);
    dispatch(resetGame(turn));
    dispatch(setBoard(newGame.board()));
    setGameOver({
      isGameOver: false,
      message: "",
    });
    localStorage.removeItem("gameOver");
    localStorage.removeItem("chessState");
  };

  return (
    <section className="flex flex-col w-full  gap-4 relative h-fit lg:max-w-[300px]">
      <div className="flex flex-row lg:flex-col justify-between  gap-4 border bg-custom-grey border-white/20 rounded-lg p-4">
        {/* Opponent */}
        <div className="flex lg:flex-row flex-col-reverse items-center justify-between gap-4 ">
          <div className="flex gap-4 items-center">
            <img
              className="rounded-full w-10 h-10 lg:w-14 lg:h-14"
              src="https://github.com/shadcn.png"
              alt="Player 2"
            />
            <h3 className="font-medium text-xs lg:text-base">Player 2</h3>
          </div>
          <div className="text-lg lg:text-xl font-mono font-bold">10:00</div>
        </div>

        {/* Current Player (You) */}
        <div className="flex lg:flex-row flex-col-reverse items-center justify-between gap-4 ">
          <div className="flex lg:flex-row flex-row-reverse gap-4 items-center">
            <div className="relative">
              <img
                className="border-4 border-green-500 rounded-full w-10 h-10 lg:w-14 lg:h-14"
                src="https://play-lh.googleusercontent.com/YA_VX_XkrHW_rX4zaTuIXi0dBx80BFxfDlSf5f4Q7_-09TQq9rImbD7V8PlMQX_JN4Ai=w950-h950"
                alt="You"
              />
              <span className="w-4 h-4 top-0 right-0 bg-green-500 p-2 absolute rounded-full"></span>
            </div>
            <h3 className="font-medium text-xs lg:text-base">You</h3>
          </div>
          <div className="text-lg lg:text-xl font-mono font-bold">10:00</div>
        </div>
      </div>

      {/* Game Controls */}
      {!gameOver.isGameOver ? (
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
