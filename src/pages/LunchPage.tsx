import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useApp } from "@/context/AppContext";
import AppHeader from "@/components/AppHeader";
import { supabase } from "@/connection/connection";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

const CATEGORY_ORDER = ["Soup", "Vegetarian soup", "Vegetarian", "Lunch", "Theme Friday", "Special lunch"];

interface MenuItem {
  id: number;
  name: string;
  category: string;
  priceStudent: string;
  priceStaff: string;
  priceGuests: string;
  weekday: string;
  specificDate: string;
}

const LunchPage = () => {
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date().getDay();
    return today >= 1 && today <= 5 ? today - 1 : 0;
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { role } = useApp();

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from("full_week_menu")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching menu:", error);
        setLoading(false);
        return;
      }

      const mapped: MenuItem[] = (data || []).map((row: Record<string, unknown>) => ({
        id: row.id as number,
        name: row.name as string,
        category: row.category as string,
        priceStudent: row["price (student)"] as string,
        priceStaff: row["price (staff)"] as string,
        priceGuests: row["price (guests)"] as string,
        weekday: row.weekday as string,
        specificDate: row.specific_date as string,
      }));

      setMenuItems(mapped);
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const dayLabels = [t("monday"), t("tuesday"), t("wednesday"), t("thursday"), t("friday")];
  const dayKey = WEEKDAYS[selectedDay];

  const dayItems = menuItems.filter((item) => item.weekday === dayKey);

  const grouped = CATEGORY_ORDER
    .map((cat) => ({
      category: cat,
      items: dayItems.filter((item) => item.category === cat),
    }))
    .filter((group) => group.items.length > 0);

  const getPrice = (item: MenuItem) => {
    if (role === "student") return item.priceStudent;
    return item.priceStaff;
  };

  const getPriceLabel = (item: MenuItem) => {
    const parts: string[] = [];
    if (item.priceStudent) parts.push(`${t("student")}: ${item.priceStudent}`);
    if (item.priceStaff) parts.push(`${t("staff")}: ${item.priceStaff}`);
    if (item.priceGuests) parts.push(`${t("guests")}: ${item.priceGuests}`);
    return parts.join("  ·  ");
  };

  const dateStr = dayItems[0]?.specificDate
    ? new Date(dayItems[0].specificDate + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pb-20">
        <div className="flex items-center gap-3 pt-4 pb-2">
          <button onClick={() => navigate("/home")} className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground font-display">{t("lunchMenu")}</h1>
            {dateStr && <p className="text-xs text-muted-foreground">{dateStr}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Clock size={14} className="text-accent" />
          <span>{t("openingHours")}</span>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
          {WEEKDAYS.map((day, i) => (
            <button
              key={day}
              onClick={() => setSelectedDay(i)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                i === selectedDay
                  ? "bg-primary text-primary-foreground"
                  : "bg-hankeit-ice text-hankeit-deep hover:bg-accent/20"
              }`}
            >
              {dayLabels[i]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={28} className="animate-spin text-accent" />
          </div>
        ) : dayItems.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">{t("noMenuAvailable")}</p>
        ) : (
          <motion.div key={dayKey} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {grouped.map((group) => (
              <section key={group.category} className="mb-6">
                <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">{group.category}</h2>
                <div className="space-y-3">
                  {group.items.map((item) => (
                    <div key={item.id} className="bg-card border border-border rounded-2xl p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-base font-semibold text-card-foreground flex-1 pr-3">{item.name}</h3>
                        <span className="text-sm font-semibold text-accent whitespace-nowrap">{getPrice(item)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{getPriceLabel(item)}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default LunchPage;
