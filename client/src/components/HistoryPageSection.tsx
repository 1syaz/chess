import { Card, CardContent } from "@/components/ui/card";
import GamesHistory from "./chess/GamesHistory";
interface GameHistoryProps {
	user: {
		name: string;
	};
}

function HistoryPageSection({ user }: GameHistoryProps) {
	return (
		<div className="space-y-6">
			<GamesHistory />
			<Card className="bg-slate-800 border-slate-700">
				<CardContent className="p-6">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-green-400">
								29
							</div>
							<div className="text-sm text-slate-400">Wins</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-red-400">
								losses
							</div>
							<div className="text-sm text-slate-400">Losses</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-yellow-400">
								2
							</div>
							<div className="text-sm text-slate-400">Draws</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-purple-400">
								12%
							</div>
							<div className="text-sm text-slate-400">
								Win Rate
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default HistoryPageSection;
