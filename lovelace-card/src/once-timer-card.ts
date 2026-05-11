import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type {
  HomeAssistant,
  OnceTimerCardConfig,
  Preset,
  Schedule,
  TimerAction,
  TimerMode,
} from "./types.js";
import { cardStyles } from "./styles.js";
import {
  CARD_EDITOR_NAME,
  CARD_NAME,
  DEFAULT_ALLOWED_DOMAINS,
} from "./const.js";
import { cancelTimer, loadPreset, savePreset, startTimer } from "./utils/ha-api.js";
import { defaultRunAt, localDatetimeInputValue } from "./utils/time-helpers.js";
import { validateStartInput } from "./utils/validation.js";

import "./components/target-section.js";
import "./components/action-section.js";
import "./components/time-section.js";
import "./components/control-section.js";
import "./components/status-section.js";
import "./editor.js";

@customElement(CARD_NAME)
export class OnceTimerCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config!: OnceTimerCardConfig;
  @state() private _selectedEntityId = "";
  @state() private _selectedAction: TimerAction = "turn_off";
  @state() private _mode: TimerMode = "delay";
  @state() private _delayMinutes = 30;
  @state() private _runAt = defaultRunAt();
  @state() private _loading = false;
  @state() private _error: string | null = null;
  @state() private _selectedPreset = "";

  setConfig(config: OnceTimerCardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    this._config = config;
  }

  static getConfigElement(): HTMLElement {
    return document.createElement(CARD_EDITOR_NAME);
  }

  static getStubConfig(): OnceTimerCardConfig {
    return { type: `custom:${CARD_NAME}`, title: "Once Timer", show_history: true };
  }

  private _getSchedules(): Schedule[] {
    // The NextRunSensor exposes all schedules in its attributes
    const entry = Object.values(this.hass.states).find(
      (e) => e.entity_id.startsWith("sensor.") && e.entity_id.endsWith("_next_run")
    );
    const schedules = entry?.attributes?.["schedules"];
    return Array.isArray(schedules) ? (schedules as Schedule[]) : [];
  }

  private _getHistory(): Schedule[] {
    const entry = Object.values(this.hass.states).find(
      (e) => e.entity_id.startsWith("sensor.") && e.entity_id.endsWith("_state")
    );
    const history = entry?.attributes?.["history"];
    return Array.isArray(history) ? (history as Schedule[]) : [];
  }

  private _getPresets(): Preset[] {
    const entry = Object.values(this.hass.states).find(
      (e) => e.entity_id.startsWith("sensor.") && e.entity_id.endsWith("_state")
    );
    const presets = entry?.attributes?.["presets"];
    return Array.isArray(presets) ? (presets as Preset[]) : [];
  }

  private async _handleStart(): Promise<void> {
    this._error = null;

    const validationError = validateStartInput({
      entityId: this._selectedEntityId,
      action: this._selectedAction,
      mode: this._mode,
      delayMinutes: this._delayMinutes,
      runAt: this._runAt,
    });

    if (validationError) {
      this._error = validationError;
      return;
    }

    this._loading = true;
    try {
      await startTimer(this.hass, {
        entity_id: this._selectedEntityId,
        action: this._selectedAction,
        mode: this._mode,
        ...(this._mode === "delay"
          ? { delay_minutes: this._delayMinutes }
          : { run_at: new Date(this._runAt).toISOString() }),
      });
    } catch (err) {
      this._error = `Failed to start timer: ${err}`;
    } finally {
      this._loading = false;
    }
  }

  private async _handleCancelSchedule(scheduleId: string): Promise<void> {
    try {
      await cancelTimer(this.hass, scheduleId);
    } catch (err) {
      this._error = `Failed to cancel: ${err}`;
    }
  }

  private async _handleCancelAll(): Promise<void> {
    const activeSchedules = this._getSchedules().filter(
      (s) => s.status === "scheduled" || s.status === "running"
    );
    for (const s of activeSchedules) {
      await this._handleCancelSchedule(s.schedule_id);
    }
  }

  private async _handleLoadPreset(): Promise<void> {
    if (!this._selectedPreset) return;
    try {
      await loadPreset(this.hass, this._selectedPreset);
      const presets = this._getPresets();
      const preset = presets.find((p) => p.name === this._selectedPreset);
      if (preset) {
        this._selectedEntityId = preset.entity_id;
        this._selectedAction = preset.action;
        this._mode = preset.mode;
        if (preset.delay_minutes !== null) {
          this._delayMinutes = preset.delay_minutes;
        }
      }
    } catch (err) {
      this._error = `Failed to load preset: ${err}`;
    }
  }

  private async _handleSavePreset(): Promise<void> {
    const name = prompt("Preset name:");
    if (!name) return;
    try {
      await savePreset(this.hass, {
        name,
        entity_id: this._selectedEntityId,
        action: this._selectedAction,
        mode: this._mode,
        ...(this._mode === "delay" ? { delay_minutes: this._delayMinutes } : {}),
      });
    } catch (err) {
      this._error = `Failed to save preset: ${err}`;
    }
  }

  render() {
    if (!this._config) return html``;

    const schedules = this._getSchedules();
    const history = this._getHistory();
    const presets = this._getPresets();
    const allowedDomains = this._config.allowed_domains ?? DEFAULT_ALLOWED_DOMAINS;
    const activeSchedules = schedules.filter(
      (s) => s.status === "scheduled" || s.status === "running"
    );

    return html`
      <ha-card>
        ${this._config.title
          ? html`<div class="card-header">${this._config.title}</div>`
          : ""}

        <!-- Presets -->
        ${presets.length > 0
          ? html`
              <div class="section">
                <div class="section-title">Presets</div>
                <div class="preset-section">
                  <select
                    .value=${this._selectedPreset}
                    @change=${(e: Event) =>
                      (this._selectedPreset = (e.target as HTMLSelectElement).value)}
                  >
                    <option value="">-- Select preset --</option>
                    ${presets.map(
                      (p) => html`
                        <option value=${p.name} ?selected=${p.name === this._selectedPreset}>
                          ${p.is_favorite ? "★ " : ""}${p.name}
                        </option>
                      `
                    )}
                  </select>
                  <button class="btn-load-preset" @click=${this._handleLoadPreset}>
                    Load
                  </button>
                </div>
              </div>
            `
          : ""}

        <!-- Section 1: Target -->
        <div class="section">
          <div class="section-title">Target</div>
          <once-timer-target-section
            .hass=${this.hass}
            .selectedEntityId=${this._selectedEntityId}
            .allowedDomains=${allowedDomains}
            @entity-changed=${(e: CustomEvent) =>
              (this._selectedEntityId = e.detail)}
          ></once-timer-target-section>
        </div>

        <!-- Section 2: Action -->
        <div class="section">
          <div class="section-title">Action</div>
          <once-timer-action-section
            .selectedAction=${this._selectedAction}
            @action-changed=${(e: CustomEvent) =>
              (this._selectedAction = e.detail)}
          ></once-timer-action-section>
        </div>

        <!-- Section 3: Time -->
        <div class="section">
          <div class="section-title">Time</div>
          <once-timer-time-section
            .mode=${this._mode}
            .delayMinutes=${this._delayMinutes}
            .runAt=${this._runAt}
            @mode-changed=${(e: CustomEvent) => (this._mode = e.detail)}
            @delay-changed=${(e: CustomEvent) => (this._delayMinutes = e.detail)}
            @run-at-changed=${(e: CustomEvent) => (this._runAt = localDatetimeInputValue(new Date(e.detail)))}
          ></once-timer-time-section>
        </div>

        <!-- Section 4: Controls -->
        <div class="section">
          <once-timer-control-section
            .loading=${this._loading}
            .disabled=${!this._selectedEntityId}
            .hasActive=${activeSchedules.length > 0}
            @start=${this._handleStart}
            @cancel-all=${this._handleCancelAll}
          ></once-timer-control-section>

          ${this._error
            ? html`<div class="error-message">⚠ ${this._error}</div>`
            : ""}
        </div>

        <!-- Save as Preset -->
        ${this._selectedEntityId
          ? html`
              <div class="section">
                <button class="btn-load-preset" @click=${this._handleSavePreset}>
                  💾 Save as Preset
                </button>
              </div>
            `
          : ""}

        <!-- Section 5: Status -->
        <div class="section">
          <div class="section-title">Status</div>
          <once-timer-status-section
            .schedules=${schedules}
            .history=${history}
            .showHistory=${this._config.show_history ?? false}
            @cancel-schedule=${(e: CustomEvent) =>
              this._handleCancelSchedule(e.detail)}
          ></once-timer-status-section>
        </div>
      </ha-card>
    `;
  }

  static styles = cardStyles;
}

// Register in HA card picker
declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }
  interface HTMLElementTagNameMap {
    "once-timer-card": OnceTimerCard;
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: CARD_NAME,
  name: "Once Timer",
  description: "Schedule a one-shot action on any Home Assistant entity.",
  preview: true,
});
