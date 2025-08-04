import "./config/passportSetup";
import express from "express";
import helmet from "helmet";
import userRouter from "./routes/userRoute";
import cookieParser from "cookie-parser";
import passport from "passport";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { errorMiddleware } from "./middleware/errorMiddleware";

const app = express();

// middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// routes
app.use("/api/v1/users", userRouter);

app.use(errorMiddleware);

// websockets
const server = http.createServer(app);
const wss = new WebSocketServer({
  server,
});

interface Game {
  players: WebSocket[];
}
const playground: Record<string, Game> = {};

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data: string) {
    const parsedData = JSON.parse(data);

    // create game if not already
    if (parsedData.type === "join-game") {
      const game = parsedData.game;
      if (!playground[game]) {
        playground[game] = {
          players: [],
        };
      }
      playground[game].players.push(ws);
    }

    // send move to everyone in game
    if (parsedData.type === "move-piece") {
      const { game } = parsedData;
      console.log("PARSED DATA", parsedData);

      playground[game].players?.forEach((ws) =>
        ws.send(JSON.stringify(parsedData))
      );
    }
  });
});

wss.on("close", () => {
  console.log("server closed");
});

export default server;
