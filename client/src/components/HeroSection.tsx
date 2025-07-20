import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center  flex-1  ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center  mb-10 flex flex-col"
      >
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold leading-tight"
          >
            Play Chess in{" "}
            <span className="bg-gradient-to-r from-mint-green to-forest-green bg-clip-text text-transparent">
              One Place
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-xl  text-text-secondary max-w-3xl mx-auto leading-relaxed"
          >
            Play and compete with players. Improve your skills by playing
            against bots.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/play">
              <Button
                size="lg"
                className="bg-gradient-to-r from-mint-green to-forest-green hover:from-mint-green/90 hover:to-forest-green/90 text-white border-0 px-8 py-4  font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group md:text-base text-sm cursor-pointer"
              >
                Start Playing Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
      <img src="chessboard.png" className="h-auto max-h-[400px]" />
    </section>
  );
}

export default HeroSection;
