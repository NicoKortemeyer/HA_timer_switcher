from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (
    HISTORY_MAX_ENTRIES,
    STATUS_ERROR,
    STATUS_SCHEDULED,
    STORAGE_KEY,
    STORAGE_VERSION,
)
from .models import Preset, Schedule

if TYPE_CHECKING:
    pass

_LOGGER = logging.getLogger(__name__)


class ScheduleStore:
    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._schedules: dict[str, Schedule] = {}
        self._history: list[Schedule] = []
        self._presets: list[Preset] = []

    async def async_load(self) -> tuple[dict[str, Schedule], list[Schedule], list[Preset]]:
        raw = await self._store.async_load()
        if raw is None:
            return {}, [], []

        schedules: dict[str, Schedule] = {}
        now = dt_util.utcnow()

        for item in raw.get("schedules", []):
            try:
                schedule = Schedule.from_dict(item)
                # Mark past-due scheduled jobs as error on restart
                if schedule.status == STATUS_SCHEDULED and schedule.run_at < now:
                    schedule.status = STATUS_ERROR
                    schedule.last_error = "Missed: HA was restarted while timer was pending"
                    schedule.updated_at = now
                schedules[schedule.schedule_id] = schedule
            except Exception as err:
                _LOGGER.warning("Failed to restore schedule %s: %s", item.get("schedule_id"), err)

        history: list[Schedule] = []
        for item in raw.get("history", []):
            try:
                history.append(Schedule.from_dict(item))
            except Exception as err:
                _LOGGER.warning("Failed to restore history entry: %s", err)

        presets: list[Preset] = []
        for item in raw.get("presets", []):
            try:
                presets.append(Preset.from_dict(item))
            except Exception as err:
                _LOGGER.warning("Failed to restore preset: %s", err)

        self._schedules = schedules
        self._history = history
        self._presets = presets
        return schedules, history, presets

    async def async_save(
        self,
        schedules: dict[str, Schedule],
        history: list[Schedule],
        presets: list[Preset],
    ) -> None:
        await self._store.async_save(
            {
                "schedules": [s.to_dict() for s in schedules.values()],
                "history": [s.to_dict() for s in history[-HISTORY_MAX_ENTRIES:]],
                "presets": [p.to_dict() for p in presets],
            }
        )

    async def async_update_schedule(
        self,
        schedule: Schedule,
        schedules: dict[str, Schedule],
        history: list[Schedule],
        presets: list[Preset],
    ) -> None:
        schedules[schedule.schedule_id] = schedule
        await self.async_save(schedules, history, presets)

    async def async_delete_schedule(
        self,
        schedule_id: str,
        schedules: dict[str, Schedule],
        history: list[Schedule],
        presets: list[Preset],
    ) -> None:
        schedules.pop(schedule_id, None)
        await self.async_save(schedules, history, presets)
