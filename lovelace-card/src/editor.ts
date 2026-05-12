import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, OnceTimerCardConfig } from "./types.js";
import { CARD_EDITOR_NAME, DEFAULT_QUICK_DELAYS } from "./const.js";

@customElement(CARD_EDITOR_NAME)
export class OnceTimerCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: OnceTimerCardConfig;

  setConfig(config: OnceTimerCardConfig): void {
    this._config = config;
  }

  private _set<K extends keyof OnceTimerCardConfig>(field: K, value: OnceTimerCardConfig[K]): void {
    if (!this._config) return;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: { ...this._config, [field]: value } },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _toggle(field: keyof OnceTimerCardConfig, e: Event): void {
    this._set(field, (e.target as HTMLInputElement).checked as OnceTimerCardConfig[typeof field]);
  }

  private _parseDelays(raw: string): number[] {
    return raw
      .split(",")
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n) && n > 0);
  }

  private _renderToggle(
    label: string,
    desc: string,
    checked: boolean,
    onChange: (e: Event) => void,
    indent = false
  ) {
    return html`
      <div class="toggle-row ${indent ? "indent" : ""}">
        <div class="toggle-label">
          <span>${label}</span>
          <span class="toggle-desc">${desc}</span>
        </div>
        <label class="switch">
          <input type="checkbox" ?checked=${checked} @change=${onChange} />
          <span class="slider"></span>
        </label>
      </div>
    `;
  }

  render() {
    if (!this._config) return html``;
    const c = this._config;
    const quickDelays = (c.quick_delays ?? DEFAULT_QUICK_DELAYS).join(", ");
    const lockTarget = c.lock_target ?? false;
    const showQuickDelays = c.show_quick_delays ?? true;
    const showStatus = c.show_status ?? true;
    const quickTargets = c.quick_targets ?? [];

    return html`
      <div class="editor">

        <!-- ── GENERAL ── -->
        <div class="section-label">General</div>
        <div class="field">
          <label>Title</label>
          <input
            type="text"
            .value=${c.title ?? ""}
            @input=${(e: Event) => this._set("title", (e.target as HTMLInputElement).value)}
            placeholder="Once Timer"
          />
        </div>

        <!-- ── TARGET ── -->
        <div class="divider"></div>
        <div class="section-label">Target</div>

        <div class="field">
          <label>Default entity</label>
          <div class="entity-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{ entity: {} }}
              .value=${c.default_entity_id ?? ""}
              @value-changed=${(e: CustomEvent) =>
                this._set("default_entity_id", e.detail.value || undefined)}
            ></ha-selector>
            ${c.default_entity_id
              ? html`
                  <button
                    class="btn-remove"
                    type="button"
                    @click=${() => this._set("default_entity_id", undefined)}
                  >✕</button>
                `
              : ""}
          </div>
          <span class="field-hint">Pre-selects this entity when the card loads.</span>
        </div>

        ${this._renderToggle(
          "Lock target",
          "Hide the target section — entity is fixed",
          lockTarget,
          (e) => this._toggle("lock_target", e)
        )}

        ${!lockTarget ? html`
          ${this._renderToggle(
            "Show entity search",
            "Hide when only using quick targets",
            c.show_target_search ?? true,
            (e) => this._toggle("show_target_search", e),
            true
          )}

          <div class="field indent">
            <label>Quick targets</label>
            ${quickTargets.length > 0 ? html`
              <div class="target-chips">
                ${quickTargets.map(
                  (id, i) => html`
                    <div class="target-chip">
                      <span class="target-chip-name">${
                        String(this.hass?.states[id]?.attributes["friendly_name"] ?? id)
                      }</span>
                      <button
                        class="target-chip-remove"
                        type="button"
                        @click=${() => {
                          const updated = [...quickTargets];
                          updated.splice(i, 1);
                          this._set("quick_targets", updated);
                        }}
                      >✕</button>
                    </div>
                  `
                )}
              </div>
            ` : ""}
            <ha-selector
              .hass=${this.hass}
              .selector=${{ entity: {} }}
              .value=${""}
              @value-changed=${(e: CustomEvent) => {
                if (!e.detail.value) return;
                this._set("quick_targets", [...quickTargets, e.detail.value]);
              }}
            ></ha-selector>
            <span class="field-hint">One-click buttons above the entity search.</span>
          </div>
        ` : ""}

        <!-- ── TIME ── -->
        <div class="divider"></div>
        <div class="section-label">Time</div>

        ${this._renderToggle(
          "Quick delay buttons",
          "One-click shortcuts: 30 min, 1h, …",
          showQuickDelays,
          (e) => this._toggle("show_quick_delays", e)
        )}

        ${showQuickDelays ? html`
          <div class="field indent">
            <label>Delay values (minutes, comma-separated)</label>
            <input
              type="text"
              .value=${quickDelays}
              placeholder="15, 30, 60, 120"
              @change=${(e: Event) =>
                this._set("quick_delays", this._parseDelays((e.target as HTMLInputElement).value))}
            />
          </div>
        ` : ""}

        ${this._renderToggle(
          "Show time input",
          "Hide when only using quick delay buttons",
          c.show_time_input ?? true,
          (e) => this._toggle("show_time_input", e)
        )}

        <!-- ── ACTIONS ── -->
        <div class="divider"></div>
        <div class="section-label">Actions</div>

        ${this._renderToggle(
          "Show presets",
          "Load and save timer configurations",
          c.show_presets ?? true,
          (e) => this._toggle("show_presets", e)
        )}

        ${this._renderToggle(
          "Show \"Cancel all\" button",
          "Appears when one or more timers are active",
          c.show_cancel_all ?? true,
          (e) => this._toggle("show_cancel_all", e)
        )}

        <!-- ── STATUS ── -->
        <div class="divider"></div>
        <div class="section-label">Status</div>

        ${this._renderToggle(
          "Show progress bar",
          "Visual countdown on active timers",
          c.show_progress_bar ?? true,
          (e) => this._toggle("show_progress_bar", e)
        )}

        ${this._renderToggle(
          "Show status section",
          "Active timers list — badge in title shows count when hidden",
          showStatus,
          (e) => this._toggle("show_status", e)
        )}

        ${showStatus ? html`
          ${this._renderToggle(
            "Show history",
            "List of past timer executions",
            c.show_history ?? false,
            (e) => this._toggle("show_history", e),
            true
          )}
        ` : ""}

      </div>
    `;
  }

  static styles = css`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 8px 0;
    }
    .section-label {
      font-size: 0.72em;
      font-weight: 700;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 8px 0 4px;
    }
    .divider {
      height: 1px;
      background: var(--divider-color, #e0e0e0);
      margin: 10px 0 2px;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 4px 0;
    }
    .field.indent,
    .toggle-row.indent {
      padding-left: 14px;
      border-left: 2px solid var(--divider-color, #e0e0e0);
      margin-left: 2px;
    }
    label {
      font-size: 0.82em;
      color: var(--secondary-text-color);
      font-weight: 500;
    }
    input[type="text"] {
      padding: 8px 10px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 0.95em;
    }
    input[type="text"]:focus {
      outline: none;
      border-color: var(--primary-color);
    }
    .field-hint {
      font-size: 0.76em;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }
    .entity-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .entity-row ha-selector {
      flex: 1;
      min-width: 0;
    }
    .btn-remove {
      background: transparent;
      border: 1px solid var(--error-color, #f44336);
      color: var(--error-color, #f44336);
      border-radius: 6px;
      padding: 4px 8px;
      cursor: pointer;
      font-size: 0.8em;
      flex-shrink: 0;
      transition: background 0.15s, color 0.15s;
    }
    .btn-remove:hover {
      background: var(--error-color, #f44336);
      color: #fff;
    }
    .target-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 8px;
    }
    .target-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px 4px 12px;
      border-radius: 16px;
      background: var(--secondary-background-color, #f5f5f5);
      border: 1px solid var(--divider-color, #e0e0e0);
      font-size: 0.85em;
    }
    .target-chip-name {
      color: var(--primary-text-color);
      font-weight: 500;
      white-space: nowrap;
      max-width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .target-chip-remove {
      background: transparent;
      border: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 0.85em;
      padding: 0;
      line-height: 1;
      flex-shrink: 0;
      transition: color 0.15s;
    }
    .target-chip-remove:hover {
      color: var(--error-color, #f44336);
    }
    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      gap: 12px;
    }
    .toggle-label {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
    }
    .toggle-label span:first-child {
      font-size: 0.9em;
      color: var(--primary-text-color);
    }
    .toggle-desc {
      font-size: 0.78em;
      color: var(--secondary-text-color);
    }
    .switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 22px;
      flex-shrink: 0;
    }
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .slider {
      position: absolute;
      inset: 0;
      background: var(--divider-color, #ccc);
      border-radius: 22px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .slider::before {
      content: "";
      position: absolute;
      width: 16px;
      height: 16px;
      left: 3px;
      top: 3px;
      background: white;
      border-radius: 50%;
      transition: transform 0.2s;
    }
    .switch input:checked + .slider {
      background: var(--primary-color);
    }
    .switch input:checked + .slider::before {
      transform: translateX(18px);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "once-timer-card-editor": OnceTimerCardEditor;
  }
}
