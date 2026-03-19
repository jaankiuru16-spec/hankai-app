import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import AppHeader from "@/components/AppHeader";


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

export const eventsData: EventData[] = [
  {
    id: "1",
    title: "Stockholm Excursion 2026",
    date: "April 15-17, 2026",
    time: "08:00 - 18:00",
    location: "Stockholm, Sweden",
    club: "HankInvest",
    clubColor: "bg-blue-500/10 text-blue-600",
    description: "Visit top investment banks and consulting firms in Stockholm.",
    fullDescription: "The Stockholm excursion is a chance for top students to get to know leading investment banks, consulting firms, and private equity firms. Students will visit multiple offices and have the opportunity to network with professionals.",
    fee: "50",
    signupUrl: "https://shs.fi",
    orbiUrl: "https://orbi.hanken.fi",
    clubWebsite: "https://hankinvest.fi",
    signupDeadline: "April 1, 2026",
    calendarDate: new Date(2026, 3, 15),
  },
  {
    id: "2",
    title: "Nordea Women's Finance Insight",
    date: "March 28, 2026",
    time: "16:00 - 19:00",
    location: "Nordea HQ, Helsinki",
    club: "HankInvest",
    clubColor: "bg-blue-500/10 text-blue-600",
    description: "Exclusive insights into finance careers for women at Nordea.",
    fullDescription: "Join Nordea for an exclusive afternoon designed for women interested in finance careers. The event will feature presentations from senior leaders, panel discussions, and networking opportunities.",
    fee: "Free",
    signupUrl: "https://shs.fi",
    orbiUrl: "https://orbi.hanken.fi",
    clubWebsite: "https://hankinvest.fi",
    signupDeadline: "March 20, 2026",
    calendarDate: new Date(2026, 2, 28),
  },
  {
    id: "3",
    title: "Startup Sauna Night",
    date: "April 5, 2026",
    time: "18:00 - 22:00",
    location: "Hanken Campus",
    club: "Hanken ES",
    clubColor: "bg-emerald-500/10 text-emerald-600",
    description: "Pitch your startup idea and network with fellow entrepreneurs.",
    fullDescription: "Hanken Entrepreneurship Society invites you to Startup Sauna Night! Present your startup idea in a 3-minute pitch, get feedback from experienced entrepreneurs and investors.",
    fee: "Free",
    signupUrl: "https://shs.fi",
    orbiUrl: "https://orbi.hanken.fi",
    clubWebsite: "https://hankenes.fi",
    calendarDate: new Date(2026, 3, 5),
  },
  {
    id: "4",
    title: "Spring Sitz Party",
    date: "April 22, 2026",
    time: "18:00 - 02:00",
    location: "Restaurant Porssi, Helsinki",
    club: "SHS",
    clubColor: "bg-amber-500/10 text-amber-600",
    description: "The traditional spring sitz with dinner, songs, and celebrations.",
    fullDescription: "SHS invites all students to the annual Spring Sitz Party! Enjoy a three-course dinner, traditional student songs from the songbook, and great company.",
    fee: "35",
    signupUrl: "https://shs.fi",
    orbiUrl: "https://orbi.hanken.fi",
    clubWebsite: "https://shs.fi",
    signupDeadline: "April 15, 2026",
    calendarDate: new Date(2026, 3, 22),
  },
  {
    id: "5",
    title: "Wine Tasting Evening",
    date: "March 25, 2026",
    time: "18:00 - 20:00",
    location: "Hanken Campus, Room 301",
    club: "Wine Society",
    clubColor: "bg-purple-500/10 text-purple-600",
    description: "Explore wines from the Rhone Valley with expert guidance.",
    fullDescription: "Hankens Wine Society presents an evening dedicated to the wines of the Rhone Valley. A professional sommelier will guide us through 6 different wines.",
    fee: "15",
    signupUrl: "https://shs.fi",
    orbiUrl: "https://orbi.hanken.fi",
    clubWebsite: "https://shs.fi",
    calendarDate: new Date(2026, 2, 25),
  },
  {
    id: "6",
    title: "McKinsey Case Competition",
    date: "April 10, 2026",
    time: "09:00 - 17:00",
    location: "Hanken Campus",
    club: "HankInvest",
    clubColor: "bg-blue-500/10 text-blue-600",
    description: "Solve a real business case and compete for prizes from McKinsey.",
    fullDescription: "Work in teams of 3-4 to solve a real-world business case provided by McKinsey & Company. The winning team gets a fast-track interview opportunity and prizes.",
    fee: "Free",
    signupUrl: "https://shs.fi",
    orbiUrl: "https://orbi.hanken.fi",
    clubWebsite: "https://hankinvest.fi",
    calendarDate: new Date(2026, 3, 10),
  },
];

type CalendarView = "month" | "week" | "day";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const EventsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const initialView = searchParams.get("view") === "calendar" ? "calendar" : "list";
  const [viewMode, setViewModeState] = useState<"list" | "calendar">(initialView);

  const setViewMode = (mode: "list" | "calendar") => {
    setViewModeState(mode);
    setSearchParams(mode === "calendar" ? { view: "calendar" } : {}, { replace: true });
  };
  const [calendarView, setCalendarView] = useState<CalendarView>("month");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 19));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDay = (day: number) => {
    return eventsData.filter((e) => {
      const d = e.calendarDate;
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

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

        {viewMode === "calendar" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="p-2 rounded-full hover:bg-muted text-muted-foreground"><ChevronLeft size={20} /></button>
              <h2 className="text-lg font-semibold text-foreground">{monthNames[month]} {year}</h2>
              <button onClick={nextMonth} className="p-2 rounded-full hover:bg-muted text-muted-foreground"><ChevronRight size={20} /></button>
            </div>

            <div className="flex gap-1 mb-4 justify-center">
              {(["month", "week", "day"] as CalendarView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setCalendarView(v)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${calendarView === v ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"}`}
                >
                  {t(v)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {dayNames.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} className="aspect-square" />;
                const dayEvents = getEventsForDay(day);
                const isToday = day === 19 && month === 2 && year === 2026;
                return (
                  <button
                    key={day}
                    onClick={() => {
                      if (dayEvents.length > 0) navigate(`/events/${dayEvents[0].id}`);
                    }}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-colors relative ${
                      isToday ? "bg-primary text-primary-foreground font-bold" : dayEvents.length > 0 ? "bg-hankeit-ice text-hankeit-deep font-medium hover:bg-accent/20" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {day}
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-0.5">
                        {dayEvents.slice(0, 2).map((e, ei) => (
                          <div key={ei} className={`w-1 h-1 rounded-full ${isToday ? "bg-white" : "bg-accent"}`} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {viewMode === "list" && <div className="space-y-4 pb-4">
          {eventsData.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow relative"
            >
              {event.fee && (
                <span className="absolute top-4 right-4 text-sm font-bold text-accent">
                  {event.fee === "Free" ? t("free") : `€${event.fee}`}
                </span>
              )}

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

            </motion.div>
          ))}
        </div>}
      </main>
    </div>
  );
};

export default EventsPage;
