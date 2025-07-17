import { motion } from "motion/react";
import { Bot, Monitor, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
// import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { useState } from "react";
import DialogComponent from "./DialogComponent";
import LocalDialogContent from "./LocalDialogContent";

function GameMode() {
  const [selectedMode, setSelectedMode] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {isDialogOpen && (
        <DialogComponent
          dialogTitle={
            gameModes.find((mode) => mode.id === selectedMode)!.title
          }
          isDialogOpen={isDialogOpen}
          toggleDialog={setIsDialogOpen}
        >
          <div className="text-white">
            {selectedMode === "local" ? <LocalDialogContent /> : "test"}
          </div>
        </DialogComponent>
      )}
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
                onClick={() => {
                  setSelectedMode(mode.id);
                  setIsDialogOpen(true);
                }}
              >
                Start Game
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
export default GameMode;
