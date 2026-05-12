export const DOMAIN_SERVICES: Record<string, string[]> = {
  light: ["turn_on", "turn_off", "toggle"],
  switch: ["turn_on", "turn_off", "toggle"],
  fan: ["turn_on", "turn_off", "toggle", "increase_speed", "decrease_speed"],
  media_player: [
    "media_play",
    "media_pause",
    "media_stop",
    "media_next_track",
    "media_previous_track",
    "volume_up",
    "volume_down",
    "volume_mute",
    "turn_on",
    "turn_off",
  ],
  climate: ["turn_on", "turn_off"],
  cover: ["open_cover", "close_cover", "stop_cover", "toggle"],
  vacuum: ["start", "pause", "stop", "return_to_base"],
  lock: ["lock", "unlock"],
  input_boolean: ["turn_on", "turn_off", "toggle"],
  automation: ["trigger", "turn_on", "turn_off"],
  script: ["turn_on"],
  alarm_control_panel: [
    "alarm_arm_home",
    "alarm_arm_away",
    "alarm_arm_night",
    "alarm_disarm",
  ],
};

const DEFAULT_SERVICES = ["turn_on", "turn_off"];

export function getServicesForEntity(entityId: string): string[] {
  const domain = entityId.split(".")[0] ?? "";
  return DOMAIN_SERVICES[domain] ?? DEFAULT_SERVICES;
}
