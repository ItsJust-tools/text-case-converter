'use client';

import { useCallback } from 'react';
import { MODE_GROUPS, getModeDescription } from '../lib/case-converter';
import type { TextCaseState, CaseMode } from '../types';

interface ToolSidebarProps {
  state: TextCaseState;
  onChange: (patch: Partial<TextCaseState>) => void;
  onConvert: () => void;
}

export function ToolSidebar({ state, onChange, onConvert }: ToolSidebarProps) {
  const handleModeSelect = useCallback(
    (mode: CaseMode) => {
      onChange({ mode });
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange({ input: '', lastOutput: '' });
  }, [onChange]);

  return (
    <div className="case-converter-sidebar">
      {/* Case mode selection */}
      <div className="sidebar-section">
        <h3>Case Mode</h3>
        {MODE_GROUPS.map(group => (
          <div key={group.label} className="mode-group">
            <h4 className="mode-group-label">{group.label}</h4>
            <div className="mode-buttons">
              {group.modes.map(mode => (
                <button
                  key={mode}
                  type="button"
                  className={`mode-btn ${state.mode === mode ? 'mode-btn--active' : ''}`}
                  onClick={() => handleModeSelect(mode)}
                  title={getModeDescription(mode)}
                  aria-pressed={state.mode === mode}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Convert action */}
      <div className="sidebar-section">
        <button
          type="button"
          className="convert-btn"
          onClick={onConvert}
          disabled={!state.input.trim()}
          aria-label="Convert text"
        >
          Convert
        </button>
      </div>

      {/* Stats */}
      <div className="sidebar-section">
        <h3>Statistics</h3>
        <dl className="stats-list">
          <div className="stat-row">
            <dt>Input length</dt>
            <dd>{state.input.length.toLocaleString()}</dd>
          </div>
          {state.lastOutput && (
            <div className="stat-row">
              <dt>Output length</dt>
              <dd>{state.lastOutput.length.toLocaleString()}</dd>
            </div>
          )}
          <div className="stat-row">
            <dt>Input lines</dt>
            <dd>{state.input ? state.input.split('\n').length : 0}</dd>
          </div>
        </dl>
      </div>

      {/* Actions */}
      <div className="sidebar-section">
        <h3>Actions</h3>
        <button
          type="button"
          className="clear-btn"
          onClick={handleClear}
          disabled={!state.input}
          aria-label="Clear input"
        >
          Clear Input
        </button>
      </div>
    </div>
  );
}