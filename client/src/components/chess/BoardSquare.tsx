import { getChessBoardColor } from "@/utils/boardHelpers";
import { pieces } from "@/utils/pieces";
import type { Color } from "chess.js";
import PromotePieceDialog from "./PromotePieceDialog";
import { useAppSelector } from "@/app/hooks";
import type {
  BoardSquareState,
  ChessActions,
  DragState,
  PromotionState,
} from "@/types/types";

type BoardSquareProps = {
  dragState: DragState;
  promotionState: PromotionState;
  boardSquareState: BoardSquareState;
  chessActions: ChessActions;
};

function BoardSquare(props: BoardSquareProps) {
  const { playerColor } = useAppSelector((state) => state.game);
  const { boardSquareState, chessActions, dragState, promotionState } = props;

  const {
    colIdx,
    file,
    isCapture,
    isChecked,
    moveNotation,
    rank,
    rowIdx,
    square,
  } = boardSquareState;
  const {
    getValidMovesForSquare,
    handleClickMove,
    handleDragDropPieces,
    handleDragPiece,
    setHoveredSquare,
  } = chessActions;
  const { draggedSquare, hoveredSquare, possibleMoves } = dragState;
  const { handlePromotionSelect, isPromotion, setIsPromotion } = promotionState;

  const handleCloseDialog = () => {
    setIsPromotion((prev) => ({ ...prev!, status: false }));
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setHoveredSquare(moveNotation);
      }}
      onDragLeave={() => setHoveredSquare(null)}
      onDrop={() => handleDragDropPieces(moveNotation)}
      onClick={() => {
        handleClickMove(
          moveNotation,
          square?.type ?? "",
          (square?.color as Color) ?? playerColor,
        );
      }}
      className={`aspect-square flex relative items-center justify-center transition-colors duration-300 ${
        isChecked === moveNotation ? "bg-red-700" : ""
      } ${getChessBoardColor(rowIdx, colIdx)}`}
    >
      <div className="w-full h-full flex items-center justify-center relative">
        {isPromotion?.status && (
          <div
            className="inset-0 h-full w-full bg-black opacity-70 absolute z-20"
            onClick={(e) => {
              e.stopPropagation();
              handleCloseDialog();
            }}
          ></div>
        )}

        {/* Legal move dots or capture highlights */}
        {possibleMoves.find((move) => move.square === moveNotation) &&
        !isCapture ? (
          <div className="h-full w-full group hover:bg-black/30 cursor-pointer">
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 group-hover:bg-transparent rounded-full bg-black/60 z-20"></span>
          </div>
        ) : (
          isCapture && (
            <div className="h-full w-full absolute bg-red-400/80">
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full h-full w-full z-20"></span>
            </div>
          )
        )}

        {/* Piece */}
        {square?.color && square.type && (
          <img
            onClick={() => {
              handleClickMove(moveNotation, square.type, square.color);
            }}
            onDragStart={() => {
              getValidMovesForSquare(moveNotation);
              handleDragPiece(square.square, square.type, moveNotation);
            }}
            src={pieces.get(square.color + square.type.toUpperCase())}
            className="z-10 w-full h-full object-contain p-1"
            alt={square.type}
            draggable
          />
        )}
      </div>

      {/* Promotion dialog */}
      <PromotePieceDialog
        choosePiece={handlePromotionSelect}
        isPromotion={isPromotion}
        moveNotation={moveNotation}
      />

      {/* Coordinates */}
      {colIdx === 7 && (
        <span
          className={`absolute top-0.5 right-0.5 text-[10px] sm:text-xs font-bold ${
            (rowIdx + colIdx) % 2 === 0 ? "text-[#AE835F]" : "text-[#E6D0AE]"
          }`}
        >
          {rank}
        </span>
      )}
      {rowIdx === 7 && (
        <span
          className={`absolute bottom-0.5 left-0.5 text-[10px] sm:text-xs font-bold ${
            (rowIdx + colIdx) % 2 === 0 ? "text-[#AE835F]" : "text-[#E6D0AE]"
          }`}
        >
          {file}
        </span>
      )}
    </div>
  );
}

export default BoardSquare;
