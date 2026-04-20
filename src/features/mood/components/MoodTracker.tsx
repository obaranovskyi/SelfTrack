import { useState } from "react";
import { getMoodAverage, getMoodLog, getTodayISO, setMood } from "../../../services/storage";
import { cn } from "../../../lib/utils";

const MOOD_EMOJIS: Record<number, string> = {
  1: "😞",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😊",
  6: "😄",
  7: "😁",
  8: "🤩",
  9: "😍",
  10: "🥳",
};

function getEmojiForAverage(avg: number): string {
  const rounded = Math.round(avg);
  const clamped = Math.min(10, Math.max(1, rounded));
  return MOOD_EMOJIS[clamped];
}

export function MoodTracker() {
  const today = getTodayISO();
  const [selectedMood, setSelectedMood] = useState<number | null>(() => getMoodLog()[today] ?? null);
  const [avg, setAvg] = useState<number | null>(() => getMoodAverage());

  function handleSelect(mood: number) {
    setMood(mood);
    setSelectedMood(mood);
    setAvg(getMoodAverage());
  }

  return (
    <div className="bg-card rounded-2xl p-5 flex flex-col gap-4 shadow-sm border border-border">
      <h2 className="text-base font-semibold text-foreground">😊 Mood</h2>

      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">Avg. Mood</span>
        {avg !== null ? (
          <span className="text-lg font-bold text-foreground">
            {getEmojiForAverage(avg)} {avg.toFixed(1)}
          </span>
        ) : (
          <span className="text-lg font-bold text-muted-foreground">—</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((mood) => (
            <button
              key={mood}
              onClick={() => handleSelect(mood)}
              aria-label={`Mood ${mood} ${MOOD_EMOJIS[mood]}`}
              aria-pressed={selectedMood === mood}
              className={cn(
                "flex flex-col items-center justify-center min-h-12 rounded-lg text-lg touch-manipulation transition-all",
                selectedMood === mood
                  ? "bg-primary/20 scale-110"
                  : "opacity-40 hover:opacity-70"
              )}
            >
              {MOOD_EMOJIS[mood]}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((mood) => (
            <span
              key={mood}
              className="text-center text-xs text-muted-foreground"
            >
              {mood}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
