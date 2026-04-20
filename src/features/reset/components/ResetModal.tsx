import { useState } from "react";
import { getTodayISO, resetAll } from "../../../services/storage";

interface ResetModalProps {
  onClose: () => void;
}

export function ResetModal({ onClose }: ResetModalProps) {
  const today = getTodayISO();
  const [inputDate, setInputDate] = useState("");

  const isConfirmed = inputDate === today;

  function handleConfirm() {
    if (!isConfirmed) return;
    resetAll();
    window.location.reload();
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-sm bg-card text-card-foreground rounded-2xl shadow-2xl p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h2 className="text-lg font-bold text-foreground">Reset progress</h2>
          <p className="text-sm text-muted-foreground mt-1">
            This action is <strong>irreversible</strong>. All tracked data — weight, water,
            exercise, and mood — will be permanently deleted.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirm-date" className="text-sm font-medium text-foreground">
            Type today's date to confirm:
            <span className="ml-1 font-mono text-muted-foreground">{today}</span>
          </label>
          <input
            id="confirm-date"
            type="text"
            inputMode="numeric"
            placeholder={today}
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 min-h-12 rounded-lg border border-border text-foreground font-medium text-sm touch-manipulation transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmed}
            className="flex-1 min-h-12 rounded-lg bg-destructive text-destructive-foreground font-medium text-sm touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            Confirm Reset
          </button>
        </div>
      </div>
    </div>
  );
}
