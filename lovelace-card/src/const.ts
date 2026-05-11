export const DOMAIN = "once_timer";
export const CARD_NAME = "once-timer-card";
export const CARD_EDITOR_NAME = "once-timer-card-editor";

export const DEFAULT_ALLOWED_DOMAINS = ["light", "switch", "fan", "media_player", "climate"];
export const STATUS_SENSOR_ENTITY_ID = "sensor.once_timer_next_run";

export const STATUS_COLORS: Record<string, string> = {
  scheduled: "var(--info-color, #039be5)",
  running: "var(--warning-color, #ff9800)",
  done: "var(--success-color, #4caf50)",
  error: "var(--error-color, #f44336)",
  cancelled: "var(--disabled-color, #9e9e9e)",
};
