import { Sun, Moon, LogOut, Globe } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const langLabels = {
  en: "English",
  sv: "Svenska",
  fi: "Suomi",
} as const;

const langOrder: Array<keyof typeof langLabels> = ["en", "sv", "fi"];

const AppHeader = () => {
  const { darkMode, toggleDarkMode, language, setLanguage, logout, role } = useApp();
  const navigate = useNavigate();
  const logo = darkMode ? "/tiles/logo.png" : "/tiles/logo-light.png";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border safe-top">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <Link to="/home" className="flex items-center gap-2">
            <img src={logo} alt="Hankeit" className={`w-8 h-8 object-cover ${darkMode ? "rounded-lg" : ""}`} />
          </Link>
          {role && (
            <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full">
              {role}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground" aria-label="Change language">
                <Globe size={20} />
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

          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
