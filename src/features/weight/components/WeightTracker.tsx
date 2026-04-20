import { useState } from "react";
import { adjustWeight, getCurrentWeight, getStartWeight } from "../../../services/storage";
import { cn } from "../../../lib/utils";

export function WeightTracker() {
  const startWeight = getStartWeight();
  const [currentWeight, setCurrentWeight] = useState(() => getCurrentWeight());

  const lostWeight = Math.round((startWeight - currentWeight) * 10) / 10;

  function handleDecrement() {
    const next = adjustWeight(-0.1);
    setCurrentWeight(next);
  }

  function handleIncrement() {
    const next = adjustWeight(0.1);
    setCurrentWeight(next);
  }

  return (
    <div className="bg-card rounded-2xl p-5 flex flex-col gap-4 shadow-sm border border-border">
      <h2 className="text-base font-semibold text-foreground">⚖️ Weight</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Start Weight</span>
          <span className="text-lg font-bold text-foreground">{startWeight.toFixed(1)} kg</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Lost Weight</span>
          <span
            className={cn(
              "text-lg font-bold",
              lostWeight > 0 ? "text-green-600 dark:text-green-400" : "text-foreground"
            )}
          >
            {lostWeight > 0 ? "−" : lostWeight < 0 ? "+" : ""}
            {Math.abs(lostWeight).toFixed(1)} kg
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleDecrement}
          disabled={currentWeight <= 0.1}
          aria-label="Decrease weight"
          className="min-h-12 min-w-12 rounded-full bg-secondary text-secondary-foreground text-xl font-bold flex items-center justify-center touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          −
        </button>
        <span className="text-2xl font-bold text-foreground tabular-nums">
          {currentWeight.toFixed(1)} kg
        </span>
        <button
          onClick={handleIncrement}
          aria-label="Increase weight"
          className="min-h-12 min-w-12 rounded-full bg-secondary text-secondary-foreground text-xl font-bold flex items-center justify-center touch-manipulation transition-opacity"
        >
          +
        </button>
      </div>
    </div>
  );
}
