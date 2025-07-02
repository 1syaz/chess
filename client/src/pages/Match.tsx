import ChessBoardSection from "@/components/chess/ChessBoardSection";
import PlayerInfo from "@/components/chess/PlayerInfo";
import { useChessGame } from "@/hooks/useChessGame";
import { useState } from "react";

function Match() {
  // TODO
  const [gameStatus, setGameStatus] = useState<{
    isCheckmate: boolean;
    isStalemate: boolean;
    isDraw: boolean;
    isInsufficientMaterial: boolean;
  }>({
    isCheckmate: false,
    isStalemate: false,
    isDraw: false,
    isInsufficientMaterial: false,
  });

  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
  const {
    board,
    game,
    isChecked,
    draggedSquare,
    hoveredSquare,
    possibleMoves,
    isPromotion,
    handleClickMove,
    handleDragDrop,
    setBoard,
    setHoveredSquare,
    handleDragPiece,
    setIsPromotion,
    handlePromotionSelect,
    getValidMovesForSquare,
  } = useChessGame(playerColor, setGameStatus, setPlayerColor);

  return (
    <div className="gradient min-h-screen w-full text-white flex items-center justify-center p-4">
      <div className="flex flex-col-reverse lg:flex-row items-start justify-center gap-3">
        <ChessBoardSection
          gameStatus={gameStatus}
          board={board}
          game={game}
          isChecked={isChecked}
          draggedSquare={draggedSquare}
          hoveredSquare={hoveredSquare}
          possibleMoves={possibleMoves}
          isPromotion={isPromotion}
          playerColor={playerColor}
          handleClickMove={handleClickMove}
          handleDragDrop={handleDragDrop}
          setBoard={setBoard}
          setHoveredSquare={setHoveredSquare}
          handleDragPiece={handleDragPiece}
          setIsPromotion={setIsPromotion}
          handlePromotionSelect={handlePromotionSelect}
          getValidMovesForSquare={getValidMovesForSquare}
        />

        <PlayerInfo gameStatus={gameStatus} />
      </div>
    </div>
  );
}

export default Match;
