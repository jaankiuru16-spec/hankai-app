import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "student" | "alumni" | null;
type Language = "en" | "fi" | "sv";

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem("hankeit-role") as UserRole) || null;
  });
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("hankeit-lang") as Language) || "en";
  });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("hankeit-dark") === "true";
  });

  useEffect(() => {
    if (role) localStorage.setItem("hankeit-role", role);
    else localStorage.removeItem("hankeit-role");
  }, [role]);

  useEffect(() => {
    localStorage.setItem("hankeit-lang", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("hankeit-dark", String(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((d) => !d);
  const logout = () => setRole(null);

  return (
    <AppContext.Provider value={{ role, setRole, language, setLanguage, darkMode, toggleDarkMode, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
