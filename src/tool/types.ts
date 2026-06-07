/**
 * Supported case transformation modes for the text case converter.
 */
export type CaseMode =
  | 'lowercase'
  | 'uppercase'
  | 'capitalize'
  | 'title-case'
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'SCREAMING_SNAKE_CASE'
  | 'kebab-case'
  | 'SCREAMING-KEBAB-CASE'
  | 'dot.case'
  | 'lowercasing'
  | 'alternating'
  | 'inverse';

/**
 * Application state for the text case converter.
 */
export interface TextCaseState {
  /** Raw input text from the user */
  input: string;
  /** The currently selected case transformation mode */
  mode: CaseMode;
  /** Whether to show the transformed output (vs. raw) */
  showOutput: boolean;
  /** Auto-copy transformed text to clipboard */
  autoCopy: boolean;
  /** Recently transformed output (cached for copy) */
  lastOutput: string;
}
