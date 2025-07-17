import { useNavigate } from "react-router";
import { Button } from "./ui/button";

function LocalDialogContent() {
  const navigate = useNavigate();
  const time = [
    { minute: 5, ms: 300000 },
    { minute: 10, ms: 600000 },
    { minute: 15, ms: 900000 },
  ];

  const handleStartMatch = (time: number) => {
    navigate(`/match?game=local&time=${time}`);
    console.log(time);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold">Choose your time control</h1>
        <p className="text-sm text-white/40">
          Select how much time each player will have for the match. You can play
          with a timer or select “Unlimited” for a relaxed game.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {time.map((t) => (
          <Button onClick={() => handleStartMatch(t.ms)} key={t.minute}>
            {t.minute} minute
          </Button>
        ))}
      </div>
    </div>
  );
}

export default LocalDialogContent;
