import HistoryPageSection from "@/components/HistoryPageSection";
import { motion } from "motion/react";

function History() {
	const user = {
		name: "ChessMaster",
		rating: 1847,
		gamesPlayed: 156,
		wins: 89,
		losses: 45,
		draws: 22,
		avatar: "/placeholder.svg",
	};

	return (
		<div className="min-h-screen gradient dark:from-surface-darker dark:via-surface-dark dark:to-surface-darker">
			<div className="container mx-auto px-6 py-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-8"
				>
					<div className="text-center space-y-4">
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
							className="text-4xl md:text-5xl font-bold text-text-primary"
						>
							Game History
						</motion.h1>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="text-base sm:text-xl text-text-secondary max-w-2xl mx-auto"
						>
							Review your past games and analyze your performance
						</motion.p>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="max-w-6xl mx-auto"
					>
						<HistoryPageSection user={user} />
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}

export default History;
