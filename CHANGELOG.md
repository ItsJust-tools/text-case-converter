# Changelog

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
