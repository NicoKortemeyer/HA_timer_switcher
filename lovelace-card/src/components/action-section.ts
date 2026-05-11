import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { TimerAction } from "../types.js";

@customElement("once-timer-action-section")
export class ActionSection extends LitElement {
  @property() selectedAction!: TimerAction;

  private _select(action: TimerAction): void {
    this.dispatchEvent(
      new CustomEvent("action-changed", { detail: action, bubbles: true, composed: true })
    );
  }

  render() {
    return html`
      <div class="action-toggle">
        <button
          class=${this.selectedAction === "turn_on" ? "active" : ""}
          @click=${() => this._select("turn_on")}
        >
          Turn On
        </button>
        <button
          class=${this.selectedAction === "turn_off" ? "active" : ""}
          @click=${() => this._select("turn_off")}
        >
          Turn Off
        </button>
      </div>
    `;
  }

  static styles = css`
    .action-toggle {
      display: flex;
      gap: 8px;
    }
    .action-toggle button {
      flex: 1;
      padding: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.95em;
      transition: background 0.2s, color 0.2s;
    }
    .action-toggle button.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "once-timer-action-section": ActionSection;
  }
}
