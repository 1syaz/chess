import { useEffect, useRef } from "react";
import LowTime from "@/assets/sounds/LowTime.mp3";
import type { Color } from "chess.js";

type Player = {
  timeLeft: number;
  color: Color;
  name: string;
  imgUrl: string;
};

export const useAlertLowTime = (
  p1: Player | null,
  p2: Player | null,
  lowTimePlayedTrack: React.RefObject<{
    p1: boolean;
    p2: boolean;
  }>,
  handleFinishTimeGameOver: () => void
) => {
  const player1Ref = useRef(p1);
  const player2Ref = useRef(p2);

  const lowTimeSoundRef = useRef<HTMLAudioElement | null>(new Audio(LowTime));

  useEffect(() => {
    const prev1 = player1Ref.current?.timeLeft ?? Infinity;
    const prev2 = player2Ref.current?.timeLeft ?? Infinity;

    const new1 = p1?.timeLeft ?? Infinity;
    const new2 = p2?.timeLeft ?? Infinity;

    if (prev1 >= 60000 && new1 < 60000 && !lowTimePlayedTrack.current.p1) {
      lowTimeSoundRef.current?.play();
      lowTimePlayedTrack.current.p1 = true;
    }

    if (prev2 >= 60000 && new2 < 60000 && !lowTimePlayedTrack.current.p2) {
      lowTimeSoundRef.current?.play();
      lowTimePlayedTrack.current.p2 = true;
    }

    if ((new2 === 0 && prev2 > 0) || (new1 === 0 && prev1 > 0)) {
      handleFinishTimeGameOver();
    }

    player1Ref.current = p1;
    player2Ref.current = p2;
  }, [p1, p2, lowTimePlayedTrack, handleFinishTimeGameOver]);
};
