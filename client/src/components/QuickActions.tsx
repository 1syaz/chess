import { History, Play, Trophy, User, Users } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

function QuickActions() {
  const quickActions = [
    {
      title: "Quick Play",
      description: "Start playing immediately",
      icon: Play,
      link: "/play",
      color: "from-mint-green to-forest-green",
    },
    {
      title: "Online Match",
      description: "Play with others",
      icon: Users,
      link: "/online",
      color: "from-forest-green to-mint-green",
    },
    {
      title: "View Profile",
      description: "Check your stats",
      icon: User,
      link: "/profile",
      color: "from-forest-green/90 to-mint-green/90",
    },
    {
      title: "Game History",
      description: "Review past games",
      icon: History,
      link: "/history",
      color: "from-mint-green/80 to-forest-green/80",
    },
    {
      title: "Leaderboard",
      description: "See rankings",
      icon: Trophy,
      link: "/leaderboard",
      color: "from-forest-green/90 to-mint-green/90",
    },
  ];
  return (
    <div>
      {/* Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-12 mb-20"
      >
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Quick Actions
          </h3>
          <p className="text-text-secondary text-lg">
            Jump into your favorite chess activities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <Link to={action.link}>
                <div className="group relative bg-accent-foreground  backdrop-blur-sm  rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden h-full">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />
                  <div
                    // bg-linear-to-r from-cyan-500 to-blue-500
                    // ${action.color}
                    className={`w-14 h-14 bg-gradient-to-br from-foreground via-background/10  to-foreground  rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <action.icon className="h-7 w-7 text-forest-green" />
                  </div>
                  <h4 className="text-xl font-bold text-text-primary mb-3">
                    {action.title}
                  </h4>
                  <p className="text-base">{action.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default QuickActions;
