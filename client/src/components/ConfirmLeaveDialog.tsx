import type { AppDispatch } from "@/app/store";
import type { Chess } from "chess.js";
import type { Blocker } from "react-router";
import DialogComponent from "./DialogComponent";
import { Button } from "./ui/button";
import initLocalGame from "@/utils/initLocalGame";
import { setFen, startGame } from "@/features/game/gameSlice";

const getInitialPlayerColor = () => {
  const saved = localStorage.getItem("chessGame");
  return saved ? JSON.parse(saved).playerColor : null;
};

const playerColorFromLS = getInitialPlayerColor();

export function ConfirmLeaveDialog({
  blocker,
  dispatch,
  gameRef,
  setIsInGame,
  timeInMs,
}: {
  blocker: Blocker;
  dispatch: AppDispatch;
  gameRef: React.RefObject<Chess>;
  setIsInGame: React.Dispatch<React.SetStateAction<boolean>>;
  timeInMs: string | null;
}) {
  return (
    blocker.state === "blocked" && (
      <DialogComponent
        toggleDialog={() => blocker.reset?.()}
        dialogTitle="Caution"
        isDialogOpen={blocker.state === "blocked"}
      >
        <div className="text-white flex flex-col gap-3">
          <p>You sure you want to leave match page?</p>
          <div className="flex justify-end gap-2">
            <Button onClick={() => blocker.reset?.()}>Stay here</Button>
            <Button
              variant="destructive"
              onClick={() => {
                localStorage.clear();
                initLocalGame(
                  dispatch,
                  gameRef,
                  playerColorFromLS,
                  setIsInGame,
                  timeInMs,
                );
                dispatch(
                  startGame({
                    board: gameRef.current.board(),
                    playerColor: "w",
                  }),
                );
                dispatch(
                  setFen(
                    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                  ),
                );
                blocker.proceed?.();
              }}
            >
              Leave
            </Button>
          </div>
        </div>
      </DialogComponent>
    )
  );
}
