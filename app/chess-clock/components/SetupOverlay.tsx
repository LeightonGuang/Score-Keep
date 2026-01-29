import Link from "next/link";
import { useChessClock } from "../context/ChessClockContext";

const PRESETS = [
  { label: "1+0", h: "0", m: "1", s: "0", inc: "0" },
  { label: "3+0", h: "0", m: "3", s: "0", inc: "0" },
  { label: "3+2", h: "0", m: "3", s: "0", inc: "2" },
  { label: "5+0", h: "0", m: "5", s: "0", inc: "0" },
  { label: "5+3", h: "0", m: "5", s: "0", inc: "3" },
  { label: "10+0", h: "0", m: "10", s: "0", inc: "0" },
  { label: "10+5", h: "0", m: "10", s: "0", inc: "5" },
  { label: "15+10", h: "0", m: "15", s: "0", inc: "10" },
  { label: "30+0", h: "0", m: "30", s: "0", inc: "0" },
];

export const SetupOverlay: React.FC = () => {
  const {
    p1Name,
    setP1Name,
    p2Name,
    setP2Name,
    baseHoursInput,
    setBaseHoursInput,
    baseMinutesInput,
    setBaseMinutesInput,
    baseSecondsInput,
    setBaseSecondsInput,
    incrementSecondsInput,
    setIncrementSecondsInput,
    p2HoursInput,
    setP2HoursInput,
    p2MinutesInput,
    setP2MinutesInput,
    p2SecondsInput,
    setP2SecondsInput,
    p2IncrementSecondsInput,
    setP2IncrementSecondsInput,
    isMirrored,
    setIsMirrored,
    selectedPreset,
    setSelectedPreset,
    clockStyle,
    setClockStyle,
    errors,
    setErrors,
    startGame: onStart,
  } = useChessClock();

  const handlePresetSelect = (p: (typeof PRESETS)[0]) => {
    setSelectedPreset(p.label);
    setBaseHoursInput(p.h);
    setBaseMinutesInput(p.m);
    setBaseSecondsInput(p.s);
    setIncrementSecondsInput(p.inc);
    setIsMirrored(true); // Presets are always mirrored
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 backdrop-blur-sm sm:p-6 landscape:p-2">
      <div className="animate-in fade-in zoom-in scrollbar-hide relative flex max-h-full w-full max-w-sm flex-col gap-6 overflow-y-auto px-4 py-4 duration-300 landscape:max-h-screen landscape:gap-2 landscape:py-2">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-500 transition-all hover:bg-zinc-800 hover:text-white active:scale-90"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>

          <h1 className="flex-1 text-center text-3xl font-black tracking-tight landscape:hidden">
            CHESS CLOCK
          </h1>

          <div className="w-10 shrink-0 landscape:hidden" />
        </div>

        <div className="grid grid-cols-1 gap-4 landscape:grid-cols-2 landscape:gap-2">
          <input
            type="text"
            placeholder="Player 1"
            value={p1Name}
            onChange={(e) => setP1Name(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 transition-colors focus:border-white focus:outline-none landscape:py-2 landscape:text-sm"
          />
          <input
            type="text"
            placeholder="Player 2"
            value={p2Name}
            onChange={(e) => setP2Name(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 transition-colors focus:border-white focus:outline-none landscape:py-2 landscape:text-sm"
          />
        </div>

        {/* Style Selector */}
        <div className="grid grid-cols-2 gap-3 landscape:gap-2">
          <button
            onClick={() => setClockStyle("classic")}
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all landscape:flex-row landscape:p-2 ${clockStyle === "classic" ? "border-white bg-white/5" : "border-zinc-800 bg-zinc-900/50 opacity-40 hover:opacity-100"} `}
          >
            <div className="flex h-12 w-full items-end gap-0.5 landscape:h-6 landscape:w-12">
              <div
                className="relative h-full flex-1 bg-white/30"
                style={{
                  clipPath: "polygon(0% 10%, 100% 30%, 100% 100%, 0% 100%)",
                }}
              >
                <div
                  className="absolute bottom-0 left-0 h-[30%] w-full bg-red-500/50"
                  style={{ clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)" }}
                />
              </div>
              <div
                className="h-full flex-1 bg-white/10"
                style={{
                  clipPath: "polygon(0% 30%, 100% 30%, 100% 100%, 0% 100%)",
                }}
              />
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase landscape:text-[8px]">
              Classic
            </span>
          </button>

          <button
            onClick={() => setClockStyle("modern")}
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all landscape:flex-row landscape:p-2 ${clockStyle === "modern" ? "border-white bg-white/5" : "border-zinc-800 bg-zinc-900/50 opacity-40 hover:opacity-100"} `}
          >
            <div className="flex h-12 w-full flex-row gap-0.5 overflow-hidden rounded-sm border border-white/5 landscape:h-6 landscape:w-12">
              <div className="flex-1 bg-white/40" />
              <div className="w-1.5 bg-white/10" />
              <div className="flex-1 bg-white/5" />
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase landscape:text-[8px]">
              Modern
            </span>
          </button>
        </div>

        {/* Presets Dropdown */}
        <div className="space-y-2">
          <label className="ml-1 text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">
            Time Control
          </label>
          <div className="relative">
            <select
              value={selectedPreset || "custom"}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "custom") {
                  setSelectedPreset(null);
                } else {
                  const p = PRESETS.find((x) => x.label === val);
                  if (p) handlePresetSelect(p);
                }
              }}
              className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-bold text-white transition-all focus:border-white focus:outline-none landscape:py-2"
            >
              {PRESETS.map((p) => (
                <option key={p.label} value={p.label}>
                  {p.label}
                </option>
              ))}
              <option value="custom">Custom</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Custom Inputs */}
        {selectedPreset === null && (
          <div className="animate-in fade-in slide-in-from-top-2 space-y-4 duration-300 landscape:space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                Mirror Timer
              </label>
              <button
                onClick={() => setIsMirrored(!isMirrored)}
                className={`relative h-6 w-11 rounded-full transition-colors duration-200 outline-none ${isMirrored ? "bg-white" : "bg-zinc-800"}`}
              >
                <div
                  className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-zinc-950 transition-transform duration-200 ${isMirrored ? "translate-x-5 shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "translate-x-0"}`}
                />
              </button>
            </div>

            <div className="space-y-4 landscape:space-y-2">
              {/* Player 1 Section */}
              <div className="space-y-2 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-3">
                <div className="text-[8px] font-black tracking-widest text-zinc-600 uppercase">
                  {isMirrored ? "Both Players" : p1Name || "Player 1"}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1">
                    <input
                      type="number"
                      placeholder="H"
                      value={baseHoursInput}
                      onChange={(e) => setBaseHoursInput(e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-center text-sm transition-colors focus:border-zinc-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="number"
                      placeholder="M"
                      value={baseMinutesInput}
                      onChange={(e) => setBaseMinutesInput(e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-center text-sm transition-colors focus:border-zinc-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="number"
                      placeholder="S"
                      value={baseSecondsInput}
                      onChange={(e) => setBaseSecondsInput(e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-center text-sm transition-colors focus:border-zinc-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 px-1 py-1">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase">
                    Incr
                  </span>
                  <input
                    type="number"
                    placeholder="Secs"
                    value={incrementSecondsInput}
                    onChange={(e) => setIncrementSecondsInput(e.target.value)}
                    className="w-20 rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-center text-xs transition-colors focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Player 2 Section (if not mirrored) */}
              {!isMirrored && (
                <div className="animate-in fade-in slide-in-from-top-2 space-y-2 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-3 duration-300">
                  <div className="text-[8px] font-black tracking-widest text-zinc-600 uppercase">
                    {p2Name || "Player 2"}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-1">
                      <input
                        type="number"
                        placeholder="H"
                        value={p2HoursInput}
                        onChange={(e) => setP2HoursInput(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-center text-sm transition-colors focus:border-zinc-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <input
                        type="number"
                        placeholder="M"
                        value={p2MinutesInput}
                        onChange={(e) => setP2MinutesInput(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-center text-sm transition-colors focus:border-zinc-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <input
                        type="number"
                        placeholder="S"
                        value={p2SecondsInput}
                        onChange={(e) => setP2SecondsInput(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-center text-sm transition-colors focus:border-zinc-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 px-1 py-1">
                    <span className="text-[8px] font-bold text-zinc-500 uppercase">
                      Incr
                    </span>
                    <input
                      type="number"
                      placeholder="Secs"
                      value={p2IncrementSecondsInput}
                      onChange={(e) =>
                        setP2IncrementSecondsInput(e.target.value)
                      }
                      className="w-20 rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-center text-xs transition-colors focus:border-zinc-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {errors.base && (
              <span className="block text-center text-[10px] font-medium text-red-500">
                {errors.base}
              </span>
            )}
          </div>
        )}

        <button
          onClick={onStart}
          className="mt-2 w-full shrink-0 rounded-2xl bg-white py-4 font-black tracking-widest text-zinc-950 uppercase transition-all active:scale-[0.98] landscape:mt-0 landscape:py-2"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};
