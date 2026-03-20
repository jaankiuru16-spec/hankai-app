import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowLeft, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";
import AppHeader from "@/components/AppHeader";
import { supabase } from "@/connection/connection";

interface SongRow {
  id: number;
  title: string;
  content: string;
}

const NOTE_SYMBOLS = ["♪", "♫", "♩", "♬"];

interface FloatingNote {
  id: number;
  symbol: string;
  left: string;
  bottom: string;
  fontSize: string;
  duration: string;
  delay: string;
}

const SongbookPage = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { role } = useApp();
  const { t } = useTranslation();
  const [songs, setSongs] = useState<SongRow[]>([]);
  const [loading, setLoading] = useState(true);
  const noteIdRef = useRef(0);
  const [floatingNotes, setFloatingNotes] = useState<FloatingNote[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const { data, error } = await supabase
        .from("lyrics")
        .select("id, title, content")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching songs:", error);
        setLoading(false);
        return;
      }
      setSongs(data || []);
      setLoading(false);
    };
    fetchSongs();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return songs;
    const q = query.toLowerCase();
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.id.toString().includes(q) ||
        s.content.toLowerCase().includes(q)
    );
  }, [query, songs]);

  useEffect(() => {
    const spawn = () => {
      const zones = [Math.random() * 16 + 1, Math.random() * 16 + 78];
      const note: FloatingNote = {
        id: noteIdRef.current++,
        symbol: NOTE_SYMBOLS[Math.floor(Math.random() * NOTE_SYMBOLS.length)],
        left: zones[Math.floor(Math.random() * zones.length)] + "%",
        bottom: (Math.random() * 35 + 5) + "%",
        fontSize: (13 + Math.random() * 11) + "px",
        duration: (5 + Math.random() * 7) + "s",
        delay: (Math.random() * -5) + "s",
      };
      setFloatingNotes((prev) => [...prev.slice(-19), note]);
    };
    for (let i = 0; i < 10; i++) spawn();
    const interval = setInterval(spawn, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden" style={{ fontFamily: "'Futura', 'Century Gothic', 'Apple Gothic', sans-serif" }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
        {floatingNotes.map((note) => (
          <div
            key={note.id}
            className="absolute animate-float-note"
            style={{
              left: note.left,
              bottom: note.bottom,
              fontSize: note.fontSize,
              color: "hsl(var(--foreground) / 0.13)",
              animationDuration: note.duration,
              animationDelay: note.delay,
            }}
          >
            {note.symbol}
          </div>
        ))}
      </div>

      {[
        { top: "16%", left: "7%", delay: "0s", dur: "2.8s" },
        { top: "30%", left: "90%", delay: "1.2s", dur: "3.4s" },
        { top: "52%", left: "5%", delay: "2s", dur: "2.6s" },
        { top: "70%", left: "87%", delay: "0.5s", dur: "3.1s" },
        { top: "13%", left: "84%", delay: "1.8s", dur: "2.3s" },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute w-[3px] h-[3px] rounded-full bg-foreground/30 animate-sparkle-pop pointer-events-none z-[2]"
          style={{
            top: s.top,
            left: s.left,
            animationDelay: s.delay,
            animationDuration: s.dur,
          }}
        />
      ))}

      <AppHeader />
      <main className="flex-1 flex flex-col max-w-lg mx-auto w-full relative z-[5]">
        <div className="px-4 pt-4 pb-2 flex items-center gap-3">
          {role !== "alumni" && (
            <button onClick={() => navigate("/home")} className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-xl font-bold text-foreground font-display">{t("songbook")}</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={28} className="animate-spin text-accent" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-1 pb-36">
              {filtered.map((song, i) => (
                <motion.button
                  key={song.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.015, 0.5) }}
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
        )}

        <div className="sticky bottom-0 bg-background/80 backdrop-blur-lg border-t border-border px-4 py-3">
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
