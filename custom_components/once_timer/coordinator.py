from __future__ import annotations

import logging
from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.util import dt as dt_util

from .const import (
    ACTION_TURN_OFF,
    ATTR_SCHEDULES,
    DOMAIN,
    HISTORY_MAX_ENTRIES,
    MODE_DELAY,
    STATUS_CANCELLED,
    STATUS_DONE,
    STATUS_ERROR,
    STATUS_SCHEDULED,
)
from .exceptions import InvalidRunTimeError, ScheduleNotFoundError
from .models import Preset, Schedule
from .scheduler import TimerScheduler
from .store import ScheduleStore

_LOGGER = logging.getLogger(__name__)


class OnceTimerCoordinator(DataUpdateCoordinator):
    def __init__(self, hass: HomeAssistant, store: ScheduleStore, scheduler: TimerScheduler) -> None:
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            # No polling — updates are pushed by the scheduler callbacks
            update_interval=None,
        )
        self._store = store
        self._scheduler = scheduler
        self._schedules: dict[str, Schedule] = {}
        self._history: list[Schedule] = []
        self._presets: list[Preset] = []
        self.pending_config: dict = {
            "target_entity": None,
            "action": ACTION_TURN_OFF,
            "mode": MODE_DELAY,
            "delay_minutes": 30.0,
            "run_at": None,
        }
        self._scheduler.set_coordinator(self)

    async def async_initialize(self) -> None:
        self._schedules, self._history, self._presets = await self._store.async_load()
        await self._scheduler.async_restore_from_store(self._schedules)
        self.data = self._build_data()

    def _build_data(self) -> dict:
        return {
            "schedules": {sid: s.to_dict() for sid, s in self._schedules.items()},
            "history": [s.to_dict() for s in self._history[-HISTORY_MAX_ENTRIES:]],
            "presets": [p.to_dict() for p in self._presets],
            "pending_config": dict(self.pending_config),
        }

    async def _async_update_data(self) -> dict:
        return self._build_data()

    def get_schedule(self, schedule_id: str) -> Schedule | None:
        return self._schedules.get(schedule_id)

    def get_all_schedules(self) -> list[Schedule]:
        return list(self._schedules.values())

    def get_active_schedules(self) -> list[Schedule]:
        return [s for s in self._schedules.values() if s.status == STATUS_SCHEDULED]

    async def async_start_schedule(
        self,
        entity_id: str,
        action: str,
        mode: str,
        delay_minutes: float | None = None,
        run_at_str: str | None = None,
    ) -> str:
        now = dt_util.utcnow()

        if mode == MODE_DELAY:
            if delay_minutes is None:
                raise InvalidRunTimeError("delay_minutes is required for delay mode")
            run_at = now + timedelta(minutes=delay_minutes)
        else:
            if run_at_str is None:
                raise InvalidRunTimeError("run_at is required for absolute_time mode")
            parsed = dt_util.parse_datetime(run_at_str)
            if parsed is None:
                raise InvalidRunTimeError(f"Invalid datetime: {run_at_str}")
            run_at = dt_util.as_utc(parsed)

        if run_at <= now:
            raise InvalidRunTimeError("run_at must be in the future")

        schedule = Schedule(
            entity_id=entity_id,
            action=action,
            mode=mode,
            run_at=run_at,
        )

        self._schedules[schedule.schedule_id] = schedule
        await self._store.async_save(self._schedules, self._history, self._presets)
        await self._scheduler.async_schedule(schedule)
        await self.async_refresh()

        _LOGGER.info("Created schedule %s: %s %s at %s", schedule.schedule_id, action, entity_id, run_at)
        return schedule.schedule_id

    async def async_cancel_schedule(self, schedule_id: str) -> None:
        schedule = self._schedules.get(schedule_id)
        if schedule is None:
            raise ScheduleNotFoundError(f"Schedule '{schedule_id}' not found")

        await self._scheduler.async_cancel(schedule_id)
        schedule.status = STATUS_CANCELLED
        schedule.updated_at = dt_util.utcnow()
        self._move_to_history(schedule)
        await self._store.async_save(self._schedules, self._history, self._presets)
        await self.async_refresh()

    async def async_preview_schedule(self, schedule_id: str) -> dict:
        schedule = self._schedules.get(schedule_id)
        if schedule is None:
            raise ScheduleNotFoundError(f"Schedule '{schedule_id}' not found")
        return schedule.to_dict()

    async def async_persist_schedule(self, schedule: Schedule) -> None:
        self._schedules[schedule.schedule_id] = schedule
        await self._store.async_save(self._schedules, self._history, self._presets)
        await self.async_refresh()

    async def async_finalize_schedule(self, schedule: Schedule) -> None:
        if schedule.status in (STATUS_DONE, STATUS_ERROR, STATUS_CANCELLED):
            self._move_to_history(schedule)
        await self._store.async_save(self._schedules, self._history, self._presets)
        await self.async_refresh()

    def _move_to_history(self, schedule: Schedule) -> None:
        self._schedules.pop(schedule.schedule_id, None)
        self._history.append(schedule)
        if len(self._history) > HISTORY_MAX_ENTRIES:
            self._history = self._history[-HISTORY_MAX_ENTRIES:]

    async def async_save_preset(self, name: str, entity_id: str, action: str, mode: str, delay_minutes: float | None) -> None:
        # Replace existing preset with same name
        self._presets = [p for p in self._presets if p.name != name]
        preset = Preset(name=name, entity_id=entity_id, action=action, mode=mode, delay_minutes=delay_minutes)
        self._presets.append(preset)
        await self._store.async_save(self._schedules, self._history, self._presets)
        await self.async_refresh()

    async def async_load_preset(self, name: str) -> Preset:
        for preset in self._presets:
            if preset.name == name:
                self.pending_config.update({
                    "target_entity": preset.entity_id,
                    "action": preset.action,
                    "mode": preset.mode,
                    "delay_minutes": preset.delay_minutes,
                })
                await self.async_refresh()
                return preset
        raise ScheduleNotFoundError(f"Preset '{name}' not found")

    async def async_unload(self) -> None:
        await self._scheduler.async_cancel_all()
