import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { t } from "../utils/i18n.js";

@customElement("once-timer-control-section")
export class ControlSection extends LitElement {
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) hasActive = false;
  @property({ type: Boolean }) showCancelAll = true;
  @property({ type: Boolean }) allowRepeat = false;
  @property({ type: Boolean }) repeat = false;
  @property() lang = "en";

  private _onStart(): void {
    this.dispatchEvent(new CustomEvent("start", { bubbles: true, composed: true }));
  }

  private _onCancelAll(): void {
    this.dispatchEvent(new CustomEvent("cancel-all", { bubbles: true, composed: true }));
  }

  private _onRepeatChange(e: Event): void {
    this.dispatchEvent(
      new CustomEvent("repeat-changed", {
        detail: (e.target as HTMLInputElement).checked,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      ${this.allowRepeat
        ? html`
            <label class="repeat-row">
              <input type="checkbox" ?checked=${this.repeat} @change=${this._onRepeatChange} />
              <span>${t(this.lang, "repeat")}</span>
            </label>
          `
        : ""}
      <div class="control-buttons">
        <button
          class="btn-start"
          ?disabled=${this.disabled || this.loading}
          @click=${this._onStart}
          type="button"
        >
          ${this.loading
            ? html`<span class="spinner"></span> ${t(this.lang, "scheduling")}`
            : t(this.lang, "start_timer")}
        </button>
        ${this.showCancelAll && this.hasActive
          ? html`
              <button
                class="btn-cancel-all"
                ?disabled=${this.loading}
                @click=${this._onCancelAll}
                type="button"
              >
                ${t(this.lang, "cancel_all")}
              </button>
            `
          : ""}
      </div>
    `;
  }

  static styles = css`
    .repeat-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.88em;
      color: var(--secondary-text-color);
      margin-bottom: 8px;
      cursor: pointer;
    }
    .control-buttons {
      display: flex;
      gap: 8px;
    }
    .btn-start {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 16px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border: none;
      border-radius: 8px;
      font-size: 0.95em;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.15s, filter 0.15s;
    }
    .btn-start:hover:not(:disabled) {
      filter: brightness(1.1);
    }
    .btn-start:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-cancel-all {
      padding: 12px 16px;
      background: transparent;
      color: var(--error-color, #f44336);
      border: 1.5px solid var(--error-color, #f44336);
      border-radius: 8px;
      font-size: 0.9em;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      white-space: nowrap;
    }
    .btn-cancel-all:hover:not(:disabled) {
      background: var(--error-color, #f44336);
      color: #fff;
    }
    .btn-cancel-all:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.4);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      flex-shrink: 0;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @media (max-width: 400px) {
      .control-buttons { flex-direction: column; }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "once-timer-control-section": ControlSection;
  }
}
