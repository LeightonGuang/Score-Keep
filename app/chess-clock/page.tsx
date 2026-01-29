"use client";
import { useState, useEffect, useRef } from "react";
import { ModernClock } from "./components/ModernClock";
import { ClassicClock } from "./components/ClassicClock";
import { SetupOverlay } from "./components/SetupOverlay";

type ClockStyle = "modern" | "classic";

const ChessClockPage = () => {
  // Setup State
  const [p1Name, setP1Name] = useState("");
  const [p2Name, setP2Name] = useState("");
  const [baseHoursInput, setBaseHoursInput] = useState("0");
  const [baseMinutesInput, setBaseMinutesInput] = useState("3");
  const [baseSecondsInput, setBaseSecondsInput] = useState("0");
  const [incrementSecondsInput, setIncrementSecondsInput] = useState("2");

  const [p2HoursInput, setP2HoursInput] = useState("0");
  const [p2MinutesInput, setP2MinutesInput] = useState("3");
  const [p2SecondsInput, setP2SecondsInput] = useState("0");
  const [p2IncrementSecondsInput, setP2IncrementSecondsInput] = useState("2");

  const [isMirrored, setIsMirrored] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<string | null>("3+2");

  const [errors, setErrors] = useState<{ base?: string; inc?: string }>({});
  const [isSetupOpen, setIsSetupOpen] = useState(true);
  const [clockStyle, setClockStyle] = useState<ClockStyle>("classic");

  // Shared Config for active game
  const [inc1, setInc1] = useState(0);
  const [inc2, setInc2] = useState(0);

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
      console.log("Wake Lock acquired");
    } catch (err) {
      console.error(`Wake Lock Error: ${err}`);
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
      console.log("Wake Lock released");
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
    setInc1(increment1);
    setInc2(increment2);

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

    // Switch turn
    const currentEnemy = playerNum === 1 ? 2 : 1;

    // If it's the player's turn, they tap to end it
    if (activePlayer === playerNum) {
      triggerVibration();
      // Add increment
      if (playerNum === 1) {
        setTime1((prev) => prev + inc1);
      } else {
        setTime2((prev) => prev + inc2);
      }
      setActivePlayer(currentEnemy);
    } else if (activePlayer === 0) {
      triggerVibration();
      // If choosing who starts, clicking any rocker primes the clock
      if (!hasPrimed) {
        setHasPrimed(true);
        // Set who moves next based on which side was clicked
        setReadyPlayer(playerNum === 1 ? 2 : 1);
      } else {
        // Already primed, only allow clicking the "UP" rocker to switch turn
        if (readyPlayer === playerNum) {
          setReadyPlayer(currentEnemy);
        }
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent, playerNum: 1 | 2) => {
    e.preventDefault();
    touchStarted.current = true;
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

  // Handle visibility change to re-acquire wake lock
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

    // Hundredths (2 digits) when under 1 minute
    if (seconds < 60) {
      return `${mins}:${secs.toString().padStart(2, "0")}.${hundredths.toString().padStart(2, "0")}`;
    }

    // Tenths when under 10 minutes
    if (seconds < 600) {
      const tenths = Math.floor(hundredths / 10);
      return `${mins}:${secs.toString().padStart(2, "0")}.${tenths}`;
    }

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resetGame = () => {
    if (!isGameOver) {
      const confirmReset = window.confirm(
        "Are you sure you want to reset the clock and go to settings? This will end the current game.",
      );
      if (!confirmReset) return;
    }
    setIsSetupOpen(true);
    setActivePlayer(0);
    setIsGameOver(false);
  };

  const togglePause = () => {
    if (activePlayer === 0) {
      setHasPrimed(true); // Ensure instruction overlay is removed
      setActivePlayer(readyPlayer);
      return;
    }
    // Save the current player as the ready player so turn is preserved on resume
    setReadyPlayer(activePlayer as 1 | 2);
    setActivePlayer(0);
  };

  return (
    <main className="fixed inset-0 flex flex-col overflow-hidden bg-zinc-950 font-sans text-white select-none">
      {clockStyle === "modern" && !isSetupOpen && (
        <ModernClock
          time1={time1}
          time2={time2}
          p1Name={p1Name}
          p2Name={p2Name}
          activePlayer={activePlayer}
          readyPlayer={readyPlayer}
          hasPrimed={hasPrimed}
          isGameOver={isGameOver}
          handleTouchStart={handleTouchStart}
          handleMouseDown={handleMouseDown}
          formatTime={formatTime}
          onReset={resetGame}
          onPause={togglePause}
        />
      )}

      {clockStyle === "classic" && !isSetupOpen && (
        <ClassicClock
          time1={time1}
          time2={time2}
          p1Name={p1Name}
          p2Name={p2Name}
          activePlayer={activePlayer}
          readyPlayer={readyPlayer}
          hasPrimed={hasPrimed}
          isGameOver={isGameOver}
          handleTouchStart={handleTouchStart}
          handleMouseDown={handleMouseDown}
          formatTime={formatTime}
          onReset={resetGame}
          onPause={togglePause}
        />
      )}

      {isSetupOpen && (
        <SetupOverlay
          p1Name={p1Name}
          setP1Name={setP1Name}
          p2Name={p2Name}
          setP2Name={setP2Name}
          baseHoursInput={baseHoursInput}
          setBaseHoursInput={setBaseHoursInput}
          baseMinutesInput={baseMinutesInput}
          setBaseMinutesInput={setBaseMinutesInput}
          baseSecondsInput={baseSecondsInput}
          setBaseSecondsInput={setBaseSecondsInput}
          incrementSecondsInput={incrementSecondsInput}
          setIncrementSecondsInput={setIncrementSecondsInput}
          p2HoursInput={p2HoursInput}
          setP2HoursInput={setP2HoursInput}
          p2MinutesInput={p2MinutesInput}
          setP2MinutesInput={setP2MinutesInput}
          p2SecondsInput={p2SecondsInput}
          setP2SecondsInput={setP2SecondsInput}
          p2IncrementSecondsInput={p2IncrementSecondsInput}
          setP2IncrementSecondsInput={setP2IncrementSecondsInput}
          isMirrored={isMirrored}
          setIsMirrored={setIsMirrored}
          selectedPreset={selectedPreset}
          setSelectedPreset={setSelectedPreset}
          clockStyle={clockStyle}
          setClockStyle={setClockStyle}
          errors={errors}
          setErrors={setErrors}
          onStart={startGame}
        />
      )}
    </main>
  );
};

export default ChessClockPage;
