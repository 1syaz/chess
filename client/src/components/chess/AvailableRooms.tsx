import { motion } from "motion/react";
import { Eye, Filter, Play, Search, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { useNavigate } from "react-router";

function AvailableRooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const onlineRooms = [
    {
      id: "1",
      name: "Blitz Arena",
      host: "QuickPlayer99",
      hostRating: 1834,
      players: 2,
      maxPlayers: 2,
      timeControl: "5+3",
      type: "ranked",
      status: "playing",
      spectators: 5,
    },
    {
      id: "2",
      name: "Beginner Friendly",
      host: "TeacherBot",
      hostRating: 1200,
      players: 1,
      maxPlayers: 2,
      timeControl: "10+5",
      type: "casual",
      status: "waiting",
      spectators: 0,
    },
    {
      id: "3",
      name: "Masters Only",
      host: "ChessGrandmaster",
      hostRating: 2543,
      players: 2,
      maxPlayers: 2,
      timeControl: "15+10",
      type: "ranked",
      status: "playing",
      spectators: 23,
    },
    {
      id: "4",
      name: "Speed Chess",
      host: "BlitzKing",
      hostRating: 1956,
      players: 1,
      maxPlayers: 2,
      timeControl: "3+2",
      type: "ranked",
      status: "waiting",
      spectators: 2,
    },
  ];

  const handleJoinRoom = (roomId: string) => {
    console.log(`Joining room ${roomId}`);
    navigate(`/game?mode=online&room=${roomId}`);
  };

  return (
    <div>
      <Card className="bg-background border-charcoal ">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Available Rooms
            </CardTitle>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-48 bg-custom-grey border-charcoal text-white focus:outline-0"
                />
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="border-slate-600"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {onlineRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-charcoal rounded-lg hover:bg-custom-grey transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`
                      w-3 h-3 rounded-full
                      ${
                        room.status === "waiting"
                          ? "bg-green-400"
                          : "bg-yellow-400"
                      }
                    `}
                    />

                    <div>
                      <h3 className="text-white font-semibold">{room.name}</h3>
                      <div className="flex items-center space-x-3 text-sm text-slate-400">
                        <span>Host: {room.host}</span>
                        <Badge variant="secondary" className="bg-slate-600">
                          {room.hostRating}
                        </Badge>
                        <span>{room.timeControl}</span>
                        <Badge
                          variant={
                            room.type === "ranked" ? "default" : "secondary"
                          }
                        >
                          {room.type}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm">
                      <div className="text-white">
                        {room.players}/{room.maxPlayers} players
                      </div>
                      {room.spectators > 0 && (
                        <div className="text-slate-400">
                          {room.spectators} watching
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {room.status === "playing" ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="border-slate-600"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Watch
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className=""
                          variant="destructive"
                          onClick={() => handleJoinRoom(room.id)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

export default AvailableRooms;
