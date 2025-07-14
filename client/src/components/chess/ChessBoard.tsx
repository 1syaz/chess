import { Chess, type PieceSymbol, type Square } from "chess.js";
import { getFiles, getRanks } from "@/utils/boardHelpers";
import BoardSquare from "./BoardSquare";
import GameOverWrapper from "./GameOverWrapper";
import { useAppSelector } from "@/app/hooks";
import { selectBoard, selectPlayerColor } from "@/features/game/gameSlice";

interface ChessBoardProps {
  game: Chess;
  isChecked: string | null;
  possibleMoves: {
    square: Square;
    isCapture?: boolean;
  }[];
  isPromotion:
    | {
        to: string;
        from: string;
        status: boolean;
        color: "w" | "b";
      }
    | undefined;
  handleClickMove: (
    square: Square,
    piece: string,
    color: string,
    promoteTo?: string,
  ) => void;
  handleDragDrop: (to: string) => void;
  handleDragPiece: (
    square: Square,
    piece: PieceSymbol,
    moveNotation: Square,
  ) => void;
  setIsPromotion: React.Dispatch<
    React.SetStateAction<
      | {
          to: string;
          from: string;
          status: boolean;
          color: "w" | "b";
        }
      | undefined
    >
  >;
  handlePromotionSelect: (promotionPiece: string) => void;
  getValidMovesForSquare: (square: Square) => void;
}

function ChessBoard(props: ChessBoardProps) {
  const {
    // gameOver,
    isChecked,
    possibleMoves,
    isPromotion,
    handleClickMove,
    handleDragDrop,
    handleDragPiece,
    setIsPromotion,
    handlePromotionSelect,
    getValidMovesForSquare,
  } = props;

  const board = useAppSelector(selectBoard);
  const playerColor = useAppSelector(selectPlayerColor);

  return (
    <section className="flex items-center justify-center w-full h-full">
      <div className="w-full max-w-[min(100vw-2rem,100vh-2rem,700px)] aspect-square relative ">
        {/* Wrapper for end game */}
        <GameOverWrapper />
        <div className="w-full h-full border border-white/20 rounded-lg bg-custom-grey overflow-hidden">
          <div className="grid grid-cols-8 w-full h-full">
            {board!.map((b, rowIdx) =>
              b.map((square, colIdx) => {
                const file = getFiles(playerColor as "w" | "b", colIdx);
                const rank = getRanks(playerColor as "w" | "b", rowIdx);
                const moveNotation = `${file}${rank}` as Square;
                const match = possibleMoves.find(
                  (mv) => mv.square === moveNotation,
                );
                const isPieceCapture = match?.isCapture;

                // prop
                const dragState = {
                  possibleMoves,
                };
                const promotionState = {
                  isPromotion,
                  setIsPromotion,
                  handlePromotionSelect,
                };
                const boardSquareState = {
                  isCapture: isPieceCapture,
                  isChecked: isChecked,
                  square,
                  rank,
                  file,
                  colIdx,
                  rowIdx,
                  moveNotation,
                };
                const chessActions = {
                  handleClickMove,
                  handleDragPiece,
                  handleDragDropPieces: handleDragDrop,
                  getValidMovesForSquare,
                };
                return (
                  <BoardSquare
                    key={`${rowIdx}-${colIdx}`}
                    chessActions={chessActions}
                    boardSquareState={boardSquareState}
                    promotionState={promotionState}
                    dragState={dragState}
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

export default ChessBoard;
