import { getDaysElapsed, getTodayISO } from "../../../services/storage";

interface ProgressHeaderProps {
  startDate: string;
}

export function ProgressHeader({ startDate }: ProgressHeaderProps) {
  const today = getTodayISO();
  const daysInProgress = getDaysElapsed(startDate);

  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">Start Date</span>
        <span className="text-sm font-semibold text-foreground">{startDate}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">Today</span>
        <span className="text-sm font-semibold text-foreground">{today}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">Days</span>
        <span className="text-sm font-semibold text-foreground">{daysInProgress}</span>
      </div>
    </div>
  );
}
