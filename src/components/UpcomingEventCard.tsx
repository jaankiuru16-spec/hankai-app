import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/connection/connection";

interface UpcomingEvent {
  id: string;
  title: string;
  location: string;
  date: Date;
}

const formatShortDate = (date: Date) => {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const UpcomingEventCard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const todayStr = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("events")
        .select("id, title, location, date")
        .gte("date", todayStr)
        .order("date", { ascending: true })
        .limit(3);

      if (error) {
        console.error("Error fetching upcoming events:", error);
        setLoading(false);
        return;
      }
      setEvents(
        (data || []).map((r: any) => ({
          id: String(r.id),
          title: r.title,
          location: r.location || "",
          date: new Date(r.date + "T00:00:00"),
        }))
      );
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 size={20} className="animate-spin text-accent" />
      </div>
    );
  }

  if (events.length === 0) return null;

  return (
    <div>
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

      <div className="flex flex-col gap-2">
        {events.map((event) => (
          <button
            key={event.id}
            onClick={() => navigate(`/events/${event.id}`)}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left w-full"
          >
            <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-muted flex items-center justify-center border border-border/50">
              <Calendar size={18} className="text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {event.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {formatShortDate(event.date)} · {event.location}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEventCard;
