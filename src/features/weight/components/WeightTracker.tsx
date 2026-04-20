import { useState } from "react";
import { adjustWeight, getCurrentWeight, getStartWeight } from "../../../services/storage";
import { cn } from "../../../lib/utils";

export function WeightTracker() {
  const startWeight = getStartWeight();
  const [currentWeight, setCurrentWeight] = useState(() => getCurrentWeight());

  const lostWeight = Math.round((startWeight - currentWeight) * 10) / 10;

  function handleDecrement() {
    setCurrentWeight(adjustWeight(-0.1));
  }

  function handleIncrement() {
    setCurrentWeight(adjustWeight(0.1));
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <span className="text-lg">⚖️</span>
        <span className="text-sm font-medium text-muted-foreground">Weight</span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-bold text-foreground tabular-nums">
          {currentWeight.toFixed(1)}
        </span>
        <span className="text-xl text-muted-foreground">kg</span>
      </div>

      <div className="flex items-center gap-5">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Start</p>
          <p className="text-sm font-semibold text-foreground">{startWeight.toFixed(1)} kg</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Lost</p>
          <p
            className={cn(
              "text-sm font-semibold",
              lostWeight > 0
                ? "text-primary"
                : lostWeight < 0
                  ? "text-destructive"
                  : "text-foreground"
            )}
          >
            {lostWeight > 0 ? "−" : lostWeight < 0 ? "+" : ""}
            {Math.abs(lostWeight).toFixed(1)} kg
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleDecrement}
          disabled={currentWeight <= 0.1}
          aria-label="Decrease weight"
          className="min-h-12 min-w-12 rounded-full bg-secondary text-secondary-foreground text-2xl font-light flex items-center justify-center touch-manipulation disabled:opacity-30 transition-opacity"
        >
          −
        </button>
        <div className="flex-1" />
        <button
          onClick={handleIncrement}
          aria-label="Increase weight"
          className="min-h-12 min-w-12 rounded-full bg-primary text-primary-foreground text-2xl font-light flex items-center justify-center touch-manipulation transition-opacity"
        >
          +
        </button>
      </div>
    </div>
  );
}
