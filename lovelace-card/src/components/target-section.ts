import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../types.js";
import { getFriendlyName } from "../utils/ha-helpers.js";
import { t } from "../utils/i18n.js";

interface EntityOption {
  entity_id: string;
  friendly_name: string;
}

@customElement("once-timer-target-section")
export class TargetSection extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property() selectedEntityId = "";
  @property({ type: Array }) allowedDomains!: string[];
  @property({ type: Array }) quickTargets: string[] = [];
  @property({ type: Boolean }) showSearch = true;
  @property() lang = "en";

  @state() private _open = false;
  @state() private _search = "";

  private _clickOutside = (e: Event) => {
    if (!e.composedPath().includes(this)) {
      this._open = false;
      this._search = "";
    }
  };

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("click", this._clickOutside);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("click", this._clickOutside);
  }

  private get _entities(): EntityOption[] {
    return Object.values(this.hass.states)
      .filter((e) => this.allowedDomains.some((d) => e.entity_id.startsWith(d + ".")))
      .map((e) => ({
        entity_id: e.entity_id,
        friendly_name: String(e.attributes["friendly_name"] ?? e.entity_id),
      }))
      .sort((a, b) => a.friendly_name.localeCompare(b.friendly_name));
  }

  private _select(entityId: string): void {
    this._open = false;
    this._search = "";
    this.dispatchEvent(
      new CustomEvent("entity-changed", { detail: entityId, bubbles: true, composed: true })
    );
  }

  private _toggleOpen(): void {
    this._open = !this._open;
    if (this._open) {
      this.updateComplete.then(() => {
        this.shadowRoot?.querySelector<HTMLInputElement>(".search-input")?.focus();
      });
    } else {
      this._search = "";
    }
  }

  render() {
    const entities = this._entities;
    const selected = entities.find((e) => e.entity_id === this.selectedEntityId);
    const q = this._search.toLowerCase();
    const filtered = q
      ? entities.filter(
          (e) => e.friendly_name.toLowerCase().includes(q) || e.entity_id.toLowerCase().includes(q)
        )
      : entities;

    return html`
      ${this.quickTargets.length > 0
        ? html`
            <div class="quick-targets">
              ${this.quickTargets.map(
                (id) => html`
                  <button
                    type="button"
                    class="quick-chip ${this.selectedEntityId === id ? "active" : ""}"
                    @click=${() => this._select(id)}
                  >
                    ${getFriendlyName(this.hass, id)}
                  </button>
                `
              )}
            </div>
          `
        : ""}
      ${this.showSearch ? html`<div class="combobox">
        <button
          class="trigger ${this._open ? "open" : ""}"
          @click=${this._toggleOpen}
          type="button"
        >
          <span class="trigger-content">
            ${selected
              ? html`
                  <span class="selected-name">${selected.friendly_name}</span>
                  <span class="selected-id">${selected.entity_id}</span>
                `
              : html`<span class="placeholder">${t(this.lang, "no_entity")}</span>`}
          </span>
          <svg class="chevron ${this._open ? "up" : ""}" viewBox="0 0 24 24" width="18" height="18">
            <path d="M7 10l5 5 5-5z" fill="currentColor"/>
          </svg>
        </button>

        ${this._open
          ? html`
              <div class="dropdown">
                <div class="search-wrapper">
                  <svg viewBox="0 0 24 24" width="16" height="16" class="search-icon">
                    <path
                      d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                      fill="currentColor"
                    />
                  </svg>
                  <input
                    class="search-input"
                    type="text"
                    placeholder="${t(this.lang, "search")}"
                    .value=${this._search}
                    @input=${(e: Event) =>
                      (this._search = (e.target as HTMLInputElement).value)}
                    @click=${(e: Event) => e.stopPropagation()}
                  />
                </div>
                <div class="options">
                  ${filtered.length === 0
                    ? html`<div class="no-results">—</div>`
                    : filtered.map(
                        (entity) => html`
                          <div
                            class="option ${entity.entity_id === this.selectedEntityId
                              ? "selected"
                              : ""}"
                            @click=${() => this._select(entity.entity_id)}
                          >
                            <span class="option-name">${entity.friendly_name}</span>
                            <span class="option-id">${entity.entity_id}</span>
                          </div>
                        `
                      )}
                </div>
              </div>
            `
          : ""}
      </div>` : ""}
    `;
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
    }
    .quick-targets {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 8px;
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
      max-width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
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
    .combobox {
      position: relative;
    }
    .trigger {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.95em;
      text-align: left;
      transition: border-color 0.15s;
      box-sizing: border-box;
      gap: 8px;
    }
    .trigger:hover,
    .trigger.open {
      border-color: var(--primary-color);
    }
    .trigger-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    .selected-name {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .selected-id {
      font-size: 0.78em;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .placeholder {
      color: var(--secondary-text-color);
    }
    .chevron {
      flex-shrink: 0;
      color: var(--secondary-text-color);
      transition: transform 0.15s;
    }
    .chevron.up {
      transform: rotate(180deg);
    }
    .dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      z-index: 100;
      overflow: hidden;
    }
    .search-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    .search-icon {
      flex-shrink: 0;
      color: var(--secondary-text-color);
    }
    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--primary-text-color);
      font-size: 0.95em;
      outline: none;
    }
    .search-input::placeholder {
      color: var(--secondary-text-color);
    }
    .options {
      max-height: 220px;
      overflow-y: auto;
    }
    .option {
      padding: 10px 12px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 1px;
      transition: background 0.1s;
    }
    .option:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .option.selected {
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }
    .option-name {
      font-weight: 500;
      font-size: 0.9em;
    }
    .option-id {
      font-size: 0.75em;
      color: var(--secondary-text-color);
    }
    .no-results {
      padding: 12px;
      text-align: center;
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "once-timer-target-section": TargetSection;
  }
}
