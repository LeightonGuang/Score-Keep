import { useChessClock } from "../context/ChessClockContext";

const LcdTimer = ({ time, isActive }: { time: number; isActive: boolean }) => {
  const { isGameOver } = useChessClock();
  const isFlagged = isGameOver && time === 0;

  const formatLcdTime = (seconds: number) => {
    const totalMins = Math.floor(seconds / 60);
    const displayMins = totalMins % 100;
    const secs = Math.floor(seconds % 60);
    const hundredths = Math.floor((seconds * 100) % 100);

    const minsStr = displayMins.toString().padStart(2, " ");
    const secsStr = secs.toString().padStart(2, "0");

    if (seconds < 60) {
      // Under 1 minute: MM:SS:hh (Show 2-digit hundredths)
      const hhStr = hundredths.toString().padStart(2, "0");
      return `${minsStr}:${secsStr}:${hhStr}`;
    } else if (seconds < 600) {
      // 1-10 minutes: MM:SS:h  (Show 1-digit tenth + space)
      const tenths = Math.floor(hundredths / 10);
      return `${minsStr}:${secsStr}:${tenths} `;
    } else {
      // Over 10 minutes: MM:SS    (Hide ms and their colon, pad with 3 spaces)
      return `${minsStr}:${secsStr}   `;
    }
  };

  const displayText = formatLcdTime(time);

  return (
    <div className="relative flex flex-1 flex-col items-stretch justify-center rounded-2xl transition-all duration-300">
      <div className="relative flex flex-col items-center justify-center overflow-hidden py-1 bg-[#a3b18a]  text-[#1a1c1e] shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] landscape:py-1">
        {/* Background "Unlit" segments mask */}
        <div className="pointer-events-none absolute text-6xl font-bold tracking-tight tabular-nums opacity-[0.03] contrast-150 select-none sm:text-7xl">
          <span className="font-mono">88:88:88</span>
        </div>

        <span
          className={`relative z-10 font-mono text-6xl font-bold tracking-tight tabular-nums opacity-90 sm:text-7xl landscape:text-4xl landscape:sm:text-5xl ${isFlagged ? "animate-pulse text-red-900" : ""}`}
        >
          {displayText}
        </span>

        {/* Active Indicator */}
        {isActive && !isGameOver && (
          <div className="absolute top-3 right-3 h-2 w-2 rounded-full border border-red-900 bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
        )}

        {/* Flag Indicator */}
        {isFlagged && (
          <div className="absolute top-3 left-3 text-[8px] font-bold text-red-900">
            FLAG
          </div>
        )}
      </div>
    </div>
  );
};

export default LcdTimer;
