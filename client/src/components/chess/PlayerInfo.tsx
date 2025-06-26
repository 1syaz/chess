import GameButtons from "./GameButtons";
import GameOverButtons from "./GameOverButtons";

interface PlayerInfoProps {
	gameStatus: {
		isCheckmate: boolean;
		isStalemate: boolean;
		isDraw: boolean;
	};
}

function PlayerInfo({ gameStatus }: PlayerInfoProps) {
	return (
		<section className="flex flex-col w-full  gap-4 h-fit lg:max-w-[300px]">
			<div className="flex flex-row lg:flex-col justify-between  gap-4 border bg-custom-grey border-white/20 rounded-lg p-4">
				{/* Opponent */}
				<div className="flex lg:flex-row flex-col-reverse items-center justify-between gap-4 ">
					<div className="flex gap-4 items-center">
						<img
							className="rounded-full w-10 h-10 lg:w-14 lg:h-14"
							src="https://github.com/shadcn.png"
							alt="Player 2"
						/>
						<h3 className="font-medium text-xs lg:text-base">
							Player 2
						</h3>
					</div>
					<div className="text-lg lg:text-xl font-mono font-bold">
						10:00
					</div>
				</div>

				{/* Current Player (You) */}
				<div className="flex lg:flex-row flex-col-reverse items-center justify-between gap-4 ">
					<div className="flex lg:flex-row flex-row-reverse gap-4 items-center">
						<div className="relative">
							<img
								className="border-4 border-green-500 rounded-full w-10 h-10 lg:w-14 lg:h-14"
								src="https://play-lh.googleusercontent.com/YA_VX_XkrHW_rX4zaTuIXi0dBx80BFxfDlSf5f4Q7_-09TQq9rImbD7V8PlMQX_JN4Ai=w950-h950"
								alt="You"
							/>
							<span className="w-4 h-4 top-0 right-0 bg-green-500 p-2 absolute rounded-full"></span>
						</div>
						<h3 className="font-medium text-xs lg:text-base">
							You
						</h3>
					</div>
					<div className="text-lg lg:text-xl font-mono font-bold">
						10:00
					</div>
				</div>
			</div>

			{/* Game Controls */}
			{!gameStatus.isCheckmate ? <GameButtons /> : <GameOverButtons />}
		</section>
	);
}

export default PlayerInfo;
