import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { eventsData } from "@/pages/EventsPage";
import { useTranslation } from "@/hooks/useTranslation";

const SLIDE_DURATION = 4000;

const now = new Date(2026, 2, 19);
const upcomingEvents = [...eventsData]
  .filter((e) => e.calendarDate >= now)
  .sort((a, b) => a.calendarDate.getTime() - b.calendarDate.getTime());

const gradients = [
  "from-primary/80 to-accent/80",
  "from-hankeit-deep/80 to-primary/80",
  "from-hankeit-sky/80 to-accent/80",
  "from-hankeit-steel/80 to-hankeit-deep/80",
];

const EventSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % upcomingEvents.length);
  }, []);

  useEffect(() => {
    if (upcomingEvents.length === 0) return;
    const interval = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [next]);

  if (upcomingEvents.length === 0) return null;

  const event = upcomingEvents[currentIndex];
  const gradient = gradients[currentIndex % gradients.length];

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={`absolute inset-0 bg-gradient-to-br ${gradient} p-5 flex flex-col justify-between cursor-pointer`}
          onClick={() => navigate(`/events/${event.id}`)}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/70 bg-white/15 px-2.5 py-1 rounded-full backdrop-blur-sm">
              {event.club}
            </span>
            <span className="text-sm font-bold text-white/90">
              {event.fee === "Free" ? t("free") : `€${event.fee}`}
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center py-3">
            <h3 className="text-xl font-bold text-white leading-tight mb-2 font-display">
              {event.title}
            </h3>
            <p className="text-sm text-white/80 leading-relaxed line-clamp-2">
              {event.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-white/70">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {event.date}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {event.location}
              </span>
            </div>
            <ChevronRight size={16} className="text-white/60" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {upcomingEvents.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(i);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default EventSlideshow;
