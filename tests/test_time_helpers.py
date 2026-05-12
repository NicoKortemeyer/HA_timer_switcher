"""Tests for TypeScript time-helper equivalents (implemented in Python for CI)."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone


def format_remaining_time(run_at_iso: str) -> str:
    """Python port of formatRemainingTime for testing logic."""
    run_at = datetime.fromisoformat(run_at_iso)
    now = datetime.now(tz=timezone.utc)
    diff_ms = (run_at - now).total_seconds() * 1000

    if diff_ms <= 0:
        return "overdue"

    total_seconds = int(diff_ms / 1000)
    days = total_seconds // 86400
    hours = (total_seconds % 86400) // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60

    if days > 0:
        return f"{days}d {hours}h {minutes}m"
    if hours > 0:
        return f"{hours}h {minutes}m"
    if minutes > 0:
        return f"{minutes}m {seconds}s"
    return f"{seconds}s"


class TestFormatRemainingTime:
    def test_overdue(self):
        past = (datetime.now(tz=timezone.utc) - timedelta(hours=1)).isoformat()
        assert format_remaining_time(past) == "overdue"

    def test_days(self):
        future = (datetime.now(tz=timezone.utc) + timedelta(days=2, hours=3)).isoformat()
        result = format_remaining_time(future)
        assert result.startswith("2d")

    def test_hours(self):
        future = (datetime.now(tz=timezone.utc) + timedelta(hours=2, minutes=30)).isoformat()
        result = format_remaining_time(future)
        assert result.startswith("2h")

    def test_minutes(self):
        future = (datetime.now(tz=timezone.utc) + timedelta(minutes=15)).isoformat()
        result = format_remaining_time(future)
        assert result.startswith("14m") or result.startswith("15m")

    def test_seconds(self):
        future = (datetime.now(tz=timezone.utc) + timedelta(seconds=45)).isoformat()
        result = format_remaining_time(future)
        assert result.endswith("s")
        assert "m" not in result
