import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Languages, Info, X, Play, Pause, Loader2 } from "lucide-react";
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

const SongDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [song, setSong] = useState<LyricRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showFunFacts, setShowFunFacts] = useState(false);
  const [activeLine, setActiveLine] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const noteIdRef = useRef(0);
  const [floatingNotes, setFloatingNotes] = useState<FloatingNote[]>([]);

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

  const originalLines = (song?.content || "").split("\n");
  const translationLines = (song?.english_translation || "").split("\n");
  const TOTAL = originalLines.length * 18;
  const lineDuration = originalLines.length > 0 ? TOTAL / originalLines.length : 1;

  const hasTranslation = !!song?.english_translation;
  const hasFunFacts = !!song?.fun_facts;

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

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = Math.min(TOTAL, prev + 0.4);
          if (next >= TOTAL) {
            setPlaying(false);
          }
          return next;
        });
      }, 400);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, TOTAL]);

  useEffect(() => {
    const lineIndex = Math.min(
      Math.floor(elapsed / lineDuration),
      originalLines.length - 1
    );
    setActiveLine(lineIndex);
  }, [elapsed, lineDuration, originalLines.length]);

  const togglePlay = useCallback(() => {
    setPlaying((p) => {
      if (!p && elapsed >= TOTAL) setElapsed(0);
      return !p;
    });
  }, [elapsed, TOTAL]);

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setElapsed(pct * TOTAL);
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const miniNotes = ["♪", "♫", "♩"];

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

  return (
    <div
      className="min-h-screen bg-background flex flex-col relative overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      <AppHeader />

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

      <main className="flex-1 max-w-lg mx-auto w-full relative z-[5]">
        <div className="flex items-center justify-between px-6 pt-4 pb-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/songbook")}
              className="p-1 -ml-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
          <div className="flex items-center gap-2.5">
            {hasTranslation && (
              <button
                onClick={() => setShowTranslation((v) => !v)}
                className={`p-2 rounded-full transition-colors ${
                  showTranslation
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted text-muted-foreground/65"
                }`}
                aria-label="Toggle translation"
              >
                <Languages size={20} />
              </button>
            )}
            {hasFunFacts && (
              <button
                onClick={() => setShowFunFacts(true)}
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground/65"
                aria-label="Fun facts"
              >
                <Info size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="px-6 pt-4 pb-5">
          <p className="text-xs text-muted-foreground/40 font-semibold tracking-wide mb-1">
            #{song.id}
          </p>
          <h1 className="text-[28px] font-bold text-foreground mb-6">
            {song.title}
          </h1>

          <div className="space-y-0">
            {originalLines.map((line, i) => {
              const isNote = /^\s*\[note\]/.test(line);
              const isCenter = /^\s*\[center\]/.test(line);
              const strippedLine = line.replace(/^\s*\[(note|center)\]\s*/, "");

              const translationLine = translationLines[i] || "";
              const translationIsNote = /^\s*\[note\]/.test(translationLine);
              const displayTranslation = translationLine.replace(/^\s*\[(note|center)\]\s*/, "");

              return (
                <div
                  key={i}
                  onClick={() => {
                    setActiveLine(i);
                    setElapsed(i * lineDuration);
                  }}
                  className={`flex items-center py-[11px] px-1.5 border-b border-foreground/5 last:border-b-0 cursor-pointer rounded-lg transition-all duration-200 relative group ${
                    isCenter ? "justify-center text-center" : ""
                  } ${
                    activeLine === i
                      ? "bg-foreground/[0.06] pl-3"
                      : "hover:bg-foreground/[0.04] hover:pl-3"
                  }`}
                >
                  <div
                    className={`w-[3px] h-[18px] rounded-sm bg-foreground mr-2.5 flex-shrink-0 transition-opacity duration-200 ${
                      activeLine === i ? "opacity-70" : "opacity-0"
                    }`}
                  />
                  <div className="flex-1">
                    <p
                      className={`leading-relaxed transition-colors duration-200 ${
                        isNote
                          ? "text-xs text-muted-foreground italic"
                          : activeLine === i
                            ? "text-lg text-foreground font-semibold"
                            : "text-lg text-foreground/70"
                      }`}
                    >
                      {strippedLine || "\u00A0"}
                    </p>
                    {showTranslation && displayTranslation !== "" && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className={`leading-relaxed italic mt-0.5 ${
                          translationIsNote
                            ? "text-[10px] text-gray-500"
                            : "text-sm text-muted-foreground"
                        }`}
                      >
                        {displayTranslation}
                      </motion.p>
                    )}
                  </div>
                  <span
                    className={`absolute right-3 text-sm text-foreground/28 transition-opacity duration-300 ${
                      activeLine === i ? "opacity-100 animate-note-pulse" : "opacity-0"
                    }`}
                  >
                    {miniNotes[i % miniNotes.length]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 pb-9 flex flex-col items-center gap-3.5 relative z-[5]">
          <div className="w-full">
            <div
              className="w-full h-[3px] bg-foreground/15 rounded-sm cursor-pointer relative"
              onClick={seekTo}
            >
              <div
                className="h-full bg-foreground rounded-sm relative transition-[width] duration-[400ms] linear"
                style={{ width: `${(elapsed / TOTAL) * 100}%` }}
              >
                <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-foreground" />
              </div>
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] font-medium text-foreground/30">
                {fmt(elapsed)}
              </span>
              <span className="text-[10px] font-medium text-foreground/30">
                {fmt(TOTAL)}
              </span>
            </div>
          </div>

          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-foreground flex items-center justify-center transition-transform active:scale-[0.88] hover:bg-foreground/90"
          >
            {playing ? (
              <Pause size={18} className="text-background" fill="hsl(var(--background))" />
            ) : (
              <Play size={18} className="text-background ml-0.5" fill="hsl(var(--background))" />
            )}
          </button>
        </div>
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
                <h2 className="text-lg font-bold text-card-foreground">
                  {t("funFactsTitle")}
                </h2>
                <button
                  onClick={() => setShowFunFacts(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-base text-card-foreground leading-relaxed whitespace-pre-line">
                {song.fun_facts || t("noFunFacts")}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SongDetailPage;
