import { WebSocket } from "ws";
import { Game } from "./Game";
import { PlayerColorType } from "../types/types";
import { games } from "./initWebSocketServer";
import { ZodError } from "zod";
import { MessageSchema } from "../types/ws-types";

export class User {
  ws: WebSocket;
  username: string | undefined;
  inGame: string | undefined;
  pieceColor: PlayerColorType;

  constructor(ws: WebSocket) {
    this.ws = ws;
    this.initHandlers();
  }

  initHandlers() {
    this.ws.on("message", (data) => {
      const parsedData = JSON.parse(data.toString());
      const { event, payload } = parsedData;

      try {
        MessageSchema.parse(parsedData);
      } catch (error) {
        if (error instanceof ZodError) {
          const messages = error.issues.map(
            (issue) => `${issue.path.join(".")} | ${issue.message}`
          );
          this.ws.send(
            JSON.stringify({
              event: "ERROR",
              payload: {
                message: messages,
              },
            })
          );

          return;
        }
      }

      switch (event) {
        case "JOIN_GAME":
          {
            const isUserInGame = (user: any) => {
              for (let game of games.values()) {
                if (
                  game.p1?.username === user.username ||
                  game.p2?.username === user.username
                ) {
                  return true;
                }
              }
              return false;
            };

            const user = {
              // NOTE: temp username will verify jwt and get username from db
              username: payload.username,
              ws: this.ws,
              pieceColor: payload.pieceColor,
            };

            if (isUserInGame(user)) {
              this.ws.send(
                JSON.stringify({
                  event: "ERROR",
                  payload: { message: "Already in game" },
                })
              );
              return;
            }

            if (games.size <= 0) {
              let newGame = new Game();
              newGame.addPlayerOne(user);
              this.inGame = newGame.id;

              games.set(newGame.id, newGame);
            } else {
              // check for games with waiting state
              let waitingGame: Game | undefined;
              for (let game of games.values()) {
                if (game.gameState === "waiting") {
                  waitingGame = game;
                  break;
                }
              }

              if (waitingGame) {
                waitingGame.addPlayerTwo(user);

                this.inGame = waitingGame.id;
              } else {
                const newGame = new Game();
                newGame.addPlayerOne(user);

                this.inGame = newGame.id;
                games.set(newGame.id, newGame);
              }
            }

            this.ws.send(
              JSON.stringify({
                event: "GAME_JOINED",
                payload: {
                  message: "you have joined the game",
                  gameId: this.inGame,
                },
              })
            );
          }
          break;

        case "MOVE_PIECE":
          {
            const { gameId } = payload;

            const game = games.get(gameId);

            game?.movePiece(this.ws, payload);
          }
          break;

        default:
          break;
      }
    });
  }
}
