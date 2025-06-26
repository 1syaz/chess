import { Button } from "../ui/button";

function GameOverButtons() {
	const handlePlayAgain = () => {
		// TODO
		console.log("HANDLE PLAY AGAIN");
	};

	return (
		<div className="flex flex-row lg:flex-col gap-3 p-4 flex-wrap  items-center md:items-stretch justify-center ">
			<Button onClick={handlePlayAgain} variant="secondary" size="sm">
				Play again
			</Button>
		</div>
	);
}

export default GameOverButtons;
