'use client';

import { useCallback, useMemo } from 'react';
import { MODE_GROUPS, getModeDescription, convertCaseLines } from '../lib/case-converter';
import type { TextCaseState, CaseMode } from '../types';

interface ToolSidebarProps {
  state: TextCaseState;
  onChange: (patch: Partial<TextCaseState>) => void;
  onConvert: () => void;
  onSwap?: () => void;
  onCopyOutputToInput?: () => void;
}

export function ToolSidebar({
  state,
  onChange,
  onConvert,
  onSwap,
  onCopyOutputToInput,
}: ToolSidebarProps) {
  const handleModeSelect = useCallback(
    (mode: CaseMode) => {
      onChange({ mode });
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange({ input: '', lastOutput: '' });
  }, [onChange]);

  /**
   * Swaps the output back into the input, allowing chained transformations.
   * Converts the current input, then uses that as the new input value.
   */
  const handleSwap = useCallback(() => {
    if (!state.input.trim()) return;
    const output = convertCaseLines(state.input, state.mode, state.lineByLine);
    onChange({ input: output, lastOutput: '' });
    onSwap?.();
  }, [state.input, state.mode, state.lineByLine, onChange, onSwap]);

  /**
   * Copies the converted output back to the input, preserving the current
   * output for reference.
   */
  const handleCopyOutputToInput = useCallback(() => {
    if (!state.input.trim()) return;
    const output = convertCaseLines(state.input, state.mode, state.lineByLine);
    onChange({ input: output });
    onCopyOutputToInput?.();
  }, [state.input, state.mode, state.lineByLine, onChange, onCopyOutputToInput]);

  const wordCount = useMemo(
    () => (state.input.trim() ? state.input.trim().split(/\s+/).length : 0),
    [state.input]
  );

  return (
    <div className="case-converter-sidebar">
      {/* Case mode selection */}
      <div className="sidebar-section">
        <h3>Case Mode</h3>
        {MODE_GROUPS.map((group) => (
          <div key={group.label} className="mode-group">
            <h4 className="mode-group-label">{group.label}</h4>
            <div className="mode-buttons">
              {group.modes.map((mode) => (
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

      {/* Line-by-line mode toggle */}
      <div className="sidebar-section">
        <h3>Processing</h3>
        <label
          className="toggle-row"
          title="When enabled, each line of multi-line text is converted independently"
        >
          <input
            type="checkbox"
            className="toggle-input"
            checked={state.lineByLine}
            onChange={(e) => onChange({ lineByLine: e.target.checked })}
          />
          <span className="toggle-label">Line-by-line mode</span>
        </label>
      </div>

      {/* Stats */}
      <div className="sidebar-section">
        <h3>Statistics</h3>
        <dl className="stats-list">
          <div className="stat-row">
            <dt>Words</dt>
            <dd>{wordCount.toLocaleString()}</dd>
          </div>
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
        <button
          type="button"
          className="swap-btn"
          onClick={handleSwap}
          disabled={!state.input.trim()}
          aria-label="Swap output to input"
          title="Replace input with converted output (chain transformations)"
        >
          Swap Output → Input
        </button>
        <button
          type="button"
          className="swap-btn swap-btn--alt"
          onClick={handleCopyOutputToInput}
          disabled={!state.input.trim()}
          aria-label="Copy output to input"
          title="Copy the converted output into the input field"
        >
          Copy Output to Input
        </button>
      </div>

      {/* Keyboard shortcuts */}
      <div className="sidebar-section">
        <h3>Shortcuts</h3>
        <dl className="stats-list shortcuts-list">
          <div className="shortcut-row">
            <kbd className="shortcut-kbd">Ctrl+Enter</kbd>
            <span className="shortcut-label">Convert</span>
          </div>
          <div className="shortcut-row">
            <kbd className="shortcut-kbd">Ctrl+Shift+C</kbd>
            <span className="shortcut-label">Copy</span>
          </div>
          <div className="shortcut-row">
            <kbd className="shortcut-kbd">Ctrl+Shift+R</kbd>
            <span className="shortcut-label">Reset</span>
          </div>
          <div className="shortcut-row">
            <kbd className="shortcut-kbd">Ctrl+Shift+T</kbd>
            <span className="shortcut-label">Cycle mode</span>
          </div>
        </dl>
      </div>
    </div>
  );
}
