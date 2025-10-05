import { BarChart3, Target, Zap } from "lucide-react";
import { motion } from "motion/react";

function FeatureSection() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Games",
      description:
        "Experience instant matchmaking and seamless gameplay with our optimized chess engine.",
    },
    {
      icon: Target,
      title: "Skill-Based Matching",
      description:
        "Play against opponents of similar skill levels for the most competitive and fair matches.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Track your progress with detailed statistics and performance insights to improve your game.",
    },
  ];
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center mb-20"
      >
        <div className="space-y-4 mb-12 ">
          <p className="text-mint-green font-semibold text-sm uppercase tracking-wide">
            FEATURES
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
            Everything You Need to Master Chess
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Simplify your chess journey with powerful tools designed for players
            of all levels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-mint-green/20 to-forest-green/20 rounded-2xl flex items-center justify-center mx-auto">
                <feature.icon className="h-8 w-8 text-mint-green" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">
                {feature.title}
              </h3>
              <p className="text-text-secondary text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default FeatureSection;
