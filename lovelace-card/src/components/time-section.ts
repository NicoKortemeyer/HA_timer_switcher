import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { TimerMode } from "../types.js";

@customElement("once-timer-time-section")
export class TimeSection extends LitElement {
  @property() mode!: TimerMode;
  @property({ type: Number }) delayMinutes!: number;
  @property() runAt!: string;

  private _onModeChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value as TimerMode;
    this.dispatchEvent(
      new CustomEvent("mode-changed", { detail: value, bubbles: true, composed: true })
    );
  }

  private _onDelayChange(e: Event): void {
    const value = parseFloat((e.target as HTMLInputElement).value);
    this.dispatchEvent(
      new CustomEvent("delay-changed", { detail: value, bubbles: true, composed: true })
    );
  }

  private _onRunAtChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    // Convert local datetime-local value to ISO string
    const date = new Date(value);
    this.dispatchEvent(
      new CustomEvent("run-at-changed", {
        detail: date.toISOString(),
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="mode-toggle">
        <label>
          <input
            type="radio"
            name="mode"
            value="delay"
            ?checked=${this.mode === "delay"}
            @change=${this._onModeChange}
          />
          In X minutes
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="absolute_time"
            ?checked=${this.mode === "absolute_time"}
            @change=${this._onModeChange}
          />
          At exact time
        </label>
      </div>

      ${this.mode === "delay"
        ? html`
            <input
              type="number"
              min="0.1"
              max="10080"
              step="0.5"
              .value=${String(this.delayMinutes)}
              @input=${this._onDelayChange}
              placeholder="Minutes"
            />
          `
        : html`
            <input
              type="datetime-local"
              .value=${this.runAt}
              @input=${this._onRunAtChange}
            />
          `}
    `;
  }

  static styles = css`
    .mode-toggle {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;
    }
    .mode-toggle label {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      font-size: 0.95em;
    }
    input[type="number"],
    input[type="datetime-local"] {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 1em;
      box-sizing: border-box;
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
