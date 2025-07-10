interface GameOverWrapperProps {
	gameOver: {
		isGameOver: boolean;
		message: string;
	};
}

function GameOverWrapper({ gameOver }: GameOverWrapperProps) {
	return (
		gameOver.isGameOver && (
			<div className="absolute h-full w-full top-0 left-0 bg-black/50 z-30 rounded-lg flex items-center justify-center">
				{gameOver.message && (
					<div className="bg-custom-grey border border-border rounded-lg p-3 md:p-4 md:text-sm text-xs text-center">
						<p>{gameOver.message}</p>
					</div>
				)}
			</div>
		)
	);
}

export default GameOverWrapper;
