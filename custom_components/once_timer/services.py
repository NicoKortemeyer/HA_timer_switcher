from __future__ import annotations

import voluptuous as vol
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv

from .const import (
    ACTION_TURN_OFF,
    ACTION_TURN_ON,
    DOMAIN,
    MODE_ABSOLUTE,
    MODE_DELAY,
    SERVICE_CANCEL,
    SERVICE_DELETE_PRESET,
    SERVICE_LOAD_PRESET,
    SERVICE_PREVIEW,
    SERVICE_SAVE_PRESET,
    SERVICE_START,
)
from .coordinator import OnceTimerCoordinator
from .exceptions import OnceTimerError

START_SCHEMA = vol.Schema(
    {
        vol.Required("entity_id"): cv.entity_id,
        vol.Required("action"): cv.string,
        vol.Required("mode"): vol.In([MODE_DELAY, MODE_ABSOLUTE]),
        vol.Optional("delay_minutes"): vol.All(
            vol.Coerce(float), vol.Range(min=0.1, max=10080)
        ),
        vol.Optional("run_at"): str,
    }
)

CANCEL_SCHEMA = vol.Schema({vol.Required("schedule_id"): str})

PREVIEW_SCHEMA = vol.Schema({vol.Required("schedule_id"): str})

SAVE_PRESET_SCHEMA = vol.Schema(
    {
        vol.Required("name"): str,
        vol.Required("entity_id"): cv.entity_id,
        vol.Required("action"): cv.string,
        vol.Required("mode"): vol.In([MODE_DELAY, MODE_ABSOLUTE]),
        vol.Optional("delay_minutes"): vol.All(
            vol.Coerce(float), vol.Range(min=0.1, max=10080)
        ),
    }
)

LOAD_PRESET_SCHEMA = vol.Schema({vol.Required("name"): str})


async def async_register_services(
    hass: HomeAssistant, coordinator: OnceTimerCoordinator
) -> None:
    async def handle_start(call: ServiceCall) -> None:
        data = call.data
        mode = data["mode"]
        delay_minutes = data.get("delay_minutes")
        run_at = data.get("run_at")

        if mode == MODE_DELAY and delay_minutes is None:
            raise vol.Invalid("delay_minutes is required when mode is 'delay'")
        if mode == MODE_ABSOLUTE and run_at is None:
            raise vol.Invalid("run_at is required when mode is 'absolute_time'")

        try:
            await coordinator.async_start_schedule(
                entity_id=data["entity_id"],
                action=data["action"],
                mode=mode,
                delay_minutes=delay_minutes,
                run_at_str=run_at,
            )
        except OnceTimerError as err:
            raise vol.Invalid(str(err)) from err

    async def handle_cancel(call: ServiceCall) -> None:
        try:
            await coordinator.async_cancel_schedule(call.data["schedule_id"])
        except OnceTimerError as err:
            raise vol.Invalid(str(err)) from err

    async def handle_preview(call: ServiceCall) -> None:
        try:
            await coordinator.async_preview_schedule(call.data["schedule_id"])
        except OnceTimerError as err:
            raise vol.Invalid(str(err)) from err

    async def handle_save_preset(call: ServiceCall) -> None:
        data = call.data
        await coordinator.async_save_preset(
            name=data["name"],
            entity_id=data["entity_id"],
            action=data["action"],
            mode=data["mode"],
            delay_minutes=data.get("delay_minutes"),
        )

    async def handle_load_preset(call: ServiceCall) -> None:
        try:
            await coordinator.async_load_preset(call.data["name"])
        except OnceTimerError as err:
            raise vol.Invalid(str(err)) from err

    async def handle_delete_preset(call: ServiceCall) -> None:
        await coordinator.async_delete_preset(call.data["name"])

    hass.services.async_register(DOMAIN, SERVICE_START, handle_start, schema=START_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_CANCEL, handle_cancel, schema=CANCEL_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_PREVIEW, handle_preview, schema=PREVIEW_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_SAVE_PRESET, handle_save_preset, schema=SAVE_PRESET_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_LOAD_PRESET, handle_load_preset, schema=LOAD_PRESET_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_DELETE_PRESET, handle_delete_preset, schema=LOAD_PRESET_SCHEMA)
