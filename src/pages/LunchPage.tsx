import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useApp } from "@/context/AppContext";
import AppHeader from "@/components/AppHeader";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday"] as const;

interface MenuItemI18n {
  name: { en: string; fi: string; sv: string };
  description: { en: string; fi: string; sv: string };
  dietary?: string[];
  price: string;
}

interface DayMenuI18n {
  student: MenuItemI18n[];
  premium: MenuItemI18n[];
  soup: MenuItemI18n;
}

const weekMenu: Record<string, DayMenuI18n> = {
  monday: {
    soup: {
      name: { en: "Tomato Basil Soup", fi: "Tomaatti-basilikakeitto", sv: "Tomat- och basilikasoppa" },
      description: { en: "Classic tomato soup with fresh basil and cream", fi: "Klassinen tomaattikeitto tuoreella basilikalla ja kermalla", sv: "Klassisk tomatsoppa med färsk basilika och grädde" },
      dietary: ["V", "G"], price: "1.50",
    },
    student: [
      {
        name: { en: "Chicken Pasta", fi: "Kanapasta", sv: "Kycklingpasta" },
        description: { en: "Creamy chicken pasta with sun-dried tomatoes and parmesan", fi: "Kermainen kanapasta aurinkokuivatuilla tomaateilla ja parmesaanilla", sv: "Krämig kycklingpasta med soltorkade tomater och parmesan" },
        dietary: ["G"], price: "1.80",
      },
      {
        name: { en: "Vegetable Curry", fi: "Kasvis-curry", sv: "Grönsakscurry" },
        description: { en: "Aromatic coconut curry with seasonal vegetables and rice", fi: "Aromikas kookoscurry kauden kasviksilla ja riisillä", sv: "Aromatisk kokosnötscurry med säsongsbetonade grönsaker och ris" },
        dietary: ["V", "G"], price: "1.80",
      },
    ],
    premium: [
      {
        name: { en: "Grilled Salmon", fi: "Grillattu lohi", sv: "Grillad lax" },
        description: { en: "Atlantic salmon with dill cream sauce, new potatoes, and asparagus", fi: "Atlantin lohi tillillä kermakastikkeella, uusilla perunoilla ja parsalla", sv: "Atlantlax med dillkrämsås, nypotatis och sparris" },
        dietary: ["G"], price: "4.25",
      },
    ],
  },
  tuesday: {
    soup: {
      name: { en: "Carrot Ginger Soup", fi: "Porkkana-inkiväärikeitto", sv: "Morot- och ingefärssoppa" },
      description: { en: "Smooth carrot soup with ginger and coconut milk", fi: "Pehmeä porkkanakeitto inkiväärillä ja kookosmaidolla", sv: "Len morotssoppa med ingefära och kokosmjölk" },
      dietary: ["V", "G"], price: "1.50",
    },
    student: [
      {
        name: { en: "Beef Stew", fi: "Naudanlihapata", sv: "Nötköttgryta" },
        description: { en: "Slow-cooked beef with root vegetables and mashed potatoes", fi: "Haudutettua naudanlihaa juureksilla ja perunamuusilla", sv: "Långkokt nötkött med rotgrönsaker och potatismos" },
        dietary: ["G"], price: "1.80",
      },
      {
        name: { en: "Falafel Bowl", fi: "Falafel-kulho", sv: "Falafelbowl" },
        description: { en: "Crispy falafel with hummus, tabbouleh, and tahini sauce", fi: "Rapeat falafelit humuksella, tabboulehilla ja tahinikastikkeella", sv: "Krispig falafel med hummus, tabbouleh och tahinisås" },
        dietary: ["V"], price: "1.80",
      },
    ],
    premium: [
      {
        name: { en: "Duck Breast", fi: "Ankkarintafile", sv: "Ankbröst" },
        description: { en: "Pan-seared duck with cherry reduction and roasted vegetables", fi: "Pannupaistettua ankkaa kirsikkakastikkeella ja paahdetuilla kasviksilla", sv: "Panstekt anka med körsbärsreduktion och rostade grönsaker" },
        dietary: ["G"], price: "4.25",
      },
    ],
  },
  wednesday: {
    soup: {
      name: { en: "Mushroom Soup", fi: "Sienisoppa", sv: "Svampsoppa" },
      description: { en: "Creamy wild mushroom soup with thyme", fi: "Kermainen metsäsienisoppa timjamilla", sv: "Krämig vildsvampsoppa med timjan" },
      dietary: ["V", "G"], price: "1.50",
    },
    student: [
      {
        name: { en: "Fish & Chips", fi: "Fish & Chips", sv: "Fish & Chips" },
        description: { en: "Beer-battered cod with thick-cut fries and remoulade", fi: "Olutleivitettyä turskaa paksuilla ranskalaisilla ja remouladekastikkeella", sv: "Ölbakad torsk med tjocka pommes och remouladsås" },
        dietary: [], price: "1.80",
      },
      {
        name: { en: "Mushroom Risotto", fi: "Sienirisotto", sv: "Svamprisotto" },
        description: { en: "Creamy arborio rice with mixed wild mushrooms and truffle oil", fi: "Kermainen arborioriisi sekoitetuilla metsäsienillä ja tryffeliöljyllä", sv: "Krämigt arborioris med blandade vilda svampar och tryffelolja" },
        dietary: ["V", "G"], price: "1.80",
      },
    ],
    premium: [
      {
        name: { en: "Lamb Chops", fi: "Lampaankyljykset", sv: "Lammkotletter" },
        description: { en: "Herb-crusted lamb with mint yogurt and roasted sweet potatoes", fi: "Yrttikuorrutettu lammas minttujogurtilla ja paahdetuilla bataateilla", sv: "Örtpanerade lammkotletter med mintayoghurt och rostade sötpotatisar" },
        dietary: ["G"], price: "4.25",
      },
    ],
  },
  thursday: {
    soup: {
      name: { en: "Pea Soup", fi: "Hernekeitto", sv: "Ärtsoppa" },
      description: { en: "Traditional Finnish pea soup", fi: "Perinteinen suomalainen hernekeitto", sv: "Traditionell finsk ärtsoppa" },
      dietary: ["V", "G"], price: "1.50",
    },
    student: [
      {
        name: { en: "Thai Green Curry", fi: "Thaimaalainen vihreä curry", sv: "Thailändsk grön curry" },
        description: { en: "Chicken in green curry with jasmine rice and crispy shallots", fi: "Kanaa vihreässä curryssä jasmiiniriisillä ja rapeilla salottisipuleilla", sv: "Kyckling i grön curry med jasminris och krispiga schalottenlökar" },
        dietary: ["G"], price: "1.80",
      },
      {
        name: { en: "Veggie Wrap", fi: "Kasviskääre", sv: "Grönsakswrap" },
        description: { en: "Grilled halloumi and roasted vegetables in a warm tortilla", fi: "Grillattua halloumia ja paahdettuja kasviksia lämpimässä tortillassa", sv: "Grillad halloumi och rostade grönsaker i en varm tortilla" },
        dietary: ["V"], price: "1.80",
      },
    ],
    premium: [
      {
        name: { en: "Steak Frites", fi: "Pihvi ja ranskalaiset", sv: "Steak Frites" },
        description: { en: "Sirloin steak with bearnaise sauce and hand-cut fries", fi: "Ulkofileepihvi bearnaisekastikkeella ja käsin leikatuilla ranskalaisilla", sv: "Entrecôte med bearnaisesås och handskurna pommes" },
        dietary: ["G"], price: "4.25",
      },
    ],
  },
  friday: {
    soup: {
      name: { en: "Cauliflower Soup", fi: "Kukkakaalisoppa", sv: "Blomkålssoppa" },
      description: { en: "Roasted cauliflower soup with truffle oil", fi: "Paahdettu kukkakaalisoppa tryffeliöljyllä", sv: "Rostad blomkålssoppa med tryffelolja" },
      dietary: ["V", "G"], price: "1.50",
    },
    student: [
      {
        name: { en: "Pizza Margherita", fi: "Pizza Margherita", sv: "Pizza Margherita" },
        description: { en: "Classic pizza with fresh mozzarella, tomato sauce, and basil", fi: "Klassinen pizza tuoreella mozzarellalla, tomaattikastikkeella ja basilikalla", sv: "Klassisk pizza med färsk mozzarella, tomatsås och basilika" },
        dietary: ["V"], price: "1.80",
      },
      {
        name: { en: "Poke Bowl", fi: "Poke Bowl", sv: "Poke Bowl" },
        description: { en: "Fresh salmon poke with avocado, edamame, and soy-sesame dressing", fi: "Tuoretta lohta avokadolla, edamamella ja soija-seesami-kastikkeella", sv: "Färsk laxpoke med avokado, edamame och soja-sesamdressing" },
        dietary: ["G"], price: "1.80",
      },
    ],
    premium: [
      {
        name: { en: "Seafood Platter", fi: "Merenelävälautanen", sv: "Skaldjursfat" },
        description: { en: "Grilled shrimp and scallops with saffron risotto and lemon butter", fi: "Grillattuja katkarapuja ja kampasimpukoita sahrami-risotolla ja sitruunavoilla", sv: "Grillade räkor och pilgrimsmusslor med saffransrisotto och citronsmör" },
        dietary: ["G"], price: "4.25",
      },
    ],
  },
};

