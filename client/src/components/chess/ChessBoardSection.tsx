import { type Square } from "chess.js";
import React, { useEffect, useState } from "react";
import { getFiles, getRanks } from "@/utils/boardHelpers";
import BoardSquare from "./BoardSquare";
import { useChessGame } from "@/hooks/useChessGame";
import GameOverWrapper from "./GameOverWrapper";

interface ChessBoardSectionProps {
  gameStatus: {
    isCheckmate: boolean;
    isStalemate: boolean;
    isDraw: boolean;
    isInsufficientMaterial: boolean;
  };
  setGameStatus: React.Dispatch<
    React.SetStateAction<{
      isCheckmate: boolean;
      isStalemate: boolean;
      isDraw: boolean;
      isInsufficientMaterial: boolean;
    }>
  >;
}

function ChessBoardSection({
  gameStatus,
  setGameStatus,
}: ChessBoardSectionProps) {
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

  // useEffect(() => {
  //   if (!playerColor) return;
  //   if (playerColor === "w") {
  //     setBoard(game.board());
  //   } else {
  //     setBoard(game.board().slice().reverse());
  //   }
  // }, [playerColor]);

  return (
    <section className="flex items-center justify-center w-full h-full">
      <div className="w-full max-w-[min(100vw-2rem,100vh-2rem,700px)] aspect-square relative ">
        {/* Wrapper for end game */}
        <GameOverWrapper gameStatus={gameStatus} />
        <div className="w-full h-full border border-white/20 rounded-lg bg-custom-grey overflow-hidden">
          <div className="grid grid-cols-8 w-full h-full">
            {board.map((b, rowIdx) =>
              b.map((square, colIdx) => {
                const file = getFiles(playerColor as "w" | "b", colIdx);
                const rank = getRanks(playerColor as "w" | "b", rowIdx);
                const moveNotation = `${file}${rank}` as Square;
                const match = possibleMoves.find(
                  (mv) => mv.square === moveNotation,
                );
                const isPieceCapture = match?.isCapture;
                return (
                  <BoardSquare
                    key={`${rowIdx}-${colIdx}`}
                    rank={rank}
                    file={file}
                    colIdx={colIdx}
                    rowIdx={rowIdx}
                    square={square}
                    isCapture={isPieceCapture}
                    moveNotation={moveNotation}
                    draggedSquare={draggedSquare}
                    hoveredSquare={hoveredSquare}
                    possibleMoves={possibleMoves}
                    playerColor={playerColor}
                    isPromotion={isPromotion}
                    isChecked={isChecked}
                    setHoveredSquare={setHoveredSquare}
                    handleDragDropPieces={handleDragDrop}
                    handleClickMove={handleClickMove}
                    handleDragPiece={handleDragPiece}
                    setIsPromotion={setIsPromotion}
                    handlePromotionSelect={handlePromotionSelect}
                    getValidMovesForSquare={getValidMovesForSquare}
                  />
                );
              }),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChessBoardSection;
