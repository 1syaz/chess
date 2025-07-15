import { handleTimeFormat } from "@/utils/handleTimeFormat";
import type { Color } from "chess.js";

interface PlayerDisplayProps {
  player: {
    color: Color;
    imgUrl: string;
    timeLeft: number;
    name: string;
  };
}

function PlayerDisplay({ player }: PlayerDisplayProps) {
  return (
    <div
      key={player?.color}
      className="flex lg:flex-row flex-col-reverse items-center justify-between gap-4 "
    >
      <div className="flex gap-4 items-center">
        <img
          className="rounded-full w-10 h-10 lg:w-14 lg:h-14"
          src={player?.imgUrl}
          alt="Player 2"
        />
        <h3 className="font-medium text-xs lg:text-base">
          {player?.name ?? "player1"}
        </h3>
      </div>
      <div
        className={`w-[60px]  text-right text-lg font-semibold  flex item-center justify-center ${
          player && player.timeLeft < 1000 * 60 ? "text-red-400" : ""
        }`}
      >
        {handleTimeFormat(player?.timeLeft ?? 1)}
      </div>
    </div>
  );
}
export default PlayerDisplay;
