import { useAppDispatch, useAppSelector } from "@/app/hooks";
import ChessBoard from "@/components/chess/ChessBoard";
import PlayerInfo from "@/components/chess/PlayerInfo";
import DialogComponent from "@/components/DialogComponent";
import { Button } from "@/components/ui/button";
import { startGame } from "@/features/game/gameSlice";
import { useChessLogic } from "@/hooks/useChessLogic";
import { Chess } from "chess.js";
import { useEffect, useRef, useState } from "react";
import notifyAudio from "@/assets/sounds/GenericNotify.mp3";

const getInitialPlayerColor = () => {
  const saved = localStorage.getItem("chessGame");
  return saved ? JSON.parse(saved).playerColor : null;
};

const playerColorFromLS = getInitialPlayerColor();

function Match() {
  const dispatch = useAppDispatch();
  const [isResignPopupOpen, setIsResignPopupOpen] = useState<boolean>(false);
  const { fen, playerColor, board } = useAppSelector((state) => state.game);
  const gameRef = useRef<Chess>(new Chess(fen));
  const [gameOver, setGameOver] = useState<{
    isGameOver: boolean;
    message: string;
  }>(
    localStorage.getItem("gameover")
      ? JSON.parse(localStorage.getItem("gameover")!)
      : {
          isGameOver: false,
          message: "",
        },
  );

  const {
    isChecked,
    draggedSquare,
    hoveredSquare,
    possibleMoves,
    isPromotion,
    handleClickMove,
    handleDragDrop,
    setHoveredSquare,
    handleDragPiece,
    setIsPromotion,
    handlePromotionSelect,
    getValidMovesForSquare,
  } = useChessLogic(setGameOver, gameRef.current);

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
    setGameOver({ isGameOver: true, message });
    localStorage.setItem(
      "gameOver",
      JSON.stringify({ isGameOver: true, message }),
    );
    setIsResignPopupOpen(false);
  };

  useEffect(() => {
    dispatch(
      startGame({
        board: gameRef.current.board(),
        playerColor: playerColorFromLS ?? gameRef.current.turn(),
      }),
    );
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
          gameOver={gameOver}
          game={gameRef.current}
          isChecked={isChecked}
          draggedSquare={draggedSquare}
          hoveredSquare={hoveredSquare}
          possibleMoves={possibleMoves}
          isPromotion={isPromotion}
          handleClickMove={handleClickMove}
          handleDragDrop={handleDragDrop}
          setHoveredSquare={setHoveredSquare}
          handleDragPiece={handleDragPiece}
          setIsPromotion={setIsPromotion}
          handlePromotionSelect={handlePromotionSelect}
          getValidMovesForSquare={getValidMovesForSquare}
        />
        <PlayerInfo
          updateGame={handleGameUpdate}
          toggleResignPopup={setIsResignPopupOpen}
          gameOver={gameOver}
          setGameOver={setGameOver}
        />
      </div>
    </div>
  );
}

export default Match;
