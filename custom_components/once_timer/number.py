from __future__ import annotations

from homeassistant.components.number import NumberEntity, NumberMode
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .coordinator import OnceTimerCoordinator
from .entity_base import OnceTimerEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator: OnceTimerCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([DelayMinutesNumber(coordinator, entry)])


class DelayMinutesNumber(OnceTimerEntity, NumberEntity):
    _attr_native_min_value = 0.1
    _attr_native_max_value = 10080.0
    _attr_native_step = 0.5
    _attr_native_unit_of_measurement = "min"
    _attr_mode = NumberMode.BOX

    def __init__(self, coordinator: OnceTimerCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"{entry.entry_id}_delay_minutes"
        self._attr_name = "Delay (minutes)"

    @property
    def native_value(self) -> float:
        return self.coordinator.pending_config.get("delay_minutes", 30.0)

    async def async_set_native_value(self, value: float) -> None:
        self.coordinator.pending_config["delay_minutes"] = value
        await self.coordinator.async_refresh()
