from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN
from .coordinator import OnceTimerCoordinator
from .scheduler import TimerScheduler
from .services import async_register_services
from .store import ScheduleStore

PLATFORMS = ["button", "select", "number", "datetime", "sensor"]


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    store = ScheduleStore(hass)
    scheduler = TimerScheduler(hass)
    coordinator = OnceTimerCoordinator(hass, store, scheduler)

    await coordinator.async_initialize()

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    await async_register_services(hass, coordinator)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if unload_ok:
        coordinator: OnceTimerCoordinator = hass.data[DOMAIN].pop(entry.entry_id)
        await coordinator.async_unload()

        # Remove services if no more entries
        if not hass.data[DOMAIN]:
            for service in ["start", "cancel", "preview", "save_preset", "load_preset"]:
                hass.services.async_remove(DOMAIN, service)

    return unload_ok
