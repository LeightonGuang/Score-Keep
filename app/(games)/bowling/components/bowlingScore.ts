import type { Frame } from "../context/BowlingContext";

export function calculateFrameScores(frames: Frame[]): (number | null)[] {
  const scores: (number | null)[] = [];

  // All rolls are needed because a strike in frame 9
  // can receive its bonus from frame 10.
  const rolls = frames.flatMap((frame) => frame.rolls);

  let rollIndex = 0;
  let total = 0;

  // ------------------------------------------
  // Frames 1-9
  // ------------------------------------------

  for (let frameIndex = 0; frameIndex < 9; frameIndex++) {
    const first = rolls[rollIndex];

    // No roll yet.
    if (first === undefined) {
      scores.push(null);
      continue;
    }

    // Strike
    if (first === 10) {
      const bonus1 = rolls[rollIndex + 1];
      const bonus2 = rolls[rollIndex + 2];

      // We don't have enough rolls to calculate
      // the strike yet.
      if (bonus1 === undefined || bonus2 === undefined) {
        scores.push(null);

        // Still move to the next frame.
        rollIndex += 1;
        continue;
      }

      total += 10 + bonus1 + bonus2;
      scores.push(total);

      rollIndex += 1;
      continue;
    }

    const second = rolls[rollIndex + 1];

    // Only the first ball has been thrown.
    if (second === undefined) {
      scores.push(null);
      continue;
    }

    // Spare
    if (first + second === 10) {
      const bonus = rolls[rollIndex + 2];

      if (bonus === undefined) {
        scores.push(null);

        rollIndex += 2;
        continue;
      }

      total += 10 + bonus;
      scores.push(total);

      rollIndex += 2;
      continue;
    }

    // Open frame
    total += first + second;
    scores.push(total);

    rollIndex += 2;
  }

  // ------------------------------------------
  // Frame 10
  // ------------------------------------------

  const tenthFrame = frames[9];

  if (!tenthFrame || tenthFrame.rolls.length === 0) {
    scores.push(null);
    return scores;
  }

  const tenthRolls = tenthFrame.rolls;

  // Open frame.
  if (
    tenthRolls.length >= 2 &&
    tenthRolls[0] < 10 &&
    tenthRolls[0] + tenthRolls[1] < 10
  ) {
    total += tenthRolls[0] + tenthRolls[1];
    scores.push(total);

    return scores;
  }

  // Strike or spare requires the bonus roll.
  if (tenthRolls.length < 3) {
    scores.push(null);
    return scores;
  }

  total += tenthRolls.reduce((sum, pins) => sum + pins, 0);

  scores.push(total);

  return scores;
}
