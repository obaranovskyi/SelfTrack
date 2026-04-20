import { useState } from "react";
import {
  adjustExercise,
  getExerciseAverage,
  getExerciseLog,
  getTodayISO,
} from "../../../services/storage";

interface ExerciseTrackerProps {
  startDate: string;
}

export function ExerciseTracker({ startDate }: ExerciseTrackerProps) {
  const today = getTodayISO();
  const [todayMinutes, setTodayMinutes] = useState(() => getExerciseLog()[today] ?? 0);
  const [avgMinutes, setAvgMinutes] = useState(() => getExerciseAverage(startDate));

  function handleDecrement() {
    setTodayMinutes(adjustExercise(-1));
    setAvgMinutes(getExerciseAverage(startDate));
  }

  function handleIncrement() {
    setTodayMinutes(adjustExercise(1));
    setAvgMinutes(getExerciseAverage(startDate));
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <span className="text-base">🏃</span>
        <span className="text-xs font-medium text-muted-foreground">Exercise</span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-foreground tabular-nums">{todayMinutes}</span>
        <span className="text-sm text-muted-foreground">min</span>
      </div>

      <p className="text-xs text-muted-foreground">
        avg{" "}
        <span className="text-primary font-semibold">{avgMinutes} min</span>
      </p>

      <div className="flex gap-2 mt-1">
        <button
          onClick={handleDecrement}
          disabled={todayMinutes <= 0}
          aria-label="Decrease exercise"
          className="flex-1 h-10 rounded-xl bg-secondary text-secondary-foreground text-lg font-semibold touch-manipulation disabled:opacity-30 transition-opacity"
        >
          −
        </button>
        <button
          onClick={handleIncrement}
          aria-label="Increase exercise"
          className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-lg font-semibold touch-manipulation transition-opacity"
        >
          +
        </button>
      </div>
    </div>
  );
}
