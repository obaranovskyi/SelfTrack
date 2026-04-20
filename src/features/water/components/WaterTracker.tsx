import { useState } from "react";
import {
  adjustWater,
  getWaterAverage,
  getWaterToday,
} from "../../../services/storage";

interface WaterTrackerProps {
  startDate: string;
}

export function WaterTracker({ startDate }: WaterTrackerProps) {
  const [todayAmount, setTodayAmount] = useState(() => getWaterToday().amount);
  const [avgAmount, setAvgAmount] = useState(() => getWaterAverage(startDate));

  function handleDecrement() {
    const next = adjustWater(-0.1);
    setTodayAmount(next);
    setAvgAmount(getWaterAverage(startDate));
  }

  function handleIncrement() {
    const next = adjustWater(0.1);
    setTodayAmount(next);
    setAvgAmount(getWaterAverage(startDate));
  }

  return (
    <div className="bg-card rounded-2xl p-5 flex flex-col gap-4 shadow-sm border border-border">
      <h2 className="text-base font-semibold text-foreground">💧 Water</h2>

      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">Avg. Water</span>
        <span className="text-lg font-bold text-foreground">{avgAmount.toFixed(1)} L/day</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleDecrement}
          disabled={todayAmount <= 0}
          aria-label="Decrease water intake"
          className="min-h-12 min-w-12 rounded-full bg-secondary text-secondary-foreground text-xl font-bold flex items-center justify-center touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          −
        </button>
        <span className="text-2xl font-bold text-foreground tabular-nums">
          {todayAmount.toFixed(1)} L
        </span>
        <button
          onClick={handleIncrement}
          aria-label="Increase water intake"
          className="min-h-12 min-w-12 rounded-full bg-secondary text-secondary-foreground text-xl font-bold flex items-center justify-center touch-manipulation transition-opacity"
        >
          +
        </button>
      </div>
    </div>
  );
}
