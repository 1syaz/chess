import { motion } from "motion/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Bot, Monitor, Clock, Zap, Brain } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const GameModeSelector = () => {
	const navigate = useNavigate();

	const gameModes = [
		{
			id: "local",
			title: "Local Play",
			description: "Play with a friend on the same device",
			icon: Users,
			color: "bg-green-600",
			features: ["2 Players", "Same Device", "No Time Limit"],
		},
		{
			id: "ai",
			title: "Play vs AI",
			description: "Challenge our intelligent chess AI",
			icon: Bot,
			color: "bg-blue-600",
			features: [
				"Multiple Difficulties",
				"Instant Play",
				"Practice Mode",
			],
		},
		{
			id: "online",
			title: "Online Match",
			description: "Play against players worldwide",
			icon: Monitor,
			color: "bg-purple-600",
			features: ["Ranked Games", "Quick Match", "Global Players"],
		},
	];

	const timeControls = [
		{
			id: "blitz",
			name: "Blitz",
			time: "5+3",
			icon: Zap,
			color: "text-yellow-400",
		},
		{
			id: "rapid",
			name: "Rapid",
			time: "10+5",
			icon: Clock,
			color: "text-blue-400",
		},
		{
			id: "classical",
			name: "Classical",
			time: "30+0",
			icon: Brain,
			color: "text-green-400",
		},
	];

	const handleGameStart = (mode: string, timeControl?: string) => {
		console.log(
			`Starting ${mode} game with ${timeControl || "no"} time control`
		);
		navigate(`/game?mode=${mode}&time=${timeControl || "unlimited"}`);
	};

	return (
		<div className="space-y-6 py-5 px-5">
			{/* Game Modes Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{gameModes.map((mode, index) => (
					<motion.div
						key={mode.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
					>
						<Card className=" h-full bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors group cursor-pointer flex flex-col justify-between">
							<CardHeader className="text-center">
								<div
									className={`w-16 h-16 ${mode.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
								>
									<mode.icon className="h-8 w-8 text-white" />
								</div>
								<CardTitle className="text-white">
									{mode.title}
								</CardTitle>
								<CardDescription className="text-slate-400">
									{mode.description}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex flex-wrap gap-2 justify-center">
									{mode.features.map((feature) => (
										<Badge
											key={feature}
											variant="secondary"
											className="bg-slate-700 text-slate-300"
										>
											{feature}
										</Badge>
									))}
								</div>
								<Button
									className="w-full bg-purple-600 hover:bg-purple-700"
									onClick={() => handleGameStart(mode.id)}
								>
									Start Game
								</Button>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>

			{/* Time Controls */}
			<Card className="bg-slate-800 border-slate-700">
				<CardHeader>
					<CardTitle className="text-white flex items-center">
						<Clock className="h-5 w-5 mr-2" />
						Quick Start with Time Control
					</CardTitle>
					<CardDescription className="text-slate-400">
						Start a timed game instantly
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{timeControls.map((control) => (
							<Button
								key={control.id}
								variant="outline"
								className="h-auto p-4 flex flex-col items-center space-y-2 border-slate-600 hover:border-purple-500 hover:bg-slate-700"
								onClick={() =>
									handleGameStart("online", control.id)
								}
							>
								<control.icon
									className={`h-6 w-6 ${control.color}`}
								/>
								<div className="text-center">
									<div className="font-semibold text-white">
										{control.name}
									</div>
									<div className="text-sm text-slate-400">
										{control.time}
									</div>
								</div>
							</Button>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Recent Activity */}
			<Card className="bg-slate-800 border-slate-700">
				<CardHeader>
					<CardTitle className="text-white">
						Recent Activity
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
							<div className="flex items-center space-x-3">
								<div className="w-2 h-2 bg-green-400 rounded-full"></div>
								<span className="text-white">
									Won against AIBot (Level 5)
								</span>
							</div>
							<Badge variant="secondary">+12 rating</Badge>
						</div>
						<div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
							<div className="flex items-center space-x-3">
								<div className="w-2 h-2 bg-red-400 rounded-full"></div>
								<span className="text-white">
									Lost to GrandMaster99
								</span>
							</div>
							<Badge variant="destructive">-8 rating</Badge>
						</div>
						<div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
							<div className="flex items-center space-x-3">
								<div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
								<span className="text-white">
									Draw with ChessLover42
								</span>
							</div>
							<Badge variant="secondary">±0 rating</Badge>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default GameModeSelector;
