import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, OnceTimerCardConfig } from "./types.js";
import { CARD_EDITOR_NAME } from "./const.js";

@customElement(CARD_EDITOR_NAME)
export class OnceTimerCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: OnceTimerCardConfig;

  setConfig(config: OnceTimerCardConfig): void {
    this._config = config;
  }

  private _valueChanged(field: keyof OnceTimerCardConfig, value: unknown): void {
    if (!this._config) return;
    const newConfig = { ...this._config, [field]: value };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this._config) return html``;

    return html`
      <div class="editor">
        <div class="field">
          <label>Title</label>
          <input
            type="text"
            .value=${this._config.title ?? ""}
            @input=${(e: Event) =>
              this._valueChanged("title", (e.target as HTMLInputElement).value)}
            placeholder="Once Timer"
          />
        </div>

        <div class="field">
          <label>Show history</label>
          <input
            type="checkbox"
            ?checked=${this._config.show_history ?? false}
            @change=${(e: Event) =>
              this._valueChanged(
                "show_history",
                (e.target as HTMLInputElement).checked
              )}
          />
        </div>
      </div>
    `;
  }

  static styles = css`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    label {
      font-size: 0.85em;
      color: var(--secondary-text-color);
      font-weight: 500;
    }
    input[type="text"] {
      padding: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 1em;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "once-timer-card-editor": OnceTimerCardEditor;
  }
}
