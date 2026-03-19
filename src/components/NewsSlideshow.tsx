import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { supabase } from "@/connection/connection";

const SLIDE_DURATION = 5000;

interface NewsSlide {
  id: number;
  title: string;
  image: string;
  link: string | null;
}

const NewsSlideshow = () => {
  const [slides, setSlides] = useState<NewsSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from("news")
        .select("id, title, image, link")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
        return;
      }
      setSlides(data || []);
      setLoading(false);
    };
    fetchNews();
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (slides.length > 0 ? (prev + 1) % slides.length : 0));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [next, slides.length]);

  if (loading) {
    return (
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );
  }

  if (slides.length === 0) return null;

  const slide = slides[currentIndex];

  const content = (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/70 bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-sm">
              News
            </span>
            <h3 className="text-base font-bold text-white mt-1.5 font-display leading-tight">
              {slide.title}
            </h3>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-2 right-3 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(i); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-5 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );

  if (slide.link) {
    return (
      <a href={slide.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer">
        {content}
      </a>
    );
  }

  return content;
};

export default NewsSlideshow;
