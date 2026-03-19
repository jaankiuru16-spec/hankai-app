import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import AppHeader from "@/components/AppHeader";
import { Music } from "lucide-react";

const AlumniHomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/songbook")}
          className="flex flex-col items-center gap-4 px-12 py-8 rounded-2xl bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-colors"
        >
          <Music size={40} />
          <span className="text-xl font-bold font-display">{t("songbook")}</span>
        </motion.button>
      </div>
    </div>
  );
};

export default AlumniHomePage;
