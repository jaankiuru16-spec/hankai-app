import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useTranslation } from "@/hooks/useTranslation";
import logo from "@/assets/hankeit-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const langLabels = {
  en: "English",
  sv: "Svenska",
  fi: "Suomi",
} as const;

const langOrder: Array<keyof typeof langLabels> = ["en", "sv", "fi"];

const TenantScreen = () => {
  const { setRole, language, setLanguage } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSelect = (role: "student" | "alumni") => {
    setRole(role);
    navigate(role === "alumni" ? "/songbook" : "/home");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative">
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground" aria-label="Change language">
              <Globe size={22} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {langOrder.map((l) => (
              <DropdownMenuItem
                key={l}
                onClick={() => setLanguage(l)}
                className={language === l ? "font-semibold text-accent" : ""}
              >
                {langLabels[l]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-8 w-full max-w-sm"
      >
        <img src={logo} alt="Hankeit" className="w-24 h-24 rounded-2xl shadow-lg object-cover" />
        <h1 className="text-2xl font-bold text-foreground tracking-tight font-display">Hankeit</h1>

        <p className="text-muted-foreground text-center text-base">
          {t("whoAreYou")}
        </p>

        <div className="flex flex-col gap-3 w-full">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect("student")}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg shadow-sm transition-colors hover:opacity-90"
          >
            {t("student")}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect("alumni")}
            className="w-full py-4 rounded-xl bg-hankeit-ice text-hankeit-deep font-semibold text-lg shadow-sm border border-accent/20 transition-colors hover:bg-accent/20"
          >
            {t("alumni")}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default TenantScreen;
