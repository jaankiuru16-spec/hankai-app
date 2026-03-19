import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/hankeit-logo.png";
import { useApp } from "@/context/AppContext";

const Index = () => {
  const navigate = useNavigate();
  const { role } = useApp();

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
        <img src={logo} alt="Hankeit" className="w-28 h-28 rounded-3xl shadow-xl" />
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-3xl font-bold text-foreground tracking-tight"
        >
          Hankeit
        </motion.h1>
      </motion.div>
    </div>
  );
};

export default Index;
