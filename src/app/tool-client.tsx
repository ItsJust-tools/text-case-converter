'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  toolConfig,
  templateBaseVersion,
  textCaseTool,
  ToolCanvas,
  ToolToolbar,
  ToolSidebar,
  ALL_VALID_MODES,
} from '@/tool';
import { ToolShell, useTool } from '@itsjust/core';
import { convertCaseLines } from '@/tool/lib/case-converter';
import type { TextCaseState } from '@/tool/types';

/** Maximum number of undo/redo history entries to keep. */
const MAX_HISTORY = 50;

/**
 * Milliseconds to wait before committing an input change to the undo stack.
 * This prevents rapid keystrokes from flooding the undo stack with one entry
 * per character.
 */
const INPUT_DEBOUNCE_MS = 500;

/**
 * Determines the modifier key based on the user's platform.
 */
function isMac(): boolean {
  return typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
}

const MOD_KEY = isMac() ? 'metaKey' : 'ctrlKey';

/** Reuse the canonical list from the tool definition to avoid duplication. */
const ALL_MODES = ALL_VALID_MODES;

/**
 * Controls whether a keyboard event matches the current platform's modifier key
 * and an optional shift requirement.
 */
function matchesModShortcut(e: KeyboardEvent, key: string, shift = false): boolean {
  return (
    e[MOD_KEY as keyof KeyboardEvent] === true &&
    e.shiftKey === shift &&
    e.key.toLowerCase() === key.toLowerCase()
  );
}

/**
 * Main tool client component for the Text Case Converter.
 * Wires together the tool shell, canvas, sidebar, toolbar, and keyboard shortcuts.
 */
