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
      color: "bg-forest-green",
      features: ["2 Players", "Same Device"],
    },
    {
      id: "ai",
      title: "Play vs AI",
      description: "Challenge our intelligent chess AI",
      icon: Bot,
      color: "bg-forest-green",
      features: ["Multiple Difficulties", "Instant Play", "Practice Mode"],
    },
    {
      id: "online",
      title: "Online Match",
      description: "Play against players worldwide",
      icon: Monitor,
      color: "bg-forest-green",
      features: ["Ranked Games", "Quick Match", "Global Players"],
    },
  ];

  // const timeControls = [
  //   {
  //     id: "blitz",
  //     name: "Blitz",
  //     time: "5+3",
  //     icon: Zap,
  //     color: "text-yellow-400",
  //   },
  //   {
  //     id: "rapid",
  //     name: "Rapid",
  //     time: "10+5",
  //     icon: Clock,
  //     color: "text-blue-400",
  //   },
  //   {
  //     id: "classical",
  //     name: "Classical",
  //     time: "30+0",
  //     icon: Brain,
  //     color: "text-green-400",
  //   },
  // ];

  const handleGameStart = (mode: string, timeControl?: string) => {
    console.log(
      `Starting ${mode} game with ${timeControl || "no"} time control`,
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
            <Card className=" h-full bg-background border-charcoal hover:border-border transition-colors group cursor-pointer flex flex-col justify-between">
              <CardHeader className="text-center">
                <div
                  className={`w-16 h-16 ${mode.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                >
                  <mode.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white">{mode.title}</CardTitle>
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
                      className="bg-custom-grey text-slate-300"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
                <Button
                  className="w-full bg-charcoal hover:bg-custom-grey"
                  onClick={() => handleGameStart(mode.id)}
                >
                  Start Game
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="bg-background border-charcoal">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-charcoal rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white">Won against AIBot (Level 5)</span>
              </div>
              <Badge variant="secondary">+12 rating</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-charcoal rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-white">Lost to GrandMaster99</span>
              </div>
              <Badge variant="destructive">-8 rating</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-charcoal rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-white">Draw with ChessLover42</span>
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
