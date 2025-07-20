import notifyAudio from "@/assets/sounds/GenericNotify.mp3";
import DialogComponent from "./DialogComponent";
import { Button } from "./ui/button";
import type { Chess } from "chess.js";
import type { AppDispatch } from "@/app/store";
import type { SetStateAction } from "react";
import { setGameStatus } from "@/features/game/gameSlice";

function ResignGameDialog({
  gameRef,
  dispatch,
  isDialogOpen,
  setIsDialogOpen,
  setIsInGame,
}: {
  gameRef: React.RefObject<Chess>;
  dispatch: AppDispatch;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<SetStateAction<boolean>>;
  setIsInGame: React.Dispatch<SetStateAction<boolean>>;
}) {
  const handleResign = () => {
    const notifySound = new Audio(notifyAudio);
    const turn = gameRef.current.turn();
    notifySound.play();

    const message = `${turn === "w" ? "Black" : "White"} wins — ${
      turn === "w" ? "White" : "Black"
    } resigned.`;
    dispatch(setGameStatus({ isGameOver: true, message }));
    localStorage.setItem(
      "gameOver",
      JSON.stringify({ isGameOver: true, message })
    );
    setIsDialogOpen(false);
    setIsInGame(false);
  };

  return (
    isDialogOpen && (
      <DialogComponent
        toggleDialog={setIsDialogOpen}
        isDialogOpen={isDialogOpen}
        dialogTitle={"Are you sure you want to resign?"}
      >
        <div className="flex items-center justify-end gap-2">
          <Button onClick={() => setIsDialogOpen(false)}>No</Button>
          <Button onClick={handleResign} variant="destructive">
            Yes
          </Button>
        </div>
      </DialogComponent>
    )
  );
}

export default ResignGameDialog;
