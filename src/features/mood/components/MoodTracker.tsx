import { useState } from "react";
import { getMoodAverage, getMoodLog, getTodayISO, setMood } from "../../../services/storage";
import { cn } from "../../../lib/utils";

const MOOD_EMOJIS: Record<number, string> = {
  1: "😞", 2: "😕", 3: "😐", 4: "🙂", 5: "😊",
  6: "😄", 7: "😁", 8: "🤩", 9: "😍", 10: "🥳",
};

function emojiForAvg(avg: number) {
  return MOOD_EMOJIS[Math.min(10, Math.max(1, Math.round(avg)))];
}

export function MoodTracker() {
  const today = getTodayISO();
  const [selected, setSelected] = useState<number | null>(() => getMoodLog()[today] ?? null);
  const [avg, setAvg] = useState<number | null>(() => getMoodAverage());

  function handleSelect(mood: number) {
    setMood(mood);
    setSelected(mood);
    setAvg(getMoodAverage());
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎭</span>
          <span className="text-sm font-medium text-muted-foreground">Mood</span>
        </div>
        {avg !== null ? (
          <div className="flex items-center gap-2">
            <span className="text-xl">{emojiForAvg(avg)}</span>
            <span className="text-2xl font-bold text-primary">{avg.toFixed(1)}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">No entries yet</span>
        )}
      </div>

      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((mood) => (
          <button
            key={mood}
            onClick={() => handleSelect(mood)}
            aria-label={`Mood ${mood}`}
            aria-pressed={selected === mood}
            className={cn(
              "flex items-center justify-center aspect-square rounded-xl text-xl touch-manipulation transition-all duration-150",
              selected === mood
                ? "bg-primary/20 ring-1 ring-primary scale-110"
                : "opacity-30 active:opacity-70"
            )}
          >
            {MOOD_EMOJIS[mood]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <span key={n} className="text-center text-[10px] text-muted-foreground">
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}
