"""Tests for Schedule and Preset models."""
from __future__ import annotations

import importlib.util
import sys
from datetime import datetime, timezone
from pathlib import Path

# conftest.py has already registered all stubs — load models directly
_ROOT = Path(__file__).parent.parent
_spec = importlib.util.spec_from_file_location(
    "custom_components.once_timer.models",
    _ROOT / "custom_components" / "once_timer" / "models.py",
)
_models_mod = importlib.util.module_from_spec(_spec)
_models_mod.__package__ = "custom_components.once_timer"
sys.modules["custom_components.once_timer.models"] = _models_mod
_spec.loader.exec_module(_models_mod)

Schedule = _models_mod.Schedule
Preset = _models_mod.Preset

# ---------------------------------------------------------------------------

NOW = datetime(2026, 5, 11, 10, 0, 0, tzinfo=timezone.utc)


def make_schedule(**kwargs) -> Schedule:
    defaults = dict(
        entity_id="light.test",
        action="turn_off",
        mode="delay",
        run_at=NOW,
    )
    defaults.update(kwargs)
    return Schedule(**defaults)


class TestScheduleSerialisation:
    def test_round_trip(self):
        s = make_schedule()
        d = s.to_dict()
        s2 = Schedule.from_dict(d)
        assert s2.schedule_id == s.schedule_id
        assert s2.entity_id == s.entity_id
        assert s2.action == s.action
        assert s2.mode == s.mode
        assert s2.status == s.status
        assert s2.run_at == s.run_at

    def test_iso8601_timezone(self):
        s = make_schedule(run_at=NOW)
        d = s.to_dict()
        assert "+" in d["run_at"] or "Z" in d["run_at"]

    def test_default_status_is_scheduled(self):
        s = make_schedule()
        assert s.status == "scheduled"

    def test_repeat_defaults_false(self):
        s = make_schedule()
        assert s.repeat is False

    def test_last_error_serialises_none(self):
        s = make_schedule()
        assert s.to_dict()["last_error"] is None

    def test_last_run_at_serialises_none(self):
        s = make_schedule()
        assert s.to_dict()["last_run_at"] is None

    def test_from_dict_with_last_error(self):
        s = make_schedule()
        s.last_error = "something went wrong"
        s2 = Schedule.from_dict(s.to_dict())
        assert s2.last_error == "something went wrong"

    def test_unique_schedule_ids(self):
        assert make_schedule().schedule_id != make_schedule().schedule_id


class TestPresetSerialisation:
    def test_round_trip(self):
        p = Preset(
            name="morning",
            entity_id="light.bedroom",
            action="turn_on",
            mode="delay",
            delay_minutes=15,
        )
        p2 = Preset.from_dict(p.to_dict())
        assert p2.name == p.name
        assert p2.entity_id == p.entity_id
        assert p2.delay_minutes == p.delay_minutes

    def test_is_favorite_defaults_false(self):
        p = Preset(name="x", entity_id="switch.x", action="turn_off", mode="delay")
        assert p.is_favorite is False
