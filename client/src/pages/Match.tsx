import notifyAudio from "@/assets/sounds/GenericNotify.mp3";
import ChessBoard from "@/components/chess/ChessBoard";
import PlayerInfo from "@/components/chess/PlayerInfo";
import DialogComponent from "@/components/DialogComponent";
import { Button } from "@/components/ui/button";
import { Chess, type Color } from "chess.js";
import {
  selectBoard,
  selectFen,
  selectPlayerColor,
  setGameStatus,
  setPlayers,
  startGame,
} from "@/features/game/gameSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useChessLogic } from "@/hooks/useChessLogic";
import { useEffect, useRef, useState } from "react";

const getInitialPlayerColor = () => {
  const saved = localStorage.getItem("chessGame");
  return saved ? JSON.parse(saved).playerColor : null;
};

const playerColorFromLS = getInitialPlayerColor();

function Match() {
  const [isResignPopupOpen, setIsResignPopupOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const fen = useAppSelector(selectFen);
  const playerColor = useAppSelector(selectPlayerColor);
  const board = useAppSelector(selectBoard);
  const gameRef = useRef<Chess>(new Chess(fen));

  const {
    isChecked,
    possibleMoves,
    isPromotion,
    handleClickMove,
    handleDragDrop,
    handleDragPiece,
    setIsPromotion,
    handlePromotionSelect,
    getValidMovesForSquare,
  } = useChessLogic(gameRef.current);

  const handleGameUpdate = (game: Chess) => {
    gameRef.current = game;
  };

  const handleResign = () => {
    const notifySound = new Audio(notifyAudio);
    const turn = gameRef.current.turn();
    notifySound.play();

    const message = `${turn === "w" ? "Black" : "White"} wins — ${
      turn === "w" ? "White" : "Black"
    } resigned.`;
    dispatch(setGameStatus({ isGameOver: true, message }));
    localStorage.setItem(
      "gameOver",
      JSON.stringify({ isGameOver: true, message }),
    );
    setIsResignPopupOpen(false);
  };

  // starting game
  useEffect(() => {
    const savedPlayersFromLS = localStorage.getItem("players");
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

    dispatch(
      startGame({
        board: gameRef.current.board(),
        playerColor: playerColorFromLS ?? gameRef.current.turn(),
      }),
    );
    dispatch(setPlayers([player1, player2]));
  }, [dispatch]);

  // TODO update
  if (!board || !playerColor) {
    return <div>Loading game...</div>;
  }

  return (
    <div className="relative gradient min-h-screen w-full text-white flex items-center justify-center p-4">
      {isResignPopupOpen && (
        <DialogComponent
          toggleDialog={setIsResignPopupOpen}
          isDialogOpen={isResignPopupOpen}
          dialogTitle={"Are you sure you want to resign?"}
        >
          <div className="flex items-center justify-end gap-2">
            <Button onClick={() => setIsResignPopupOpen(false)}>No</Button>
            <Button onClick={handleResign} variant="destructive">
              Yes
            </Button>
          </div>
        </DialogComponent>
      )}
      <div className="flex flex-col-reverse lg:flex-row items-start justify-center gap-3">
        <ChessBoard
          game={gameRef.current}
          isChecked={isChecked}
          possibleMoves={possibleMoves}
          isPromotion={isPromotion}
          handleClickMove={handleClickMove}
          handleDragDrop={handleDragDrop}
          handleDragPiece={handleDragPiece}
          setIsPromotion={setIsPromotion}
          handlePromotionSelect={handlePromotionSelect}
          getValidMovesForSquare={getValidMovesForSquare}
        />
        <PlayerInfo
          updateGame={handleGameUpdate}
          toggleResignPopup={setIsResignPopupOpen}
        />
      </div>
    </div>
  );
}

export default Match;
