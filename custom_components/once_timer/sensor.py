from __future__ import annotations

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import (
    ATTR_ACTIVE_COUNT,
    ATTR_DONE_COUNT,
    ATTR_HISTORY,
    ATTR_LAST_ERROR,
    ATTR_LAST_RUN_AT,
    ATTR_PRESETS,
    ATTR_SCHEDULES,
    DOMAIN,
    STATUS_SCHEDULED,
)
from .coordinator import OnceTimerCoordinator
from .entity_base import OnceTimerEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator: OnceTimerCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([
        NextRunSensor(coordinator, entry),
        StatusSensor(coordinator, entry),
    ])


class NextRunSensor(OnceTimerEntity, SensorEntity):
    _attr_device_class = SensorDeviceClass.TIMESTAMP
    _attr_translation_key = "next_run"
    _attr_unique_id_suffix = "next_run"

    def __init__(self, coordinator: OnceTimerCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"{entry.entry_id}_next_run"
        self._attr_name = "Next Run"

    @property
    def native_value(self):
        active = sorted(
            coordinator_active := self.coordinator.get_active_schedules(),
            key=lambda s: s.run_at,
        )
        if active:
            return dt_util.as_utc(active[0].run_at)
        return None

    @property
    def extra_state_attributes(self) -> dict:
        all_schedules = self.coordinator.get_all_schedules()
        return {
            ATTR_SCHEDULES: [s.to_dict() for s in all_schedules],
        }


class StatusSensor(OnceTimerEntity, SensorEntity):
    _attr_translation_key = "timer_state"

    def __init__(self, coordinator: OnceTimerCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"{entry.entry_id}_state"
        self._attr_name = "Timer State"

    @property
    def native_value(self) -> str:
        active = self.coordinator.get_active_schedules()
        all_schedules = self.coordinator.get_all_schedules()
        error_schedules = [s for s in all_schedules if s.status == "error"]

        if error_schedules:
            return "error"
        if active:
            return f"{len(active)} scheduled"
        return "idle"

    @property
    def extra_state_attributes(self) -> dict:
        all_schedules = self.coordinator.get_all_schedules()
        history = self.coordinator.data.get("history", []) if self.coordinator.data else []
        presets = self.coordinator.data.get("presets", []) if self.coordinator.data else []

        active = [s for s in all_schedules if s.status == STATUS_SCHEDULED]
        done = [s for s in history if s.get("status") == "done"] if history else []

        last_errors = [s.last_error for s in all_schedules if s.last_error]
        last_runs = [s.last_run_at for s in all_schedules if s.last_run_at]

        return {
            ATTR_ACTIVE_COUNT: len(active),
            ATTR_DONE_COUNT: len(done),
            ATTR_LAST_ERROR: last_errors[-1] if last_errors else None,
            ATTR_LAST_RUN_AT: last_runs[-1].isoformat() if last_runs else None,
            ATTR_HISTORY: history,
            ATTR_PRESETS: presets,
        }