export default function ToolClient() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const tool = useTool(textCaseTool, canvasRef);
  const setToolData = tool.state.setData;
  const showToast = tool.toast;
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth > 768 && toolConfig.features.sidebar
  );

  const title = toolConfig.name;

  // Undo/redo history
  const [undoStack, setUndoStack] = useState<TextCaseState[]>([]);
  const [redoStack, setRedoStack] = useState<TextCaseState[]>([]);
  // Debounce timer for coalescing adjacent input changes
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Pushes the given state onto the undo stack.
   * Clears the redo stack since a new action invalidates redo history.
   */
  const pushUndo = useCallback((state: TextCaseState) => {
    setUndoStack((prev) => {
      const next = [...prev, state];
      if (next.length > MAX_HISTORY) next.shift();
      return next;
    });
    setRedoStack([]);
  }, []);

  /**
   * Queues the given state for undo push with a debounce delay.
   * Multiple rapid calls within the debounce window collapse into a single
   * undo entry. This prevents each keystroke from creating a separate entry.
   */
  const pushUndoDebounced = useCallback(
    (state: TextCaseState) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        pushUndo(state);
        debounceTimer.current = null;
      }, INPUT_DEBOUNCE_MS);
    },
    [pushUndo]
  );

  /**
   * Undo: restore the most recent undo entry, pushing current state to redo.
   */
  const handleUndo = useCallback(() => {
    const undoEntry = undoStack[undoStack.length - 1];
    if (!undoEntry) return;
    setToolData((prev) => {
      setRedoStack((r) => {
        const next = [...r, prev];
        if (next.length > MAX_HISTORY) next.shift();
        return next;
      });
      return undoEntry;
    });
    setUndoStack((prev) => prev.slice(0, -1));
    showToast('Undo', 'success');
  }, [undoStack, setToolData, showToast]);

  /**
   * Redo: restore the most recent redo entry, pushing current state to undo.
   */
  const handleRedo = useCallback(() => {
    const redoEntry = redoStack[redoStack.length - 1];
    if (!redoEntry) return;
    setToolData((prev) => {
      setUndoStack((u) => {
        const next = [...u, prev];
        if (next.length > MAX_HISTORY) next.shift();
        return next;
      });
      return redoEntry;
    });
    setRedoStack((prev) => prev.slice(0, -1));
    showToast('Redo', 'success');
  }, [redoStack, setToolData, showToast]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  /**
   * Handles partial state updates from child components (canvas, sidebar).
   * When the input or mode changes, automatically recompute the output
   * and cache it in lastOutput so keyboard shortcuts stay consistent
   * with the real-time preview. Pushes the previous state onto the undo
   * stack (debounced for input changes) before applying the change.
   *
   * Input changes are debounced so rapid typing coalesces into a single
   * undo entry. Mode changes are pushed immediately.
   */
  const handleStateChange = useCallback(
    (patch: Partial<TextCaseState>) => {
      const snapshot = { ...tool.state.data };
      setToolData((prev) => {
        const next = { ...prev, ...patch };
        // Keep lastOutput in sync whenever input or mode changes
        if ('input' in patch || 'mode' in patch) {
          const trimmed = next.input.trim();
          if (trimmed) {
            next.lastOutput = convertCaseLines(next.input, next.mode, next.lineByLine);
          }
        }
        return next;
      });
      // Push undo snapshot after setToolData commits.
      // Using queueMicrotask to avoid side-effects inside the setter.
      queueMicrotask(() => {
        if ('input' in patch) {
          pushUndoDebounced(snapshot);
        } else {
          // Mode, lineByLine etc — push immediately
          pushUndo(snapshot);
        }
      });
    },
    [tool.state.data, setToolData, pushUndo, pushUndoDebounced]
  );

  /**
   * Converts the current input text using the selected case mode;
   * caches the result in lastOutput and shows a success toast.
   */
  const handleConvert = useCallback(() => {
    const { input, mode, lineByLine } = tool.state.data;
    if (!input.trim()) {
      showToast('No text to convert', 'error');
      return;
    }
    const output = convertCaseLines(input, mode, lineByLine);
    setToolData((prev) => ({ ...prev, lastOutput: output }));
    showToast(`Converted to ${mode}`, 'success');
  }, [tool.state.data, setToolData, showToast]);

  /**
   * Cycles through case modes in order, wrapping around at the end.
   */
  const cycleMode = useCallback(() => {
    setToolData((prev) => {
      const currentIndex = ALL_MODES.indexOf(prev.mode);
      const nextMode = ALL_MODES[(currentIndex + 1) % ALL_MODES.length]!;
      return { ...prev, mode: nextMode };
    });
  }, [setToolData]);

  /**
   * Copies the current output to the clipboard.
   * Always computes fresh output from the current input and mode
   * to stay consistent with the real-time preview in the canvas.
   */
  const handleCopyOutput = useCallback(async () => {
    const { input, mode, lineByLine } = tool.state.data;
    if (!input.trim()) {
      showToast('Nothing to copy', 'error');
      return;
    }
    const output = convertCaseLines(input, mode, lineByLine);
    setToolData((prev) => ({ ...prev, lastOutput: output }));
    try {
      await navigator.clipboard.writeText(output);
      showToast('Copied to clipboard', 'success');
    } catch {
      showToast('Failed to copy', 'error');
    }
  }, [tool.state.data, setToolData, showToast]);

  /**
   * Resets the tool to its initial state (empty input, lowercase mode).
   */
  const handleResetState = useCallback(() => {
    setToolData((prev) => ({
      ...prev,
      input: '',
      mode: 'lowercase' as const,
      lastOutput: '',
      lineByLine: false,
    }));
    showToast('Reset', 'success');
  }, [setToolData, showToast]);

  /**
   * Swaps the converted output back into the input, allowing chained
   * transformations. Uses the cached lastOutput to avoid recomputation.
   */
  const handleSwap = useCallback(() => {
    const { input, lastOutput } = tool.state.data;
    if (!input.trim() || !lastOutput) {
      showToast('Nothing to swap', 'error');
      return;
    }
    setToolData((prev) => ({ ...prev, input: lastOutput, lastOutput: '' }));
    showToast('Input replaced with converted output', 'success');
  }, [tool.state.data, setToolData, showToast]);

  // Wire tool-specific keyboard shortcuts using stable refs to avoid
  // stale closure issues.
  const convertRef = useRef<typeof handleConvert>(handleConvert);
  const copyRef = useRef<typeof handleCopyOutput>(handleCopyOutput);
  const resetRef = useRef<typeof handleResetState>(handleResetState);
  const cycleRef = useRef<typeof cycleMode>(cycleMode);
  const undoRef = useRef<typeof handleUndo>(handleUndo);
  const redoRef = useRef<typeof handleRedo>(handleRedo);

  // Keep refs current with latest callbacks
  useEffect(() => {
    convertRef.current = handleConvert;
    copyRef.current = handleCopyOutput;
    resetRef.current = handleResetState;
    cycleRef.current = cycleMode;
    undoRef.current = handleUndo;
    redoRef.current = handleRedo;
  });

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Don't intercept undo/redo when focused on a textarea/input
      // (browser native undo/redo should work there)
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInput = tag === 'textarea' || tag === 'input';

      if (matchesModShortcut(e, 'z') && !e.shiftKey) {
        e.preventDefault();
        if (!isInput) {
          undoRef.current();
        }
        return;
      }
      if (matchesModShortcut(e, 'z', true)) {
        e.preventDefault();
        if (!isInput) {
          redoRef.current();
        }
        return;
      }
      if (matchesModShortcut(e, 'enter')) {
        e.preventDefault();
        convertRef.current();
        return;
      }
      if (matchesModShortcut(e, 'c', true)) {
        e.preventDefault();
        copyRef.current();
        return;
      }
      if (matchesModShortcut(e, 'r', true)) {
        e.preventDefault();
        resetRef.current();
        return;
      }
      if (matchesModShortcut(e, 't', true)) {
        e.preventDefault();
        cycleRef.current();
        return;
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toolbarActions = useMemo(() => tool.toolbarActions, [tool.toolbarActions]);

  const handleClear = useCallback(() => {
    setToolData((prev) => ({ ...prev, input: '', lastOutput: '' }));
    showToast('Input cleared', 'success');
  }, [setToolData, showToast]);

  const handlePaste = useCallback(
    (text: string) => {
      setToolData((prev) => ({ ...prev, input: text }));
      showToast('Pasted from clipboard', 'success');
    },
    [setToolData, showToast]
  );

  const toolbarContent = (
    <>
      <ToolToolbar
        input={tool.state.data.input}
        onClear={handleClear}
        onPaste={handlePaste}
        onSwap={handleSwap}
        hasOutput={!!tool.state.data.lastOutput}
      />
    </>
  );

  const sidebarContent = (
    <ToolSidebar
      state={tool.state.data}
      onChange={handleStateChange}
      onConvert={handleConvert}
      onSwap={() => showToast('Input replaced with converted output', 'success')}
      onCopyOutputToInput={() => showToast('Output copied to input', 'success')}
    />
  );

  const canvasContent = (
    <ToolCanvas
      state={tool.state.data}
      canvasRef={canvasRef}
      onChange={handleStateChange}
      onCopy={() => showToast('Copied to clipboard', 'success')}
    />
  );

  const statusBarContent = (
    <>
      <span
        className={`status-slot status-slot-state ${tool.state.isDirty ? 'status-unsaved' : 'status-saved'}`}
      >
        {tool.state.isDirty ? (
          <>
            <span className="status-saving-dot" />
            Unsaved
          </>
        ) : tool.state.lastSaved ? (
          <>Saved {tool.state.lastSaved}</>
        ) : (
          'Ready'
        )}
      </span>
      <span className="status-slot status-slot-input-length">
        {tool.state.data.input.length} chars
      </span>
      <span className="status-slot status-slot-mode">{tool.state.data.mode}</span>
      <span className="status-slot status-slot-tool-version">Tool v{toolConfig.version}</span>
      <span className="status-slot status-slot-template-version">
        Template v{templateBaseVersion}
      </span>
    </>
  );

  return (
    <ToolShell
      config={toolConfig}
      actions={toolbarActions}
      sidebarOpen={sidebarOpen}
      onSidebarChange={setSidebarOpen}
      toolbar={toolbarContent}
      sidebar={sidebarContent}
      canvas={canvasContent}
      statusBar={statusBarContent}
    />
  );
}
