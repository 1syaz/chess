import { useAppDispatch, useAppSelector } from "@/app/hooks";
import ChessBoard from "@/components/chess/ChessBoard";
import PlayerInfo from "@/components/chess/PlayerInfo";
import { startGame } from "@/features/game/gameSlice";
import { useChessLogic } from "@/hooks/useChessLogic";
import { Chess } from "chess.js";
import { useEffect, useRef, useState } from "react";

function Match() {
	const dispatch = useAppDispatch();
	const { fen, playerColor, board } = useAppSelector((state) => state.game);

	const gameRef = useRef<Chess>(new Chess(fen));

	const [gameOver, setGameOver] = useState<{
		isGameOver: boolean;
		message: string;
	}>(
		localStorage.getItem("gameOver")
			? JSON.parse(localStorage.getItem("gameOver")!)
			: {
					isGameOver: false,
					message: "",
			  }
	);

	useEffect(() => {
		dispatch(
			startGame({ board: gameRef.current.board(), playerColor: "w" })
		);
	}, [dispatch]);

	const handleGameUpdate = (game: Chess) => {
		gameRef.current = game;
	};

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

	// TODO update
	if (!board || !playerColor) {
		return <div>Loading game...</div>;
	}

	return (
		<div className="gradient min-h-screen w-full text-white flex items-center justify-center p-4">
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
					game={gameRef.current}
					gameOver={gameOver}
					setGameOver={setGameOver}
				/>
			</div>
		</div>
	);
}

export default Match;
