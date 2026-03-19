import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SLIDE_DURATION = 5000;

const newsSlides = [
  {
    id: "news-1",
    title: "Spring Semester Registration Open",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&q=80",
  },
  {
    id: "news-2",
    title: "Library Extended Hours",
    imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80",
  },
  {
    id: "news-3",
    title: "Campus Sustainability Week",
    imageUrl: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&q=80",
  },
  {
    id: "news-4",
    title: "New Student Lounge Opening",
    imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
  },
];

const NewsSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % newsSlides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [next]);

  const slide = newsSlides[currentIndex];

  return (
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
            src={slide.imageUrl}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/70 bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-sm">
              📰 News
            </span>
            <h3 className="text-base font-bold text-white mt-1.5 font-display leading-tight">
              {slide.title}
            </h3>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute bottom-2 right-3 flex gap-1.5 z-10">
        {newsSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-5 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsSlideshow;
