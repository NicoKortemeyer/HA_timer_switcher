import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type {
  HomeAssistant,
  OnceTimerCardConfig,
  Preset,
  Schedule,
  TimerMode,
} from "./types.js";
import { cardStyles } from "./styles.js";
import {
  CARD_EDITOR_NAME,
  CARD_NAME,
  DEFAULT_ALLOWED_DOMAINS,
  DEFAULT_QUICK_DELAYS,
} from "./const.js";
import { cancelTimer, deletePreset, loadPreset, savePreset, startTimer } from "./utils/ha-api.js";
import { getFriendlyName } from "./utils/ha-helpers.js";
import { defaultRunAt, localDatetimeInputValue } from "./utils/time-helpers.js";
import { validateStartInput } from "./utils/validation.js";
import { t } from "./utils/i18n.js";

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
  @state() private _selectedAction = "turn_off";
  @state() private _mode: TimerMode = "delay";
  @state() private _delayMinutes = 30;
  @state() private _runAt = defaultRunAt();
  @state() private _loading = false;
  @state() private _error: string | null = null;
  @state() private _selectedPreset = "";
  @state() private _repeat = false;

  private get _lang(): string {
    return this.hass?.language ?? "en";
  }

  setConfig(config: OnceTimerCardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    this._config = config;
    // Apply default only when locked (entity is always fixed) or on first load (no selection yet)
    if (config.default_entity_id && (config.lock_target || !this._selectedEntityId)) {
      this._selectedEntityId = config.default_entity_id;
    }
  }

  static getConfigElement(): HTMLElement {
    return document.createElement(CARD_EDITOR_NAME);
  }

  static getStubConfig(): OnceTimerCardConfig {
    return {
      type: `custom:${CARD_NAME}`,
      title: "Once Timer",
      show_history: false,
      show_quick_delays: true,
      show_presets: true,
      show_cancel_all: true,
      show_progress_bar: true,
      allow_repeat: false,
    };
  }

  private _getTimerData(): { schedules: Schedule[]; history: Schedule[]; presets: Preset[] } {
    const merged: Record<string, unknown> = {};
    for (const entry of Object.values(this.hass.states)) {
      if (entry.entity_id.includes("once_timer")) {
        Object.assign(merged, entry.attributes);
      }
    }
    return {
      schedules: Array.isArray(merged["schedules"]) ? (merged["schedules"] as Schedule[]) : [],
      history: Array.isArray(merged["history"]) ? (merged["history"] as Schedule[]) : [],
      presets: Array.isArray(merged["presets"]) ? (merged["presets"] as Preset[]) : [],
    };
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
      this._error = `${err}`;
    } finally {
      this._loading = false;
    }
  }

  private async _handleCancelSchedule(scheduleId: string): Promise<void> {
    try {
      await cancelTimer(this.hass, scheduleId);
    } catch (err) {
      this._error = `${err}`;
    }
  }

  private async _handleCancelAll(): Promise<void> {
    const { schedules } = this._getTimerData();
    for (const s of schedules) {
      if (s.status === "scheduled" || s.status === "running") {
        await this._handleCancelSchedule(s.schedule_id);
      }
    }
  }

  private async _handleLoadPreset(): Promise<void> {
    if (!this._selectedPreset) return;
    try {
      await loadPreset(this.hass, this._selectedPreset);
      const preset = this._getTimerData().presets.find((p) => p.name === this._selectedPreset);
      if (preset) {
        this._selectedEntityId = preset.entity_id;
        this._selectedAction = preset.action;
        this._mode = preset.mode;
        if (preset.delay_minutes !== null) {
          this._delayMinutes = preset.delay_minutes;
        }
      }
    } catch (err) {
      this._error = `${err}`;
    }
  }

  private async _handleSavePreset(): Promise<void> {
    const name = prompt(t(this._lang, "save_preset"));
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
      this._error = `${err}`;
    }
  }

  private async _handleDeletePreset(): Promise<void> {
    if (!this._selectedPreset) return;
    try {
      await deletePreset(this.hass, this._selectedPreset);
      this._selectedPreset = "";
    } catch (err) {
      this._error = `${err}`;
    }
  }

  private async _handleRestartFromHistory(schedule: Schedule): Promise<void> {
    this._error = null;
    this._loading = true;
    try {
      const originalMs = new Date(schedule.run_at).getTime() - new Date(schedule.created_at).getTime();
      const delayMinutes = Math.max(1, Math.round(originalMs / 60000));
      await startTimer(this.hass, {
        entity_id: schedule.entity_id,
        action: schedule.action,
        mode: "delay",
        delay_minutes: delayMinutes,
      });
    } catch (err) {
      this._error = `${err}`;
    } finally {
      this._loading = false;
    }
  }

  render() {
    if (!this._config) return html``;

    const lang = this._lang;
    const { schedules, history, presets } = this._getTimerData();
    const allowedDomains = this._config.allowed_domains ?? DEFAULT_ALLOWED_DOMAINS;
    const showQuickDelays = this._config.show_quick_delays ?? true;
    const quickDelays = this._config.quick_delays ?? DEFAULT_QUICK_DELAYS;
    const showPresets = this._config.show_presets ?? true;
    const showCancelAll = this._config.show_cancel_all ?? true;
    const showProgressBar = this._config.show_progress_bar ?? true;
    const allowRepeat = false; // not yet implemented in backend
    const quickTargets = this._config.quick_targets ?? [];
    const showTargetSearch = this._config.show_target_search ?? true;
    const showTimeInput = this._config.show_time_input ?? true;
    const lockTarget = this._config.lock_target ?? false;
    const showStatus = this._config.show_status ?? true;
    const activeSchedules = schedules.filter(
      (s) => s.status === "scheduled" || s.status === "running"
    );

    return html`
      <ha-card>
        ${this._config.title
          ? html`
              <div class="card-header">
                ${this._config.title}
                ${!showStatus && activeSchedules.length > 0
                  ? html`<span class="active-badge">${activeSchedules.length}</span>`
                  : ""}
              </div>`
          : ""}

        <!-- Presets -->
        ${showPresets
          ? html`
              <div class="section">
                <div class="section-title">${t(lang, "presets")}</div>
                ${presets.length > 0
                  ? html`
                      <div class="preset-row">
                        <select
                          .value=${this._selectedPreset}
                          @change=${(e: Event) =>
                            (this._selectedPreset = (e.target as HTMLSelectElement).value)}
                        >
                          <option value="">${t(lang, "no_preset")}</option>
                          ${presets.map(
                            (p) => html`
                              <option value=${p.name} ?selected=${p.name === this._selectedPreset}>
                                ${p.is_favorite ? "★ " : ""}${p.name}
                              </option>
                            `
                          )}
                        </select>
                        <button class="btn-secondary" @click=${this._handleLoadPreset} type="button">
                          ${t(lang, "load")}
                        </button>
                        ${this._selectedPreset
                          ? html`
                              <button class="btn-delete-preset" @click=${this._handleDeletePreset} type="button"
                                title="${t(lang, "delete")}">✕</button>
                            `
                          : ""}
                      </div>
                    `
                  : html`<div class="empty-hint">${lang.startsWith("de") ? "Noch keine Vorlagen — wähle ein Ziel und speichere unten." : "No presets yet — select a target and save below."}</div>`}
              </div>
            `
          : ""}

        <!-- Target -->
        ${lockTarget && this._selectedEntityId
          ? html`
              <div class="section">
                <div class="locked-target-chip">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                  ${getFriendlyName(this.hass, this._selectedEntityId)}
                </div>
              </div>
            `
          : !lockTarget ? html`
        <div class="section">
          <div class="section-title">${t(lang, "target")}</div>
          <once-timer-target-section
            .hass=${this.hass}
            .selectedEntityId=${this._selectedEntityId}
            .allowedDomains=${allowedDomains}
            .quickTargets=${quickTargets}
            .showSearch=${showTargetSearch}
            .lang=${lang}
            @entity-changed=${(e: CustomEvent) => (this._selectedEntityId = e.detail)}
          ></once-timer-target-section>
        </div>` : ""}

        <!-- Action -->
        <div class="section">
          <div class="section-title">${t(lang, "action")}</div>
          <once-timer-action-section
            .selectedAction=${this._selectedAction}
            .entityId=${this._selectedEntityId}
            .lang=${lang}
            @action-changed=${(e: CustomEvent) => (this._selectedAction = e.detail)}
          ></once-timer-action-section>
        </div>

        <!-- Time -->
        ${showTimeInput || showQuickDelays ? html`
        <div class="section">
          <div class="section-title">${t(lang, "time")}</div>
          <once-timer-time-section
            .mode=${this._mode}
            .delayMinutes=${this._delayMinutes}
            .runAt=${this._runAt}
            .lang=${lang}
            .showQuickDelays=${showQuickDelays}
            .quickDelays=${quickDelays}
            .showTimeInput=${showTimeInput}
            @mode-changed=${(e: CustomEvent) => (this._mode = e.detail)}
            @delay-changed=${(e: CustomEvent) => (this._delayMinutes = e.detail)}
            @run-at-changed=${(e: CustomEvent) =>
              (this._runAt = localDatetimeInputValue(new Date(e.detail)))}
          ></once-timer-time-section>
        </div>` : ""}

        <!-- Controls -->
        <div class="section">
          <once-timer-control-section
            .loading=${this._loading}
            .disabled=${!this._selectedEntityId}
            .hasActive=${activeSchedules.length > 0}
            .showCancelAll=${showCancelAll}
            .allowRepeat=${allowRepeat}
            .repeat=${this._repeat}
            .lang=${lang}
            @start=${this._handleStart}
            @cancel-all=${this._handleCancelAll}
            @repeat-changed=${(e: CustomEvent) => (this._repeat = e.detail)}
          ></once-timer-control-section>

          ${this._error
            ? html`<div class="error-message">${this._error}</div>`
            : ""}
        </div>

        <!-- Save preset -->
        ${showPresets && this._selectedEntityId
          ? html`
              <div class="section">
                <button class="btn-secondary full-width" @click=${this._handleSavePreset} type="button">
                  ${t(lang, "save_preset")}
                </button>
              </div>
            `
          : ""}

        <!-- Status -->
        ${showStatus ? html`
        <div class="section">
          <div class="section-title">${t(lang, "status")}</div>
          <once-timer-status-section
            .hass=${this.hass}
            .schedules=${schedules}
            .history=${history}
            .showHistory=${this._config.show_history ?? false}
            .showProgressBar=${showProgressBar}
            .lang=${lang}
            @cancel-schedule=${(e: CustomEvent) => this._handleCancelSchedule(e.detail)}
            @restart-schedule=${(e: CustomEvent) => this._handleRestartFromHistory(e.detail)}
          ></once-timer-status-section>
        </div>` : ""}
      </ha-card>
    `;
  }

  static styles = cardStyles;
}

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
