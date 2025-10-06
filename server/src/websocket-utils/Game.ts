import { WebSocket } from "ws";
import { PlayerColorType } from "../types/types";
import { Chess } from "chess.js";

interface IPlayer {
  username: string;
  ws: WebSocket;
  pieceColor?: PlayerColorType;
  playerTime?: number;
}

const pieceColor = ["w", "b"];

export class Game {
  p1: IPlayer | undefined;
  p2: IPlayer | undefined;
  // id: string = uuidv4();
  id: string = "12345";
  game: Chess = new Chess();
  fen: string = this.game.fen();
  turn: PlayerColorType;
  spectators: WebSocket[] = [];
  gameState: "waiting" | "finished" | "in-progress" | undefined;
  gameTime: number = 0;
  isGameOver: {
    state: boolean;
    reason: string;
  } = { state: false, reason: "" };

  private p1TimeIntervalId: NodeJS.Timeout | undefined = undefined;
  private p2TimeIntervalId: NodeJS.Timeout | undefined = undefined;

  constructor(gameTime: number = 200000, fen?: string) {
    this.gameTime = gameTime;
    this.game = fen ? new Chess(fen) : new Chess();
  }

  addPlayerOne(
    player: Omit<IPlayer, "playerTime" | "pieceColor">,
    playerWs: WebSocket
  ) {
    this.p1 = player;
    this.p1.pieceColor = pieceColor[
      Math.floor(Math.random() * pieceColor.length)
    ] as PlayerColorType;
    this.turn = this.game.turn();
    this.gameState = "waiting";
    this.p1.playerTime = this.gameTime;

    playerWs.send(
      JSON.stringify({
        event: "GAME_JOINED",
        payload: {
          message: "you have joined the game",
          gameId: this.id,
          pieceColor: this.p1.pieceColor,
        },
      })
    );
  }

  addPlayerTwo(player: IPlayer, playerWs: WebSocket) {
    this.p2 = player;
    this.p2.pieceColor = this.p1?.pieceColor === "w" ? "b" : "w";
    this.gameState = "in-progress";
    this.p2.playerTime = this.gameTime;
    this.handleStartAndToggleTurn();

    playerWs.send(
      JSON.stringify({
        event: "GAME_JOINED",
        payload: {
          message: "you have joined the game",
          gameId: this.id,
          pieceColor: this.p2.pieceColor,
        },
      })
    );
  }

  startGame() {
    // Always clear existing intervals before starting
    clearInterval(this.p1TimeIntervalId);
    clearInterval(this.p2TimeIntervalId);

    const currentPlayer = this.turn === this.p1?.pieceColor ? this.p1 : this.p2;

    if (currentPlayer) {
      const intervalId = setInterval(() => {
        if (currentPlayer.playerTime) {
          currentPlayer.playerTime -= 1000;

          if (currentPlayer.playerTime <= 0) {
            const data = {
              event: "GAME_OVER",
              message: `${this.p1?.username} ran out of time`,
            };

            this.broadcastMessage(data);
          }
        }
      }, 1000);

      if (currentPlayer === this.p1) this.p1TimeIntervalId = intervalId;
      else this.p2TimeIntervalId = intervalId;
    }
  }

  private handleStartAndToggleTurn() {
    if (this.turn === this.p1?.pieceColor) {
      this.p2TimeIntervalId && clearInterval(this.p2TimeIntervalId);
      this.p1TimeIntervalId = setInterval(() => {
        this.p1!.playerTime = this.p1?.playerTime! - 1000;

        if (this.p1?.playerTime! <= 0) {
          clearInterval(this.p1TimeIntervalId);
          const message = `${this.p2?.pieceColor} won the game! ${this.p1?.username} ran out of time`;
          this.gameState = "finished";
          this.isGameOver = {
            state: true,
            reason: message,
          };

          const data = {
            event: "GAME_OVER",
            message,
          };

          this.broadcastMessage(data);
        }
      }, 1000);
    } else if (this.turn === this.p2?.pieceColor) {
      this.p1TimeIntervalId && clearInterval(this.p1TimeIntervalId);
      this.p2TimeIntervalId = setInterval(() => {
        this.p2!.playerTime = this.p2?.playerTime! - 1000;

        if (this.p2?.playerTime! <= 0) {
          clearInterval(this.p2TimeIntervalId);
          const message = `${this.p1?.pieceColor} won the game! ${this.p2?.pieceColor} ran out of time`;
          this.gameState = "finished";
          this.isGameOver = {
            state: true,
            reason: message,
          };

          const data = {
            event: "GAME_OVER",
            message,
          };

          this.broadcastMessage(data);
        }
      }, 1000);
    }
  }

