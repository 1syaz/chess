import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { PlayerColorType } from "../types/types";
import { handleTimeFormat } from "../utils/handleTimeFormat";

interface IPlayer {
  username: string;
  ws: WebSocket;
  pieceColor: PlayerColorType;
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

  // temp
  whiteTimer: NodeJS.Timeout | undefined;
  blackTimer: NodeJS.Timeout | undefined;

  private p1TimeIntervalId: NodeJS.Timeout | undefined = undefined;
  private p2TimeIntervalId: NodeJS.Timeout | undefined = undefined;

  constructor(gameTime: number = 600000) {
    this.gameTime = gameTime;
  }

  addPlayerOne(player: Omit<IPlayer, "playerTime">) {
    this.p1 = player;
    this.p1.pieceColor = pieceColor[
      Math.floor(Math.random() * pieceColor.length)
    ] as PlayerColorType;
    this.turn = this.game.turn();
    this.gameState = "waiting";
    this.p1.playerTime = this.gameTime;
  }

  addPlayerTwo(player: IPlayer) {
    this.p2 = player;
    this.p2.pieceColor = this.p1?.pieceColor === "w" ? "b" : "w";
    this.gameState = "in-progress";
    this.p2.playerTime = this.gameTime;
    this.handleStartAndToggleTurn();
  }

  startGame() {
    // Always clear existing intervals before starting
    clearInterval(this.p1TimeIntervalId);
    clearInterval(this.p2TimeIntervalId);

    if (this.turn === this.p1?.pieceColor) {
      this.p1TimeIntervalId = setInterval(() => {
        this.p1!.playerTime = this.p1?.playerTime! - 1000;

        if (this.p1?.playerTime! <= 0) {
          const data = {
            event: "GAME_OVER",
            message: `${this.p1?.username} ran out of time`,
          };

          this.broadcastMessage(this.p1!.ws, data);
        }
      }, 1000);
    } else if (this.turn === this.p2?.pieceColor) {
      this.p2TimeIntervalId = setInterval(() => {
        this.p2!.playerTime = this.p2?.playerTime! - 1000;

        if (this.p2?.playerTime! <= 0) {
          const data = {
            event: "GAME_OVER",
            message: `${this.p2?.username} ran out of time`,
          };

          this.broadcastMessage(this.p2!.ws, data);
        }
      }, 1000);
    }
  }

  private handleStartAndToggleTurn() {
    if (this.turn === this.p1?.pieceColor) {
      this.p2TimeIntervalId && clearInterval(this.p2TimeIntervalId);
      this.p1TimeIntervalId = setInterval(() => {
        this.p1!.playerTime = this.p1?.playerTime! - 1000;

        if (this.p1?.playerTime! <= 0) {
          clearInterval(this.p1TimeIntervalId);
          this.gameState = "finished";
          const data = {
            event: "game-over",
            message: `${this.p1?.username} ran out of time`,
          };

          this.broadcastMessage(this.p1!.ws, data);
        }
      }, 1000);
    } else if (this.turn === this.p2?.pieceColor) {
      this.p1TimeIntervalId && clearInterval(this.p1TimeIntervalId);
      this.p2TimeIntervalId = setInterval(() => {
        this.p2!.playerTime = this.p2?.playerTime! - 1000;

        if (this.p2?.playerTime! <= 0) {
          clearInterval(this.p2TimeIntervalId);
          this.gameState = "finished";

          const data = {
            event: "GAME_OVER",
            message: `${this.p2?.username} ran out of time`,
          };

          this.broadcastMessage(this.p2!.ws, data);
        }
      }, 1000);
    }
  }

  movePiece(ws: WebSocket, data: any) {
    if (this.gameState === "finished" || this.gameState === "waiting") return;

    const { move } = data;

    const moves = this.game.moves({ verbose: true });
    const isValidMove = moves.some(
      (m) => m.to === move.to && m.from === move.from
    );

    console.log(move);
    console.log("CHECK FOR VALID MOVE");
    if (!isValidMove) {
      console.log("ERROR IS VALID");
      ws.send(
        JSON.stringify({
          event: "ERROR",
          payload: {
            message: "Invalid move",
          },
        })
      );
      return;
    }

    const moveResult = this.game.move(move.to);
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

    const gameStatus = {
      capture: moveResult.captured || null,
      promotion: moveResult.promotion || null,
      draw: this.game.isDraw(),
      threefold: this.game.isThreefoldRepetition(),
      stalemate: this.game.isStalemate(),
      check: this.game.isCheck(),
      checkmate: this.game.isCheckmate(),
    };

    const payload = {
      event: "MOVE_MADE",
      payload: {
        fen: this.fen,
        turn: this.turn,
        timeWhite:
          this.p1?.pieceColor === "w"
            ? this.p1?.playerTime
            : this.p2?.playerTime,
        timeBlack:
          this.p2?.pieceColor === "b"
            ? this.p2?.playerTime
            : this.p1?.playerTime,
        ...gameStatus,
      },
    };

    if (gameStatus.checkmate || gameStatus.draw || gameStatus.stalemate) {
      this.gameState = "finished";
    }

    this.broadcastMessage(ws, payload);
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

  private broadcastMessage(ws: WebSocket, data: any) {
    const connectedPlayers = [this.p1?.ws, this.p2?.ws];
    for (let player of connectedPlayers) {
      if (player && player !== ws) {
        player.send(JSON.stringify(data));
      }
    }
  }
}
