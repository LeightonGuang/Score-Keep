"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface Game {
  id: string;
  title: string;
  tagline: string;
  description: string;
  href: string;
  status: string;
  theme: string;
  icon: React.ReactNode;
}

const HeroCarousel = ({ games }: { games: Game[] }) => {
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % games.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [games.length, carouselIndex]);

  return (
    <div className="relative mb-8 h-100 w-full overflow-hidden rounded-4xl border border-zinc-500/10 bg-white shadow-xl transition-all dark:bg-zinc-900/50 dark:shadow-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={carouselIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.6, ease: "circOut" }}
          className="flex h-full flex-col p-8 md:p-16"
        >
          <div className="flex flex-1 flex-col justify-center">
            <div className="mb-4 flex items-center gap-3">
              <div
                className={`h-1.5 w-12 rounded-full ${games[carouselIndex].theme}`}
              />
              <span className="text-xs font-black tracking-[0.3em] text-zinc-400 uppercase dark:text-zinc-500">
                Featured Mode
              </span>
            </div>
            <h1 className="mb-2 text-5xl font-black tracking-tighter text-zinc-950 md:text-7xl dark:text-white">
              {games[carouselIndex].title}
            </h1>
            <p className="mb-8 max-w-md text-lg font-medium text-zinc-500 dark:text-zinc-400">
              {games[carouselIndex].tagline} —{" "}
              {games[carouselIndex].description}
            </p>
            <Link
              href={games[carouselIndex].href}
              className={`flex w-max items-center gap-3 rounded-full px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all active:scale-95 ${
                games[carouselIndex].status === "active"
                  ? "bg-zinc-950 text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-950"
                  : "pointer-events-none bg-zinc-500/20 text-zinc-500 opacity-40 grayscale"
              }`}
            >
              {games[carouselIndex].status === "active"
                ? "Launch"
                : "Coming Soon"}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="h-4 w-4"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="mt-8 flex gap-2">
            {games.map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIndex(i)}
                className={`h-2 rounded-full transition-all hover:w-4 hover:cursor-pointer hover:bg-white ${
                  i === carouselIndex
                    ? `w-8 ${games[i].theme}`
                    : "w-2 bg-zinc-500/20"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute top-1/2 right-[-5%] h-80 w-80 -translate-y-1/2 text-zinc-950 opacity-[0.03] dark:text-white">
        {games[carouselIndex].icon}
      </div>
    </div>
  );
};

export default HeroCarousel;
