import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";
import AppHeader from "@/components/AppHeader";
import UpcomingEventCard from "@/components/UpcomingEventCard";
import NewsSlideshow from "@/components/NewsSlideshow";
import { Music, UtensilsCrossed, Calendar, DollarSign } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

const HomePage = () => {
  const { role } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const studentFeatures = [
  { title: t("songbook"), icon: Music, path: "/songbook", gradient: "from-primary to-accent" },
  { title: t("lunchMenu"), icon: UtensilsCrossed, path: "/lunch", gradient: "from-hankeit-steel to-hankeit-sky" },
  { title: t("events"), icon: Calendar, path: "/events", gradient: "from-hankeit-deep to-primary" },
  { title: t("games"), icon: DollarSign, path: "/games", gradient: "from-hankeit-sky to-accent" }];


  const alumniFeatures = [
  { title: t("songbook"), icon: Music, path: "/songbook", gradient: "from-primary to-accent" }];


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
          className="grid grid-cols-2 gap-3 mb-5">
          
          {features.map((f) =>
          <motion.button
            key={f.title}
            variants={item}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(f.path)}
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow aspect-[4/3] relative overflow-hidden">
            
              <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-10`} />
              <div className={`p-3 rounded-xl bg-gradient-to-br ${f.gradient} text-white relative z-10`}>
                <f.icon size={24} />
              </div>
              <span className="text-sm font-semibold text-foreground relative z-10">{f.title}</span>
            </motion.button>
          )}
        </motion.div>

        {/* Upcoming Event */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-4">
          
          

          
          <UpcomingEventCard />
        </motion.div>

        {/* News Image Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}>
          
          <h2 className="text-lg font-bold text-foreground font-display mb-3">
            News
          </h2>
          <div className="h-[160px] relative rounded-2xl overflow-hidden">
            <NewsSlideshow />
          </div>
        </motion.div>
      </main>
    </div>);

};

export default HomePage;