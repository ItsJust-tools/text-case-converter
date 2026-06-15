# Text Case Converter

> A privacy-first, client-side text case converter. Convert text between different cases — **lowercase**, **UPPERCASE**, **Title Case**, **camelCase**, **snake_case**, **kebab-case**, **PascalCase**, and more.

[![CI](https://github.com/ItsJust-tools/text-case-converter/actions/workflows/ci.yml/badge.svg)](https://github.com/ItsJust-tools/text-case-converter/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)](https://nextjs.org/)

Built with [Next.js](https://nextjs.org/) and the [ItsJust Core](https://github.com/ItsJust-tools/itsjust) framework. All processing happens locally in your browser — **zero data leaves your device**.

**Live site:** [text-case-converter.itsjust.tools](https://text-case-converter.itsjust.tools)

## Features

- **16 case modes:** lowercase, UPPERCASE, capitalize, Title Case, Sentence case, camelCase, PascalCase, snake_case, SCREAMING_SNAKE_CASE, kebab-case, Train-Case, SCREAMING-KEBAB-CASE, dot.case, flatcase, alternating case, and inverse case
- **Real-time preview:** output updates automatically as you type or select a new mode — no button press needed
- **One-click copy:** click the output area or Copy button to grab transformed text instantly
- **Swap Output → Input:** replace the input with the converted output for chained transformations in a different case mode
- **Copy Output to Input:** copy converted text back to the input field (without clearing the output)
- **Live statistics:** word count, character count, line count, and input/output diff update in real-time in the sidebar
- **Output word count:** the preview pane also tracks word count of the converted text
- **Smart case cycling:** use `Ctrl+Shift+T` to cycle through all 16 case modes and preview each one in real-time
- **Keyboard shortcuts** for quick access:
  - `Ctrl+Enter` — Apply conversion
  - `Ctrl+Shift+C` — Copy output to clipboard
  - `Ctrl+Shift+R` — Clear input and reset
  - `Ctrl+Shift+T` — Cycle through case modes
- **Toolbar actions:** Clear input and Paste from clipboard buttons in the toolbar for quick access
- **Undo/Redo:** use `Ctrl+Z` / `Ctrl+Shift+Z` to revert or reapply text changes
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

> **Note:** Code-style conversions (camelCase, PascalCase, snake_case, etc.)
> automatically split on letter↔digit boundaries. For example,
> `hello2world` becomes `hello2World` in camelCase and `hello_2_world` in snake_case.
> Unicode and accented characters (é, ñ, ü) are fully supported.

## Usage Examples

### Quick Conversions

| Goal                   | Input              | Mode        | Output            |
| ---------------------- | ------------------ | ----------- | ----------------- |
| Normalize to lowercase | `USER INPUT`       | lowercase   | `user input`      |
| Make all caps          | `warning message`  | UPPERCASE   | `WARNING MESSAGE` |
| Title a blog post      | `the art of code`  | Title Case  | `The Art of Code` |
| Format a sentence      | `hello. world`     | Sentence    | `Hello. World`    |
| JavaScript variable    | `my variable name` | camelCase   | `myVariableName`  |
| React component name   | `user profile`     | PascalCase  | `UserProfile`     |
| Python constant        | `max retries`      | SCREAMING   | `MAX_RETRIES`     |
| CSS class name         | `main container`   | kebab-case  | `main-container`  |
| Database column        | `firstName`        | snake_case  | `first_name`      |
| Environment variable   | `app secret`       | SCREAMING   | `APP_SECRET`      |
| Meme text              | `hello world`      | alternating | `hElLo wOrLd`     |
| Toggle case            | `Hello World`      | inverse     | `hELLO wORLD`     |

### Chained Transformations

1. Type or paste `my_variable_name`
2. Select **camelCase** → output: `myVariableName`
3. Click **Swap Output → Input** to use the result as new input
4. Select **PascalCase** → output: `MyVariableName`
5. Click **Swap Output → Input** again
6. Select **SCREAMING_SNAKE_CASE** → output: `MY_VARIABLE_NAME`

### Line-by-Line Processing

Enable **Line-by-line mode** in the sidebar to convert each line independently.
Useful for batch-converting a list of items:

```
Input:                    Output (PascalCase):
first name                FirstName
last_name                 LastName
email-address             EmailAddress
```

### Keyboard-Only Workflow

1. `Tab` into the textarea and type your text
2. `Ctrl+Shift+T` to cycle through case modes until you find the right one
3. `Ctrl+Shift+C` to copy the result
4. `Ctrl+Shift+R` to reset and start fresh

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (see `.nvmrc` for the required version)
- npm (ships with Node.js)

### Install and Run

```bash
# Install dependencies
npm install

# Start dev server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker

```bash
# Build
docker compose build

# Run
docker compose up
```

## Tech Stack

- **Framework:** Next.js 16 (Turbopack)
- **Language:** TypeScript 6
- **UI:** React 19, CSS Variables, Tailwind 4
- **Testing:** Vitest (unit), Playwright (e2e)
- **Core:** @itsjust/core (tool-shell, storage, theme, import/export)
- **Linting:** ESLint, Prettier
- **Pre-commit:** Husky, lint-staged

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
packages/
└── core/               # Shared ItsJust framework (@itsjust/core)
```

## Development

```bash
# Install dependencies
npm install

# Start dev server with Turbopack
npm run dev

# Run unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run end-to-end tests (requires dev server)
npm run test:e2e

# Check formatting
npm run format:check

# Format all files
npm run format

# Lint
npm run lint
```

### Pre-commit Checks

This project uses Husky and lint-staged to automatically format and lint
staged files before each commit.

## Adding a New Case Mode

1. Add the mode string to the `CaseMode` union type in `src/tool/types.ts`
2. Add a `case` branch to `convertCase()` in `src/tool/lib/case-converter.ts`
3. Register the mode in `ALL_VALID_MODES` in `src/tool/tool-definition.ts`
4. Add entries to `getModeDescription()`, `getModeLabel()`, and `MODE_GROUPS` in `src/tool/lib/case-converter.ts`
5. Add test cases in `__tests__/unit/tool/tool-logic.test.ts`
6. Update the table in this README

## Serialization

Saved state preserves all fields: `input`, `mode`, `lastOutput`, and `lineByLine`. Deserialization validates that `mode` is one of the 16 known cases and gracefully fills defaults for missing optional fields (`lastOutput` defaults to `''`, `lineByLine` defaults to `false`).

State is saved to `localStorage` automatically via the `useTool` hook.

## License

MIT © ItsJust Tools

---

<p align="center">
  <sub>Built with ❤️ as part of the <a href="https://github.com/ItsJust-tools">ItsJust Tools</a> collection.</sub>
</p>
