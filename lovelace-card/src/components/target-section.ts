import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { HomeAssistant } from "../types.js";

@customElement("once-timer-target-section")
export class TargetSection extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property() selectedEntityId!: string;
  @property({ type: Array }) allowedDomains!: string[];

  private get _filteredEntities(): string[] {
    return Object.keys(this.hass.states)
      .filter((id) => this.allowedDomains.some((d) => id.startsWith(d + ".")))
      .sort();
  }

  private _onChange(e: Event): void {
    const value = (e.target as HTMLSelectElement).value;
    this.dispatchEvent(
      new CustomEvent("entity-changed", { detail: value, bubbles: true, composed: true })
    );
  }

  render() {
    const entities = this._filteredEntities;
    return html`
      <select .value=${this.selectedEntityId} @change=${this._onChange}>
        <option value="" ?selected=${!this.selectedEntityId}>-- Select entity --</option>
        ${entities.map(
          (id) => html`
            <option value=${id} ?selected=${id === this.selectedEntityId}>${id}</option>
          `
        )}
      </select>
    `;
  }

  static styles = css`
    select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 1em;
      box-sizing: border-box;
    }
    select:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "once-timer-target-section": TargetSection;
  }
}
