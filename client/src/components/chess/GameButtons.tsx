import { Button } from "../ui/button";
interface GameButtonsProps {
  handleResign: () => void;
  handleDraw: () => void;
  handleTakeback: () => void;
}

function GameButtons({
  handleResign,
  handleTakeback,
  handleDraw,
}: GameButtonsProps) {
  return (
    <div className="flex flex-row lg:flex-col gap-3 p-4 flex-wrap">
      <Button
        onClick={handleResign}
        variant="destructive"
        size="sm"
        className="w-auto cursor-pointer flex-1 lg:flex-none"
      >
        Resign
      </Button>
      <Button
        onClick={handleDraw}
        variant="secondary"
        size="sm"
        className="flex-1 lg:flex-none"
      >
        Offer Draw
      </Button>
      <Button
        onClick={handleTakeback}
        variant="default"
        size="sm"
        className="flex-1 lg:flex-none"
      >
        Request Takeback
      </Button>
    </div>
  );
}

export default GameButtons;
