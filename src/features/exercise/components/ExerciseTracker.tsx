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
    const next = adjustExercise(-1);
    setTodayMinutes(next);
    setAvgMinutes(getExerciseAverage(startDate));
  }

  function handleIncrement() {
    const next = adjustExercise(1);
    setTodayMinutes(next);
    setAvgMinutes(getExerciseAverage(startDate));
  }

  return (
    <div className="bg-card rounded-2xl p-5 flex flex-col gap-4 shadow-sm border border-border">
      <h2 className="text-base font-semibold text-foreground">🏃 Exercise</h2>

      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">Avg. Exercise</span>
        <span className="text-lg font-bold text-foreground">{avgMinutes} min</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleDecrement}
          disabled={todayMinutes <= 0}
          aria-label="Decrease exercise minutes"
          className="min-h-12 min-w-12 rounded-full bg-secondary text-secondary-foreground text-xl font-bold flex items-center justify-center touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          −
        </button>
        <span className="text-2xl font-bold text-foreground tabular-nums">
          {todayMinutes} min
        </span>
        <button
          onClick={handleIncrement}
          aria-label="Increase exercise minutes"
          className="min-h-12 min-w-12 rounded-full bg-secondary text-secondary-foreground text-xl font-bold flex items-center justify-center touch-manipulation transition-opacity"
        >
          +
        </button>
      </div>
    </div>
  );
}
