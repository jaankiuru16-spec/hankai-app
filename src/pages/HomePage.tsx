import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";
import AppHeader from "@/components/AppHeader";
import UpcomingEventCard from "@/components/UpcomingEventCard";
import NewsSlideshow from "@/components/NewsSlideshow";
import { Music, UtensilsCrossed, Calendar, Gamepad2 } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

const studentFeatures = [
  { key: "songbook", icon: Music, path: "/songbook", image: "/tiles/songbook.png" },
  { key: "lunchMenu", icon: UtensilsCrossed, path: "/lunch", image: "/tiles/lunch.png" },
  { key: "events", icon: Calendar, path: "/events", image: "/tiles/events.png" },
  { key: "games", icon: Gamepad2, path: "/games", image: "/tiles/games.png" },
];

const alumniFeatures = [
  { key: "songbook", icon: Music, path: "/songbook", image: "/tiles/songbook.png" },
];

const HomePage = () => {
  const { role } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = role === "alumni" ? alumniFeatures : studentFeatures;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 px-4 pt-6 pb-20 max-w-lg mx-auto w-full">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <h1 className="text-3xl font-bold text-foreground font-display">{t("welcome")}</h1>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3 mb-5"
        >
          {features.map((f) => (
            <motion.button
              key={f.key}
              variants={item}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(f.path)}
              className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-lg transition-shadow"
            >
              <img
                src={f.image}
                alt={t(f.key)}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/35" />
              <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2">
                <div className="p-3 rounded-xl bg-primary/80 backdrop-blur-sm text-white">
                  <f.icon size={24} />
                </div>
                <span className="text-sm font-bold text-white drop-shadow-md">{t(f.key)}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Upcoming Event */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-4"
        >
          <UpcomingEventCard />
        </motion.div>

        {/* News Image Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-bold text-foreground font-display mb-3">
            News
          </h2>
          <div className="h-[160px] relative rounded-2xl overflow-hidden">
            <NewsSlideshow />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default HomePage;
