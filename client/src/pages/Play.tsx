import GameModeSelector from "@/components/chess/GameModeSelector";
import { motion } from "motion/react";

function Play() {
	return (
		<div>
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
						Choose Your Game Mode
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-base sm:text-xl text-text-secondary max-w-2xl mx-auto"
					>
						Select how you want to play chess today
					</motion.p>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="max-w-4xl mx-auto"
				>
					<GameModeSelector />
				</motion.div>
			</motion.div>
		</div>
	);
}

export default Play;
