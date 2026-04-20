# Product Requirements Document — SelfTrack

## 1. Overview

SelfTrack is a personal health-progress tracking Progressive Web App (PWA). It allows a single user to monitor their weight loss, daily water intake, exercise minutes, and mood — all from one dashboard, installable on a mobile phone, with no backend or account required.

---

## 2. Goals

- Provide a frictionless daily check-in experience (open → update → close in under 30 seconds).
- Persist all data locally on the device; no server, no login, no data leaving the device.
- Be installable as a PWA so it behaves like a native mobile app.

---

## 3. Scope (V1)

Single page: **Dashboard**.  
No authentication, no sync, no notifications in V1.

---

## 4. First-Time Onboarding

When the app is opened for the first time (no `startDate` in local storage):

1. Show a full-screen onboarding modal (not dismissable without completing it).
2. Ask the user to enter their **starting weight** in kilograms (decimal input, e.g. `90.0`).
3. On confirmation, store `startDate` (today's date, ISO format `YYYY-MM-DD`) and `startWeight` in local storage.
4. Dismiss the modal and show the Dashboard.

On every subsequent open, skip onboarding and go straight to the Dashboard.

---

## 5. Dashboard

The Dashboard is divided into the following sections, top to bottom:

### 5.1 Progress Header

Displays three values in a row:

| Start Date | Today | Days in Progress |
|---|---|---|
| `startDate` | current date | `today − startDate` (integer) |

- `startDate` is read from local storage.
- `Days in Progress` is always recalculated at render time; it is never stored.

### 5.2 Weight Tracker

Displays a summary row and an inline editor:

```
| Start Weight | Lost Weight |
| 90.0 kg      | 2.9 kg      |

  [−]  87.1 kg  [+]
```

**Behavior:**
- `Lost Weight = startWeight − currentWeight` (always positive when losing; show as negative if the user gained weight).
- `[+]` adds 0.1 kg to `currentWeight`; `[−]` subtracts 0.1 kg.
- `currentWeight` cannot go below `0.1 kg`.
- Changes are persisted to local storage immediately on each button press.
- Stored keys: `startWeight` (set once during onboarding), `currentWeight` (updated on every change).

### 5.3 Exercise Tracker

```
Avg. Exercise
25 min

  [−]  0 min  [+]
```

**Behavior:**
- `[+]` adds 1 minute; `[−]` subtracts 1 minute. Today's exercise total cannot go below `0`.
- The displayed value (`0 min` in the editor) is today's exercise total.
- **Average** is calculated over the last 165 days (including days with 0 minutes). Days before `startDate` are excluded if the app is less than 165 days old.
- Changes are persisted immediately.
- Stored key: `exerciseLog` — an object keyed by ISO date (`YYYY-MM-DD`), value is integer minutes. Only the last 165 days are retained; older entries are pruned on each write.

### 5.4 Water Tracker

```
Avg. Water
1.3 L/day

  [−]  0.0 L  [+]
```

**Behavior:**
- Each calendar day starts fresh at `0.0 L`.
- `[+]` adds 0.1 L; `[−]` subtracts 0.1 L. Cannot go below `0.0 L`.
- The displayed value is today's total.
- **Average** is `totalWaterDrunk ÷ daysElapsed` where `daysElapsed = today − startDate + 1` (minimum 1).
- Stored keys: `totalWaterDrunk` (cumulative float, updated when today's entry changes), `waterToday` (object with keys `date: YYYY-MM-DD` and `amount: float`). When the app is opened on a new day, `waterToday` is reset to `{ date: today, amount: 0.0 }` without modifying `totalWaterDrunk`.

> Note: on day rollover, `totalWaterDrunk` already contains everything from previous days. The running total is only ever incremented/decremented by the delta of changes made to today's entry.

### 5.5 Mood Tracker

```
Avg. Mood
😊 7.2

  😞 😕 😐 🙂 😊 😄 😁 🤩 😍 🥳
  1   2   3   4   5   6   7   8   9  10
```

**Behavior:**
- The user taps one of 10 emoji buttons to set today's mood (1–10).
- The selected emoji is highlighted; the rest are dimmed.
- The user can change their mood selection any number of times during the day.
- **Average mood** is calculated from the last 90 days of recorded entries (days with no entry are excluded from the average, not counted as 0).
- Average is displayed as a number rounded to one decimal place, with the corresponding emoji.
- Stored key: `moodLog` — object keyed by ISO date, value is integer 1–10. Only the last 90 days are retained; older entries are pruned on each write.

### 5.6 Reset Progress

A small, low-prominence button labeled **"Reset the progress"** is placed at the bottom of the page.

**Behavior:**
- Tapping the button opens a confirmation modal.
- The modal explains the action is irreversible and shows a date format example (e.g., `2026-04-20`).
- The user must type today's date in `YYYY-MM-DD` format into an input field.
- If the entered date matches today's date exactly, the **"Confirm Reset"** button becomes active.
- On confirm: all local storage keys used by the app are cleared; the app reloads and shows the onboarding flow.
- Tapping outside the modal or a **"Cancel"** button dismisses without action.

---

## 6. Technical Requirements

### 6.1 PWA
- Must include a valid `manifest.json` with app name, icons (at least 192×192 and 512×512), `display: standalone`, and a theme color.
- Must register a Service Worker that caches the app shell for offline use.
- App must be fully functional offline after the first load.

### 6.2 Storage
- All data is stored in `localStorage` under a single namespace prefix, e.g. `selftrack_`.
- No external API calls.

### 6.3 Platform
- Targets modern mobile browsers (iOS Safari, Android Chrome).
- Responsive layout, optimized for portrait mode on phones (360–430 px wide).
- No desktop-only interactions (no hover-dependent UI).

### 6.4 Tech Stack
- Static web app: HTML, CSS, JavaScript (or a lightweight framework).
- No build step required (optional bundler acceptable).
- No backend.

---

## 7. Local Storage Schema

| Key | Type | Description |
|---|---|---|
| `selftrack_startDate` | `string` (ISO date) | Date app was first opened |
| `selftrack_startWeight` | `number` | Initial weight in kg |
| `selftrack_currentWeight` | `number` | Current weight in kg |
| `selftrack_exerciseLog` | `object` | `{ "YYYY-MM-DD": minutes }`, last 165 days |
| `selftrack_totalWaterDrunk` | `number` | Cumulative liters since start |
| `selftrack_waterToday` | `object` | `{ date: "YYYY-MM-DD", amount: liters }` |
| `selftrack_moodLog` | `object` | `{ "YYYY-MM-DD": 1–10 }`, last 90 days |

---

## 8. Edge Cases & Constraints

| Scenario | Behavior |
|---|---|
| App opened for first time | Onboarding modal; no data displayed until weight is entered |
| Day rollover (midnight) | Water today resets; exercise and mood entries use today's date automatically |
| Weight goes to 0 | `[−]` button is disabled at `0.1 kg` |
| Water goes negative | `[−]` button is disabled at `0.0 L` |
| Exercise goes negative | `[−]` button is disabled at `0 min` |
| `daysElapsed = 0` | Show `0` for averages; avoid divide-by-zero |
| Reset with wrong date | "Confirm Reset" button remains disabled |
| No mood set today | Today's mood editor shows no selection highlighted |

---
