# Once Timer – Home Assistant Integration

Schedule a **one-shot action** on any Home Assistant entity — turn a light off after 30 minutes, open a cover at an exact time, play a media player when you wake up.

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)

---

## Features

- **Delay mode** – run an action in X minutes
- **Exact time mode** – run an action at a specific date and time
- **Any HA action** – turn_on, turn_off, toggle, media_play, open_cover, lock, and more
- **Presets** – save and reload favourite configurations
- **Persistent** – timers survive a Home Assistant restart
- **Notification** – get a persistent notification when a timer fires

---

## Installation

### Via HACS (Custom Repository)

1. Open HACS in Home Assistant
2. Go to **Integrations** → ⋮ → **Custom Repositories**
3. Add `https://github.com/NicoKortemeyer/Once_Timer` with category **Integration**
4. Search for **Once Timer** and install it
5. Restart Home Assistant

### Manual

Copy the `custom_components/once_timer/` folder into your HA `config/custom_components/` directory and restart.

---

## Setup

After restarting, go to **Settings → Devices & Services → Add Integration** and search for **Once Timer**. No credentials or configuration needed.

---

## Lovelace Card

Install the companion card separately via HACS:
→ [once-timer-card](https://github.com/NicoKortemeyer/once-timer-card)

The card lets you search for entities by name, pick an action, set a time, and start the timer — all from your dashboard.

---

## Services

### `once_timer.start`

| Field | Required | Description |
|-------|----------|-------------|
| `entity_id` | ✅ | Target entity (light, switch, cover, media_player, …) |
| `action` | ✅ | HA service name, e.g. `turn_on`, `toggle`, `media_play` |
| `mode` | ✅ | `delay` or `absolute_time` |
| `delay_minutes` | if delay | Minutes to wait (0.1 – 10080) |
| `run_at` | if absolute_time | ISO8601 datetime string |

### `once_timer.cancel`

| Field | Required | Description |
|-------|----------|-------------|
| `schedule_id` | ✅ | ID of the schedule to cancel |

### `once_timer.save_preset`

| Field | Required | Description |
|-------|----------|-------------|
| `name` | ✅ | Preset name |
| `entity_id` | ✅ | Target entity |
| `action` | ✅ | Action to perform |
| `mode` | ✅ | `delay` or `absolute_time` |
| `delay_minutes` | | Delay value (for delay mode) |

### `once_timer.load_preset`

| Field | Required | Description |
|-------|----------|-------------|
| `name` | ✅ | Name of the preset to load |

### `once_timer.delete_preset`

| Field | Required | Description |
|-------|----------|-------------|
| `name` | ✅ | Name of the preset to delete |

---

## Supported Entities

Any entity whose domain has a matching HA service. Built-in support for:
`light`, `switch`, `fan`, `media_player`, `climate`, `cover`, `vacuum`, `lock`, `input_boolean`, `automation`, `script`, `alarm_control_panel`

---

## License

MIT © Nico Kortemeyer
