import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import { eventsData } from "@/pages/EventsPage";
import { useTranslation } from "@/hooks/useTranslation";
import AppHeader from "@/components/AppHeader";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const event = eventsData.find((e) => e.id === id);

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
          {event.fee && (
            <span className="text-lg font-bold text-accent">
              {event.fee === "Free" ? t("free") : `€${event.fee}`}
            </span>
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground mb-4 font-display">{event.title}</h1>

          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Calendar size={16} className="text-accent" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Clock size={16} className="text-accent" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <MapPin size={16} className="text-accent" />
              <span>{event.location}</span>
            </div>
          </div>

          <p className="text-base text-foreground leading-relaxed mb-6">{event.fullDescription}</p>


          {event.signupUrl && (
            <a
              href={event.signupUrl}
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
