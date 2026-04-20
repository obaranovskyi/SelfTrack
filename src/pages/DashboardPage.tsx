import { useState } from "react";
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

  return (
    <div className="min-h-svh flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-foreground">SelfTrack</h1>
      </header>

      <main className="flex-1 px-4 pb-8 flex flex-col gap-4 max-w-lg mx-auto w-full">
        {/* Progress Header */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <ProgressHeader startDate={startDate} />
        </div>

        {/* Trackers */}
        <WeightTracker />
        <ExerciseTracker startDate={startDate} />
        <WaterTracker startDate={startDate} />
        <MoodTracker />

        {/* Reset */}
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
