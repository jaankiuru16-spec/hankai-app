import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";

const Index = () => {
  const navigate = useNavigate();
  const { role, darkMode } = useApp();
  const logo = darkMode ? "/tiles/logo.png" : "/tiles/logo-light.png";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (role) {
        navigate("/home");
      } else {
        navigate("/tenant");
      }
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigate, role]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative w-28 h-28">
          <img src={logo} alt="Hankeit" className={`w-28 h-28 ${darkMode ? "rounded-3xl shadow-xl" : ""}`} style={{ clipPath: "inset(0 25% 0 0)" }} />
          <img src={logo} alt="" className={`absolute inset-0 w-28 h-28 ${darkMode ? "rounded-3xl" : ""}`} style={{ clipPath: "inset(0 25% 0 25%)" }} />
          <motion.div
            className={`absolute inset-0 overflow-hidden ${darkMode ? "rounded-3xl" : ""}`}
            style={{ mixBlendMode: darkMode ? "lighten" : "darken" }}
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.4, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <img src={logo} alt="" className={`w-28 h-28 ${darkMode ? "rounded-3xl" : ""}`} style={{ clipPath: "inset(0 0 0 72%)" }} />
          </motion.div>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-3xl font-bold text-foreground tracking-tight"
        >
          Hankeit
        </motion.h1>
      </motion.div>
    </div>
  );
};

export default Index;
