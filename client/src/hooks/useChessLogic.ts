import {
  Chess,
  type Color,
  type Piece,
  type PieceSymbol,
  type Square,
} from "chess.js";

import { useRef, useState, type SetStateAction } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectPlayerColor,
  setBoard,
  setGameStatus,
  setPlayerColor,
} from "@/features/game/gameSlice";

import moveAudio from "@/assets/sounds/Move.mp3";
import captureAudio from "@/assets/sounds/Capture.mp3";
import notifyAudio from "@/assets/sounds/GenericNotify.mp3";
import checkAudio from "@/assets/sounds/Check.mp3";

export function useChessLogic(
  game: Chess,
  setIsInGame: React.Dispatch<SetStateAction<boolean>>,
) {
  const playerColor = useAppSelector(selectPlayerColor);
  const dragInfoRef = useRef<{ from: string; piece: string } | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [isChecked, setIsChecked] = useState<string | null>(null);

  const [isPromotion, setIsPromotion] = useState<{
    to: string;
    from: string;
    status: boolean;
    color: "w" | "b";
  }>();
  const [possibleMoves, setPossibleMoves] = useState<
    {
      square: Square;
      isCapture?: boolean;
    }[]
  >([]);
  const dispatch = useAppDispatch();

  // === game audios
  const movePieceAudio = useRef(new Audio(moveAudio));
  const capturePieceAudio = useRef(new Audio(captureAudio));
  const notifySound = useRef(new Audio(notifyAudio));
  const checkSound = useRef(new Audio(checkAudio));

  // === utils
  const finalizeMove = (capture = false) => {
    const color = game.turn();
    dispatch(setPlayerColor(playerColor === "w" ? "b" : "w"));
    dispatch(setBoard(game.board()));
    setSelectedSquare(null);
    setPossibleMoves([]);
    saveGameInLocalStorage(game.fen());
    handleCheck(color, capture);
    handleEndGame();
  };

  const getPromotion = (from: Square, to: Square) => {
    for (const move of game.moves({ verbose: true })) {
      if (move.from === from && move.to === to && move.promotion) {
        setIsPromotion({
          color: move.color,
          from: move.from,
          status: true,
          to: move.to,
        });
        return true;
      }
    }
    return false;
  };

  const saveGameInLocalStorage = (fen: string) => {
    const gameState = {
      fen,
      playerColor: playerColor === "w" ? "b" : "w",
    };
    localStorage.setItem("chessGame", JSON.stringify(gameState));
  };

  const handlePromotion = (
    from: Square | string,
    to: Square | string,
    promoteTo?: string,
  ) => {
    if (!promoteTo) return;

    game.move({
      from,
      to,
      promotion: promoteTo ?? "q",
    });

    setIsPromotion((prev) => ({ ...prev!, status: false }));
    finalizeMove();
  };

  const handlePromotionSelect = (promotionPiece: string) => {
    if (selectedSquare && isPromotion?.to) {
      handlePromotion(selectedSquare, isPromotion.to, promotionPiece);
    }
    if (dragInfoRef.current && isPromotion?.to) {
      handlePromotion(dragInfoRef.current.from, isPromotion.to, promotionPiece);
    }
  };

  const getValidMovesForSquare = (square: Square) => {
    const moves = game.moves({ square, verbose: true });
    const mapped = moves.map((m) => {
      const targetPieceSquare = game.get(m.to);

      return {
        square: m.to,
        isCapture: targetPieceSquare && targetPieceSquare.color !== playerColor,
      };
    });
    setPossibleMoves(mapped);
  };

  const handleEndGame = () => {
    const isCheckmate = game.isCheckmate();

    if (isCheckmate) {
      setIsInGame(false);
      setIsChecked(null);
      notifySound.current.play();
      const turn = game.turn();
      const message = `${turn === "w" ? "Black" : "White"} won by checkmate`;
      dispatch(
        setGameStatus({
          isGameOver: true,
          message,
        }),
      );

      localStorage.setItem(
        "gameOver",
        JSON.stringify({
          isGameOver: true,
          message,
        }),
      );
    }

    const isStalemate = game.isStalemate();

    if (isStalemate) {
      setIsInGame(false);
      notifySound.current.play();
      const message = "Stalemate! No legal moves — it's a draw";
      dispatch(
        setGameStatus({
          isGameOver: true,
          message,
        }),
      );
      localStorage.setItem(
        "gameOver",
        JSON.stringify({
          isGameOver: true,
          message,
        }),
      );
    }

    const isDraw = game.isDraw();

    if (isDraw) {
      setIsInGame(false);
      notifySound.current.play();
      const message = "Draw! The game ended with no winner";
      dispatch(
        setGameStatus({
          isGameOver: true,
          message,
        }),
      );
      localStorage.setItem(
        "gameOver",
        JSON.stringify({
          isGameOver: true,
          message,
        }),
      );
    }

    const isInsufficientMaterial = game.isInsufficientMaterial();

    if (isInsufficientMaterial) {
      setIsInGame(false);
      notifySound.current.play();
      const message = "Draw! Insufficient material";
      dispatch(
        setGameStatus({
          isGameOver: true,
          message,
        }),
      );
      localStorage.setItem(
        "gameOver",
        JSON.stringify({
          isGameOver: true,
          message,
        }),
      );
    }
  };

  const handleCheck = (color: string, capture: boolean = false) => {
    const isCheck = game.isCheck();

    if (!isCheck && !capture) {
      movePieceAudio.current.play();
      setIsChecked(null);
      return;
    } else if (!isCheck && capture) {
      capturePieceAudio.current.play();
      setIsChecked(null);
      return;
    }

    const piece: Piece = {
      color: color as Color,
      type: "k",
    };
    const checkedSquare = game.findPiece(piece);
    setIsChecked(checkedSquare[0]);
    checkSound.current.play();
  };

  const handleClickMove = (
    square: Square,
    piece: string,
    color: string,
    promoteTo?: string,
  ) => {
    if (playerColor === game.turn() && playerColor === color) {
      // select square
      if (!selectedSquare) {
        if (!piece) {
          return;
        }
        getValidMovesForSquare(square);
        setSelectedSquare(square);
      } else {
        if (possibleMoves.find((m) => m.square === square)) {
          const isPromotion = getPromotion(selectedSquare, square);

          //  return for promotion piece selection
          if (isPromotion) {
            if (!promoteTo) {
              return;
            }
          } else {
            // move piece
            game.move({ from: selectedSquare, to: square });
            finalizeMove();
          }
        } else {
          // change selected piece
          setSelectedSquare(square);
          getValidMovesForSquare(square);
        }
      }
    } else if (
      selectedSquare &&
      possibleMoves.find((x) => x.square === square)
    ) {
      // opponent piece capture
      const isPromotion = getPromotion(selectedSquare, square);

      if (isPromotion) {
        if (!promoteTo) {
          return; // return for promotion piece selection
        }
      } else {
        // capture
        game.move({ from: selectedSquare, to: square });
        finalizeMove(true);
      }
    }
  };

  const handleDragPiece = (
    square: Square,
    piece: PieceSymbol,
    moveNotation: Square,
  ) => {
    if (game.turn() !== playerColor) return;

    getValidMovesForSquare(square);
    dragInfoRef.current = {
      from: moveNotation,
      piece: piece,
    };
  };

  const handleDragDrop = (to: string) => {
    if (game.turn() !== playerColor) return;
    if (!dragInfoRef.current) return;

    const from = dragInfoRef.current.from;

    if (!possibleMoves.find((m) => m.square === to)) return;

    const isPromotion = getPromotion(from as Square, to as Square);

    // handle promotion
    if (isPromotion) {
      handlePromotion(from, to);
      return;
    }
    const move = game.move({ from, to });

    finalizeMove(move.captured ? true : false);
  };

  return {
    game,
    possibleMoves,
    isPromotion,
    isChecked,
    handlePromotionSelect,
    handleClickMove,
    handleDragDrop,
    handleDragPiece,
    setIsPromotion,
    getValidMovesForSquare,
  };
}
