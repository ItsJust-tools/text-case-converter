'use client';

import { useCallback } from 'react';
import Link from 'next/link';

/** Props for the ToolToolbar component. */
interface ToolToolbarProps {
  /** Current input text, used to enable/disable the Clear button. */
  input?: string;
  /** Callback to clear the input. */
  onClear?: () => void;
  /** Callback to paste from clipboard into the input. */
  onPaste?: (text: string) => void;
  /** Callback to swap output back into input (chain transformations). */
  onSwap?: () => void;
  /** Whether there is output to swap (enables/disables the swap button). */
  hasOutput?: boolean;
  /** Callback to copy the current output to clipboard. */
  onCopyOutput?: () => void;
}

/**
 * Toolbar component for the Text Case Converter.
 * Displays a link to the help/guide page, a Clear button, a Paste button,
 * a Copy Output button, and a Swap button for quick access.
 */
export function ToolToolbar({
  input,
  onClear,
  onPaste,
  onSwap,
  hasOutput,
  onCopyOutput,
}: ToolToolbarProps) {
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      onPaste?.(text);
    } catch {
      // Clipboard read not available — silently fail
    }
  }, [onPaste]);

  return (
    <div className="case-toolbar">
      <Link href="/help" className="toolbar-btn toolbar-btn--help" aria-label="Open help page">
        Help
      </Link>
      <button
        type="button"
        className="toolbar-btn toolbar-btn--clear"
        onClick={onClear}
        disabled={!input}
        aria-label="Clear input text"
        title="Clear input"
      >
        Clear
      </button>
      <button
        type="button"
        className="toolbar-btn toolbar-btn--paste"
        onClick={handlePaste}
        aria-label="Paste text from clipboard"
        title="Paste from clipboard"
      >
        Paste
      </button>
      <button
        type="button"
        className="toolbar-btn toolbar-btn--copy"
        onClick={onCopyOutput}
        disabled={!hasOutput}
        aria-label="Copy output to clipboard"
        title="Copy converted output to clipboard"
      >
        Copy
      </button>
      <button
        type="button"
        className="toolbar-btn toolbar-btn--swap"
        onClick={onSwap}
        disabled={!hasOutput}
        aria-label="Swap output to input"
        title="Replace input with converted output (chain transformations)"
      >
        Swap
      </button>
    </div>
  );
}
