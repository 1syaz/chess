import { useNavigate } from "react-router";
import { Button } from "./ui/button";

function AiModeDialogContent() {
  const navigate = useNavigate();
  const levels = ["easy", "medium", "hard"];

  const handleStartMatch = (level: string) => {
    navigate(`/match?game=ai&level=${level}`);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold">Choose difficulty</h1>
        <p className="text-sm text-white/40">
          Select how challenging the AI should be for this match.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {levels.map((level) => (
          <Button onClick={() => handleStartMatch(level)} key={level}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default AiModeDialogContent;
