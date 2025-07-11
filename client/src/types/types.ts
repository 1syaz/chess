import type { Color, PieceSymbol, Square } from "chess.js";

export type DragState = {
  draggedSquare: string | null;
  hoveredSquare: string | null;
  possibleMoves: { square: Square; isCapture?: boolean }[];
};

export type PromotionState = {
  isPromotion:
    | {
        to: string;
        from: string;
        status: boolean;
        color: "w" | "b";
      }
    | undefined;
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
};

export type BoardSquareState = {
  isCapture?: boolean;
  isChecked: string | null;
  square: {
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null;
  rank: number;
  file: string;
  rowIdx: number;
  colIdx: number;
  moveNotation: Square;
};

export type ChessActions = {
  handleClickMove: (
    square: Square,
    piece: string,
    color: string,
    promoteTo?: string,
  ) => void;
  handleDragPiece: (
    square: Square,
    piece: PieceSymbol,
    moveNotation: Square,
  ) => void;
  handleDragDropPieces: (to: string) => void;
  setHoveredSquare: React.Dispatch<React.SetStateAction<string | null>>;
  getValidMovesForSquare: (square: Square) => void;
};
