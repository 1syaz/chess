interface GameOverWrapperProps {
	gameStatus: {
		isCheckmate: boolean;
		isStalemate: boolean;
		isDraw: boolean;
		isInsufficientMaterial: boolean;
	};
}

function GameOverWrapper({ gameStatus }: GameOverWrapperProps) {
	let message = "";

	if (gameStatus.isCheckmate) {
		message = "Checkmate! You won the game";
	} else if (gameStatus.isStalemate) {
		message = "Stalemate! No legal moves — it's a draw";
	} else if (gameStatus.isDraw) {
		message = "Draw! The game ended with no winner";
	} else if (gameStatus.isInsufficientMaterial) {
		message = "Draw! Insufficient material";
	} else {
		return null;
	}

	return (
		<div className="absolute h-full w-full top-0 left-0 bg-black/50 z-30 rounded-lg flex items-center justify-center">
			<div className="bg-custom-grey border border-border rounded-lg p-3 md:p-4 md:text-sm text-xs text-center">
				<p>{message}</p>
			</div>
		</div>
	);
}

export default GameOverWrapper;
