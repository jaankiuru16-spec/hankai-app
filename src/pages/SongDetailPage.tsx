import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, Languages, BookOpen, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import AppHeader from "@/components/AppHeader";
import { supabase } from "@/connection/connection";

interface LyricRow {
  id: number;
  title: string;
  content: string;
  language: string;
  english_translation: string | null;
  fun_facts: string | null;
}

const SongDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [song, setSong] = useState<LyricRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showFunFacts, setShowFunFacts] = useState(false);

  useEffect(() => {
    const fetchSong = async () => {
      const { data, error } = await supabase
        .from("lyrics")
        .select("id, title, content, language, english_translation, fun_facts")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error fetching song:", error);
        setLoading(false);
        return;
      }
      setSong(data);
      setLoading(false);
    };
    fetchSong();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-accent" />
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t("songNotFound")}</p>
      </div>
    );
  }

  const originalLines = (song.content || "").split("\n");
  const translationLines = (song.english_translation || "").split("\n");

  const hasTranslation = !!song.english_translation;
  const hasFunFacts = !!song.fun_facts;

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
              <p className="text-xs text-muted-foreground font-medium">#{song.id} · {song.language}</p>
              <h1 className="text-xl font-bold text-foreground">{song.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasTranslation && (
              <button
                onClick={() => setShowTranslation((v) => !v)}
                className={`p-2 rounded-full transition-colors ${
                  showTranslation
                    ? "bg-accent text-white"
                    : "hover:bg-muted text-muted-foreground"
                }`}
                title="Translate"
              >
                <Languages size={20} />
              </button>
            )}
            {hasFunFacts && (
              <button
                onClick={() => setShowFunFacts(true)}
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                title="Fun Facts"
              >
                <BookOpen size={20} />
              </button>
            )}
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-10 space-y-1">
          {originalLines.map((line, i) => (
            <div key={i}>
              <p className="text-base text-foreground leading-relaxed">{line || "\u00A0"}</p>
              {showTranslation && translationLines[i] !== undefined && translationLines[i] !== "" && (
                <p className="text-sm text-accent/70 leading-relaxed italic">{translationLines[i]}</p>
              )}
            </div>
          ))}
        </motion.div>
      </main>

      {/* Fun Facts Modal */}
      <AnimatePresence>
        {showFunFacts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowFunFacts(false)}
          >
            {/* Blurred backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-card border border-border rounded-2xl w-full max-w-md max-h-[70vh] flex flex-col shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-accent" />
                  <h2 className="text-lg font-bold text-foreground">{t("funFacts")}</h2>
                </div>
                <button
                  onClick={() => setShowFunFacts(false)}
                  className="p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{song.fun_facts}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SongDetailPage;
