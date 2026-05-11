import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("once-timer-control-section")
export class ControlSection extends LitElement {
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) hasActive = false;

  private _onStart(): void {
    this.dispatchEvent(new CustomEvent("start", { bubbles: true, composed: true }));
  }

  private _onCancelAll(): void {
    this.dispatchEvent(new CustomEvent("cancel-all", { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="control-buttons">
        <button
          class="btn-start"
          ?disabled=${this.disabled || this.loading}
          @click=${this._onStart}
        >
          ${this.loading ? "Scheduling…" : "▶ Start Timer"}
        </button>
        <button
          class="btn-cancel-all"
          ?disabled=${!this.hasActive || this.loading}
          @click=${this._onCancelAll}
        >
          Cancel All
        </button>
      </div>
    `;
  }

  static styles = css`
    .control-buttons {
      display: flex;
      gap: 8px;
    }
    .btn-start {
      flex: 2;
      padding: 10px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border: none;
      border-radius: 4px;
      font-size: 1em;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn-start:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-cancel-all {
      flex: 1;
      padding: 10px;
      background: var(--error-color, #f44336);
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 0.9em;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn-cancel-all:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    @media (max-width: 400px) {
      .control-buttons {
        flex-direction: column;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "once-timer-control-section": ControlSection;
  }
}
