"""Shared pytest fixtures and HA stubs for once_timer tests."""
from __future__ import annotations

import sys
import types
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock

import pytest

ROOT = Path(__file__).parent.parent

# ---------------------------------------------------------------------------
# Stub all homeassistant.* modules before any integration code is imported
# ---------------------------------------------------------------------------

def _stub(name: str, **attrs) -> types.ModuleType:
    """Create and register a stub module."""
    mod = sys.modules.get(name) or types.ModuleType(name)
    for k, v in attrs.items():
        setattr(mod, k, v)
    sys.modules[name] = mod
    return mod


_stub("homeassistant")
_stub("homeassistant.util")
_stub(
    "homeassistant.util.dt",
    utcnow=lambda: datetime.now(tz=timezone.utc),
    now=lambda: datetime.now(tz=timezone.utc),
    parse_datetime=datetime.fromisoformat,
    as_utc=lambda dt: dt.astimezone(timezone.utc),
)
_stub("homeassistant.core", HomeAssistant=MagicMock, callback=lambda f: f)
_stub("homeassistant.config_entries", ConfigEntry=MagicMock, ConfigFlow=object)
_stub("homeassistant.helpers")
_stub("homeassistant.helpers.storage", Store=MagicMock)
_stub("homeassistant.helpers.event", async_track_point_in_time=MagicMock(return_value=lambda: None))
_stub(
    "homeassistant.helpers.update_coordinator",
    DataUpdateCoordinator=object,
    CoordinatorEntity=object,
)
_stub("homeassistant.helpers.device_registry", DeviceInfo=dict)
_stub("homeassistant.helpers.entity_platform", AddEntitiesCallback=MagicMock)
_stub("homeassistant.helpers.config_validation", entity_id=str, datetime=str)
_stub("homeassistant.components")
for _domain in ("button", "select", "number", "datetime", "sensor"):
    _m = _stub(f"homeassistant.components.{_domain}")
    for _cls in ("ButtonEntity", "SelectEntity", "NumberEntity", "DateTimeEntity", "SensorEntity"):
        setattr(_m, _cls, object)
    setattr(_m, "SensorDeviceClass", MagicMock())
    setattr(_m, "NumberMode", MagicMock())

# ---------------------------------------------------------------------------
# Stub the custom_components package itself so __init__.py doesn't auto-run
# ---------------------------------------------------------------------------

def _make_const_stub() -> types.ModuleType:
    """Load the real const.py values into a stub module."""
    const = _stub("custom_components.once_timer.const")
    # Load values directly from the real file without running the package
    const_path = ROOT / "custom_components" / "once_timer" / "const.py"
    exec(compile(const_path.read_text(), const_path, "exec"), const.__dict__)
    return const


_stub("custom_components")
_once_timer_pkg = _stub("custom_components.once_timer")
_once_timer_pkg.__path__ = [str(ROOT / "custom_components" / "once_timer")]
_once_timer_pkg.__package__ = "custom_components.once_timer"
_make_const_stub()

# Register remaining sub-module stubs so they can be individually loaded
for _sub in ("models", "exceptions", "store", "scheduler", "coordinator", "services"):
    _stub(f"custom_components.once_timer.{_sub}")

# Now put the project root on sys.path for direct imports
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


# ---------------------------------------------------------------------------
# Pytest fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def mock_hass():
    """Minimal HomeAssistant mock."""
    hass = MagicMock()
    hass.states = MagicMock()
    hass.states.get = MagicMock(return_value=MagicMock())
    hass.services = MagicMock()
    hass.services.async_call = AsyncMock()
    return hass
