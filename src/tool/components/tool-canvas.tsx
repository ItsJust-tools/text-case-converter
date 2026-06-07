'use client';

import { useCallback, useMemo, useState } from 'react';
import { convertCase, getModeLabel, getModeDescription } from '../lib/case-converter';
import type { TextCaseState } from '../types';

interface ToolCanvasProps {
  state: TextCaseState;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
  onChange: (patch: Partial<TextCaseState>) => void;
}

export function ToolCanvas({ state, canvasRef, onChange }: ToolCanvasProps) {
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!state.input.trim()) return '';
    try {
      return convertCase(state.input, state.mode);
    } catch {
      return '(conversion error)';
    }
  }, [state.input, state.mode]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange({ input: e.target.value });
    },
    [onChange]
  );

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      onChange({ autoCopy: true, lastOutput: output });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  }, [output, onChange]);

  const chars = state.input.length;
  const outputChars = output.length;

  return (
    <div
      ref={canvasRef}
      className="tool-canvas"
      role="application"
      aria-label="Text Case Converter canvas"
    >
      {/* Input area */}
      <div className="input-section">
        <div className="section-header">
          <label htmlFor="case-input" className="section-label">
            Input
          </label>
          <span className="char-count">
            {chars} character{chars !== 1 ? 's' : ''}
          </span>
        </div>
        <textarea
          id="case-input"
          className="case-textarea"
          value={state.input}
          onChange={handleInputChange}
          placeholder="Type or paste text here to convert..."
          aria-label="Input text"
          spellCheck={false}
          rows={6}
        />
      </div>

      {/* Mode indicator */}
      <div className="mode-indicator">
        <span className="mode-badge" title={getModeDescription(state.mode)}>
          {getModeLabel(state.mode)}
        </span>
        <span className="mode-name">{state.mode}</span>
        <span className="mode-desc">{getModeDescription(state.mode)}</span>
      </div>

      {/* Output area */}
      <div className="output-section">
        <div className="section-header">
          <label className="section-label">Output</label>
          <div className="output-actions">
            <span className="char-count">
              {outputChars} character{outputChars !== 1 ? 's' : ''}
            </span>
            <button
              type="button"
              className="copy-btn"
              onClick={handleCopy}
              disabled={!output}
              aria-label="Copy output to clipboard"
              title="Copy to clipboard"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <div
          className="case-output"
          aria-label="Converted output"
          role="textbox"
          aria-readonly="true"
          tabIndex={0}
          onClick={() => {
            if (output) handleCopy();
          }}
        >
          {output || <span className="output-placeholder">Converted text will appear here...</span>}
        </div>
      </div>
    </div>
  );
}
