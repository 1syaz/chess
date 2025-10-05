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
                },
              })
            );
          };
          ws1.onmessage = ({ data }) => {
            const { event, payload } = JSON.parse(data.toString());

            expect(event).toBe("GAME_JOINED");
            expect(payload.message).toBe("you have joined the game");
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
            ws1.onmessage = null;

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
              pieceColor: "w",
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
              pieceColor: "w",
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

    it("should handle wrong player moves out of turn", async () => {
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
            const { event } = JSON.parse(data.toString());

            expect(event).toBe("GAME_JOINED");
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
            activeGame = games.get(payload.gameId);
            ws2.onmessage = null;
            resolve();
          };
        }),
      ]);

      const playerWaitingForTurn =
        activeGame?.p1?.pieceColor === "w" ? ws2 : ws1;

      await new Promise<void>((resolve) => {
        playerWaitingForTurn.onmessage = ({ data }) => {
          const { event, payload } = JSON.parse(data.toString());

          expect(event).toBe("ERROR");
          expect(payload.message).toBe("Not your turn yet");
          resolve();
        };

        playerWaitingForTurn.send(
          JSON.stringify({
            event: "MOVE_PIECE",
            payload: {
              gameId: "12345",
              pieceColor: "b",
              move: {
                promotion: "",
                to: "e4",
                from: "e2",
              },
            },
          })
        );
      });
    });
  });

  // TODO: write test for  handle promotion
  // 3k4/P3r3/5n2/8/8/8/3K4/3R4 w - - 0 1

  // ------------------------
  // END_GAME
  // ------------------------

  it("should handle stalemate", async () => {
    let playerOnTurn: WebSocket;
    let fen = "7k/5K2/8/5Q2/8/8/8/8 w - - 16 9";

    await Promise.all([
      new Promise<void>((resolve) => {
        ws1.onopen = () => {
          ws1.send(
            JSON.stringify({
              event: "JOIN_GAME",
              payload: {
                username: "user1",
                fen: "7k/5K2/8/5Q2/8/8/8/8 w - - 16 9",
              },
            })
          );
        };

        ws1.onmessage = ({ data }) => {
          const { event } = JSON.parse(data.toString());

          expect(event).toBe("GAME_JOINED");
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

          const activeColor = fen.split(" ")[1]; // "w" or "b"
          playerOnTurn =
            activeColor === "w"
              ? payload.pieceColor === "w"
                ? ws2
                : ws1
              : payload.pieceColor === "b"
                ? ws2
                : ws1;
          ws2.onmessage = null;
          resolve();
        };
      }),
    ]);

    await new Promise<void>((resolve) => {
      playerOnTurn.onmessage = ({ data }) => {
        const { event, payload } = JSON.parse(data.toString());

        expect(event).toBe("GAME_OVER");
        expect(payload.message).toBe("Game drawn by stalemate");
        resolve();
      };

      playerOnTurn.send(
        JSON.stringify({
          event: "MOVE_PIECE",
          payload: {
            pieceColor: "w",
            gameId: "12345",
            move: {
              promotion: "",
              from: "f5",
              to: "g6",
            },
          },
        })
      );
    });
  });

  it("should handle checkmate", async () => {
    let playerOnTurn: WebSocket;
    let fen = "7k/5K2/8/5Q2/8/8/8/8 w - - 16 9";

    await Promise.all([
      new Promise<void>((resolve) => {
        ws1.onopen = () => {
          ws1.send(
            JSON.stringify({
              event: "JOIN_GAME",
              payload: {
                username: "user1",
                fen: "7k/5K2/8/5Q2/8/8/8/8 w - - 16 9",
              },
            })
          );
        };

        ws1.onmessage = ({ data }) => {
          const { event } = JSON.parse(data.toString());

          expect(event).toBe("GAME_JOINED");
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

          const activeColor = fen.split(" ")[1]; // "w" or "b"
          playerOnTurn =
            activeColor === "w"
              ? payload.pieceColor === "w"
                ? ws2
                : ws1
              : payload.pieceColor === "b"
                ? ws2
                : ws1;
          ws2.onmessage = null;
          resolve();
        };
      }),
    ]);

    await new Promise<void>((resolve) => {
      playerOnTurn.onmessage = ({ data }) => {
        const { event, payload } = JSON.parse(data.toString());

        expect(event).toBe("GAME_OVER");
        expect(payload.message).toBe("White won the game by checkmate");
        resolve();
      };

      playerOnTurn.send(
        JSON.stringify({
          event: "MOVE_PIECE",
          payload: {
            pieceColor: "w",
            gameId: "12345",
            move: {
              promotion: "",
              from: "f5",
              to: "h3",
            },
          },
        })
      );
    });
  });

  it("should handle insufficient material", async () => {
    let playerOnTurn: WebSocket;
    let fen = "8/8/8/3k4/8/8/3Kq3/8 w - - 0 1";

    await Promise.all([
      new Promise<void>((resolve) => {
        ws1.onopen = () => {
          ws1.send(
            JSON.stringify({
              event: "JOIN_GAME",
              payload: { username: "user1", fen },
            })
          );
        };

        ws1.onmessage = ({ data }) => {
          expect(JSON.parse(data.toString()).event).toBe("GAME_JOINED");
          ws1.onmessage = null;
          resolve();
        };
      }),
      new Promise<void>((resolve) => {
        ws2.onopen = () => {
          ws2.send(
            JSON.stringify({
              event: "JOIN_GAME",
              payload: { username: "user2" },
            })
          );
        };

        ws2.onmessage = ({ data }) => {
          const { event, payload } = JSON.parse(data.toString());
          expect(event).toBe("GAME_JOINED");

          const activeColor = fen.split(" ")[1];
          playerOnTurn =
            activeColor === "w"
              ? payload.pieceColor === "w"
                ? ws2
                : ws1
              : payload.pieceColor === "b"
                ? ws2
                : ws1;

          ws2.onmessage = null;
          resolve();
        };
      }),
    ]);

    await new Promise<void>((resolve) => {
      playerOnTurn.onmessage = ({ data }) => {
        const { event, payload } = JSON.parse(data.toString());
        expect(event).toBe("GAME_OVER");
        expect(payload.message).toBe("Game drawn by insufficient material");
        resolve();
      };

      playerOnTurn.send(
        JSON.stringify({
          event: "MOVE_PIECE",
          payload: {
            pieceColor: "w",
            gameId: "12345",
            move: { promotion: "", from: "d2", to: "e2" },
          },
        })
      );
    });
  });
});
