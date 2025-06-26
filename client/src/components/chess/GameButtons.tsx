import { Button } from "../ui/button";

function GameButtons() {
	return (
		<div className="flex flex-row lg:flex-col gap-3 p-4 flex-wrap">
			<Button
				variant="destructive"
				size="sm"
				className="w-auto cursor-pointer flex-1 lg:flex-none"
			>
				Resign
			</Button>
			<Button
				variant="secondary"
				size="sm"
				className="flex-1 lg:flex-none"
			>
				Offer Draw
			</Button>
			<Button variant="default" size="sm" className="flex-1 lg:flex-none">
				Request Takeback
			</Button>
		</div>
	);
}

export default GameButtons;
