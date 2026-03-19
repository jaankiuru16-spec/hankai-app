import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Languages, Info, X } from "lucide-react";
import { songs } from "@/data/songs";
import { useTranslation } from "@/hooks/useTranslation";
import AppHeader from "@/components/AppHeader";

const SongDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const song = songs.find((s) => s.id === Number(id));
  const [showTranslation, setShowTranslation] = useState(false);
  const [showFunFacts, setShowFunFacts] = useState(false);

  if (!song) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t("songNotFound")}</p>
      </div>
    );
  }

  const svLines = song.lyrics.split("\n");
  const enLines = song.lyricsEn?.split("\n") || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 max-w-lg mx-auto w-full px-4">
        <div className="flex items-center justify-between pt-4 pb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/songbook")} className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
              <ArrowLeft size={20} />
            </button>
            <div>
              <p className="text-xs text-muted-foreground font-medium">#{song.id}</p>
              <h1 className="text-xl font-bold text-foreground">{song.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowTranslation((t) => !t)}
              className={`p-2 rounded-full transition-colors ${showTranslation ? "bg-accent text-accent-foreground" : "hover:bg-muted text-muted-foreground"}`}
              aria-label="Toggle translation"
            >
              <Languages size={20} />
            </button>
            <button
              onClick={() => setShowFunFacts(true)}
              className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
              aria-label="Fun facts"
            >
              <Info size={20} />
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-10 space-y-1">
          {svLines.map((line, i) => (
            <div key={i}>
              <p className="text-base text-foreground leading-relaxed">{line || "\u00A0"}</p>
              {showTranslation && enLines[i] !== undefined && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-sm text-muted-foreground italic leading-relaxed"
                >
                  {enLines[i] || "\u00A0"}
                </motion.p>
              )}
            </div>
          ))}
        </motion.div>
      </main>

      <AnimatePresence>
        {showFunFacts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            onClick={() => setShowFunFacts(false)}
          >
            <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-card rounded-t-3xl p-6 pb-10 safe-bottom shadow-2xl max-h-[70vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-card-foreground">{t("funFactsTitle")}</h2>
                <button onClick={() => setShowFunFacts(false)} className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
                  <X size={20} />
                </button>
              </div>
              <p className="text-base text-card-foreground leading-relaxed">{song.funFacts || t("noFunFacts")}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SongDetailPage;
