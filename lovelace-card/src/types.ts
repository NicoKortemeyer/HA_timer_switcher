export interface OnceTimerCardConfig {
  type: string;
  title?: string;
  allowed_domains?: string[];
  show_history?: boolean;
}

export interface Schedule {
  schedule_id: string;
  entity_id: string;
  action: "turn_on" | "turn_off";
  mode: "delay" | "absolute_time";
  run_at: string; // ISO8601
  status: "scheduled" | "running" | "done" | "error" | "cancelled";
  created_at: string;
  updated_at: string;
  last_error: string | null;
  last_run_at: string | null;
  repeat: boolean;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>
  ): Promise<void>;
  language: string;
  locale: {
    language: string;
    number_format: string;
    time_format: string;
  };
}

export type TimerMode = "delay" | "absolute_time";
export type TimerAction = "turn_on" | "turn_off";

export interface Preset {
  name: string;
  entity_id: string;
  action: TimerAction;
  mode: TimerMode;
  delay_minutes: number | null;
  is_favorite: boolean;
}
