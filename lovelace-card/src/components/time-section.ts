import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { TimerMode } from "../types.js";
import { DEFAULT_QUICK_DELAYS } from "../const.js";
import { t } from "../utils/i18n.js";

@customElement("once-timer-time-section")
export class TimeSection extends LitElement {
  @property() mode!: TimerMode;
  @property({ type: Number }) delayMinutes!: number;
  @property() runAt!: string;
  @property() lang = "en";
  @property({ type: Boolean }) showQuickDelays = true;
  @property({ type: Array }) quickDelays: number[] = DEFAULT_QUICK_DELAYS;
  @property({ type: Boolean }) showTimeInput = true;

  private _emit(event: string, detail: unknown): void {
    this.dispatchEvent(new CustomEvent(event, { detail, bubbles: true, composed: true }));
  }

  private _onModeChange(e: Event): void {
    this._emit("mode-changed", (e.target as HTMLInputElement).value as TimerMode);
  }

  private _onDelayChange(e: Event): void {
    this._emit("delay-changed", parseFloat((e.target as HTMLInputElement).value));
  }

  private _onRunAtChange(e: Event): void {
    this._emit("run-at-changed", new Date((e.target as HTMLInputElement).value).toISOString());
  }

  private _formatQuickLabel(minutes: number): string {
    if (minutes < 60) return `${minutes} ${t(this.lang, "minutes")}`;
    const h = minutes / 60;
    return h === Math.floor(h) ? `${h}h` : `${h.toFixed(1)}h`;
  }

  render() {
    return html`
      ${this.showTimeInput ? html`
        <div class="mode-toggle">
          <label class="mode-label ${this.mode === "delay" ? "active" : ""}">
            <input type="radio" name="mode" value="delay"
              ?checked=${this.mode === "delay"} @change=${this._onModeChange} />
            ${t(this.lang, "in_minutes")}
          </label>
          <label class="mode-label ${this.mode === "absolute_time" ? "active" : ""}">
            <input type="radio" name="mode" value="absolute_time"
              ?checked=${this.mode === "absolute_time"} @change=${this._onModeChange} />
            ${t(this.lang, "at_time")}
          </label>
        </div>
      ` : ""}

      ${this.mode === "delay" || !this.showTimeInput
        ? html`
            ${this.showQuickDelays && this.quickDelays.length > 0
              ? html`
                  <div class="quick-delays">
                    ${this.quickDelays.map(
                      (m) => html`
                        <button
                          type="button"
                          class="quick-chip ${this.delayMinutes === m ? "active" : ""}"
                          @click=${() => this._emit("delay-changed", m)}
                        >
                          ${this._formatQuickLabel(m)}
                        </button>
                      `
                    )}
                  </div>
                `
              : ""}
            ${this.showTimeInput ? html`
              <div class="input-row">
                <input
                  type="number" min="0.1" max="10080" step="0.5"
                  .value=${String(this.delayMinutes)}
                  @input=${this._onDelayChange}
                  placeholder="${t(this.lang, "minutes")}"
                />
                <span class="unit">${t(this.lang, "minutes")}</span>
              </div>
            ` : ""}
          `
        : html`
            <input type="datetime-local" .value=${this.runAt} @input=${this._onRunAtChange} />
          `}
    `;
  }

  static styles = css`
    .mode-toggle {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
    }
    .mode-label {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      font-size: 0.9em;
      padding: 6px 12px;
      border: 1.5px solid var(--divider-color, #e0e0e0);
      border-radius: 20px;
      transition: border-color 0.15s, background 0.15s;
    }
    .mode-label.active {
      border-color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 8%, transparent);
      color: var(--primary-color);
      font-weight: 500;
    }
    .mode-label input[type="radio"] {
      display: none;
    }
    .quick-delays {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 10px;
    }
    .quick-chip {
      padding: 5px 12px;
      border: 1.5px solid var(--divider-color, #e0e0e0);
      border-radius: 16px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.82em;
      font-weight: 500;
      transition: border-color 0.15s, background 0.15s, color 0.15s;
      white-space: nowrap;
    }
    .quick-chip:hover {
      border-color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 8%, transparent);
    }
    .quick-chip.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .input-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .unit {
      font-size: 0.9em;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    input[type="number"],
    input[type="datetime-local"] {
      flex: 1;
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 0.95em;
      box-sizing: border-box;
      transition: border-color 0.15s;
    }
    input:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "once-timer-time-section": TimeSection;
  }
}
