import { useAppDispatch } from "@/app/hooks";
import RecentActivity from "@/components/chess/RecentActivity";
import GameMode from "@/components/GameMode";
import { setGameStatus } from "@/features/game/gameSlice";
import { motion } from "motion/react";
import { useEffect } from "react";

function Play() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    localStorage.clear();
    dispatch(setGameStatus({ isGameOver: false, message: "" }));
  }, [dispatch]);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-text-primary"
          >
            Choose Your Game Mode
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-text-secondary max-w-2xl mx-auto"
          >
            Select how you want to play chess today
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="space-y-6 py-5 px-5">
            <GameMode />
            <RecentActivity />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Play;
