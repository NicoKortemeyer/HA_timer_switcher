import type { HomeAssistant } from "../types.js";

export function getFriendlyName(hass: HomeAssistant | undefined, entityId: string): string {
  const state = hass?.states[entityId];
  return String(state?.attributes["friendly_name"] ?? entityId);
}
