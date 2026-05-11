from __future__ import annotations


class OnceTimerError(Exception):
    pass


class InvalidEntityError(OnceTimerError):
    pass


class ScheduleNotFoundError(OnceTimerError):
    pass


class InvalidRunTimeError(OnceTimerError):
    pass


class ServiceCallError(OnceTimerError):
    pass
