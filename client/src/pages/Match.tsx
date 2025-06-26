import ChessBoardSection from "@/components/chess/ChessBoardSection";
import PlayerInfo from "@/components/chess/PlayerInfo";
import { useState } from "react";

function Match() {
	// TODO
	const [gameStatus, setGameStatus] = useState<{
		isCheckmate: boolean;
		isStalemate: boolean;
		isDraw: boolean;
		isInsufficientMaterial: boolean;
	}>({
		isCheckmate: false,
		isStalemate: false,
		isDraw: false,
		isInsufficientMaterial: false,
	});

	return (
		<div className="gradient min-h-screen w-full text-white flex items-center justify-center p-4">
			<div className="flex flex-col-reverse lg:flex-row items-start justify-center gap-3">
				<ChessBoardSection
					gameStatus={gameStatus}
					setGameStatus={setGameStatus}
				/>

				<PlayerInfo gameStatus={gameStatus} />
			</div>
		</div>
	);
}

export default Match;
