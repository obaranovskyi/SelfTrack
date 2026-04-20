import { getDaysElapsed, getTodayISO } from "../../../services/storage";

interface ProgressHeaderProps {
  startDate: string;
}

export function ProgressHeader({ startDate }: ProgressHeaderProps) {
  const today = getTodayISO();
  const daysInProgress = getDaysElapsed(startDate);

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-1">
        <span className="text-3xl font-bold text-primary tabular-nums">{daysInProgress}</span>
        <span className="text-xs text-muted-foreground">Days</span>
      </div>
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-1">
        <span className="text-xs font-semibold text-foreground text-center leading-tight">{startDate}</span>
        <span className="text-xs text-muted-foreground">Started</span>
      </div>
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-1">
        <span className="text-xs font-semibold text-foreground text-center leading-tight">{today}</span>
        <span className="text-xs text-muted-foreground">Today</span>
      </div>
    </div>
  );
}
