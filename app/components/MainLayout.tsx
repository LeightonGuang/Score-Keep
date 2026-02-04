"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  // We only show the main marketing navbar/footer on the Home page and Games Library page.
  // All other pages are considered "Game Pages" or specialized tools that need full screen real estate.
  const showNavAndFooter = ["/", "/games"].includes(pathname);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 transition-colors duration-500 dark:bg-zinc-950 dark:text-white">
      {showNavAndFooter && (
        <nav className="fixed top-0 z-50 w-full border-b border-zinc-500/10 bg-white/70 backdrop-blur-xl dark:bg-zinc-950/70">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-xl font-black tracking-tighter transition-opacity hover:opacity-80"
            >
              SCORE KEEP
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/games"
                className="text-xs font-bold tracking-widest text-zinc-500 uppercase transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                Games Library
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </nav>
      )}

      {children}

      {showNavAndFooter && (
        <footer className="mt-20 border-t border-zinc-500/10 py-12 text-center md:py-16">
          <div className="mb-8 flex justify-center gap-8">
            <Link
              href="/"
              className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              HOME
            </Link>
            <Link
              href="/games"
              className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              GAMES
            </Link>
            <a
              href="#"
              className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              CONTACT
            </a>
          </div>
          <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
            © 2026 Score Keep — Professional Match Management
          </p>
        </footer>
      )}
    </div>
  );
}
