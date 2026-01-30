import { useState } from "react";
import { useChessClock } from "../context/ChessClockContext";
import LcdTimer from "./LcdTimer";

export const ClassicClock: React.FC = () => {
  const {
    activePlayer,
    readyPlayer,
    hasPrimed,
    isGameOver,
    handleTouchStart,
    handleMouseDown,
    resetGame: onReset,
    togglePause: onPause,
    selectedPreset,
  } = useChessClock();

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
          <div className="relative mb-2 flex h-full w-full overflow-hidden">
            {/* Priming Instruction Overlay */}
            {activePlayer === 0 && !hasPrimed && !isGameOver && (
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                <div className="animate-in fade-in zoom-in rounded-full border border-zinc-700/50 bg-zinc-800 px-4 py-1.5 text-[10px] font-black tracking-widest text-zinc-300 uppercase shadow-2xl drop-shadow-lg duration-500">
                  Tap a side to select who starts first
                </div>
              </div>
            )}

            {/* Player 1 Rocker */}
            <div className="relative h-full flex-1 overflow-hidden">
              <div
                className={`pointer-events-none absolute inset-0 transition-all duration-200 ${
                  activePlayer === 1 ||
                  (activePlayer === 0 && readyPlayer === 1)
                    ? "bg-linear-to-r from-zinc-50 to-zinc-400 shadow-xl"
                    : "bg-linear-to-r from-zinc-400 to-zinc-400 shadow-none"
                }`}
                style={{
                  clipPath:
                    activePlayer === 1 ||
                    (activePlayer === 0 && readyPlayer === 1)
                      ? "polygon(0% 0%, 100% 1rem, 100% 100%, 0% 100%)"
                      : "polygon(0% 1rem, 100% 1rem, 100% 100%, 0% 100%)",
                }}
              >
                {/* Red Wedge Indicator (Pivoting) */}
                <div
                  className={`absolute right-0 bottom-0 left-0 h-4 bg-red-500/80 transition-all duration-200 ${
                    activePlayer === 1 ||
                    (activePlayer === 0 && readyPlayer === 1)
                      ? "translate-y-0"
                      : "translate-y-4"
                  }`}
                  style={{
                    clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)",
                  }}
                />
              </div>
              <button
                onTouchStart={(e) => handleTouchStart(e, 1)}
                onMouseDown={(e) => handleMouseDown(e, 1)}
                disabled={
                  isGameOver ||
                  (activePlayer !== 0
                    ? activePlayer !== 1
                    : hasPrimed && readyPlayer !== 1)
                }
                className={`absolute inset-0 z-10 h-full w-full ${
                  isGameOver ||
                  (activePlayer !== 0
                    ? activePlayer !== 1
                    : hasPrimed && readyPlayer !== 1)
                    ? "pointer-events-none"
                    : "cursor-pointer"
                }`}
              />
            </div>

            {/* Player 2 Rocker */}
            <div className="relative h-full flex-1 overflow-hidden">
              <div
                className={`pointer-events-none absolute inset-0 transition-all duration-200 ${
                  activePlayer === 2 ||
                  (activePlayer === 0 && readyPlayer === 2)
                    ? "bg-linear-to-l from-zinc-50 to-zinc-400 shadow-xl"
                    : "bg-linear-to-l from-zinc-400 to-zinc-400 shadow-none"
                }`}
                style={{
                  clipPath:
                    activePlayer === 2 ||
                    (activePlayer === 0 && readyPlayer === 2)
                      ? "polygon(0% 1rem, 100% 0%, 100% 100%, 0% 100%)"
                      : "polygon(0% 1rem, 100% 1rem, 100% 100%, 0% 100%)",
                }}
              >
                {/* Red Wedge Indicator (Pivoting) */}
                <div
                  className={`absolute right-0 bottom-0 left-0 h-4 bg-red-500/80 transition-all duration-200 ${
                    activePlayer === 2 ||
                    (activePlayer === 0 && readyPlayer === 2)
                      ? "translate-y-0"
                      : "translate-y-4"
                  }`}
                  style={{
                    clipPath: "polygon(0% 100%, 100% 0%, 100% 100%)",
                  }}
                />
              </div>
              <button
                onTouchStart={(e) => handleTouchStart(e, 2)}
                onMouseDown={(e) => handleMouseDown(e, 2)}
                disabled={
                  isGameOver ||
                  (activePlayer !== 0
                    ? activePlayer !== 2
                    : hasPrimed && readyPlayer !== 2)
                }
                className={`absolute inset-0 z-10 h-full w-full ${
                  isGameOver ||
                  (activePlayer !== 0
                    ? activePlayer !== 2
                    : hasPrimed && readyPlayer !== 2)
                    ? "pointer-events-none"
                    : "cursor-pointer"
                }`}
              />
            </div>
          </div>

          {/* LCD Displays */}
          <LcdTimer />
        </div>

        {/* Bottom Control Bar */}
        <div className="flex h-max shrink-0 items-center justify-between px-8 py-2">
          <div className="flex items-center gap-6">
            <button
              onClick={onReset}
              className="group flex h-full flex-col items-center gap-1 transition-all hover:cursor-pointer active:scale-95"
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
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <span className="text-[9px] font-black tracking-widest text-zinc-600 uppercase">
                Settings
              </span>
            </button>

            {/* Preset Display */}
            <div className="flex flex-col items-start justify-center">
              <span className="text-[7px] font-black tracking-[0.2em] text-zinc-600 uppercase">
                Control
              </span>
              <span className="text-[9px] font-black tracking-widest whitespace-nowrap text-zinc-400 uppercase">
                {selectedPreset || "Custom"}
              </span>
            </div>
          </div>

          <button
            onClick={onPause}
            className={`absolute left-1/2 flex -translate-x-1/2 items-center justify-center rounded-lg border-4 border-zinc-800 px-8 py-2 text-[10px] font-black tracking-widest uppercase shadow-lg transition-all hover:cursor-pointer active:scale-95 ${activePlayer === 0 && !hasPrimed ? "bg-[#121417] text-zinc-300" : activePlayer === 0 ? "bg-[#121417] text-zinc-300 active:bg-zinc-800" : "bg-[#121417] text-zinc-300 active:bg-zinc-800"} ${activePlayer === 0 && hasPrimed && !isGameOver ? "animate-pulse border-zinc-500/50 bg-zinc-800 text-white!" : ""}`}
          >
            {activePlayer === 0 && !isGameOver ? "Start" : "Pause"}
          </button>

          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="group flex flex-col items-center gap-1 transition-all hover:cursor-pointer active:scale-95"
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
