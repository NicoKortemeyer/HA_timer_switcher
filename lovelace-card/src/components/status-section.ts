import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, Schedule } from "../types.js";
import { STATUS_COLORS } from "../const.js";
import { formatAbsoluteTime, formatRemainingTime } from "../utils/time-helpers.js";
import { getFriendlyName } from "../utils/ha-helpers.js";
import { t } from "../utils/i18n.js";

@customElement("once-timer-status-section")
export class StatusSection extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Array }) schedules: Schedule[] = [];
  @property({ type: Array }) history: Schedule[] = [];
  @property({ type: Boolean }) showHistory = false;
  @property({ type: Boolean }) showProgressBar = true;
  @property() lang = "en";

  @state() private _tick = 0;
  @state() private _showHistory = false;

  private _interval?: ReturnType<typeof setInterval>;

  connectedCallback(): void {
    super.connectedCallback();
    this._interval = setInterval(() => {
      this._tick++;
    }, 1000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._interval) clearInterval(this._interval);
  }

  private _formatDuration(createdAt: string, runAt: string): string {
    const ms = new Date(runAt).getTime() - new Date(createdAt).getTime();
    const mins = Math.round(ms / 60000);
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}min`;
  }

  private _cancelSchedule(scheduleId: string): void {
    this.dispatchEvent(
      new CustomEvent("cancel-schedule", {
        detail: scheduleId,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _restartSchedule(schedule: Schedule): void {
    this.dispatchEvent(
      new CustomEvent("restart-schedule", {
        detail: schedule,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _statusLabel(status: string): string {
    const key = status as Parameters<typeof t>[1];
    return t(this.lang, key) ?? status;
  }

  private _actionLabel(action: string): string {
    const key = action as Parameters<typeof t>[1];
    return t(this.lang, key) ?? action;
  }

  private _progressPercent(schedule: Schedule): number {
    const created = new Date(schedule.created_at).getTime();
    const runAt = new Date(schedule.run_at).getTime();
    const now = Date.now();
    const total = runAt - created;
    if (total <= 0) return 100;
    return Math.min(100, Math.max(0, ((now - created) / total) * 100));
  }

  private _renderScheduleItem(schedule: Schedule) {
    const isActive = schedule.status === "scheduled" || schedule.status === "running";
    const color = STATUS_COLORS[schedule.status] ?? "#9e9e9e";
    void this._tick;

    return html`
      <div class="schedule-item">
        <div class="schedule-info">
          <div class="schedule-entity">${getFriendlyName(this.hass,schedule.entity_id)}</div>
          <div class="schedule-details">
            ${this._actionLabel(schedule.action)} · ${formatAbsoluteTime(schedule.run_at)}
          </div>
          ${isActive
            ? html`<div class="schedule-countdown">${formatRemainingTime(schedule.run_at)}</div>`
            : ""}
          ${isActive && this.showProgressBar
            ? html`
                <div class="progress-track">
                  <div class="progress-bar" style="width:${this._progressPercent(schedule)}%"></div>
                </div>
              `
            : ""}
          ${schedule.last_error
            ? html`<div class="schedule-error">${schedule.last_error}</div>`
            : ""}
        </div>
        <div class="schedule-actions">
          <span class="status-badge" style="background:${color}">
            ${this._statusLabel(schedule.status)}
          </span>
          ${isActive
            ? html`
                <button
                  class="btn-cancel-item"
                  @click=${() => this._cancelSchedule(schedule.schedule_id)}
                  type="button"
                >
                  ${t(this.lang, "cancel")}
                </button>
              `
            : ""}
        </div>
      </div>
    `;
  }

  render() {
    const activeSchedules = this.schedules.filter(
      (s) => s.status === "scheduled" || s.status === "running"
    );
    const errorSchedules = this.schedules.filter((s) => s.status === "error");
    const allVisible = [...activeSchedules, ...errorSchedules];

    return html`
      ${allVisible.length === 0
        ? html`<div class="idle-message">${t(this.lang, "no_timers")}</div>`
        : html`
            <div class="schedule-list">
              ${allVisible.map((s) => this._renderScheduleItem(s))}
            </div>
          `}

      ${this.showHistory
        ? html`
            <div class="history-section">
              ${this.history.length === 0
                ? html`<div class="idle-message" style="font-size:0.82em">${this.lang.startsWith("de") ? "Noch kein Verlauf vorhanden." : "No history yet."}</div>`
                : html`
                    <button
                      class="history-toggle"
                      @click=${() => (this._showHistory = !this._showHistory)}
                      type="button"
                    >
                      ${this._showHistory
                        ? t(this.lang, "hide_history")
                        : t(this.lang, "show_history")}
                      (${this.history.length})
                    </button>`}
              ${this._showHistory
                ? html`
                    <div class="history-list">
                      ${this.history
                        .slice()
                        .reverse()
                        .slice(0, 20)
                        .map(
                          (s) => html`
                            <div class="history-item">
                              <div class="history-info">
                                <span class="history-name">${getFriendlyName(this.hass,s.entity_id)}</span>
                                <span class="history-meta">
                                  ${this._actionLabel(s.action)}
                                  · ${this._formatDuration(s.created_at, s.run_at)}
                                </span>
                              </div>
                              <div class="history-actions">
                                <span
                                  class="status-badge"
                                  style="background:${STATUS_COLORS[s.status] ?? "#9e9e9e"}"
                                >
                                  ${this._statusLabel(s.status)}
                                </span>
                                <button
                                  class="btn-restart"
                                  type="button"
                                  @click=${() => this._restartSchedule(s)}
                                  title="${t(this.lang, "restart")}"
                                >↺</button>
                              </div>
                            </div>
                          `
                        )}
                    </div>
                  `
                : ""}
            </div>
          `
        : ""}
    `;
  }

  static styles = css`
    .schedule-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .schedule-item {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--secondary-background-color, #fafafa);
      gap: 8px;
    }
    .schedule-info {
      flex: 1;
      min-width: 0;
    }
    .schedule-entity {
      font-weight: 500;
      font-size: 0.9em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .schedule-details {
      font-size: 0.8em;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }
    .schedule-countdown {
      font-size: 0.8em;
      color: var(--primary-color);
      font-weight: 500;
      margin-top: 3px;
    }
    .progress-track {
      height: 4px;
      background: var(--divider-color, #e0e0e0);
      border-radius: 2px;
      margin-top: 6px;
      overflow: hidden;
    }
    .progress-bar {
      height: 100%;
      background: var(--primary-color);
      border-radius: 2px;
      transition: width 1s linear;
    }
    .schedule-error {
      font-size: 0.8em;
      color: var(--error-color, #f44336);
      margin-top: 2px;
    }
    .schedule-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      flex-shrink: 0;
    }
    .status-badge {
      font-size: 0.72em;
      padding: 2px 8px;
      border-radius: 12px;
      color: #fff;
      white-space: nowrap;
      font-weight: 500;
    }
    .btn-cancel-item {
      padding: 4px 10px;
      background: transparent;
      border: 1px solid var(--error-color, #f44336);
      color: var(--error-color, #f44336);
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.78em;
      font-weight: 500;
      transition: background 0.15s, color 0.15s;
    }
    .btn-cancel-item:hover {
      background: var(--error-color, #f44336);
      color: #fff;
    }
    .idle-message {
      color: var(--secondary-text-color);
      font-size: 0.9em;
      font-style: italic;
      text-align: center;
      padding: 16px;
    }
    .history-section {
      margin-top: 12px;
    }
    .history-toggle {
      background: none;
      border: none;
      color: var(--primary-color);
      cursor: pointer;
      font-size: 0.85em;
      padding: 4px 0;
      font-weight: 500;
    }
    .history-toggle:hover {
      text-decoration: underline;
    }
    .history-list {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .history-item {
      font-size: 0.82em;
      padding: 8px 10px;
      border-radius: 6px;
      background: var(--secondary-background-color, #fafafa);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }
    .history-info {
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
      flex: 1;
    }
    .history-name {
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .history-meta {
      font-size: 0.82em;
      color: var(--secondary-text-color);
    }
    .history-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }
    .btn-restart {
      background: transparent;
      border: 1px solid var(--primary-color);
      color: var(--primary-color);
      border-radius: 6px;
      padding: 2px 8px;
      cursor: pointer;
      font-size: 1em;
      line-height: 1.4;
      transition: background 0.15s, color 0.15s;
    }
    .btn-restart:hover {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "once-timer-status-section": StatusSection;
  }
}
