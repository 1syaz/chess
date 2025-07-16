import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Calendar, Download, Eye, Filter, Play, Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { useState } from "react";

function GamesHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResult, setFilterResult] = useState("all");
  const [filterTimeControl, setFilterTimeControl] = useState("all");

  const gameHistory = [
    {
      id: "1",
      opponent: "GrandMaster99",
      opponentRating: 1923,
      result: "loss",
      userColor: "white",
      moves: 42,
      timeControl: "10+5",
      date: "2024-01-15",
      duration: "25:30",
      opening: "Sicilian Defense",
      ratingChange: -8,
    },
    {
      id: "2",
      opponent: "AIBot (Level 5)",
      opponentRating: 1500,
      result: "win",
      userColor: "black",
      moves: 38,
      timeControl: "unlimited",
      date: "2024-01-14",
      duration: "18:45",
      opening: "Queen's Gambit",
      ratingChange: +12,
    },
    {
      id: "3",
      opponent: "ChessLover42",
      opponentRating: 1834,
      result: "draw",
      userColor: "white",
      moves: 67,
      timeControl: "5+3",
      date: "2024-01-13",
      duration: "31:20",
      opening: "Ruy Lopez",
      ratingChange: 0,
    },
    {
      id: "4",
      opponent: "RookiePlayer",
      opponentRating: 1245,
      result: "win",
      userColor: "black",
      moves: 24,
      timeControl: "10+5",
      date: "2024-01-12",
      duration: "12:15",
      opening: "French Defense",
      ratingChange: +15,
    },
    {
      id: "5",
      opponent: "QueenGambit",
      opponentRating: 1789,
      result: "win",
      userColor: "white",
      moves: 45,
      timeControl: "5+3",
      date: "2024-01-11",
      duration: "22:10",
      opening: "English Opening",
      ratingChange: +10,
    },
  ];

  const filteredGames = gameHistory.filter((game) => {
    const matchesSearch =
      game.opponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.opening.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResult =
      filterResult === "all" || game.result === filterResult;
    const matchesTimeControl =
      filterTimeControl === "all" || game.timeControl === filterTimeControl;

    return matchesSearch && matchesResult && matchesTimeControl;
  });

  const getResultColor = (result: string) => {
    switch (result) {
      case "win":
        return "bg-green-600";
      case "loss":
        return "bg-red-600";
      case "draw":
        return "bg-yellow-600";
      default:
        return "bg-slate-600";
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case "win":
        return "W";
      case "loss":
        return "L";
      case "draw":
        return "D";
      default:
        return "?";
    }
  };
  return (
    <section className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-background border-charcoal">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Game History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search games..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-custom-grey border-border text-white"
                />
              </div>

              <Select value={filterResult} onValueChange={setFilterResult}>
                <SelectTrigger className="bg-custom-grey border-border text-white">
                  <SelectValue placeholder="Filter by result" />
                </SelectTrigger>
                <SelectContent className="bg-custom-grey border-border text-white">
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="win">Wins</SelectItem>
                  <SelectItem value="loss">Losses</SelectItem>
                  <SelectItem value="draw">Draws</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filterTimeControl}
                onValueChange={setFilterTimeControl}
              >
                <SelectTrigger className="bg-custom-grey border-border text-white">
                  <SelectValue placeholder="Time control" />
                </SelectTrigger>
                <SelectContent className="bg-custom-grey border-border text-white">
                  <SelectItem value="all">All Time Controls</SelectItem>
                  <SelectItem value="5+3">Blitz (5+3)</SelectItem>
                  <SelectItem value="10+5">Rapid (10+5)</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="default" className="border-slate-600">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Games List */}
      <Card className="bg-background border-charcoal">
        <CardContent className="p-6">
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredGames.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  No games found matching your criteria
                </div>
              ) : (
                filteredGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-custom-grey rounded-lg hover:bg-charcoal transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Result Badge */}
                        <div
                          className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                          ${getResultColor(game.result)}
                        `}
                        >
                          {getResultIcon(game.result)}
                        </div>

                        {/* Game Info */}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-semibold">
                              vs {game.opponent}
                            </span>
                            <Badge
                              variant="outline"
                              className="border-border text-white"
                            >
                              {game.opponentRating}
                            </Badge>
                            <div
                              className={`
                              w-4 h-4 rounded-full border-2
                              ${
                                game.userColor === "white"
                                  ? "bg-white border-border"
                                  : "bg-forest-green border-border"
                              }
                            `}
                            />
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-white/50">
                            <span>{game.opening}</span>
                            <span>{game.moves} moves</span>
                            <span>{game.duration}</span>
                            <span>{game.timeControl}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions and Rating Change */}
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant={
                            game.ratingChange > 0
                              ? "default"
                              : game.ratingChange < 0
                                ? "destructive"
                                : "secondary"
                          }
                          className={
                            game.ratingChange > 0 ? "bg-green-600" : ""
                          }
                        >
                          {game.ratingChange > 0 ? "+" : ""}
                          {game.ratingChange}
                        </Badge>

                        <div className="flex space-x-1">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 mt-2">
                      {game.date}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </section>
  );
}

export default GamesHistory;
