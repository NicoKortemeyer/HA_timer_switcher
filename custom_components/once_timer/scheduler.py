from __future__ import annotations

import logging
from datetime import datetime
from typing import TYPE_CHECKING, Callable

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.event import async_track_point_in_time
from homeassistant.util import dt as dt_util

from .const import (
    STATUS_CANCELLED,
    STATUS_DONE,
    STATUS_ERROR,
    STATUS_RUNNING,
    STATUS_SCHEDULED,
)
from .exceptions import InvalidEntityError, ServiceCallError
from .models import Schedule

if TYPE_CHECKING:
    from .coordinator import OnceTimerCoordinator

_LOGGER = logging.getLogger(__name__)


class TimerScheduler:
    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._handles: dict[str, Callable] = {}
        self._coordinator: OnceTimerCoordinator | None = None

    def set_coordinator(self, coordinator: OnceTimerCoordinator) -> None:
        self._coordinator = coordinator

    async def async_schedule(self, schedule: Schedule) -> None:
        if schedule.schedule_id in self._handles:
            self._handles.pop(schedule.schedule_id)()

        run_at_utc = dt_util.as_utc(schedule.run_at)

        @callback
        def _fire(_now: datetime) -> None:
            self._hass.async_create_task(self._async_execute(schedule.schedule_id))

        self._handles[schedule.schedule_id] = async_track_point_in_time(
            self._hass, _fire, run_at_utc
        )
        _LOGGER.debug("Scheduled %s to run at %s", schedule.schedule_id, run_at_utc)

    async def async_cancel(self, schedule_id: str) -> None:
        remove = self._handles.pop(schedule_id, None)
        if remove:
            remove()
            _LOGGER.debug("Cancelled timer %s", schedule_id)

    async def async_restore_from_store(self, schedules: dict[str, Schedule]) -> None:
        now = dt_util.utcnow()
        for schedule in schedules.values():
            if schedule.status == STATUS_SCHEDULED:
                if schedule.run_at > now:
                    await self.async_schedule(schedule)
                else:
                    # Already marked as error in store.async_load; just skip
                    pass

    async def async_cancel_all(self) -> None:
        for remove in list(self._handles.values()):
            remove()
        self._handles.clear()

    async def _async_execute(self, schedule_id: str) -> None:
        if self._coordinator is None:
            return

        self._handles.pop(schedule_id, None)
        schedule = self._coordinator.get_schedule(schedule_id)
        if schedule is None or schedule.status != STATUS_SCHEDULED:
            return

        schedule.status = STATUS_RUNNING
        schedule.updated_at = dt_util.utcnow()
        await self._coordinator.async_persist_schedule(schedule)

        try:
            await self._async_fire_action(schedule)
            schedule.status = STATUS_DONE
            schedule.last_run_at = dt_util.utcnow()
            _LOGGER.info(
                "Timer %s executed: %s on %s",
                schedule_id,
                schedule.action,
                schedule.entity_id,
            )
        except InvalidEntityError as err:
            schedule.status = STATUS_ERROR
            schedule.last_error = str(err)
            _LOGGER.error("Timer %s failed (invalid entity): %s", schedule_id, err)
        except ServiceCallError as err:
            schedule.status = STATUS_ERROR
            schedule.last_error = str(err)
            _LOGGER.error("Timer %s failed (service call): %s", schedule_id, err)
        except Exception as err:
            schedule.status = STATUS_ERROR
            schedule.last_error = f"Unexpected error: {err}"
            _LOGGER.exception("Timer %s failed unexpectedly", schedule_id)

        schedule.updated_at = dt_util.utcnow()
        await self._coordinator.async_finalize_schedule(schedule)

    async def _async_fire_action(self, schedule: Schedule) -> None:
        if self._hass.states.get(schedule.entity_id) is None:
            raise InvalidEntityError(
                f"Entity '{schedule.entity_id}' not found in Home Assistant"
            )

        domain = schedule.entity_id.split(".")[0]
        try:
            await self._hass.services.async_call(
                domain,
                schedule.action,
                {"entity_id": schedule.entity_id},
                blocking=True,
            )
        except Exception as err:
            raise ServiceCallError(
                f"Service call {domain}.{schedule.action} failed: {err}"
            ) from err

        # Phase 4: persistent notification after execution
        try:
            await self._hass.services.async_call(
                "persistent_notification",
                "create",
                {
                    "title": "Once Timer",
                    "message": (
                        f"Action '{schedule.action}' executed on {schedule.entity_id}"
                    ),
                    "notification_id": f"once_timer_{schedule.schedule_id}",
                },
                blocking=False,
            )
        except Exception:
            pass  # Notifications are best-effort
