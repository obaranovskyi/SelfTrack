export const STORAGE_KEYS = {
  startDate: "selftrack_startDate",
  startWeight: "selftrack_startWeight",
  currentWeight: "selftrack_currentWeight",
  exerciseLog: "selftrack_exerciseLog",
  totalWaterDrunk: "selftrack_totalWaterDrunk",
  waterToday: "selftrack_waterToday",
  moodLog: "selftrack_moodLog",
} as const;

export interface WaterToday {
  date: string;
  amount: number;
}

export type ExerciseLog = Record<string, number>;
export type MoodLog = Record<string, number>;

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

export function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function diffInDays(from: string, to: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((new Date(to).getTime() - new Date(from).getTime()) / msPerDay);
}

// ---------------------------------------------------------------------------
// Getters
// ---------------------------------------------------------------------------

export function getStartDate(): string | null {
  return localStorage.getItem(STORAGE_KEYS.startDate);
}

export function getStartWeight(): number {
  return parseFloat(localStorage.getItem(STORAGE_KEYS.startWeight) ?? "0");
}

export function getCurrentWeight(): number {
  return parseFloat(localStorage.getItem(STORAGE_KEYS.currentWeight) ?? "0");
}

export function getExerciseLog(): ExerciseLog {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.exerciseLog) ?? "{}") as ExerciseLog;
  } catch {
    return {};
  }
}

export function getTotalWaterDrunk(): number {
  return parseFloat(localStorage.getItem(STORAGE_KEYS.totalWaterDrunk) ?? "0");
}

/**
 * Returns today's water entry, resetting to 0 on day rollover (without
 * touching totalWaterDrunk, which is already the cumulative running total).
 */
export function getWaterToday(): WaterToday {
  const today = getTodayISO();
  try {
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.waterToday) ?? "null"
    ) as WaterToday | null;
    if (stored && stored.date === today) return stored;
  } catch {
    // fall through
  }
  const fresh: WaterToday = { date: today, amount: 0.0 };
  localStorage.setItem(STORAGE_KEYS.waterToday, JSON.stringify(fresh));
  return fresh;
}

export function getMoodLog(): MoodLog {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.moodLog) ?? "{}") as MoodLog;
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------------------
// Setters / mutators
// ---------------------------------------------------------------------------

export function initializeApp(startWeight: number): void {
  const today = getTodayISO();
  localStorage.setItem(STORAGE_KEYS.startDate, today);
  localStorage.setItem(STORAGE_KEYS.startWeight, String(startWeight));
  localStorage.setItem(STORAGE_KEYS.currentWeight, String(startWeight));
}

export function adjustWeight(delta: number): number {
  const current = getCurrentWeight();
  const next = Math.round((current + delta) * 10) / 10;
  if (next < 0.1) return current;
  localStorage.setItem(STORAGE_KEYS.currentWeight, String(next));
  return next;
}

export function adjustExercise(delta: number): number {
  const today = getTodayISO();
  const log = getExerciseLog();
  const current = log[today] ?? 0;
  const next = Math.max(0, current + delta);
  log[today] = next;
  const pruned = pruneLog(log, 165);
  localStorage.setItem(STORAGE_KEYS.exerciseLog, JSON.stringify(pruned));
  return next;
}

export function adjustWater(delta: number): number {
  const current = getWaterToday();
  const nextAmount = Math.round((current.amount + delta) * 10) / 10;
  if (nextAmount < 0) return current.amount;

  const today = getTodayISO();
  const waterToday: WaterToday = { date: today, amount: nextAmount };
  localStorage.setItem(STORAGE_KEYS.waterToday, JSON.stringify(waterToday));

  const totalDrunk = Math.round((getTotalWaterDrunk() + delta) * 10) / 10;
  localStorage.setItem(STORAGE_KEYS.totalWaterDrunk, String(Math.max(0, totalDrunk)));
  return nextAmount;
}

export function setMood(mood: number): void {
  const today = getTodayISO();
  const log = getMoodLog();
  log[today] = mood;
  const pruned = pruneLog(log, 165);
  localStorage.setItem(STORAGE_KEYS.moodLog, JSON.stringify(pruned));
}

export function resetAll(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

// ---------------------------------------------------------------------------
// Calculations
// ---------------------------------------------------------------------------

function pruneLog(log: Record<string, number>, keepDays: number): Record<string, number> {
  const today = getTodayISO();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - keepDays + 1);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  return Object.fromEntries(
    Object.entries(log).filter(([date]) => date >= cutoffStr && date <= today)
  );
}

export function getDaysElapsed(startDate: string): number {
  return diffInDays(startDate, getTodayISO());
}

export function getExerciseAverage(startDate: string): number {
  const log = getExerciseLog();
  const daysElapsed = getDaysElapsed(startDate);
  if (daysElapsed < 0) return 0;
  const daysForAverage = Math.min(daysElapsed + 1, 165);
  if (daysForAverage === 0) return 0;
  const total = Object.values(log).reduce((sum, m) => sum + m, 0);
  return Math.round(total / daysForAverage);
}

export function getWaterAverage(startDate: string): number {
  const total = getTotalWaterDrunk();
  const daysElapsed = getDaysElapsed(startDate);
  const daysForAverage = Math.max(daysElapsed + 1, 1);
  return Math.round((total / daysForAverage) * 10) / 10;
}

export function getMoodAverage(): number | null {
  const values = Object.values(getMoodLog());
  if (values.length === 0) return null;
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  return Math.round(avg * 10) / 10;
}