const today = new Date().getDay();
const todayIndex = today >= 1 && today <= 5 ? today - 1 : 0;

const DietaryBadge = ({ label }: { label: string }) => (
  <span className="text-xs bg-accent/10 text-accent font-semibold px-2 py-0.5 rounded-full">{label}</span>
);

const LunchPage = () => {
  const [selectedDay, setSelectedDay] = useState(todayIndex);
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { language: lang } = useApp();
  const dayKey = days[selectedDay];
  const menu = weekMenu[dayKey];

  const dayLabels = [t("monday"), t("tuesday"), t("wednesday"), t("thursday"), t("friday")];

  const getName = (item: MenuItemI18n) => item.name[lang] || item.name.en;
  const getDesc = (item: MenuItemI18n) => item.description[lang] || item.description.en;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pb-20">
        <div className="flex items-center gap-3 pt-4 pb-2">
          <button onClick={() => navigate("/home")} className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-foreground font-display">{t("lunchMenu")}</h1>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Clock size={14} className="text-accent" />
          <span>{t("openingHours")}</span>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
          {days.map((day, i) => (
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

        <motion.div key={`${dayKey}-${lang}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <section className="mb-6">
            <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">{t("soup")}</h2>
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-card-foreground">{getName(menu.soup)}</h3>
                  {menu.soup.dietary?.map((d) => <DietaryBadge key={d} label={d} />)}
                </div>
                <span className="text-sm font-semibold text-accent">€{menu.soup.price}</span>
              </div>
              <p className="text-sm text-muted-foreground">{getDesc(menu.soup)}</p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">{t("studentLunch")}</h2>
            <div className="space-y-3">
              {menu.student.map((item, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-card-foreground">{getName(item)}</h3>
                      {item.dietary?.map((d) => <DietaryBadge key={d} label={d} />)}
                    </div>
                    <span className="text-sm font-semibold text-accent">€{item.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{getDesc(item)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">{t("premium")}</h2>
            <div className="space-y-3">
              {menu.premium.map((item, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-card-foreground">{getName(item)}</h3>
                      {item.dietary?.map((d) => <DietaryBadge key={d} label={d} />)}
                    </div>
                    <span className="text-sm font-semibold text-accent">€{item.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{getDesc(item)}</p>
                </div>
              ))}
            </div>
          </section>
        </motion.div>

        {/* Dietary legend at bottom */}
        <div className="flex items-center gap-4 mt-6 mb-10">
          <div className="flex items-center gap-1">
            <DietaryBadge label="G" />
            <span className="text-xs text-muted-foreground">{t("glutenFree")}</span>
          </div>
          <div className="flex items-center gap-1">
            <DietaryBadge label="V" />
            <span className="text-xs text-muted-foreground">{t("vegan")}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LunchPage;
