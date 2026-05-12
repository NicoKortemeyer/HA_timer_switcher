import type { HomeAssistant, TimerAction, TimerMode } from "../types.js";

export async function startTimer(
  hass: HomeAssistant,
  params: {
    entity_id: string;
    action: TimerAction;
    mode: TimerMode;
    delay_minutes?: number;
    run_at?: string;
  }
): Promise<void> {
  await hass.callService("once_timer", "start", params);
}

export async function cancelTimer(
  hass: HomeAssistant,
  scheduleId: string
): Promise<void> {
  await hass.callService("once_timer", "cancel", { schedule_id: scheduleId });
}

export async function previewTimer(
  hass: HomeAssistant,
  scheduleId: string
): Promise<void> {
  await hass.callService("once_timer", "preview", {
    schedule_id: scheduleId,
  });
}

export async function savePreset(
  hass: HomeAssistant,
  params: {
    name: string;
    entity_id: string;
    action: TimerAction;
    mode: TimerMode;
    delay_minutes?: number;
  }
): Promise<void> {
  await hass.callService("once_timer", "save_preset", params);
}

export async function loadPreset(
  hass: HomeAssistant,
  name: string
): Promise<void> {
  await hass.callService("once_timer", "load_preset", { name });
}

export async function deletePreset(
  hass: HomeAssistant,
  name: string
): Promise<void> {
  await hass.callService("once_timer", "delete_preset", { name });
}
