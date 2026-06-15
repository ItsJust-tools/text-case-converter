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
}

/**
 * Toolbar component for the Text Case Converter.
 * Displays a link to the help/guide page, a Clear button, and a Paste button.
 */
export function ToolToolbar({ input, onClear, onPaste }: ToolToolbarProps) {
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
    </div>
  );
}
