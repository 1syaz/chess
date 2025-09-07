import type http from "node:http";
import { WebSocket } from "ws";
import { startServer } from "./test-utils/webSocketTestUtil";
import { games } from "../src/websocket-utils/initWebSocketServer";
import { Game } from "../src/websocket-utils/Game";

const BACKEND_URL = "ws://localhost:3000";
const PORT = 3000;

jest.setTimeout(10_000);

describe("WebSocket Server", () => {
  let ws1: WebSocket;
  let ws2: WebSocket;

  let server: http.Server;

  beforeAll(async () => {
    server = await startServer(PORT);
  });

  beforeEach(() => {
    ws1 = new WebSocket(BACKEND_URL);
    ws2 = new WebSocket(BACKEND_URL);
  });

  afterEach(async () => {
    games.forEach((game) => {
      game.stopGame();
    });
    games.clear();

    ws1.close();
    ws2.close();

    await Promise.all([
      new Promise<void>((res) => {
        ws1.onclose = () => res();
      }),
      new Promise<void>((res) => {
        ws2.onclose = () => res();
      }),
    ]);
  });

  afterAll(async () => {
    server.close();
  });

  // ------------------------
  // JOIN_GAME
  // ------------------------

  describe("JOIN_GAME", () => {
    it("should allow a user to join a game", async () => {
      await new Promise<void>((resolve) => {
        ws1.onopen = () => {
          ws1.send(
            JSON.stringify({
              event: "JOIN_GAME",
              payload: {
                username: "sarib",
                pieceColor: "w",
              },
            })
          );
        };

        ws1.onmessage = ({ data }) => {
          const { event, payload } = JSON.parse(data.toString());

          expect(event).toBe("GAME_JOINED");
          expect(games.has(payload.gameId)).toBe(true);
          resolve();
        };
      });
    });

    it("should not allow the same user to join game more than once", async () => {
      await new Promise<void>((resolve) => {
        ws1.onopen = () => {
          ws1.send(
            JSON.stringify({
              event: "JOIN_GAME",
              payload: {
                username: "player1",
                pieceColor: "w",
              },
            })
          );

          ws1.send(
            JSON.stringify({
              event: "JOIN_GAME",
              payload: {
                username: "player1",
                pieceColor: "w",
              },
            })
          );
        };
        const messages: { event: string; message: string }[] = [];

        ws1.onmessage = ({ data }) => {
          const { event, payload } = JSON.parse(data.toString());

          messages.push({
            event: event,
            message: payload.message,
          });

          if (messages.length === 2) {
            expect(messages).toEqual([
              { event: "GAME_JOINED", message: "you have joined the game" },
              { event: "ERROR", message: "Already in game" },
            ]);
            resolve();
          }
        };
      });
    });

    it("should send error event for invalid payload", async () => {
      await new Promise<void>((resolve) => {
        ws1.onopen = () => {
          ws1.send(
            JSON.stringify({
              event: "JOIN_GAME",
              payload: {
                username: 123, // invalid username
                pieceColor: "w",
              },
            })
          );
        };

        ws1.onmessage = ({ data }) => {
          const { event, payload } = JSON.parse(data.toString());

          expect(event).toBe("ERROR");
          expect(payload.message[0]).toBe(
            "payload.username | Invalid input: expected string, received number"
          );
          resolve();
        };
      });
    });

    it("should allow two users to join and mark the game as started", async () => {
      await Promise.all([
        new Promise<void>((resolve) => {
          ws1.onopen = () => {
            ws1.send(
              JSON.stringify({
                event: "JOIN_GAME",
                payload: {
                  username: "user1",
                  pieceColor: "w",
                },
              })
            );
          };

          ws1.onmessage = ({ data }) => {
            const { event, payload } = JSON.parse(data.toString());

            expect(event).toBe("GAME_JOINED");
            expect(payload.message).toBe("you have joined the game");

            resolve();
          };
        }),

        new Promise<void>((resolve) => {
          ws2.onopen = () => {
            ws2.send(
              JSON.stringify({
                event: "JOIN_GAME",
                payload: {
                  username: "user2",
                  pieceColor: "b",
                },
              })
            );
          };

          ws2.onmessage = ({ data }) => {
            const { event, payload } = JSON.parse(data.toString());

            const gameId = payload.gameId;
            const game = games.get(gameId);

            expect(event).toBe("GAME_JOINED");
            expect(payload.message).toBe("you have joined the game");
            expect(game?.gameState).toBe("in-progress");

            resolve();
          };
        }),
      ]);
    });
  });

  // ------------------------
  // MOVE_PIECE
  // ------------------------

  describe("MOVE_PIECE", () => {
    it("should reject an illegal move", async () => {
      let activeGame: Game | undefined;

      await Promise.all([
        new Promise<void>((resolve) => {
          ws1.onopen = () => {
            ws1.send(
              JSON.stringify({
                event: "JOIN_GAME",
                payload: {
                  username: "user1",
                  pieceColor: "w",
                },
              })
            );
          };
          ws1.onmessage = ({ data }) => {
            const { event, payload } = JSON.parse(data.toString());

            expect(event).toBe("GAME_JOINED");
            expect(payload.message).toBe("you have joined the game");
            activeGame = games.get(payload.gameId);

            resolve();
          };
        }),

        new Promise<void>((resolve) => {
          ws2.onopen = () => {
            ws2.send(
              JSON.stringify({
                event: "JOIN_GAME",
                payload: {
                  username: "user2",
                  pieceColor: "b",
                },
              })
            );
          };
          ws2.onmessage = ({ data }) => {
            const { event, payload } = JSON.parse(data.toString());

            expect(event).toBe("GAME_JOINED");
            expect(payload.message).toBe("you have joined the game");

            resolve();
          };
        }),
      ]);

      const userOnTurn =
        activeGame?.turn === activeGame?.p1?.pieceColor ? ws1 : ws2;

      await new Promise<void>((resolve) => {
        userOnTurn.onmessage = ({ data }) => {
          const { event, payload } = JSON.parse(data.toString());

          expect(event).toBe("ERROR");
          expect(payload.message).toBe("Invalid move");

          resolve();
        };
        userOnTurn.send(
          JSON.stringify({
            event: "MOVE_PIECE",
            payload: {
              gameId: "12345",
              move: {
                promotion: "",
                from: "e2",
                to: "e5",
              },
            },
          })
        );
      });
    });

    it("should allow a user to make a legal move", async () => {
      let activeGame: Game | undefined;

      await Promise.all([
        new Promise<void>((resolve) => {
          ws1.onopen = () => {
            ws1.send(
              JSON.stringify({
                event: "JOIN_GAME",
                payload: {
                  username: "user1",
                },
              })
            );
          };
          ws1.onmessage = ({ data }) => {
            const { event, payload } = JSON.parse(data.toString());

            expect(payload.message).toBe("you have joined the game");
            expect(event).toBe("GAME_JOINED");
            activeGame = games.get(payload.gameId);

            ws1.onmessage = null;
            resolve();
          };
        }),

        new Promise<void>((resolve) => {
          ws2.onopen = () => {
            ws2.send(
              JSON.stringify({
                event: "JOIN_GAME",
                payload: {
                  username: "user2",
                },
              })
            );
          };
          ws2.onmessage = ({ data }) => {
            const { event, payload } = JSON.parse(data.toString());

            expect(event).toBe("GAME_JOINED");
            expect(payload.message).toBe("you have joined the game");

            ws2.onmessage = null;
            resolve();
          };
        }),
      ]);

      const gameId = activeGame?.id;
      const userOnTurn =
        activeGame?.turn === activeGame?.p1?.pieceColor ? ws1 : ws2;
      const playerWaitingForTurn =
        activeGame?.turn === activeGame?.p1?.pieceColor ? ws2 : ws1;

      await new Promise<void>((resolve) => {
        playerWaitingForTurn.addEventListener("message", ({ data }) => {
          const { event } = JSON.parse(data.toString());
          expect(event).toBe("MOVE_MADE");
          resolve();
        });

        userOnTurn.send(
          JSON.stringify({
            event: "MOVE_PIECE",
            payload: {
              gameId: gameId,
              move: {
                promotion: "",
                from: "e2",
                to: "e4",
              },
            },
          })
        );
      });
    });
  });
});
