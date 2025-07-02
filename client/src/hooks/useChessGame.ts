import {
  Chess,
  type Color,
  type Piece,
  type PieceSymbol,
  type Square,
} from "chess.js";
import { useRef, useState } from "react";

// audios
import moveAudio from "@/assets/sounds/Move.mp3";
import captureAudio from "@/assets/sounds/Capture.mp3";
import notifyAudio from "@/assets/sounds/GenericNotify.mp3";
import checkAudio from "@/assets/sounds/Check.mp3";

export function useChessGame(
  playerColor: "w" | "b",
  setGameStatus: React.Dispatch<
    React.SetStateAction<{
      isCheckmate: boolean;
      isStalemate: boolean;
      isDraw: boolean;
      isInsufficientMaterial: boolean;
    }>
  >,

  setPlayerColor: React.Dispatch<React.SetStateAction<"w" | "b">>,
) {
  const [game] = useState(new Chess());
  const dragInfoRef = useRef<{ from: string; piece: string } | null>(null);
  const [board, setBoard] = useState(game.board());
  const [hoveredSquare, setHoveredSquare] = useState<string | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [draggedSquare, setDraggedSquare] = useState<string | null>(null);
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

  // game audios
  // const { playSound } = useChessAudio();
  const movePieceAudio = new Audio(moveAudio);
  const capturePieceAudio = new Audio(captureAudio);
  const notifySound = new Audio(notifyAudio);
  const checkSound = new Audio(checkAudio);

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

  // const makeRandomMove = () => {
  // 	if (game.turn() === playerColor) return;
  // 	const moves = game.moves({});
  //
  // 	// game over
  // 	if (moves.length === 0) return;
  // 	const move = game.move(moves[Math.floor(Math.random() * moves.length)]);
  // 	setBoard(game.board());
  //
  // 	if (move.captured) {
  // 		handleCheck(playerColor, true);
  //
  // 		const isInsufficientMaterial = game.isInsufficientMaterial();
  // 		if (isInsufficientMaterial) {
  // 			// playSound("notify");
  // 			notifySound.play();
  // 			setGameStatus((prev) => ({ ...prev, isInsufficientMaterial }));
  // 			return;
  // 		}
  // 	} else {
  // 		handleCheck(playerColor);
  // 	}
  // };

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
    setSelectedSquare(null);
    setHoveredSquare(null);
    setPossibleMoves([]);
    const color = game.turn();
    handleCheck(color);
    handleEndGame();
    setBoard(game.board());
    setPlayerColor((prev) => (prev === "w" ? "b" : "w"));
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
      notifySound.play();
      setGameStatus((prev) => ({ ...prev, isCheckmate }));
    }

    const isStalemate = game.isStalemate();

    if (isStalemate) {
      notifySound.play();
      setGameStatus((prev) => ({ ...prev, isStalemate }));
    }

    const isDraw = game.isDraw();

    if (isDraw) {
      notifySound.play();
      setGameStatus((prev) => ({ ...prev, isDraw }));
    }
  };

  const handleCheck = (color: string, capture: boolean = false) => {
    const isCheck = game.isCheck();

    if (!isCheck && !capture) {
      movePieceAudio.play();
      setIsChecked(null);
      return;
    } else if (!isCheck && capture) {
      capturePieceAudio.play();
      setIsChecked(null);
      return;
    }

    const piece: Piece = {
      color: color as Color,
      type: "k",
    };
    const checkedSquare = game.findPiece(piece);

    setIsChecked(checkedSquare[0]);

    checkSound.play();
  };

  const handleClickMove = (
    square: Square,
    piece: string,
    color: string,
    promoteTo?: string,
  ) => {
    if (playerColor === game.turn() && playerColor === color) {
      if (!selectedSquare) {
        // select piece
        if (!piece) return;
        getValidMovesForSquare(square);
        setSelectedSquare(square);
        setHoveredSquare(square);
      } else {
        if (possibleMoves.find((m) => m.square === square)) {
          const isPromotion = getPromotion(selectedSquare, square);

          if (isPromotion) {
            if (!promoteTo) return; // return for promotion piece selection
          } else {
            // move piece
            game.move({
              from: selectedSquare,
              to: square,
            });

            setPlayerColor((prev) => (prev === "w" ? "b" : "w"));
            setBoard(game.board());
            setSelectedSquare(null);
            setHoveredSquare(null);
            setPossibleMoves([]);
            handleCheck(color === "w" ? "b" : "w");
            handleEndGame();
          }
        } else {
          // change selected piece
          setHoveredSquare(square);
          setSelectedSquare(square);
          getValidMovesForSquare(square);
        }
      }
    } else if (
      selectedSquare &&
      possibleMoves.find((x) => x.square === square)
    ) {
      // Opponent piece capture scenario

      console.log("capture");
      const isPromotion = getPromotion(selectedSquare, square);

      if (isPromotion) {
        if (!promoteTo) return; // return for promotion piece selection
      } else {
        // capture
        game.move({ from: selectedSquare, to: square });
        setPlayerColor((prev) => (prev === "w" ? "b" : "w"));

        setBoard(game.board());
        setSelectedSquare(null);
        setHoveredSquare(null);
        setPossibleMoves([]);
        handleCheck(color, true);
        handleEndGame();

        const isInsufficientMaterial = game.isInsufficientMaterial();

        // handle insufficient material
        if (isInsufficientMaterial) {
          notifySound.play();
          setGameStatus((prev) => ({
            ...prev,
            isInsufficientMaterial,
          }));
        }
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
    setDraggedSquare(moveNotation);
    dragInfoRef.current = {
      from: moveNotation,
      piece: piece,
    };
  };

  const handleDragDrop = (to: string) => {
    if (game.turn() !== playerColor) return;
    if (!dragInfoRef.current) return;

    const from = dragInfoRef.current.from;

    setDraggedSquare(null);
    setHoveredSquare(null);
    setSelectedSquare(null);
    setPossibleMoves([]);

    if (!possibleMoves.find((m) => m.square === to)) return;

    const isPromotion = getPromotion(from as Square, to as Square);

    // handle promotion
    if (isPromotion) {
      handlePromotion(from, to);
      return;
    }
    const move = game.move({ from, to });
    setPlayerColor((prev) => (prev === "w" ? "b" : "w"));

    setBoard(game.board());
    const color = game.turn();
    handleCheck(color, move.captured ? true : false);
    handleEndGame();

    const isInsufficientMaterial = game.isInsufficientMaterial();

    // handle insufficient material
    if (isInsufficientMaterial) {
      notifySound.play();
      setGameStatus((prev) => ({ ...prev, isInsufficientMaterial }));
      return;
    }
  };

  return {
    board,
    game,
    possibleMoves,
    hoveredSquare,
    draggedSquare,
    isPromotion,
    isChecked,
    setBoard,
    handlePromotionSelect,
    setHoveredSquare,
    handleClickMove,
    handleDragDrop,
    handleDragPiece,
    setIsPromotion,
    getValidMovesForSquare,
  };
}
