import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import AppHeader from "@/components/AppHeader";
import { supabase } from "@/connection/connection";

export interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  club: string;
  clubColor: string;
  description: string;
  fullDescription: string;
  imageUrl?: string;
  signupUrl?: string;
  orbiUrl?: string;
  clubWebsite?: string;
  fee?: string;
  signupDeadline?: string;
  calendarDate: Date;
}

const CLUB_COLORS: Record<string, string> = {
  "HankInvest": "bg-blue-500/10 text-blue-600",
  "Hanken ES": "bg-emerald-500/10 text-emerald-600",
  "SHS": "bg-amber-500/10 text-amber-600",
  "SSHS": "bg-amber-500/10 text-amber-600",
  "SSHV": "bg-purple-500/10 text-purple-600",
  "Wine Society": "bg-purple-500/10 text-purple-600",
};
const DEFAULT_CLUB_COLOR = "bg-gray-500/10 text-gray-600";

function mapDbEvent(row: any): EventData {
  const dateParts = row.date ? row.date.split("-") : [];
  const calDate = dateParts.length === 3
    ? new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]))
    : new Date();

  const formattedDate = calDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const club = row.organizer || "Unknown";

  return {
    id: String(row.id),
    title: row.title || "",
    date: formattedDate,
    time: row.time ? row.time.slice(0, 5) : "",
    location: row.location || "",
    club,
    clubColor: CLUB_COLORS[club] || DEFAULT_CLUB_COLOR,
    description: row.description || "",
    fullDescription: row.description || "",
    signupUrl: row.link || undefined,
    calendarDate: calDate,
  };
}

type CalendarView = "month" | "week" | "day";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export let eventsData: EventData[] = [];

const EventsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const initialView = searchParams.get("view") === "calendar" ? "calendar" : "list";
  const [viewMode, setViewModeState] = useState<"list" | "calendar">(initialView);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
        return;
      }
      const mapped = (data || []).map(mapDbEvent);
      setEvents(mapped);
      eventsData = mapped;
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const setViewMode = (mode: "list" | "calendar") => {
    setViewModeState(mode);
    setSearchParams(mode === "calendar" ? { view: "calendar" } : {}, { replace: true });
  };
  const [calendarView, setCalendarView] = useState<CalendarView>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevPeriod = () => {
    setSelectedDay(null);
    if (calendarView === "month") setCurrentDate(new Date(year, month - 1, 1));
    else if (calendarView === "week") setCurrentDate(new Date(currentDate.getTime() - 7 * 86400000));
    else setCurrentDate(new Date(currentDate.getTime() - 86400000));
  };
  const nextPeriod = () => {
    setSelectedDay(null);
    if (calendarView === "month") setCurrentDate(new Date(year, month + 1, 1));
    else if (calendarView === "week") setCurrentDate(new Date(currentDate.getTime() + 7 * 86400000));
    else setCurrentDate(new Date(currentDate.getTime() + 86400000));
  };

  const getEventsForDate = (y: number, m: number, d: number) => {
    return events.filter((e) => {
      const ed = e.calendarDate;
      return ed.getFullYear() === y && ed.getMonth() === m && ed.getDate() === d;
    });
  };

  const getEventsForDay = (day: number) => getEventsForDate(year, month, day);

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const today = new Date();

  const getWeekDays = () => {
    const dayOfWeek = currentDate.getDay();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const selectedDayEvents = selectedDay !== null
    ? getEventsForDay(selectedDay)
    : calendarView === "day"
      ? getEventsForDate(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
      : [];

  const headerLabel = calendarView === "month"
    ? `${monthNames[month]} ${year}`
    : calendarView === "week"
      ? (() => { const wk = getWeekDays(); return `${wk[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${wk[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`; })()
      : currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pb-20">
        <div className="flex items-center gap-3 pt-4 pb-2">
          <button onClick={() => navigate("/home")} className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-foreground font-display">{t("events")}</h1>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-hankeit-ice text-hankeit-deep"}`}
          >
            {t("list")}
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${viewMode === "calendar" ? "bg-primary text-primary-foreground" : "bg-hankeit-ice text-hankeit-deep"}`}
          >
            {t("calendar")}
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 size={28} className="animate-spin text-accent" />
          </div>
        )}

        {!loading && viewMode === "calendar" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevPeriod} className="p-2 rounded-full hover:bg-muted text-muted-foreground"><ChevronLeft size={20} /></button>
              <h2 className="text-lg font-semibold text-foreground text-center">{headerLabel}</h2>
              <button onClick={nextPeriod} className="p-2 rounded-full hover:bg-muted text-muted-foreground"><ChevronRight size={20} /></button>
            </div>

            <div className="flex gap-1 mb-4 justify-center">
              {(["month", "week", "day"] as CalendarView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => { setCalendarView(v); setSelectedDay(null); }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${calendarView === v ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"}`}
                >
                  {t(v)}
                </button>
              ))}
            </div>

            {/* Month view */}
            {calendarView === "month" && (
              <>
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {dayNames.map((d) => (
                    <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) => {
                    if (day === null) return <div key={`empty-${i}`} className="aspect-square" />;
                    const dayEvts = getEventsForDay(day);
                    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                    const isSelected = selectedDay === day;
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(dayEvts.length > 0 ? day : null)}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-colors relative ${
                          isSelected ? "ring-2 ring-accent bg-accent/20 font-bold" :
                          isToday ? "bg-primary text-primary-foreground font-bold" :
                          dayEvts.length > 0 ? "bg-hankeit-ice text-hankeit-deep font-medium hover:bg-accent/20" :
                          "text-foreground hover:bg-muted"
                        }`}
                      >
                        {day}
                        {dayEvts.length > 0 && (
                          <div className="flex gap-0.5 mt-0.5">
                            {dayEvts.map((_, ei) => (
                              <div key={ei} className={`w-1 h-1 rounded-full ${isToday && !isSelected ? "bg-white" : "bg-accent"}`} />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Week view */}
            {calendarView === "week" && (
              <>
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {dayNames.map((d) => (
                    <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {getWeekDays().map((wd) => {
                    const dayEvts = getEventsForDate(wd.getFullYear(), wd.getMonth(), wd.getDate());
                    const isToday = wd.getDate() === today.getDate() && wd.getMonth() === today.getMonth() && wd.getFullYear() === today.getFullYear();
                    const isSelected = selectedDay === wd.getDate() && wd.getMonth() === month;
                    return (
                      <button
                        key={wd.toISOString()}
                        onClick={() => { setCurrentDate(wd); setSelectedDay(dayEvts.length > 0 ? wd.getDate() : null); }}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-colors ${
                          isSelected ? "ring-2 ring-accent bg-accent/20 font-bold" :
                          isToday ? "bg-primary text-primary-foreground font-bold" :
                          dayEvts.length > 0 ? "bg-hankeit-ice text-hankeit-deep font-medium hover:bg-accent/20" :
                          "text-foreground hover:bg-muted"
                        }`}
                      >
                        <span className="text-[10px] text-muted-foreground">{monthNames[wd.getMonth()].slice(0, 3)}</span>
                        {wd.getDate()}
                        {dayEvts.length > 0 && (
                          <div className="flex gap-0.5 mt-0.5">
                            {dayEvts.map((_, ei) => (
                              <div key={ei} className={`w-1 h-1 rounded-full ${isToday && !isSelected ? "bg-white" : "bg-accent"}`} />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Day view — just show the date prominently */}
            {calendarView === "day" && (
              <div className="flex flex-col items-center py-4">
                <div className="text-5xl font-bold text-foreground">{currentDate.getDate()}</div>
                <div className="text-sm text-muted-foreground mt-1">{dayNames[currentDate.getDay()]}</div>
              </div>
            )}

            {calendarView === "day" && selectedDayEvents.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-4">No events on this day.</p>
            )}
            {calendarView === "day" && selectedDayEvents.length > 0 && (
              <div className="mt-4 space-y-3">
                {selectedDayEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="w-full text-left bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${event.clubColor}`}>{event.club}</span>
                      <span className="text-xs text-muted-foreground">{event.time}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-card-foreground">{event.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin size={12} />{event.location}</p>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Popup for selected day events (month & week views) */}
        <AnimatePresence>
          {selectedDay !== null && calendarView !== "day" && selectedDayEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end justify-center"
              onClick={() => setSelectedDay(null)}
            >
              <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg bg-card rounded-t-3xl p-6 pb-10 shadow-2xl max-h-[60vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-card-foreground">
                    {monthNames[month]} {selectedDay} — {selectedDayEvents.length} event{selectedDayEvents.length > 1 ? "s" : ""}
                  </h2>
                  <button onClick={() => setSelectedDay(null)} className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-3">
                  {selectedDayEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => { setSelectedDay(null); navigate(`/events/${event.id}`); }}
                      className="w-full text-left bg-background border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${event.clubColor}`}>{event.club}</span>
                        <span className="text-xs text-muted-foreground">{event.time}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-card-foreground">{event.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin size={12} />{event.location}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && viewMode === "list" && <div className="space-y-4 pb-4">
          {events.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No events found.</p>
          )}
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow relative"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${event.clubColor}`}>{event.club}</span>
              </div>
              <button onClick={() => navigate(`/events/${event.id}`)} className="text-left w-full">
                <h3 className="text-base font-semibold text-card-foreground mb-2">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
              </button>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar size={14} />{event.date}</span>
                <span className="flex items-center gap-1"><MapPin size={14} />{event.location}</span>
              </div>
              {event.fee && (
                <div className="mt-2 text-sm font-semibold text-accent">
                  {event.fee === "Free" ? t("free") : `€${event.fee}`}
                </div>
              )}

            </motion.div>
          ))}
        </div>}
      </main>
    </div>
  );
};

export default EventsPage;
