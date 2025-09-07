import http from "http";
import { WebSocketServer } from "ws";
import { Game } from "./Game";
import { User } from "./User";

export const games = new Map<string, Game>();

export function initWebSocketServer(server: http.Server) {
  const wss = new WebSocketServer({
    server,
  });

  wss.on("connection", async function connection(ws) {
    new User(ws);

    ws.on("error", (err) => {
      console.error(err);
    });

    ws.on("close", () => {});
  });

  wss.on("close", () => {
    console.log("server closed");
  });
}
