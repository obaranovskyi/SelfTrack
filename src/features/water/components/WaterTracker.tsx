import { useState } from "react";
import { adjustWater, getWaterAverage, getWaterToday } from "../../../services/storage";

interface WaterTrackerProps {
  startDate: string;
}

export function WaterTracker({ startDate }: WaterTrackerProps) {
  const [todayAmount, setTodayAmount] = useState(() => getWaterToday().amount);
  const [avgAmount, setAvgAmount] = useState(() => getWaterAverage(startDate));

  function handleDecrement() {
    setTodayAmount(adjustWater(-0.1));
    setAvgAmount(getWaterAverage(startDate));
  }

  function handleIncrement() {
    setTodayAmount(adjustWater(0.1));
    setAvgAmount(getWaterAverage(startDate));
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <span className="text-base">💧</span>
        <span className="text-xs font-medium text-muted-foreground">Water</span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-foreground tabular-nums">
          {todayAmount.toFixed(1)}
        </span>
        <span className="text-sm text-muted-foreground">L</span>
      </div>

      <p className="text-xs text-muted-foreground">
        avg{" "}
        <span className="text-primary font-semibold">{avgAmount.toFixed(1)} L</span>
      </p>

      <div className="flex gap-2 mt-1">
        <button
          onClick={handleDecrement}
          disabled={todayAmount <= 0}
          aria-label="Decrease water"
          className="flex-1 h-10 rounded-xl bg-secondary text-secondary-foreground text-lg font-semibold touch-manipulation disabled:opacity-30 transition-opacity"
        >
          −
        </button>
        <button
          onClick={handleIncrement}
          aria-label="Increase water"
          className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-lg font-semibold touch-manipulation transition-opacity"
        >
          +
        </button>
      </div>
    </div>
  );
}
