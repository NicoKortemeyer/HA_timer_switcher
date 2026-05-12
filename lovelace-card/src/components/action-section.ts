import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { getServicesForEntity } from "../utils/domain-services.js";
import { t } from "../utils/i18n.js";

@customElement("once-timer-action-section")
export class ActionSection extends LitElement {
  @property() selectedAction = "turn_off";
  @property() entityId = "";
  @property() lang = "en";

  private _select(action: string): void {
    this.dispatchEvent(
      new CustomEvent("action-changed", { detail: action, bubbles: true, composed: true })
    );
  }

  render() {
    const services = getServicesForEntity(this.entityId);

    // If currently selected action is not in the list for this entity, auto-select first
    if (services.length > 0 && !services.includes(this.selectedAction)) {
      // dispatch asynchronously to avoid updating parent during render
      Promise.resolve().then(() => this._select(services[0]!));
    }

    return html`
      <div class="chips">
        ${services.map(
          (svc) => html`
            <button
              class="chip ${this.selectedAction === svc ? "active" : ""}"
              @click=${() => this._select(svc)}
              type="button"
            >
              ${t(this.lang, svc as Parameters<typeof t>[1]) ?? svc}
            </button>
          `
        )}
      </div>
    `;
  }

  static styles = css`
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .chip {
      padding: 6px 14px;
      border: 1.5px solid var(--divider-color, #e0e0e0);
      border-radius: 20px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.875em;
      font-weight: 500;
      transition: border-color 0.15s, background 0.15s, color 0.15s;
      white-space: nowrap;
    }
    .chip:hover {
      border-color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 8%, transparent);
    }
    .chip.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "once-timer-action-section": ActionSection;
  }
}
