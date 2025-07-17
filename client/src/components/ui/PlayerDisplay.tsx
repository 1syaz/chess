import { motion } from "motion/react";
import { useAppSelector } from "@/app/hooks";
import { selectPlayerColor } from "@/features/game/gameSlice";
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
  const playerColor = useAppSelector(selectPlayerColor);

  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={{
        scale: player.color === playerColor ? 1.05 : 1,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`flex lg:flex-row flex-col-reverse items-center justify-between gap-4 ${playerColor === player.color && "bg-mint-green/20"} p-2 rounded-md`}
    >
      <div className="flex gap-4 items-center">
        <motion.div
          // initial={{
          //   borderColor: "transparent",
          //   borderWidth: "1px",
          // }}
          // animate={{
          //   borderColor:
          //     player.color === playerColor ? "#22c55e" : "transparent", // green
          //   borderWidth: player.color === playerColor ? "4px" : "2px",
          // }}
          // transition={{ duration: 0.3 }}
          className="border-solid rounded-full"
        >
          <img
            className="rounded-full w-10 h-10 lg:w-14 lg:h-14"
            src={player?.imgUrl}
            alt="Player 2"
          />
        </motion.div>
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
    </motion.div>
  );
}
export default PlayerDisplay;
