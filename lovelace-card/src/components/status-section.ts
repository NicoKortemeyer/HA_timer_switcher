import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Schedule } from "../types.js";
import { STATUS_COLORS } from "../const.js";
import { formatAbsoluteTime, formatRemainingTime } from "../utils/time-helpers.js";

@customElement("once-timer-status-section")
export class StatusSection extends LitElement {
  @property({ type: Array }) schedules: Schedule[] = [];
  @property({ type: Array }) history: Schedule[] = [];
  @property({ type: Boolean }) showHistory = false;

  @state() private _tick = 0;
  @state() private _showHistory = false;

  private _interval?: ReturnType<typeof setInterval>;

  connectedCallback(): void {
    super.connectedCallback();
    this._interval = setInterval(() => {
      this._tick++;
    }, 10000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._interval) clearInterval(this._interval);
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

  private _renderStatusBadge(status: string) {
    const color = STATUS_COLORS[status] ?? "#9e9e9e";
    return html`
      <span class="status-badge" style="background:${color}">${status}</span>
    `;
  }

  private _renderScheduleItem(schedule: Schedule) {
    const isActive = schedule.status === "scheduled" || schedule.status === "running";
    return html`
      <div class="schedule-item">
        <div class="schedule-info">
          <div class="schedule-entity">${schedule.entity_id}</div>
          <div class="schedule-details">
            ${schedule.action} · ${formatAbsoluteTime(schedule.run_at)}
          </div>
          ${isActive
            ? html`<div class="schedule-countdown">
                ⏱ ${formatRemainingTime(schedule.run_at)}
              </div>`
            : ""}
          ${schedule.last_error
            ? html`<div class="schedule-error">⚠ ${schedule.last_error}</div>`
            : ""}
        </div>
        <div class="schedule-actions">
          ${this._renderStatusBadge(schedule.status)}
          ${isActive
            ? html`
                <button
                  class="btn-cancel-item"
                  @click=${() => this._cancelSchedule(schedule.schedule_id)}
                >
                  Cancel
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
        ? html`<div class="idle-message">No active timers</div>`
        : html`
            <div class="schedule-list">
              ${allVisible.map((s) => this._renderScheduleItem(s))}
            </div>
          `}

      ${this.showHistory && this.history.length > 0
        ? html`
            <div class="history-section">
              <button
                class="history-toggle"
                @click=${() => (this._showHistory = !this._showHistory)}
              >
                ${this._showHistory ? "▲ Hide" : "▼ Show"} history
                (${this.history.length})
              </button>
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
                              <span>${s.entity_id} · ${s.action}</span>
                              ${this._renderStatusBadge(s.status)}
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
      padding: 10px 12px;
      border-radius: 6px;
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
      font-size: 0.95em;
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
      margin-top: 2px;
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
      gap: 4px;
    }
    .status-badge {
      font-size: 0.75em;
      padding: 2px 8px;
      border-radius: 12px;
      color: #fff;
      white-space: nowrap;
      font-weight: 500;
    }
    .btn-cancel-item {
      padding: 4px 8px;
      background: transparent;
      border: 1px solid var(--error-color, #f44336);
      color: var(--error-color, #f44336);
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8em;
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
      padding: 12px;
    }
    .history-section {
      margin-top: 12px;
    }
    .history-toggle {
      background: none;
      border: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 0.85em;
      padding: 4px 0;
      text-decoration: underline;
    }
    .history-list {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .history-item {
      font-size: 0.8em;
      padding: 6px 10px;
      border-radius: 4px;
      background: var(--secondary-background-color, #fafafa);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "once-timer-status-section": StatusSection;
  }
}
