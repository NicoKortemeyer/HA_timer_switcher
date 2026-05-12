from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import OnceTimerCoordinator


class OnceTimerEntity(CoordinatorEntity[OnceTimerCoordinator]):
    def __init__(self, coordinator: OnceTimerCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator)
        self._entry = entry

    @property
    def device_info(self) -> DeviceInfo:
        return DeviceInfo(
            identifiers={(DOMAIN, self._entry.entry_id)},
            name="Once Timer",
            manufacturer="Custom",
            model="Einmal-Timer",
        )

    @property
    def has_entity_name(self) -> bool:
        return True
