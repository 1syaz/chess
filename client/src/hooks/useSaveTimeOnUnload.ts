import { useEffect } from "react";

export const useSaveTimeOnUnload = (p1TimeLeft: number, p2TimeLeft: number) => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem(
        "players",
        JSON.stringify({
          players: {
            player1: p1TimeLeft,
            player2: p2TimeLeft,
          },
        })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [p1TimeLeft, p2TimeLeft]);
};
