import { motion } from "motion/react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Brain, Clock, Zap } from "lucide-react";
import { useNavigate } from "react-router";

function QuickMatchSection() {
	const navigate = useNavigate();

	const handleQuickMatch = (timeControl: string) => {
		console.log(`Starting quick match with ${timeControl}`);
		navigate(`/game?mode=online&time=${timeControl}&quick=true`);
	};

	return (
		<div>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-none">
					<CardContent className="p-6">
						<div className="text-center text-white space-y-4">
							<h2 className="text-2xl font-bold">
								Find a Match Instantly
							</h2>
							<p className="text-blue-100">
								Jump into a game with players of similar skill
								level
							</p>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
								<Button
									className="bg-white text-blue-600 hover:bg-blue-50 h-16 flex flex-col space-y-1"
									onClick={() => handleQuickMatch("5+3")}
								>
									<Zap className="h-5 w-5" />
									<span className="font-semibold">Blitz</span>
									<span className="text-sm">5+3</span>
								</Button>

								<Button
									className="bg-white text-blue-600 hover:bg-blue-50 h-16 flex flex-col space-y-1"
									onClick={() => handleQuickMatch("10+5")}
								>
									<Clock className="h-5 w-5" />
									<span className="font-semibold">Rapid</span>
									<span className="text-sm">10+5</span>
								</Button>

								<Button
									className="bg-white text-blue-600 hover:bg-blue-50 h-16 flex flex-col space-y-1"
									onClick={() => handleQuickMatch("30+0")}
								>
									<Brain className="h-5 w-5" />
									<span className="font-semibold">
										Classical
									</span>
									<span className="text-sm">30+0</span>
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}

export default QuickMatchSection;
