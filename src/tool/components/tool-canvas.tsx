'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { convertCaseLines, getModeLabel, getModeDescription } from '../lib/case-converter';
import type { TextCaseState } from '../types';

/** Props for the ToolCanvas component. */
interface ToolCanvasProps {
  state: TextCaseState;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
  onChange: (patch: Partial<TextCaseState>) => void;
}

/**
 * Auto-resize a textarea to match its content height.
 */
function autoResizeTextarea(el: HTMLTextAreaElement | null): void {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${Math.max(el.scrollHeight, 120)}px`;
}

export function ToolCanvas({ state, canvasRef, onChange }: ToolCanvasProps) {
  const [copied, setCopied] = useState(false);
  const [copyAnimating, setCopyAnimating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const output = useMemo(() => {
    const trimmed = state.input.trim();
    if (!trimmed) return '';
    try {
      return convertCaseLines(state.input, state.mode, state.lineByLine);
    } catch {
      return '(conversion error)';
    }
  }, [state.input, state.mode, state.lineByLine]);

  // Auto-resize the textarea on input change
  useEffect(() => {
    autoResizeTextarea(textareaRef.current);
  }, [state.input]);

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
      // Sync lastOutput so keyboard shortcuts and exports use the latest result
      onChange({ lastOutput: output });
      setCopied(true);
      setCopyAnimating(true);
      setTimeout(() => {
        setCopied(false);
        setCopyAnimating(false);
      }, 2000);
    } catch {
      // Clipboard unavailable
    }
  }, [output, onChange]);

  const chars = state.input.length;
  const outputChars = output.length;
  const trimmed = state.input.trim();
  const wordCount = useMemo(() => (trimmed ? trimmed.split(/\s+/).length : 0), [trimmed]);
  const outputWordCount = useMemo(() => {
    const trimmedOutput = output.trim();
    return trimmedOutput ? trimmedOutput.split(/\s+/).length : 0;
  }, [output]);
  const inputLines = state.input ? state.input.split('\n').length : 0;

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
            {chars} chars &middot; {wordCount} word{wordCount !== 1 ? 's' : ''} &middot;{' '}
            {inputLines} line{inputLines !== 1 ? 's' : ''}
          </span>
        </div>
        <textarea
          id="case-input"
          ref={textareaRef}
          className="case-textarea case-textarea--auto"
          value={state.input}
          onChange={handleInputChange}
          placeholder="Type or paste text here to convert..."
          aria-label="Input text"
          spellCheck={false}
          rows={3}
        />
      </div>

      {/* Mode indicator */}
      {state.lineByLine && (
        <div className="line-mode-indicator" role="status" aria-live="polite" aria-atomic="true">
          <span className="line-mode-badge">Line-by-line</span>
          <span className="line-mode-desc">Each line is converted independently</span>
        </div>
      )}
      <div className="mode-indicator" role="status" aria-live="polite" aria-atomic="true">
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
              {outputChars} character{outputChars !== 1 ? 's' : ''} &middot; {outputWordCount} word
              {outputWordCount !== 1 ? 's' : ''}
            </span>
            <button
              type="button"
              className={`copy-btn${copied ? ' is-copied' : ''}`}
              onClick={handleCopy}
              disabled={!output}
              aria-label={copied ? 'Copied to clipboard' : 'Copy output to clipboard'}
              aria-live="polite"
              title="Copy to clipboard"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <div
          className={`case-output${copyAnimating ? ' case-output--copied' : ''}`}
          aria-label="Converted output"
          role="textbox"
          aria-readonly="true"
          aria-live="polite"
          tabIndex={0}
          onClick={handleCopy}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCopy();
            }
          }}
        >
          {output || <span className="output-placeholder">Converted text will appear here...</span>}
        </div>
      </div>
    </div>
  );
}