  movePiece(ws: WebSocket, data: any) {
    const { move, pieceColor } = data;

    if (this.gameState === "finished" || this.gameState === "waiting") {
      ws.send(
        JSON.stringify({
          event: "ERROR",
          payload: {
            message: "Game has been over",
          },
        })
      );
      return;
    }

    if (pieceColor !== this.turn) {
      ws.send(
        JSON.stringify({
          event: "ERROR",
          payload: {
            message: "Not your turn yet",
          },
        })
      );
      return;
    }

    const moves = this.game.moves({ verbose: true });
    const isValidMove = moves.some(
      (m) => m.to === move.to && m.from === move.from
    );

    if (!isValidMove) {
      ws.send(
        JSON.stringify({
          event: "ERROR",
          payload: {
            message: "Invalid move",
            move,
          },
        })
      );
      return;
    }

    const moveResult = this.game.move({
      to: move.to,
      from: move.from,
      promotion: move.promotion,
    });
    if (!moveResult) {
      ws.send(
        JSON.stringify({
          event: "ERROR",
          message: "Invalid move",
        })
      );
      return;
    }

    this.fen = this.game.fen();
    this.turn = this.game.turn();

    const payload = {
      event: "MOVE_MADE",
      payload: {
        fen: this.fen,
        turn: this.turn,
        move: {
          promotion: move.promotion,
          to: move.to,
          from: move.from,
        },
        isCapture: moveResult.captured || null,
        isCheck: this.game.isCheck(),
        isCheckmate: this.game.isCheckmate(),
        isStalemate: this.game.isStalemate(),
        promotion: moveResult.promotion || null,
      },
    };

    switch (true) {
      case this.game.isCheckmate(): {
        clearInterval(this.p1TimeIntervalId);
        clearInterval(this.p2TimeIntervalId);
        this.gameState = "finished";
        const winnerColor = this.turn === "w" ? "b" : "w";

        this.isGameOver = {
          state: true,
          reason: `${winnerColor === "w" ? "White" : "Black"} won the game by checkmate`,
        };

        this.broadcastMessage({
          event: "GAME_OVER",
          payload: {
            message: `${winnerColor === "w" ? "White" : "Black"} won the game by checkmate`,
          },
        });
        return;
      }

      case this.game.isDraw(): {
        this.gameState = "finished";

        let reason = "Game drawn";
        if (this.game.isStalemate()) {
          reason = "Game drawn by stalemate";
        } else if (this.game.isThreefoldRepetition()) {
          reason = "Game drawn by repetition";
        } else if (this.game.isInsufficientMaterial()) {
          reason = "Game drawn by insufficient material";
        } else if (this.game.isDraw()) {
          reason = "Game drawn";
        }

        clearInterval(this.p1TimeIntervalId);
        clearInterval(this.p2TimeIntervalId);
        this.isGameOver = { state: true, reason };

        this.broadcastMessage({
          event: "GAME_OVER",
          payload: { message: this.isGameOver.reason },
        });
        return;
      }
      default:
        break;
    }

    const confirmationPayload = {
      event: "MOVE_CONFIRMED",
      payload: {
        message: "Valid move",
        move,
      },
    };

    ws.send(JSON.stringify(confirmationPayload));
    this.broadcastToOthers(ws, payload);
    this.handleStartAndToggleTurn();
  }

  //temp
  stopGame() {
    if (this.p1TimeIntervalId) {
      clearInterval(this.p1TimeIntervalId);
    }
    if (this.p2TimeIntervalId) {
      clearInterval(this.p2TimeIntervalId);
    }
  }

  private broadcastMessage(data: any) {
    const connectedPlayers = [this.p1?.ws, this.p2?.ws];
    for (let player of connectedPlayers) {
      if (player) {
        player.send(JSON.stringify(data));
      }
    }
  }

  private broadcastToOthers(ws: WebSocket, data: any) {
    const connectedPlayers = [this.p1?.ws, this.p2?.ws];

    for (let player of connectedPlayers) {
      if (player && player !== ws) {
        player.send(JSON.stringify(data));
      }
    }
  }
}
