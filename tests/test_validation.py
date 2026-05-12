"""Tests for input validation logic."""
from __future__ import annotations

import re
from datetime import datetime, timedelta, timezone


def is_valid_entity_id(entity_id: str) -> bool:
    return bool(re.match(r'^[a-z_]+\.[a-z0-9_]+$', entity_id))


def is_valid_delay_minutes(minutes: float) -> bool:
    return isinstance(minutes, (int, float)) and 0.1 <= minutes <= 10080


def is_valid_run_at(iso_string: str) -> bool:
    try:
        date = datetime.fromisoformat(iso_string)
        if date.tzinfo is None:
            date = date.replace(tzinfo=timezone.utc)
        return date > datetime.now(tz=timezone.utc)
    except ValueError:
        return False


class TestEntityIdValidation:
    def test_valid_light(self):
        assert is_valid_entity_id("light.wohnzimmer") is True

    def test_valid_switch(self):
        assert is_valid_entity_id("switch.kaffeemaschine") is True

    def test_invalid_uppercase(self):
        assert is_valid_entity_id("Light.Wohnzimmer") is False

    def test_invalid_no_dot(self):
        assert is_valid_entity_id("lightwohnzimmer") is False

    def test_invalid_empty(self):
        assert is_valid_entity_id("") is False

    def test_valid_with_numbers(self):
        assert is_valid_entity_id("light.room_123") is True


class TestDelayMinutesValidation:
    def test_valid_30(self):
        assert is_valid_delay_minutes(30) is True

    def test_valid_min(self):
        assert is_valid_delay_minutes(0.1) is True

    def test_valid_max(self):
        assert is_valid_delay_minutes(10080) is True

    def test_too_small(self):
        assert is_valid_delay_minutes(0.05) is False

    def test_too_large(self):
        assert is_valid_delay_minutes(10081) is False

    def test_zero(self):
        assert is_valid_delay_minutes(0) is False


class TestRunAtValidation:
    def test_future(self):
        future = (datetime.now(tz=timezone.utc) + timedelta(hours=1)).isoformat()
        assert is_valid_run_at(future) is True

    def test_past(self):
        past = (datetime.now(tz=timezone.utc) - timedelta(hours=1)).isoformat()
        assert is_valid_run_at(past) is False

    def test_invalid_string(self):
        assert is_valid_run_at("not-a-date") is False

    def test_empty(self):
        assert is_valid_run_at("") is False
