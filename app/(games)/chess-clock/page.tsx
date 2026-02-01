"use client";

import { ChessClockProvider, useChessClock } from "./context/ChessClockContext";
import { ModernClock } from "./components/ModernClock";
import { ClassicClock } from "./components/ClassicClock";
import { SetupOverlay } from "./components/SetupOverlay";

const ChessClockContent = () => {
  const { clockStyle, isSetupOpen } = useChessClock();

  return (
    <main className="fixed inset-0 flex flex-col overflow-hidden bg-zinc-950 font-sans text-white select-none">
      {!isSetupOpen && clockStyle === "modern" && <ModernClock />}
      {!isSetupOpen && clockStyle === "classic" && <ClassicClock />}
      {isSetupOpen && <SetupOverlay />}
    </main>
  );
};

const ChessClockPage = () => {
  return (
    <ChessClockProvider>
      <ChessClockContent />
    </ChessClockProvider>
  );
};

export default ChessClockPage;
