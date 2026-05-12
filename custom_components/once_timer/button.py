from __future__ import annotations

from homeassistant.components.button import ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN, MODE_DELAY
from .coordinator import OnceTimerCoordinator
from .entity_base import OnceTimerEntity
from .exceptions import OnceTimerError


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator: OnceTimerCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([ScheduleOnceButton(coordinator, entry)])


class ScheduleOnceButton(OnceTimerEntity, ButtonEntity):
    def __init__(self, coordinator: OnceTimerCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"{entry.entry_id}_schedule_once"
        self._attr_name = "Schedule Once"

    async def async_press(self) -> None:
        config = self.coordinator.pending_config
        entity_id = config.get("target_entity")
        if not entity_id:
            raise OnceTimerError("No target entity selected in pending configuration")

        await self.coordinator.async_start_schedule(
            entity_id=entity_id,
            action=config.get("action", "turn_off"),
            mode=config.get("mode", MODE_DELAY),
            delay_minutes=config.get("delay_minutes"),
            run_at_str=config.get("run_at"),
        )
