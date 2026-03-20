import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/connection/connection";
import useEmblaCarousel from "embla-carousel-react";

const AUTO_INTERVAL = 5000;

interface NewsSlide {
  id: number;
  title: string;
  image: string;
  link: string | null;
}

const NewsSlideshow = () => {
  const [slides, setSlides] = useState<NewsSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false });

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

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || slides.length <= 1) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, AUTO_INTERVAL);
    return () => clearInterval(interval);
  }, [emblaApi, slides.length]);

  if (loading) {
    return (
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <div ref={emblaRef} className="overflow-hidden w-full h-full">
        <div className="flex h-full">
          {slides.map((slide) => {
            const inner = (
              <div className="relative w-full h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  draggable={false}
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
              </div>
            );

            return (
              <div key={slide.id} className="min-w-0 flex-[0_0_100%] h-full">
                {slide.link ? (
                  <a href={slide.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-2 right-3 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === selectedIndex ? "w-5 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsSlideshow;
