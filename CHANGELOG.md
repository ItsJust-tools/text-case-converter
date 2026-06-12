# Changelog

## [1.2.0] — 2026-06-12

### Added

- **Undo/Redo support**: enabled in tool config with `features.undoRedo: true`.
  Users can now use `Ctrl+Z` / `Ctrl+Shift+Z` to revert or reapply text changes.
- **Export feature enabled**: JSON export dropdown is now available in the toolbar
  (previously disabled despite `exportFormats` listing JSON).
- **Toast feedback for sidebar actions**: Swap Output → Input and Copy Output to
  Input now show a success toast when triggered.

### Changed

- Updated `tool.config.ts` version to `1.2.0`.
- Bumped `package.json` version to `1.2.0`.

## [1.1.1] — 2026-06-08

### Fixed

- **Keyboard shortcuts now actually wired to handlers**: `Ctrl+Enter` (convert),
  `Ctrl+Shift+C` (copy), `Ctrl+Shift+R` (reset), and `Ctrl+Shift+T` (cycle mode)
  were displayed in the sidebar but the event listeners were never connected.
  Added a `useEffect` with stable refs that listens for these shortcuts.

### Changed

- Exported `ALL_VALID_MODES` from `tool-definition.ts` and reused it in
  `tool-client.tsx` to eliminate the duplicate `ALL_MODES` array (dead code
  reduction).
- Added `satisfies never` exhaustiveness guard in `convertCase` default branch
  so TypeScript flags unhandled `CaseMode` values at compile time.
- Initialized refs inside `useEffect` instead of during render to satisfy the
  React hooks lint rules.

### Added

- JSDoc documentation for `ToolClient`, `ToolToolbar`, `matchesModShortcut`,
  `handleStateChange`, `handleConvert`, `cycleMode`, `handleCopyOutput`, and
  `handleResetState`.
- Mocked `ALL_VALID_MODES` in test setup to keep tests passing.

## [1.1.0] — 2026-06-08

### Fixed

- Fixed `Ctrl+Shift+T` keyboard shortcut cycling: `sentence-case` and `train-case`
  are now included in the rotation (previously skipped)

### Added

- Word count statistic in sidebar
- Keyboard shortcuts reference section in sidebar
- Comprehensive JSDoc documentation across all modules
- Improved `capitalize` whitespace detection for better reliability
- Edge-case tests for leading/trailing whitespace in capitalize

## [1.0.0] — 2026-06-07

### Added

- Initial release of Text Case Converter
- 14 case transformation modes: lowercase, UPPERCASE, capitalize, Title Case, camelCase, PascalCase, snake_case, SCREAMING_SNAKE_CASE, kebab-case, SCREAMING-KEBAB-CASE, dot.case, lowercasing, alternating, and inverse
- Real-time output preview as you type
- One-click copy to clipboard
- Keyboard shortcuts (Ctrl+Enter to convert, Ctrl+Shift+C to copy, Ctrl+Shift+R to reset, Ctrl+Shift+T cycle modes)
- Dark mode and accessibility support
- Privacy-first — 100% client-side processing
