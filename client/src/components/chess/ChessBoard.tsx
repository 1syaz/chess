import { Chess, type PieceSymbol, type Square } from "chess.js";
import { getFiles, getRanks } from "@/utils/boardHelpers";
import BoardSquare from "./BoardSquare";
import GameOverWrapper from "./GameOverWrapper";
import { useAppSelector } from "@/app/hooks";

interface ChessBoardProps {
	gameOver: {
		isGameOver: boolean;
		message: string;
	};
	game: Chess;
	isChecked: string | null;
	draggedSquare: string | null;
	hoveredSquare: string | null;
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
		promoteTo?: string
	) => void;
	handleDragDrop: (to: string) => void;
	setHoveredSquare: React.Dispatch<React.SetStateAction<string | null>>;
	handleDragPiece: (
		square: Square,
		piece: PieceSymbol,
		moveNotation: Square
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
		gameOver,
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
	} = props;

	const { board, playerColor } = useAppSelector((state) => state.game);

	return (
		<section className="flex items-center justify-center w-full h-full">
			<div className="w-full max-w-[min(100vw-2rem,100vh-2rem,700px)] aspect-square relative ">
				{/* Wrapper for end game */}
				<GameOverWrapper gameOver={gameOver} />
				<div className="w-full h-full border border-white/20 rounded-lg bg-custom-grey overflow-hidden">
					<div className="grid grid-cols-8 w-full h-full">
						{board!.map((b, rowIdx) =>
							b.map((square, colIdx) => {
								const file = getFiles(
									playerColor as "w" | "b",
									colIdx
								);
								const rank = getRanks(
									playerColor as "w" | "b",
									rowIdx
								);
								const moveNotation = `${file}${rank}` as Square;
								const match = possibleMoves.find(
									(mv) => mv.square === moveNotation
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
										// playerColor={playerColor}
										isPromotion={isPromotion}
										isChecked={isChecked}
										setHoveredSquare={setHoveredSquare}
										handleDragDropPieces={handleDragDrop}
										handleClickMove={handleClickMove}
										handleDragPiece={handleDragPiece}
										setIsPromotion={setIsPromotion}
										handlePromotionSelect={
											handlePromotionSelect
										}
										getValidMovesForSquare={
											getValidMovesForSquare
										}
									/>
								);
							})
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

export default ChessBoard;
