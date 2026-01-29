"use client";
import { useState } from "react";

interface ClassicClockProps {
  time1: number;
  time2: number;
  p1Name: string;
  p2Name: string;
  activePlayer: 0 | 1 | 2;
  readyPlayer: 1 | 2;
  hasPrimed: boolean;
  isGameOver: boolean;
  handleTouchStart: (e: React.TouchEvent, playerNum: 1 | 2) => void;
  handleMouseDown: (e: React.MouseEvent, playerNum: 1 | 2) => void;
  formatTime: (seconds: number) => string;
  onReset: () => void;
  onPause: () => void;
}

export const ClassicClock: React.FC<ClassicClockProps> = ({
  time1,
  time2,
  p1Name,
  p2Name,
  activePlayer,
  readyPlayer,
  hasPrimed,
  isGameOver,
  handleTouchStart,
  handleMouseDown,
  formatTime,
  onReset,
  onPause,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center overflow-hidden bg-zinc-950 font-sans">
      {/* Forced Landscape Container */}
      <div
        className={`flex flex-col bg-zinc-900 shadow-2xl transition-all duration-500 ${isFlipped ? "-rotate-90" : "rotate-90"} h-[100vw] min-h-[100vw] w-[100vh] min-w-[100vh] landscape:h-full landscape:min-h-0 landscape:w-full landscape:min-w-0 landscape:rotate-0`}
      >
        {/* Digital Clock Main Body */}
        <div className="relative mx-4 flex min-h-0 flex-1 flex-col items-center justify-center bg-[#1a1c1e] p-2 pb-2 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.05)]">
          {/* Mechanical Rocker Buttons */}
          <div className="relative mb-2 flex w-full flex-1 justify-between overflow-hidden">
            {/* Priming Instruction Overlay */}
            {activePlayer === 0 && !hasPrimed && !isGameOver && (
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                <div className="animate-in fade-in zoom-in rounded-full border border-zinc-700/50 bg-zinc-800 px-4 py-1.5 text-[10px] font-black tracking-widest text-zinc-300 uppercase shadow-2xl drop-shadow-lg duration-500">
                  Tap a side to select who starts first
                </div>
              </div>
            )}

            {/* Player 1 Rocker */}
            <div className="relative h-full flex-1">
              <button
                onTouchStart={(e) => handleTouchStart(e, 1)}
                onMouseDown={(e) => handleMouseDown(e, 1)}
                disabled={
                  isGameOver ||
                  (activePlayer === 0 && hasPrimed
                    ? readyPlayer !== 1
                    : activePlayer !== 1)
                }
                className={`h-full w-full shadow-2xl transition-all duration-200 ${activePlayer === 1 || (activePlayer === 0 && readyPlayer === 1) ? "h-full translate-y-0 border-b-8 border-red-600 bg-linear-to-r from-zinc-50 to-zinc-300 shadow-xl" : "h-[75%] translate-y-2 bg-linear-to-r from-zinc-400 to-zinc-400 shadow-none"} ${activePlayer === 0 && !hasPrimed && readyPlayer === 1 ? "animate-pulse" : ""} ${isGameOver && time1 === 0 ? "border-red-500 bg-red-600" : ""} ${isGameOver || (activePlayer !== 1 && activePlayer !== 0) ? "pointer-events-none" : "cursor-pointer"} `}
              />
            </div>

            {/* Player 2 Rocker */}
            <div className="relative h-full flex-1">
              <button
                onTouchStart={(e) => handleTouchStart(e, 2)}
                onMouseDown={(e) => handleMouseDown(e, 2)}
                disabled={
                  isGameOver ||
                  (activePlayer === 0 && hasPrimed
                    ? readyPlayer !== 2
                    : activePlayer !== 2)
                }
                className={`h-full w-full shadow-2xl transition-all duration-200 ${activePlayer === 2 || (activePlayer === 0 && readyPlayer === 2) ? "h-full translate-y-0 border-b-8 border-red-600 bg-linear-to-l from-zinc-50 to-zinc-300 shadow-xl" : "h-[75%] translate-y-2 bg-linear-to-l from-zinc-400 to-zinc-400 shadow-none"} ${activePlayer === 0 && !hasPrimed && readyPlayer === 2 ? "animate-pulse" : ""} ${isGameOver && time2 === 0 ? "border-red-500 bg-red-600" : ""} ${isGameOver || (activePlayer !== 2 && activePlayer !== 0) ? "pointer-events-none" : "cursor-pointer"} `}
              />
            </div>
          </div>

          {/* LCD Displays */}
          <div className="mt-auto flex w-full flex-row">
            {/* LCD 1 */}
            <div
              className={`relative flex flex-1 flex-col items-stretch justify-center rounded-2xl transition-all duration-300`}
            >
              <div className="relative flex flex-col items-center justify-center overflow-hidden bg-[#a3b18a] py-4 text-[#1a1c1e] shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] landscape:py-1">
                {/* Background "Unlit" segments mask */}
                <div className="pointer-events-none absolute text-5xl font-bold tracking-tight tabular-nums opacity-[0.03] contrast-150 select-none sm:text-7xl">
                  <span className="font-mono">8:88:88.88</span>
                </div>

                <span
                  className={`relative z-10 font-mono text-5xl font-bold tracking-tight tabular-nums opacity-90 sm:text-7xl landscape:text-4xl landscape:sm:text-5xl ${isGameOver && time1 === 0 ? "animate-pulse text-red-900" : ""}`}
                >
                  {formatTime(time1)}
                </span>
                <span className="mt-1 text-[8px] leading-none font-black tracking-widest uppercase opacity-40">
                  {p1Name || "Player 1"}
                </span>

                {/* Active Indicator */}
                {activePlayer === 1 && (
                  <div className="absolute top-3 right-3 h-2 w-2 rounded-full border border-red-900 bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                )}
                {isGameOver && time1 === 0 && (
                  <div className="absolute top-3 left-3 text-[8px] font-bold text-red-900">
                    FLAG
                  </div>
                )}
              </div>
            </div>

            {/* LCD 2 */}
            <div
              className={`relative flex flex-1 flex-col items-stretch justify-center rounded-2xl transition-all duration-300`}
            >
              <div className="relative flex flex-col items-center justify-center overflow-hidden bg-[#a3b18a] py-4 text-[#1a1c1e] shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] landscape:py-1">
                {/* Background "Unlit" segments mask */}
                <div className="pointer-events-none absolute text-5xl font-bold tracking-tight tabular-nums opacity-[0.03] contrast-150 select-none sm:text-7xl">
                  <span className="font-mono">8:88:88.88</span>
                </div>

                <span
                  className={`relative z-10 font-mono text-5xl font-bold tracking-tight tabular-nums opacity-90 sm:text-7xl landscape:text-4xl landscape:sm:text-5xl ${isGameOver && time2 === 0 ? "animate-pulse text-red-900" : ""}`}
                >
                  {formatTime(time2)}
                </span>
                <span className="mt-1 text-[8px] leading-none font-black tracking-widest uppercase opacity-40">
                  {p2Name || "Player 2"}
                </span>

                {/* Active Indicator */}
                {activePlayer === 2 && (
                  <div className="absolute top-3 right-3 h-2 w-2 rounded-full border border-red-900 bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                )}
                {isGameOver && time2 === 0 && (
                  <div className="absolute top-3 left-3 text-[8px] font-bold text-red-900">
                    FLAG
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="flex h-max shrink-0 items-center justify-between px-8 py-2">
          <button
            onClick={onReset}
            className="group flex h-full flex-col items-center gap-1 transition-all active:scale-95"
          >
            <div className="flex items-center justify-center rounded-md bg-zinc-800/80 p-1 shadow-sm transition-all group-active:bg-zinc-700 hover:bg-zinc-700">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-500"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="text-[9px] font-black tracking-widest text-zinc-600 uppercase">
              Settings
            </span>
          </button>

          <button
            onClick={onPause}
            className={`flex items-center justify-center rounded-lg border-4 border-zinc-800 px-4 py-2 text-[10px] font-black tracking-widest uppercase shadow-lg transition-all active:scale-95 ${activePlayer === 0 && !hasPrimed ? "bg-[#121417] text-zinc-300" : activePlayer === 0 ? "bg-[#121417] text-zinc-300 active:bg-zinc-800" : "bg-[#121417] text-zinc-300 active:bg-zinc-800"} ${activePlayer === 0 && hasPrimed && !isGameOver ? "animate-pulse border-zinc-500/50 bg-zinc-800 text-white!" : ""}`}
          >
            {activePlayer === 0 && !isGameOver ? "Start" : "Pause"}
          </button>

          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="group flex flex-col items-center gap-1 transition-all active:scale-95"
          >
            <div className="flex items-center justify-center rounded-md bg-zinc-800/80 p-1 shadow-sm transition-all group-active:bg-zinc-700 hover:bg-zinc-700">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-500"
              >
                <path d="M17 2.1l4 4-4 4" />
                <path d="M3 12.2v-2a4 4 0 0 1 4-4h14" />
                <path d="M7 21.9l-4-4 4-4" />
                <path d="M21 11.8v2a4 4 0 0 1-4 4H3" />
              </svg>
            </div>
            <span className="text-[9px] font-black tracking-widest text-zinc-600 uppercase">
              Flip
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
