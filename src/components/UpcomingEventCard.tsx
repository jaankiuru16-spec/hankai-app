import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { eventsData } from "@/pages/EventsPage";
import { useTranslation } from "@/hooks/useTranslation";

const now = new Date(2026, 2, 19);
const upcomingEvents = [...eventsData]
  .filter((e) => e.calendarDate >= now)
  .sort((a, b) => a.calendarDate.getTime() - b.calendarDate.getTime())
  .slice(0, 3);

const formatShortDate = (date: Date) => {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const UpcomingEventCard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (upcomingEvents.length === 0) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-foreground font-display">Upcoming</h2>
        <button
          onClick={() => navigate("/events")}
          className="text-sm font-medium text-primary flex items-center gap-0.5 hover:opacity-80 transition-opacity"
        >
          All events
          <span className="text-xs">›</span>
        </button>
      </div>

      {/* Event list */}
      <div className="flex flex-col gap-2">
        {upcomingEvents.map((event) => (
          <button
            key={event.id}
            onClick={() => navigate(`/events/${event.id}`)}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left w-full"
          >
            {/* Calendar icon */}
            <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-muted flex items-center justify-center border border-border/50">
              <Calendar size={18} className="text-muted-foreground" />
            </div>

            {/* Event info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {event.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {formatShortDate(event.calendarDate)} · {event.location}
              </p>
            </div>

            {/* Fee */}
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {event.fee === "Free" ? t("free") : `€${event.fee}`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEventCard;
