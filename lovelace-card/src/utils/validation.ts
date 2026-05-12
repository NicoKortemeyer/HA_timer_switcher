import type { TimerAction, TimerMode } from "../types.js";

export function isValidEntityId(entityId: string): boolean {
  return /^[a-z_]+\.[a-z0-9_]+$/.test(entityId);
}

export function isValidDelayMinutes(minutes: number): boolean {
  return Number.isFinite(minutes) && minutes >= 0.1 && minutes <= 10080;
}

export function isValidRunAt(isoString: string): boolean {
  const date = new Date(isoString);
  return !isNaN(date.getTime()) && date > new Date();
}

export function validateStartInput(params: {
  entityId: string;
  action: TimerAction;
  mode: TimerMode;
  delayMinutes: number;
  runAt: string;
}): string | null {
  if (!params.entityId) return "Please select a target entity.";
  if (!isValidEntityId(params.entityId)) return `Invalid entity ID: ${params.entityId}`;

  if (params.mode === "delay") {
    if (!isValidDelayMinutes(params.delayMinutes)) {
      return "Delay must be between 0.1 and 10080 minutes.";
    }
  } else {
    if (!isValidRunAt(params.runAt)) {
      return "Run-at time must be a valid future date/time.";
    }
  }

  return null;
}
