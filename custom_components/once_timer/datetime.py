from __future__ import annotations

from datetime import datetime, timedelta

from homeassistant.components.datetime import DateTimeEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import DOMAIN
from .coordinator import OnceTimerCoordinator
from .entity_base import OnceTimerEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator: OnceTimerCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([RunAtDatetime(coordinator, entry)])


class RunAtDatetime(OnceTimerEntity, DateTimeEntity):
    def __init__(self, coordinator: OnceTimerCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"{entry.entry_id}_run_at"
        self._attr_name = "Run At"

    @property
    def native_value(self) -> datetime:
        run_at_str = self.coordinator.pending_config.get("run_at")
        if run_at_str:
            parsed = dt_util.parse_datetime(run_at_str)
            if parsed:
                return parsed
        return dt_util.now() + timedelta(hours=1)

    async def async_set_value(self, value: datetime) -> None:
        self.coordinator.pending_config["run_at"] = value.isoformat()
        await self.coordinator.async_refresh()
