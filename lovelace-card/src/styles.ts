import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
  }

  ha-card {
    padding: 16px;
  }

  .card-header {
    font-size: 1.2em;
    font-weight: 500;
    margin-bottom: 16px;
    color: var(--primary-text-color);
  }

  .section {
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 0.85em;
    font-weight: 500;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
  }

  select,
  input[type="number"],
  input[type="datetime-local"] {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--divider-color, #e0e0e0);
    border-radius: 4px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    font-size: 1em;
    box-sizing: border-box;
  }

  select:focus,
  input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .action-toggle {
    display: flex;
    gap: 8px;
  }

  .action-toggle button {
    flex: 1;
    padding: 8px;
    border: 1px solid var(--divider-color, #e0e0e0);
    border-radius: 4px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    cursor: pointer;
    font-size: 0.95em;
    transition: background 0.2s, color 0.2s;
  }

  .action-toggle button.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    border-color: var(--primary-color);
  }

  .mode-toggle {
    display: flex;
    gap: 16px;
    margin-bottom: 8px;
  }

  .mode-toggle label {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 0.95em;
  }

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

  .error-message {
    color: var(--error-color, #f44336);
    font-size: 0.85em;
    margin-top: 4px;
    padding: 8px;
    background: var(--error-color-background, rgba(244, 67, 54, 0.1));
    border-radius: 4px;
  }

  .schedule-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .schedule-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid var(--divider-color, #e0e0e0);
    background: var(--secondary-background-color, #fafafa);
    gap: 8px;
  }

  .schedule-info {
    flex: 1;
    min-width: 0;
  }

  .schedule-entity {
    font-weight: 500;
    font-size: 0.95em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .schedule-details {
    font-size: 0.8em;
    color: var(--secondary-text-color);
    margin-top: 2px;
  }

  .schedule-countdown {
    font-size: 0.8em;
    color: var(--primary-color);
    font-weight: 500;
    margin-top: 2px;
  }

  .status-badge {
    font-size: 0.75em;
    padding: 2px 8px;
    border-radius: 12px;
    color: #fff;
    white-space: nowrap;
    font-weight: 500;
  }

  .btn-cancel-item {
    padding: 4px 8px;
    background: transparent;
    border: 1px solid var(--error-color, #f44336);
    color: var(--error-color, #f44336);
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8em;
    white-space: nowrap;
  }

  .btn-cancel-item:hover {
    background: var(--error-color, #f44336);
    color: #fff;
  }

  .idle-message {
    color: var(--secondary-text-color);
    font-size: 0.9em;
    font-style: italic;
    text-align: center;
    padding: 12px;
  }

  .history-section {
    margin-top: 12px;
  }

  .history-toggle {
    background: none;
    border: none;
    color: var(--secondary-text-color);
    cursor: pointer;
    font-size: 0.85em;
    padding: 4px 0;
    text-decoration: underline;
  }

  .history-list {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .history-item {
    font-size: 0.8em;
    padding: 6px 10px;
    border-radius: 4px;
    background: var(--secondary-background-color, #fafafa);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .preset-section {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .preset-section select {
    flex: 1;
  }

  .btn-load-preset {
    padding: 8px 12px;
    background: var(--secondary-background-color, #f5f5f5);
    border: 1px solid var(--divider-color, #e0e0e0);
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
    white-space: nowrap;
  }

  @media (max-width: 400px) {
    ha-card {
      padding: 12px;
    }

    .control-buttons {
      flex-direction: column;
    }

    .schedule-item {
      flex-wrap: wrap;
    }
  }
`;
