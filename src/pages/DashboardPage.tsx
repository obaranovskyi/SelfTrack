import { useState } from "react";
import { getTodayISO } from "../services/storage";
import { ProgressHeader } from "../features/progress/components/ProgressHeader";
import { WeightTracker } from "../features/weight/components/WeightTracker";
import { ExerciseTracker } from "../features/exercise/components/ExerciseTracker";
import { WaterTracker } from "../features/water/components/WaterTracker";
import { MoodTracker } from "../features/mood/components/MoodTracker";
import { ResetModal } from "../features/reset/components/ResetModal";

interface DashboardPageProps {
  startDate: string;
}

export function DashboardPage({ startDate }: DashboardPageProps) {
  const [showReset, setShowReset] = useState(false);
  const today = getTodayISO();

  return (
    <div className="min-h-svh flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <header className="px-5 pt-8 pb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{today}</p>
        <h1 className="text-3xl font-bold text-foreground">SelfTrack</h1>
      </header>

      <main className="flex-1 px-4 pb-8 flex flex-col gap-3 max-w-lg mx-auto w-full">
        <ProgressHeader startDate={startDate} />
        <WeightTracker />
        <div className="grid grid-cols-2 gap-3">
          <ExerciseTracker startDate={startDate} />
          <WaterTracker startDate={startDate} />
        </div>
        <MoodTracker />

        <div className="pt-4 flex justify-center">
          <button
            onClick={() => setShowReset(true)}
            className="text-xs text-muted-foreground underline underline-offset-4 touch-manipulation min-h-10 px-4"
          >
            Reset the progress
          </button>
        </div>
      </main>

      {showReset && <ResetModal onClose={() => setShowReset(false)} />}
    </div>
  );
}
