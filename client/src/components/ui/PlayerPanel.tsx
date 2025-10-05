import { useAppSelector } from "@/app/hooks";
import { selectPlayers } from "@/features/game/gameSlice";
import PlayerDisplay from "./PlayerDisplay";
import { useSaveTimeOnUnload } from "@/hooks/useSaveTimeOnUnload";
import { useCountDownTime } from "@/hooks/useCountDownTimer";
import { useAlertLowTime } from "@/hooks/useAlertLowTime";

interface PlayerPanelProps {
  lowTimePlayedTrack: React.RefObject<{
    p1: boolean;
    p2: boolean;
  }>;
  handleFinishTimeGameOver: () => void;
}

function PlayerPanel({
  lowTimePlayedTrack,
  handleFinishTimeGameOver,
}: PlayerPanelProps) {
  const [player1, player2] = useAppSelector(selectPlayers);
  useSaveTimeOnUnload(
    (player1 && player1.timeLeft) ?? 0,
    (player2 && player2.timeLeft) ?? 0
  );
  useCountDownTime();
  useAlertLowTime(
    player1,
    player2,
    lowTimePlayedTrack,
    handleFinishTimeGameOver
  );

  if (!player1 || !player2) return null;

  return (
    <div className=" flex flex-row lg:flex-col justify-between  gap-4 border bg-custom-grey border-white/20 rounded-lg p-4">
      {[player1, player2].map((player) => {
        return <PlayerDisplay key={player.color} player={player} />;
      })}
    </div>
  );
}

export default PlayerPanel;
