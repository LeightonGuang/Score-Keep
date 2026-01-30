import { useChessClock } from "../context/ChessClockContext";

const getTimerData = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const hundredths = Math.floor((seconds * 100) % 100);

  const h = hrs.toString().padStart(2, "\u00A0");
  const m = mins.toString().padStart(2, hrs > 0 ? "0" : "\u00A0");
  const s = secs.toString().padStart(2, "0");

  if (seconds >= 3600) {
    // 1 hour+: HH:MM:SS
    return {
      time: `${h}:${m}:${s}`,
    };
  } else if (seconds >= 600) {
    // 10 mins - 1 hour: MM:SS only
    const mm = mins.toString().padStart(2, "\u00A0");
    return {
      time: `\u00A0\u00A0\u00A0${mm}:${s}`,
    };
  } else if (seconds >= 60) {
    // 1 min - 10 mins: MM:SS:t
    const mm = mins.toString().padStart(2, "\u00A0");
    const t = Math.floor(hundredths / 10);
    return {
      time: `${mm}:${s}.${t}\u00A0`,
    };
  } else if (seconds < 60) {
    // Under 1 min: 00:SS:hh
    const hh = hundredths.toString().padStart(2, "0");
    return {
      time: `\u00A0\u00A0\u00A0${s}.${hh}`,
    };
  }
};

export const LcdTimer: React.FC = () => {
  const {
    time1,
    time2,
    currentDelay1,
    currentDelay2,
    activePlayer,
    isGameOver,
  } = useChessClock();

  const player1 = getTimerData(time1);
  const player2 = getTimerData(time2);

  const isFlagged1 = isGameOver && time1 === 0;
  const isFlagged2 = isGameOver && time2 === 0;

  const showDelay =
    ((activePlayer === 1 && currentDelay1 > 0) ||
      (activePlayer === 2 && currentDelay2 > 0)) &&
    !isGameOver;

  return (
    <div className="w-full">
      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center overflow-hidden bg-[#a3b18a] px-10 py-2 text-[#1a1c1e] shadow-[inset_0_2px_12px_rgba(0,0,0,0.3)] sm:h-32 landscape:h-16 landscape:px-12">
        {/* Background "Unlit" segments mask */}

        {/* Player 1 Time */}
        <div className="relative flex justify-center">
          <div className="relative">
            <span className="pointer-events-none absolute top-0 left-0 font-mono text-5xl font-bold tracking-tight whitespace-nowrap tabular-nums opacity-[0.05] sm:text-7xl landscape:text-4xl landscape:sm:text-5xl">
              88:88:88
            </span>
            <span
              className={`relative z-10 font-mono text-5xl font-bold tracking-tight whitespace-nowrap tabular-nums opacity-90 sm:text-7xl landscape:text-4xl landscape:sm:text-5xl ${isFlagged1 ? "animate-pulse text-red-900" : ""}`}
            >
              {player1?.time}
            </span>
          </div>
        </div>

        {/* Center Delay Display */}
        <div className="flex h-full min-w-16 flex-col items-center justify-center px-2">
          <div className="flex flex-col items-center">
            <div className="relative grid place-items-center">
              <span className="pointer-events-none absolute text-[0.5rem] font-black tracking-[0.3em] uppercase opacity-[0.05]">
                Delay
              </span>

              <span className="text-[0.5rem] font-black tracking-[0.3em] text-zinc-900/40 uppercase opacity-90">
                {showDelay ? "Delay" : "\u00A0"}
              </span>
            </div>

            <div className="relative">
              <span className="pointer-events-none absolute top-0 left-0 font-mono text-3xl leading-none font-bold tracking-tight whitespace-nowrap tabular-nums opacity-[0.05]">
                88
              </span>
              {
                <span className="font-mono text-3xl leading-none font-black text-zinc-900 opacity-90">
                  {showDelay
                    ? Math.ceil(
                        activePlayer === 1 ? currentDelay1 : currentDelay2,
                      )
                        .toString()
                        .padStart(2, "\u00A0")
                    : "\u00A0\u00A0"}
                </span>
              }
            </div>
          </div>
        </div>

        {/* Player 2 Time */}
        <div className="relative flex justify-center">
          <div className="relative">
            <span className="pointer-events-none absolute top-0 left-0 font-mono text-5xl font-bold tracking-tight whitespace-nowrap tabular-nums opacity-[0.05] sm:text-7xl landscape:text-4xl landscape:sm:text-5xl">
              88:88:88
            </span>
            <span
              className={`relative z-10 font-mono text-5xl font-bold tracking-tight whitespace-nowrap tabular-nums opacity-90 sm:text-7xl landscape:text-4xl landscape:sm:text-5xl ${isFlagged2 ? "animate-pulse text-red-900" : ""}`}
            >
              {player2?.time}
            </span>
          </div>
        </div>

        {/* Player 1 Indicators */}
        <div className="absolute inset-y-0 left-3 flex flex-col justify-between py-3">
          {activePlayer === 1 && !isGameOver && (
            <div className="h-2.5 w-2.5 rounded-full border border-red-900 bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
          )}
          <div className="flex-1" />
          {isFlagged1 && (
            <div className="text-[9px] font-black tracking-tighter text-red-900 uppercase">
              FLAG
            </div>
          )}
        </div>

        {/* Player 2 Indicators */}
        <div className="absolute inset-y-0 right-3 flex flex-col justify-between py-3">
          {activePlayer === 2 && !isGameOver && (
            <div className="h-2.5 w-2.5 rounded-full border border-red-900 bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
          )}
          <div className="flex-1" />
          {isFlagged2 && (
            <div className="text-[9px] font-black tracking-tighter text-red-900 uppercase">
              FLAG
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LcdTimer;
