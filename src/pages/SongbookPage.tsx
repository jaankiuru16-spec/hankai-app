import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowLeft } from "lucide-react";
import { songs } from "@/data/songs";
import { useApp } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";
import AppHeader from "@/components/AppHeader";

const SongbookPage = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { role } = useApp();
  const { t } = useTranslation();

  const filtered = useMemo(() => {
    if (!query.trim()) return songs;
    const q = query.toLowerCase();
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.id.toString().includes(q) ||
        s.lyrics.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 flex flex-col max-w-lg mx-auto w-full">
        <div className="px-4 pt-4 pb-2 flex items-center gap-3">
          {role !== "alumni" && (
            <button onClick={() => navigate("/home")} className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-xl font-bold text-foreground font-display">{t("songbook")}</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-1 pb-36">
            {filtered.map((song, i) => (
              <motion.button
                key={song.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => navigate(`/songbook/${song.id}`)}
                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-hankeit-ice transition-colors text-left"
              >
                <span className="text-sm font-medium text-accent w-8 text-right">{song.id}</span>
                <span className="text-base font-medium text-foreground">{song.title}</span>
              </motion.button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12">{t("noSongsFound")}</p>
            )}
          </motion.div>
        </div>

        <div className="sticky bottom-12 bg-background/80 backdrop-blur-lg border-t border-border px-4 py-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground text-sm border-0 outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SongbookPage;
