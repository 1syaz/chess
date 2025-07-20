import { useCallback, useEffect, useRef } from "react";
import moveAudio from "@/assets/sounds/Move.mp3";
import captureAudio from "@/assets/sounds/Capture.mp3";
import notifyAudio from "@/assets/sounds/GenericNotify.mp3";
import checkAudio from "@/assets/sounds/Check.mp3";

/*  
handle game audios
*/

export function useChessAudio() {
  const audioRefs = useRef<{
    move: HTMLAudioElement;
    capture: HTMLAudioElement;
    check: HTMLAudioElement;
    notify: HTMLAudioElement;
  } | null>(null);

  useEffect(() => {
    audioRefs.current = {
      move: new Audio(moveAudio),
      capture: new Audio(captureAudio),
      notify: new Audio(notifyAudio),
      check: new Audio(checkAudio),
    };

    return () => {
      if (audioRefs.current) {
        Object.values(audioRefs.current).forEach((audio) => {
          audio.pause();
          audio.currentTime = 0;
        });
      }
    };
  }, []);

  const playSound = useCallback(
    (type: "move" | "capture" | "notify" | "check") => {
      try {
        audioRefs.current?.[type].play().catch(console.warn);
      } catch (err) {
        console.warn("Audio playback failed:", err);
      }
    },
    []
  );

  return { playSound };
}
