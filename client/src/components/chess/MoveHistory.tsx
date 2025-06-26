import { History } from "lucide-react";

function MoveHistory() {
	// TODO moves will come from parent component
	const moves = [
		"d4",
		"e6",
		"e3",
		"c5",
		"Qa4",
		"g6",
		"d4",
		"e3",
		"e6",
		"c5",
		"Qa4",
		"g6",
		"d4",
		"e3",
		"e6",
		"c5",
		"Qa4",
		"g6",
		"g6",
		"d4",
		"e3",
		"e6",
		"c5",
		"Qa4",
		"g6",
	];

	const movePairs = [];
	for (let i = 0; i < moves.length; i += 2) {
		movePairs.push({
			moveNumber: Math.floor(i / 2) + 1,
			white: moves[i],
			black: moves[i + 1] || "",
		});
	}

	return (
		<section className="flex flex-col gap-4 min-w-[240px] lg:min-w-[280px] max-h-[400px] lg:max-h-[500px] border bg-custom-grey border-white/20 rounded-lg p-4">
			{/* Header */}
			<div className="flex items-center gap-2 pb-2 border-b border-white/10">
				<History size={16} className="text-forest-green" />
				<h3 className="text-sm lg:text-base font-medium">
					Move History
				</h3>
			</div>

			{/* Move List */}
			<div className="flex-1 overflow-hidden">
				<div className="text-xs lg:text-sm flex flex-col gap-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
					{/* Header Row */}
					<div className="grid grid-cols-[auto_1fr_1fr] gap-3 text-gray-400 font-medium pb-2 border-b border-white/10 sticky top-0 bg-custom-grey">
						<span>#</span>
						<span>White</span>
						<span>Black</span>
					</div>

					{/* Move Rows */}
					{movePairs.map((pair, index) => (
						<div
							key={pair.moveNumber}
							className={`grid grid-cols-[auto_1fr_1fr] gap-3 py-1 px-2 rounded transition-colors hover:bg-white/5 ${
								index === movePairs.length - 1
									? "bg-white/10"
									: ""
							}`}
						>
							<span className="text-gray-400 font-mono">
								{pair.moveNumber}.
							</span>
							<span className="font-mono cursor-pointer hover:bg-white/10 px-1 py-0.5 rounded">
								{pair.white}
							</span>
							<span className="font-mono cursor-pointer hover:bg-white/10 px-1 py-0.5 rounded">
								{pair.black}
							</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default MoveHistory;
