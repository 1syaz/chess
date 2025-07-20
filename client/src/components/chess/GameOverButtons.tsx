import { useNavigate } from "react-router";
import { Button } from "../ui/button";

interface GameOverButtonsProps {
  handlePlayAgain: () => void;
}

function GameOverButtons({ handlePlayAgain }: GameOverButtonsProps) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row lg:flex-col gap-3 p-4 flex-wrap  items-center md:items-stretch justify-center ">
      <Button onClick={handlePlayAgain} variant="secondary" size="sm">
        Play again
      </Button>
      <Button
        onClick={() => {
          navigate({ pathname: "/play" }, { replace: true });
        }}
        variant="destructive"
        size="sm"
      >
        Go back to home
      </Button>
    </div>
  );
}

export default GameOverButtons;
