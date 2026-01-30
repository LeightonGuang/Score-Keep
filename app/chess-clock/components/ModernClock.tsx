import { useChessClock } from "../context/ChessClockContext";

export const ModernClock: React.FC = () => {
  const {
    time1,
    time2,
    currentDelay1,
    currentDelay2,
    activePlayer,
    readyPlayer,
    hasPrimed,
    isGameOver,
    handleTouchStart,
    handleMouseDown,
    formatTime,
    resetGame: onReset,
    togglePause: onPause,
  } = useChessClock();

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Forced Portrait Container */}
      <div className="flex h-dvh w-dvw flex-col transition-all duration-500 landscape:h-[100vw] landscape:min-h-[100vw] landscape:w-[100vh] landscape:min-w-[100vh] landscape:-rotate-90">
        <button
          onTouchStart={(e) => handleTouchStart(e, 1)}
          onMouseDown={(e) => handleMouseDown(e, 1)}
          disabled={
            isGameOver ||
            (activePlayer === 0 && hasPrimed
              ? readyPlayer !== 1
              : activePlayer !== 1)
          }
          className={`flex w-full flex-1 rotate-180 flex-col items-center justify-center transition-all duration-300 ${activePlayer === 1 || (activePlayer === 0 && readyPlayer === 1) ? "bg-white text-zinc-900" : "bg-zinc-900 text-zinc-500"} ${activePlayer === 0 && !hasPrimed && readyPlayer === 1 ? "animate-pulse" : ""} ${isGameOver && time1 === 0 ? "bg-red-600 text-white" : ""} ${!isGameOver && activePlayer === 1 ? "shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]" : ""} `}
        >
          <span className="text-[25vw] leading-none font-black tracking-tighter tabular-nums landscape:text-[18vh]">
            {formatTime(time1)}
          </span>
          {activePlayer === 1 && currentDelay1 > 0 && (
            <span className="absolute bottom-[10%] text-[5vw] font-black tracking-widest text-zinc-400 landscape:text-[4vh]">
              DELAY: {Math.ceil(currentDelay1)}s
            </span>
          )}
        </button>

        <div className="relative flex h-24 items-center justify-around border-y border-zinc-800 bg-zinc-900 px-8">
          {/* Priming Instruction Overlay */}
          {activePlayer === 0 && !hasPrimed && !isGameOver && (
            <div className="pointer-events-none absolute -top-12 left-0 z-20 flex w-full items-center justify-center">
              <div className="animate-in fade-in slide-in-from-bottom-2 rounded-full border border-zinc-700/50 bg-zinc-800 px-5 py-2 text-[10px] font-black tracking-widest text-zinc-300 uppercase shadow-2xl drop-shadow-xl duration-500">
                Tap your side to choose who starts
              </div>
            </div>
          )}

          <button
            onClick={onReset}
            className="rounded-full bg-zinc-800 px-6 py-2 text-xs font-bold tracking-widest text-zinc-400"
          >
            Settings
          </button>
          <button
            onClick={onPause}
            className={`rounded-full border px-8 py-2 text-xs font-bold tracking-widest uppercase transition-all ${activePlayer === 0 && !hasPrimed ? "border-white bg-transparent text-white" : "border-white bg-white text-zinc-950"} ${activePlayer === 0 && hasPrimed && !isGameOver ? "animate-pulse ring-4 ring-white/20" : ""}`}
          >
            {activePlayer === 0 && !isGameOver ? "Start" : "Pause"}
          </button>
        </div>

        <button
          onTouchStart={(e) => handleTouchStart(e, 2)}
          onMouseDown={(e) => handleMouseDown(e, 2)}
          disabled={
            isGameOver ||
            (activePlayer === 0 && hasPrimed
              ? readyPlayer !== 2
              : activePlayer !== 2)
          }
          className={`flex w-full flex-1 flex-col items-center justify-center transition-all duration-300 ${activePlayer === 2 || (activePlayer === 0 && readyPlayer === 2) ? "bg-white text-zinc-900" : "bg-zinc-900 text-zinc-500"} ${activePlayer === 0 && !hasPrimed && readyPlayer === 2 ? "animate-pulse" : ""} ${isGameOver && time2 === 0 ? "bg-red-600 text-white" : ""} ${!isGameOver && activePlayer === 2 ? "shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]" : ""} `}
        >
          <span className="text-[25vw] leading-none font-black tracking-tighter tabular-nums landscape:text-[18vh]">
            {formatTime(time2)}
          </span>
          {activePlayer === 2 && currentDelay2 > 0 && (
            <span className="absolute bottom-[10%] text-[5vw] font-black tracking-widest text-zinc-400 landscape:text-[4vh]">
              DELAY: {Math.ceil(currentDelay2)}s
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
