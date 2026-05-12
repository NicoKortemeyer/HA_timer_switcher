from __future__ import annotations

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    ACTION_TURN_OFF,
    ACTION_TURN_ON,
    DEFAULT_ALLOWED_DOMAINS,
    DOMAIN,
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
        TargetEntitySelect(coordinator, entry, hass),
        ActionSelect(coordinator, entry),
    ])


class TargetEntitySelect(OnceTimerEntity, SelectEntity):
    def __init__(
        self,
        coordinator: OnceTimerCoordinator,
        entry: ConfigEntry,
        hass: HomeAssistant,
    ) -> None:
        super().__init__(coordinator, entry)
        self._hass = hass
        self._attr_unique_id = f"{entry.entry_id}_target_entity"
        self._attr_name = "Target Entity"

    @property
    def options(self) -> list[str]:
        entity_ids = []
        for domain in DEFAULT_ALLOWED_DOMAINS:
            entity_ids.extend(self._hass.states.async_entity_ids(domain))
        return sorted(entity_ids)

    @property
    def current_option(self) -> str | None:
        return self.coordinator.pending_config.get("target_entity")

    async def async_select_option(self, option: str) -> None:
        self.coordinator.pending_config["target_entity"] = option
        await self.coordinator.async_refresh()


class ActionSelect(OnceTimerEntity, SelectEntity):
    _attr_options = [ACTION_TURN_ON, ACTION_TURN_OFF]

    def __init__(self, coordinator: OnceTimerCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"{entry.entry_id}_action"
        self._attr_name = "Action"

    @property
    def current_option(self) -> str:
        return self.coordinator.pending_config.get("action", ACTION_TURN_OFF)

    async def async_select_option(self, option: str) -> None:
        self.coordinator.pending_config["action"] = option
        await self.coordinator.async_refresh()
