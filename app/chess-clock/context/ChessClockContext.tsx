"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

type ClockStyle = "modern" | "classic";

interface ChessClockContextType {
  // Setup State
  baseHoursInput: string;
  setBaseHoursInput: (h: string) => void;
  baseMinutesInput: string;
  setBaseMinutesInput: (m: string) => void;
  baseSecondsInput: string;
  setBaseSecondsInput: (s: string) => void;
  incrementSecondsInput: string;
  setIncrementSecondsInput: (inc: string) => void;
  p2HoursInput: string;
  setP2HoursInput: (h: string) => void;
  p2MinutesInput: string;
  setP2MinutesInput: (m: string) => void;
  p2SecondsInput: string;
  setP2SecondsInput: (s: string) => void;
  p2IncrementSecondsInput: string;
  setP2IncrementSecondsInput: (inc: string) => void;
  isMirrored: boolean;
  setIsMirrored: (mirrored: boolean) => void;
  selectedPreset: string | null;
  setSelectedPreset: (p: string | null) => void;
  errors: { base?: string; inc?: string };
  setErrors: (e: { base?: string; inc?: string }) => void;
  isSetupOpen: boolean;
  clockStyle: ClockStyle;
  setClockStyle: (style: ClockStyle) => void;

  // Active Game State
  time1: number;
  time2: number;
  activePlayer: 0 | 1 | 2;
  readyPlayer: 1 | 2;
  hasPrimed: boolean;
  isGameOver: boolean;

  // Actions
  startGame: () => void;
  resetGame: () => void;
  togglePause: () => void;
  handleTouchStart: (e: React.TouchEvent, playerNum: 1 | 2) => void;
  handleMouseDown: (e: React.MouseEvent, playerNum: 1 | 2) => void;
  formatTime: (seconds: number) => string;
}

const ChessClockContext = createContext<ChessClockContextType | undefined>(
  undefined,
);

