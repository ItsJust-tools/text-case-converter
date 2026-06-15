/**
 * Supported case transformation modes for the text case converter.
 */
export type CaseMode =
  | 'lowercase'
  | 'uppercase'
  | 'capitalize'
  | 'title-case'
  | 'sentence-case'
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'SCREAMING_SNAKE_CASE'
  | 'kebab-case'
  | 'train-case'
  | 'SCREAMING-KEBAB-CASE'
  | 'dot.case'
  | 'flatcase'
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
  /** Recently transformed output (cached for copy) */
  lastOutput: string;
  /** When enabled, multi-line input is processed line-by-line instead of as a whole */
  lineByLine: boolean;
}
