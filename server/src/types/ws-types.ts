import z from "zod";
import type { Square } from "chess.js";

const squareSchema = z.custom<Square>(
  (val) => typeof val === "string" && /^[a-h][1-8]$/.test(val),
  { message: "Invalid chess square" }
);

export const JoinGameSchema = z.object({
  event: z.literal("JOIN_GAME"),
  payload: z.object({
    username: z.string(),
  }),
});

const MovePieceSchema = z.object({
  event: z.literal("MOVE_PIECE"),
  payload: z.object({
    gameId: z.string(),
    move: z.object({
      promotion: z.string().optional(),
      from: squareSchema,
      to: squareSchema,
    }),
  }),
});

export const MessageSchema = z.discriminatedUnion("event", [
  JoinGameSchema,
  MovePieceSchema,
]);
