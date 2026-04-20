import { useState } from "react";
import { useTheme } from "../providers/ThemeProvider";
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
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className="min-h-svh flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <header className="px-5 pt-8 pb-4">
        <div className="max-w-lg mx-auto w-full flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tight">
          <span className="text-foreground">Self</span>
          <span className="text-primary">Track</span>
        </h1>
          <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle theme"
          className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm touch-manipulation transition-colors"
        >
          {isDark ? "☀️" : "🌙"}
          </button>
        </div>
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