export const ChessClockProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Setup State
  const [baseHoursInput, setBaseHoursInput] = useState("0");
  const [baseMinutesInput, setBaseMinutesInput] = useState("3");
  const [baseSecondsInput, setBaseSecondsInput] = useState("0");
  const [incrementSecondsInput, setIncrementSecondsInput] = useState("2");

  const [p2HoursInput, setP2HoursInput] = useState("0");
  const [p2MinutesInput, setP2MinutesInput] = useState("3");
  const [p2SecondsInput, setP2SecondsInput] = useState("0");
  const [p2IncrementSecondsInput, setP2IncrementSecondsInput] = useState("2");

  const [isMirrored, setIsMirrored] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(
    "3 mins + 2 sec/move",
  );

  const [errors, setErrors] = useState<{ base?: string; inc?: string }>({});
  const [isSetupOpen, setIsSetupOpen] = useState(true);
  const [clockStyle, setClockStyle] = useState<ClockStyle>("classic");

  // Shared Config for active game (using refs for direct access in callbacks)
  const incRef1 = useRef(0);
  const incRef2 = useRef(0);

  // Game State
  const [time1, setTime1] = useState(600);
  const [time2, setTime2] = useState(600);
  const [activePlayer, setActivePlayer] = useState<0 | 1 | 2>(0);
  const [readyPlayer, setReadyPlayer] = useState<1 | 2>(1);
  const [hasPrimed, setHasPrimed] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const touchStarted = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wakeLockRef = useRef<any>(null);

  // Wake Lock logic
  const requestWakeLock = async () => {
    if (!("wakeLock" in navigator)) return;
    try {
      wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
    } catch (err) {
      console.error(`Wake Lock Error: ${err}`);
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  };

  // Vibration logic
  const triggerVibration = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(125);
    }
  };

  const startGame = () => {
    const newErrors: { base?: string; inc?: string } = {};

    const hrs1 = parseInt(baseHoursInput) || 0;
    const min1 = parseInt(baseMinutesInput) || 0;
    const sec1 = parseInt(baseSecondsInput) || 0;
    const increment1 = parseFloat(incrementSecondsInput) || 0;

    let hrs2 = hrs1;
    let min2 = min1;
    let sec2 = sec1;
    let increment2 = increment1;

    if (!isMirrored && selectedPreset === null) {
      hrs2 = parseInt(p2HoursInput) || 0;
      min2 = parseInt(p2MinutesInput) || 0;
      sec2 = parseInt(p2SecondsInput) || 0;
      increment2 = parseFloat(p2IncrementSecondsInput) || 0;
    }

    const totalSecs1 = hrs1 * 3600 + min1 * 60 + sec1;
    const totalSecs2 = hrs2 * 3600 + min2 * 60 + sec2;

    if (
      (totalSecs1 <= 0 && increment1 <= 0) ||
      (totalSecs2 <= 0 && increment2 <= 0)
    ) {
      newErrors.base = "Set a valid time for both players";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    incRef1.current = increment1;
    incRef2.current = increment2;

    setTime1(totalSecs1 + increment1);
    setTime2(totalSecs2 + increment2);

    setIsSetupOpen(false);
    setIsGameOver(false);
    setActivePlayer(0);
    setReadyPlayer(1);
    setHasPrimed(false);
  };

  const handleInteraction = (playerNum: 1 | 2) => {
    if (isGameOver || isSetupOpen) return;

    const isAllowed =
      activePlayer === playerNum ||
      (activePlayer === 0 && (!hasPrimed || readyPlayer === playerNum));
    if (!isAllowed) return;

    const currentEnemy = playerNum === 1 ? 2 : 1;

    if (activePlayer === playerNum) {
      triggerVibration();
      if (playerNum === 1) {
        setTime1((prev) => prev + incRef1.current);
      } else {
        setTime2((prev) => prev + incRef2.current);
      }
      setActivePlayer(currentEnemy);
    } else if (activePlayer === 0) {
      triggerVibration();
      if (!hasPrimed) {
        setHasPrimed(true);
        setReadyPlayer(playerNum === 1 ? 2 : 1);
      } else {
        if (readyPlayer === playerNum) {
          setReadyPlayer(currentEnemy);
        }
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent, playerNum: 1 | 2) => {
    if (e.cancelable) e.preventDefault();
    touchStarted.current = true;
    // Reset after a short delay to allow subsequent interactions from other devices/players
    setTimeout(() => {
      touchStarted.current = false;
    }, 500);
    handleInteraction(playerNum);
  };

  const handleMouseDown = (e: React.MouseEvent, playerNum: 1 | 2) => {
    if (touchStarted.current) {
      touchStarted.current = false;
      return;
    }
    handleInteraction(playerNum);
  };

  useEffect(() => {
    if (activePlayer !== 0 && !isGameOver && !isSetupOpen) {
      requestWakeLock();
      timerRef.current = setInterval(() => {
        if (activePlayer === 1) {
          setTime1((prev) => {
            if (prev <= 0.01) {
              setIsGameOver(true);
              setActivePlayer(0);
              return 0;
            }
            return prev - 0.01;
          });
        } else {
          setTime2((prev) => {
            if (prev <= 0.01) {
              setIsGameOver(true);
              setActivePlayer(0);
              return 0;
            }
            return prev - 0.01;
          });
        }
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      releaseWakeLock();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      releaseWakeLock();
    };
  }, [activePlayer, isGameOver, isSetupOpen]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        wakeLockRef.current !== null &&
        document.visibilityState === "visible"
      ) {
        requestWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const hundredths = Math.min(99, Math.floor((seconds * 100) % 100));

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    if (seconds < 60) {
      return `${mins}:${secs.toString().padStart(2, "0")}.${hundredths.toString().padStart(2, "0")}`;
    }

    if (seconds < 600) {
      const tenths = Math.floor(hundredths / 10);
      return `${mins}:${secs.toString().padStart(2, "0")}.${tenths}`;
    }

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resetGame = () => {
    if (!isGameOver) {
      const confirmReset = window.confirm(
        "Are you sure you want to go to settings? This will reset the clock.",
      );
      if (!confirmReset) return;
    }
    setIsSetupOpen(true);
    setActivePlayer(0);
    setIsGameOver(false);
  };

  const togglePause = () => {
    if (activePlayer === 0) {
      setHasPrimed(true);
      setActivePlayer(readyPlayer);
      return;
    }
    setReadyPlayer(activePlayer as 1 | 2);
    setActivePlayer(0);
  };

  return (
    <ChessClockContext.Provider
      value={{
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
        errors,
        setErrors,
        isSetupOpen,
        clockStyle,
        setClockStyle,
        time1,
        time2,
        activePlayer,
        readyPlayer,
        hasPrimed,
        isGameOver,
        startGame,
        resetGame,
        togglePause,
        handleTouchStart,
        handleMouseDown,
        formatTime,
      }}
    >
      {children}
    </ChessClockContext.Provider>
  );
};

export const useChessClock = () => {
  const context = useContext(ChessClockContext);
  if (context === undefined) {
    throw new Error("useChessClock must be used within a ChessClockProvider");
  }
  return context;
};
