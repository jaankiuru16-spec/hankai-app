import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Clock, ExternalLink, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import AppHeader from "@/components/AppHeader";
import { supabase } from "@/connection/connection";

const CLUB_COLORS: Record<string, string> = {
  "HankInvest": "bg-blue-500/10 text-blue-600",
  "Hanken ES": "bg-emerald-500/10 text-emerald-600",
  "SHS": "bg-amber-500/10 text-amber-600",
  "SSHS": "bg-amber-500/10 text-amber-600",
  "SSHV": "bg-purple-500/10 text-purple-600",
  "Wine Society": "bg-purple-500/10 text-purple-600",
};
const DEFAULT_CLUB_COLOR = "bg-gray-500/10 text-gray-600";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error fetching event:", error);
        setLoading(false);
        return;
      }

      const dateParts = data.date ? data.date.split("-") : [];
      const calDate = dateParts.length === 3
        ? new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]))
        : new Date();

      setEvent({
        ...data,
        formattedDate: calDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        formattedTime: data.time ? data.time.slice(0, 5) : "",
        club: data.organizer || "Unknown",
        clubColor: CLUB_COLORS[data.organizer] || DEFAULT_CLUB_COLOR,
      });
      setLoading(false);
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-accent" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t("eventNotFound")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pb-20">
        <div className="flex items-center justify-between pt-4 pb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
              <ArrowLeft size={20} />
            </button>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${event.clubColor}`}>{event.club}</span>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground mb-4 font-display">{event.title}</h1>

          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Calendar size={16} className="text-accent" />
              <span>{event.formattedDate}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Clock size={16} className="text-accent" />
              <span>{event.formattedTime}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <MapPin size={16} className="text-accent" />
              <span>{event.location}</span>
            </div>
          </div>

          <p className="text-base text-foreground leading-relaxed mb-6">{event.description}</p>

          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base shadow-sm transition-colors hover:opacity-90 mb-10"
            >
              {t("signUp")} <ExternalLink size={16} />
            </a>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default EventDetailPage;
