# Architecture

## Overview

Text Case Converter is a Next.js app built on top of the ItsJust Core framework.
All text processing happens client-side — no server requests are made during conversion.

## Directory Layout

```
src/
├── app/                  # Next.js App Router pages, layout, and global styles
│   ├── globals.css       # Global styles + all tool-specific styles
│   ├── layout.tsx        # Root layout with metadata
│   ├── page.tsx          # Entry page
│   ├── tool-client.tsx   # Main client component: wires keyboard shortcuts, state, shell
│   └── ...
├── lib/                  # Shared utilities (SEO helpers)
└── tool/
    ├── components/
    │   ├── tool-canvas.tsx   # Input textarea + output preview
    │   ├── tool-sidebar.tsx  # Mode selection, stats, actions
    │   └── tool-toolbar.tsx  # Toolbar link to help page
    ├── lib/
    │   └── case-converter.ts # All 16 case conversion functions + helpers
    ├── index.ts             # Re-exports for clean imports
    ├── tool-definition.ts   # Tool interface (state, serialize, deserialize)
    ├── tool.config.ts       # Tool configuration metadata
    └── types.ts             # TypeScript types (CaseMode, TextCaseState)
```

## Data Flow

1. **User types** in the textarea → `onChange` fires → `handleStateChange` updates React state
2. **`ToolCanvas` computes output** via `useMemo` using `convertCase()` — no debounce needed
3. **Keyboard shortcuts** (Ctrl+Enter, Ctrl+Shift+C, etc.) are handled via global `keydown` listener in `tool-client.tsx`
4. **State persistence** uses the core framework's `useTool` hook which serializes to `localStorage`
5. **Copy to clipboard**: both the canvas copy button and keyboard shortcut use `navigator.clipboard.writeText()`

## Key Design Decisions

- **Real-time preview**: Output updates synchronously on every keystroke — no submit button needed
- **All-ASCII-friendly splitter**: `splitWords()` normalizes separators (space, hyphen, underscore, camelCase) before joining
- **Unicode-aware**: Regex uses `\p{L}` / `\P{L}` for correct handling of accented and non-Latin characters
- **Single CSS file**: All tool-specific styles live in `src/app/globals.css` alongside core framework imports and theme variables
- **Harmless redundancy**: `lastOutput` is cached for keyboard shortcut uses but always recomputed fresh on copy
