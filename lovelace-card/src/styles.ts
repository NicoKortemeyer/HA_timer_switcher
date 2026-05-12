import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
  }

  ha-card {
    padding: 16px 16px 12px;
  }

  /* ── Header ── */
  .card-header {
    font-size: 1.1em;
    font-weight: 500;
    color: var(--primary-text-color);
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--divider-color, #e0e0e0);
  }

  .active-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 10px;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    font-size: 0.7em;
    font-weight: 700;
    line-height: 1;
  }

  /* ── Sections ── */
  .section {
    margin-bottom: 16px;
  }

  .section:last-child {
    margin-bottom: 0;
  }

  .section-title {
    font-size: 0.72em;
    font-weight: 700;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
  }

  /* ── Locked target chip ── */
  .locked-target-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 20px;
    background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    color: var(--primary-color);
    font-size: 0.88em;
    font-weight: 500;
    border: 1.5px solid color-mix(in srgb, var(--primary-color) 30%, transparent);
  }

  /* ── Presets ── */
  .preset-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .preset-row select {
    flex: 1;
    padding: 9px 12px;
    border: 1px solid var(--divider-color, #e0e0e0);
    border-radius: 8px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    font-size: 0.95em;
    box-sizing: border-box;
    transition: border-color 0.15s;
    cursor: pointer;
  }

  .preset-row select:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .empty-hint {
    font-size: 0.82em;
    color: var(--secondary-text-color);
    font-style: italic;
    padding: 4px 0;
  }

  /* ── Buttons ── */
  .btn-secondary {
    padding: 9px 14px;
    background: transparent;
    border: 1.5px solid var(--divider-color, #e0e0e0);
    border-radius: 8px;
    color: var(--primary-text-color);
    font-size: 0.9em;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: border-color 0.15s, background 0.15s;
  }

  .btn-secondary:hover {
    border-color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 6%, transparent);
  }

  .btn-secondary.full-width {
    width: 100%;
    text-align: center;
  }

  .btn-delete-preset {
    padding: 6px 10px;
    background: transparent;
    border: 1px solid var(--error-color, #f44336);
    color: var(--error-color, #f44336);
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85em;
    transition: background 0.15s, color 0.15s;
    flex-shrink: 0;
  }

  .btn-delete-preset:hover {
    background: var(--error-color, #f44336);
    color: #fff;
  }

  /* ── Error message ── */
  .error-message {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    color: var(--error-color, #f44336);
    font-size: 0.85em;
    padding: 10px 12px;
    background: color-mix(in srgb, var(--error-color, #f44336) 10%, transparent);
    border-radius: 8px;
  }

  @media (max-width: 400px) {
    ha-card {
      padding: 12px 12px 8px;
    }
  }
`;
