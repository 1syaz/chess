import { motion } from "motion/react";
import { Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

function LiveGames() {
  const activeGames = [
    {
      id: "1",
      white: { name: "Player1", rating: 1834 },
      black: { name: "Player2", rating: 1923 },
      timeControl: "10+5",
      spectators: 12,
      moves: 23,
    },
    {
      id: "2",
      white: { name: "ChessKing", rating: 2145 },
      black: { name: "QueenMaster", rating: 2098 },
      timeControl: "5+3",
      spectators: 45,
      moves: 18,
    },
  ];

  return (
    <div>
      <Card className="bg-background border-charcoal">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Featured Live Games
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-charcoal  rounded-lg hover:bg-custom-grey transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-white rounded-full border-2 border-slate-400" />
                    <span className="text-white font-semibold">
                      {game.white.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-forest-green text-white text-xs"
                    >
                      {game.white.rating}
                    </Badge>
                  </div>
                  <span className="text-slate-400 text-sm">
                    {game.moves} moves
                  </span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-forest-green rounded-full border-2 border-slate-500" />
                    <span className="text-white font-semibold">
                      {game.black.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-forest-green text-xs"
                    >
                      {game.black.rating}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{game.timeControl}</span>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>{game.spectators}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LiveGames;
