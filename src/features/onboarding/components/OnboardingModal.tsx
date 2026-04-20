import { useState } from "react";
import { initializeApp } from "../../../services/storage";

interface OnboardingModalProps {
  onComplete: () => void;
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [rawValue, setRawValue] = useState("");
  const [error, setError] = useState("");

  const parsedWeight = parseFloat(rawValue);
  const isValid = !isNaN(parsedWeight) && parsedWeight > 0 && parsedWeight < 500;

  function handleConfirm() {
    if (!isValid) {
      setError("Please enter a valid weight (e.g. 90.0).");
      return;
    }
    initializeApp(Math.round(parsedWeight * 10) / 10);
    onComplete();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm bg-card text-card-foreground rounded-2xl shadow-2xl p-6 flex flex-col gap-5">
        <div className="text-center">
          <div className="text-4xl mb-3">⚖️</div>
          <h1 className="text-xl font-bold text-foreground">Welcome to SelfTrack</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Let's get started. Enter your current weight to begin tracking.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="start-weight" className="text-sm font-medium text-foreground">
            Starting weight (kg)
          </label>
          <input
            id="start-weight"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0.1"
            max="499.9"
            placeholder="e.g. 90.0"
            value={rawValue}
            onChange={(e) => {
              setRawValue(e.target.value);
              setError("");
            }}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <button
          onClick={handleConfirm}
          disabled={rawValue === ""}
          className="w-full rounded-lg bg-primary text-primary-foreground font-semibold py-3 text-base min-h-12 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          Start tracking
        </button>
      </div>
    </div>
  );
}
