from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import datetime
from typing import Literal

from homeassistant.util import dt as dt_util

from .const import (
    ACTION_TURN_OFF,
    MODE_DELAY,
    STATUS_SCHEDULED,
)

TimerStatus = Literal["scheduled", "running", "done", "error", "cancelled"]
TimerMode = Literal["delay", "absolute_time"]
TimerAction = Literal["turn_on", "turn_off"]


@dataclass
class Schedule:
    entity_id: str
    action: TimerAction
    mode: TimerMode
    run_at: datetime
    schedule_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    status: TimerStatus = STATUS_SCHEDULED
    created_at: datetime = field(default_factory=dt_util.utcnow)
    updated_at: datetime = field(default_factory=dt_util.utcnow)
    last_error: str | None = None
    last_run_at: datetime | None = None
    repeat: bool = False

    def to_dict(self) -> dict:
        return {
            "schedule_id": self.schedule_id,
            "entity_id": self.entity_id,
            "action": self.action,
            "mode": self.mode,
            "run_at": self.run_at.isoformat(),
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "last_error": self.last_error,
            "last_run_at": self.last_run_at.isoformat() if self.last_run_at else None,
            "repeat": self.repeat,
        }

    @classmethod
    def from_dict(cls, data: dict) -> Schedule:
        return cls(
            schedule_id=data["schedule_id"],
            entity_id=data["entity_id"],
            action=data["action"],
            mode=data["mode"],
            run_at=dt_util.parse_datetime(data["run_at"]),
            status=data["status"],
            created_at=dt_util.parse_datetime(data["created_at"]),
            updated_at=dt_util.parse_datetime(data["updated_at"]),
            last_error=data.get("last_error"),
            last_run_at=(
                dt_util.parse_datetime(data["last_run_at"])
                if data.get("last_run_at")
                else None
            ),
            repeat=data.get("repeat", False),
        )


@dataclass
class Preset:
    name: str
    entity_id: str
    action: TimerAction = ACTION_TURN_OFF
    mode: TimerMode = MODE_DELAY
    delay_minutes: float | None = None
    is_favorite: bool = False

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "entity_id": self.entity_id,
            "action": self.action,
            "mode": self.mode,
            "delay_minutes": self.delay_minutes,
            "is_favorite": self.is_favorite,
        }

    @classmethod
    def from_dict(cls, data: dict) -> Preset:
        return cls(
            name=data["name"],
            entity_id=data["entity_id"],
            action=data.get("action", ACTION_TURN_OFF),
            mode=data.get("mode", MODE_DELAY),
            delay_minutes=data.get("delay_minutes"),
            is_favorite=data.get("is_favorite", False),
        )
