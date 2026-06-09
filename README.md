# Text Case Converter

> A privacy-first, client-side text case converter. Convert text between different cases — **lowercase**, **UPPERCASE**, **Title Case**, **camelCase**, **snake_case**, **kebab-case**, **PascalCase**, and more.

Built with [Next.js](https://nextjs.org/) and the [ItsJust Core](https://github.com/ItsJust-tools/itsjust) framework. All processing happens locally in your browser — **zero data leaves your device**.

**Live site:** [text-case-converter.itsjust.tools](https://text-case-converter.itsjust.tools)

## Features

- **16 case modes:** lowercase, UPPERCASE, capitalize, Title Case, Sentence case, camelCase, PascalCase, snake_case, SCREAMING_SNAKE_CASE, kebab-case, Train-Case, SCREAMING-KEBAB-CASE, dot.case, flatcase, alternating case, and inverse case
- **Real-time preview:** output updates automatically as you type or select a new mode — no button press needed
- **One-click copy:** click the output area or Copy button to grab transformed text instantly
- **Live statistics:** word count, character count, and line count update in real-time in the sidebar
- **Smart case cycling:** use `Ctrl+Shift+T` to cycle through all 16 case modes and preview each one in real-time
- **Keyboard shortcuts** for quick access:
  - `Ctrl+Enter` — Apply conversion
  - `Ctrl+Shift+C` — Copy output to clipboard
  - `Ctrl+Shift+R` — Clear input and reset
  - `Ctrl+Shift+T` — Cycle through case modes
- **Dark mode:** automatic system preference or manual toggle
- **High contrast mode:** accessible theme for better readability
- **Privacy-first:** 100% client-side — nothing is sent to any server
- **Zero signup:** works immediately, no account required

## Supported Cases

| Mode                 | Example Input       | Output              |
| -------------------- | ------------------- | ------------------- |
| lowercase            | Hello World         | hello world         |
| UPPERCASE            | Hello World         | HELLO WORLD         |
| Capitalize           | hello world         | Hello World         |
| Title Case           | the quick brown fox | The Quick Brown Fox |
| Sentence Case        | hello world         | Hello world         |
| camelCase            | hello world         | helloWorld          |
| PascalCase           | hello world         | HelloWorld          |
| snake_case           | hello world         | hello_world         |
| SCREAMING_SNAKE_CASE | hello world         | HELLO_WORLD         |
| kebab-case           | hello world         | hello-world         |
| Train-Case           | hello world         | Hello-World         |
| SCREAMING-KEBAB-CASE | hello world         | HELLO-WORLD         |
| dot.case             | hello world         | hello.world         |
| flatcase             | Hello World         | helloworld          |
| alternating          | hello world         | hElLo wOrLd         |
| inverse              | Hello World         | hELLO wORLD         |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework:** Next.js 16 (Turbopack)
- **Language:** TypeScript 6
- **UI:** React 19, CSS Variables, Tailwind 4
- **Testing:** Vitest, Playwright
- **Core:** @itsjust/core (tool-shell, storage, theme, import/export)

## Project Structure

```
src/
├── app/                # Next.js app router pages and styles
├── lib/                # SEO helpers and shared utilities
└── tool/
    ├── components/     # React components (canvas, sidebar, toolbar)
    ├── lib/            # Core converter logic (split words, apply case)
    ├── tool-definition.ts  # Tool state, serialization, validation, mode list
    ├── tool.config.ts  # Tool configuration and keyboard shortcuts
    └── types.ts        # TypeScript type definitions (CaseMode, TextCaseState)
```

## Development

```bash
# Install dependencies
npm install

# Start dev server with Turbopack
npm run dev

# Run unit tests
npm test

# Run end-to-end tests (requires dev server)
npm run test:e2e

# Check formatting
npm run format:check
```

## Adding a New Case Mode

1. Add the mode string to the `CaseMode` union type in `src/tool/types.ts`
2. Add a `case` branch to `convertCase()` in `src/tool/lib/case-converter.ts`
3. Register the mode in `ALL_VALID_MODES` in `src/tool/tool-definition.ts`
4. Add entries to `getModeDescription()`, `getModeLabel()`, and `MODE_GROUPS` in `src/tool/lib/case-converter.ts`
5. Add test cases in `__tests__/unit/tool/tool-logic.test.ts`
6. Update the table in this README

## Serialization

Saved state preserves all fields: `input`, `mode`, `showOutput`, `autoCopy`, and `lastOutput`. Deserialization validates that `mode` is one of the 16 known cases and gracefully fills defaults for missing optional fields.

## License

MIT © ItsJust Tools
