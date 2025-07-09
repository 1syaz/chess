import {
	Chess,
	type Color,
	type Piece,
	type PieceSymbol,
	type Square,
} from "chess.js";

import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setBoard, setPlayerColor } from "@/features/game/gameSlice";

// audios
import moveAudio from "@/assets/sounds/Move.mp3";
import captureAudio from "@/assets/sounds/Capture.mp3";
import notifyAudio from "@/assets/sounds/GenericNotify.mp3";
import checkAudio from "@/assets/sounds/Check.mp3";

export function useChessGame(
	setGameOver: React.Dispatch<
		React.SetStateAction<{
			isGameOver: boolean;
			message: string;
		}>
	>,
	game: Chess
) {
	const { playerColor } = useAppSelector((state) => state.game);
	const dragInfoRef = useRef<{ from: string; piece: string } | null>(null);
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
	const dispatch = useAppDispatch();

	// game audios
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
	const saveGameInLocalStorage = (fen: string) => {
		localStorage.setItem("gameState", fen);
	};

	const handlePromotion = (
		from: Square | string,
		to: Square | string,
		promoteTo?: string
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
		dispatch(setBoard(game.board()));
		dispatch(setPlayerColor(playerColor === "w" ? "b" : "w"));
		saveGameInLocalStorage(game.fen());
	};

	const handlePromotionSelect = (promotionPiece: string) => {
		if (selectedSquare && isPromotion?.to) {
			handlePromotion(selectedSquare, isPromotion.to, promotionPiece);
		}
		if (dragInfoRef.current && isPromotion?.to) {
			handlePromotion(
				dragInfoRef.current.from,
				isPromotion.to,
				promotionPiece
			);
		}
	};

	const getValidMovesForSquare = (square: Square) => {
		const moves = game.moves({ square, verbose: true });
		const mapped = moves.map((m) => {
			const targetPieceSquare = game.get(m.to);

			return {
				square: m.to,
				isCapture:
					targetPieceSquare &&
					targetPieceSquare.color !== playerColor,
			};
		});
		setPossibleMoves(mapped);
	};

	const handleEndGame = () => {
		const isCheckmate = game.isCheckmate();

		if (isCheckmate) {
			notifySound.play();
			const turn = game.turn();
			setGameOver({
				isGameOver: true,
				message: `${turn === "w" ? "Black" : "White"} won by checkmate`,
			});
			localStorage.setItem("gameover", "true");
		}

		const isStalemate = game.isStalemate();

		if (isStalemate) {
			console.log(isStalemate);
			notifySound.play();
			setGameOver({
				isGameOver: true,
				message: "Stalemate! No legal moves — it's a draw",
			});
			localStorage.setItem("gameover", "true");
		}

		const isDraw = game.isDraw();

		if (isDraw) {
			notifySound.play();
			setGameOver({
				isGameOver: true,
				message: "Draw! The game ended with no winner",
			});
			localStorage.setItem("gameover", "true");
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
		promoteTo?: string
	) => {
		if (playerColor === game.turn() && playerColor === color) {
			if (!selectedSquare) {
				// select piece
				if (!piece) return;
				getValidMovesForSquare(square);
				setSelectedSquare(square);

				setHoveredSquare(square);
			} else {
				console.log(possibleMoves);
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

						dispatch(
							setPlayerColor(playerColor === "w" ? "b" : "w")
						);
						dispatch(setBoard(game.board()));
						setSelectedSquare(null);
						setHoveredSquare(null);
						setPossibleMoves([]);
						handleCheck(color === "w" ? "b" : "w");
						handleEndGame();
						saveGameInLocalStorage(game.fen());
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
			console.log("capture");
			// Opponent piece capture scenario
			const isPromotion = getPromotion(selectedSquare, square);

			if (isPromotion) {
				if (!promoteTo) return; // return for promotion piece selection
			} else {
				// capture
				game.move({ from: selectedSquare, to: square });
				dispatch(setPlayerColor(playerColor === "w" ? "b" : "w"));

				dispatch(setBoard(game.board()));
				setSelectedSquare(null);
				setHoveredSquare(null);
				setPossibleMoves([]);
				handleCheck(color, true);
				handleEndGame();
				saveGameInLocalStorage(game.fen());

				const isInsufficientMaterial = game.isInsufficientMaterial();

				// handle insufficient material
				if (isInsufficientMaterial) {
					notifySound.play();
					setGameOver({
						isGameOver: true,
						message: "Draw! Insufficient material",
					});
					localStorage.setItem("gameover", "true");
				}
			}
		}
	};

	const handleDragPiece = (
		square: Square,
		piece: PieceSymbol,
		moveNotation: Square
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
		dispatch(setPlayerColor(playerColor === "w" ? "b" : "w"));

		dispatch(setBoard(game.board()));
		const color = game.turn();
		handleCheck(color, move.captured ? true : false);
		handleEndGame();
		saveGameInLocalStorage(game.fen());

		const isInsufficientMaterial = game.isInsufficientMaterial();

		// handle insufficient material
		if (isInsufficientMaterial) {
			notifySound.play();
			setGameOver({
				isGameOver: true,
				message: "Draw! Insufficient material",
			});
			localStorage.setItem("gameover", "true");
			return;
		}
	};

	return {
		// board,
		game,
		possibleMoves,
		hoveredSquare,
		draggedSquare,
		isPromotion,
		isChecked,
		handlePromotionSelect,
		setHoveredSquare,
		handleClickMove,
		handleDragDrop,
		handleDragPiece,
		setIsPromotion,
		getValidMovesForSquare,
	};
}
