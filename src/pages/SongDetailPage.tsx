import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import AppHeader from "@/components/AppHeader";
import { supabase } from "@/connection/connection";

interface LyricRow {
  id: number;
  title: string;
  content: string;
  language: string;
}

const SongDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [song, setSong] = useState<LyricRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSong = async () => {
      const { data, error } = await supabase
        .from("lyrics")
        .select("*")
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

  const lines = (song.content || "").split("\n");

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
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-10 space-y-1">
          {lines.map((line, i) => (
            <p key={i} className="text-base text-foreground leading-relaxed">{line || "\u00A0"}</p>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default SongDetailPage;
