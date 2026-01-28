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
  const [baseMinutesInput, setBaseMinutesInput] = useState("3");
  const [incrementSecondsInput, setIncrementSecondsInput] = useState("2");
  const [errors, setErrors] = useState<{ base?: string; inc?: string }>({});
  const [isSetupOpen, setIsSetupOpen] = useState(true);
  const [clockStyle, setClockStyle] = useState<ClockStyle>("modern");

  // Shared Config for active game
  const [incrementSeconds, setIncrementSeconds] = useState(0);

  // Game State
  const [time1, setTime1] = useState(600);
  const [time2, setTime2] = useState(600);
  const [activePlayer, setActivePlayer] = useState<0 | 1 | 2>(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const touchStarted = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Vibration logic
  const triggerVibration = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(60);
    }
  };

  const startGame = () => {
    const newErrors: { base?: string; inc?: string } = {};
    if (!baseMinutesInput.trim()) newErrors.base = "this needs a value";
    if (!incrementSecondsInput.trim()) newErrors.inc = "this needs a value";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const min = parseFloat(baseMinutesInput);
    const inc = parseFloat(incrementSecondsInput);

    setIncrementSeconds(inc);
    setTime1(min * 60);
    setTime2(min * 60);
    setIsSetupOpen(false);
    setIsGameOver(false);
    setActivePlayer(0);
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
        setTime1((prev) => prev + incrementSeconds);
      } else {
        setTime2((prev) => prev + incrementSeconds);
      }
      setActivePlayer(currentEnemy);
    } else if (activePlayer === 0) {
      // Game start from pause
      triggerVibration();
      setActivePlayer(currentEnemy);
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
      timerRef.current = setInterval(() => {
        if (activePlayer === 1) {
          setTime1((prev) => {
            if (prev <= 0.1) {
              setIsGameOver(true);
              setActivePlayer(0);
              return 0;
            }
            return prev - 0.1;
          });
        } else {
          setTime2((prev) => {
            if (prev <= 0.1) {
              setIsGameOver(true);
              setActivePlayer(0);
              return 0;
            }
            return prev - 0.1;
          });
        }
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activePlayer, isGameOver, isSetupOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds * 10) % 10);

    if (seconds < 20) {
      return `${mins}:${secs.toString().padStart(2, "0")}.${tenths}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resetGame = () => {
    setIsSetupOpen(true);
    setActivePlayer(0);
    setIsGameOver(false);
  };

  const togglePause = () => {
    if (activePlayer === 0) return;
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
          baseMinutesInput={baseMinutesInput}
          setBaseMinutesInput={setBaseMinutesInput}
          incrementSecondsInput={incrementSecondsInput}
          setIncrementSecondsInput={setIncrementSecondsInput}
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
