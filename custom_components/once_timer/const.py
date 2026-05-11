from __future__ import annotations

DOMAIN = "once_timer"

STORAGE_KEY = "once_timer.schedules"
STORAGE_VERSION = 1

CONF_ALLOWED_DOMAINS = "allowed_domains"
DEFAULT_ALLOWED_DOMAINS = ["light", "switch", "fan", "media_player", "climate"]

STATUS_SCHEDULED = "scheduled"
STATUS_RUNNING = "running"
STATUS_DONE = "done"
STATUS_ERROR = "error"
STATUS_CANCELLED = "cancelled"

MODE_DELAY = "delay"
MODE_ABSOLUTE = "absolute_time"

ACTION_TURN_ON = "turn_on"
ACTION_TURN_OFF = "turn_off"

SERVICE_START = "start"
SERVICE_CANCEL = "cancel"
SERVICE_PREVIEW = "preview"
SERVICE_SAVE_PRESET = "save_preset"
SERVICE_LOAD_PRESET = "load_preset"

ATTR_SCHEDULE_ID = "schedule_id"
ATTR_RUN_AT = "run_at"
ATTR_STATUS = "status"
ATTR_LAST_ERROR = "last_error"
ATTR_LAST_RUN_AT = "last_run_at"
ATTR_SCHEDULES = "schedules"
ATTR_ACTIVE_COUNT = "active_count"
ATTR_DONE_COUNT = "done_count"
ATTR_HISTORY = "history"
ATTR_PRESETS = "presets"

HISTORY_MAX_ENTRIES = 50
