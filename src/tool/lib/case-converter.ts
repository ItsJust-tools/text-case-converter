import type { CaseMode } from '../types';

// ---------------------------------------------------------------------------
// Locale-aware string helpers (shared across all conversion functions)
// ---------------------------------------------------------------------------

/** Locale-aware lowercase, falling back to default when no locale is given. */
function toLower(s: string, locale?: string): string {
  return locale ? s.toLocaleLowerCase(locale) : s.toLowerCase();
}

/** Locale-aware uppercase, falling back to default when no locale is given. */
function toUpper(s: string, locale?: string): string {
  return locale ? s.toLocaleUpperCase(locale) : s.toUpperCase();
}

/**
 * Capitalizes the first letter of a word, preserving any non-letter prefix.
 * Handles Unicode letters (accented characters, non-Latin scripts).
 *
 * @param word - The word to capitalize.
 * @param locale - Optional locale for case conversion.
 * @returns The word with its first letter uppercased and the rest lowercased.
 */
function toUpperFirst(word: string, locale?: string): string {
  const firstLetterMatch = word.match(/\p{L}/u);
  if (!firstLetterMatch) return toLower(word, locale);
  const idx = firstLetterMatch.index!;
  return (
    toLower(word.slice(0, idx), locale) +
    toUpper(word.charAt(idx), locale) +
    toLower(word.slice(idx + 1), locale)
  );
}

/**
 * Converts text according to the specified case mode.
 *
 * @param input - The text to convert.
 * @param mode - The case transformation mode to apply.
 * @returns The converted text, or an empty string if input is empty.
 */
export function convertCase(input: string, mode: CaseMode, locale?: string): string {
  // Fast-path: no input to convert
  if (!input) return '';
  switch (mode) {
    case 'lowercase':
      return locale ? input.toLocaleLowerCase(locale) : input.toLowerCase();
    case 'uppercase':
      return locale ? input.toLocaleUpperCase(locale) : input.toUpperCase();
    case 'capitalize':
      return capitalizeWords(input, locale);
    case 'title-case':
      return titleCase(input, locale);
    case 'sentence-case':
      return toSentenceCase(input, locale);
    case 'camelCase':
      return toCamelCase(input, locale);
    case 'PascalCase':
      return toPascalCase(input, locale);
    case 'snake_case':
      return toSnakeCase(input, locale);
    case 'SCREAMING_SNAKE_CASE':
      return toScreamingSnakeCase(input, locale);
    case 'kebab-case':
      return toKebabCase(input, locale);
    case 'train-case':
      return toTrainCase(input, locale);
    case 'SCREAMING-KEBAB-CASE':
      return toScreamingKebabCase(input, locale);
    case 'dot.case':
      return toDotCase(input, locale);
    case 'flatcase':
      return toFlatCase(input, locale);
    case 'alternating':
      return toAlternatingCase(input, locale);
    case 'inverse':
      return toInverseCase(input, locale);
    default:
      // Exhaustiveness guard: if TypeScript complains here, a CaseMode is unhandled
      mode satisfies never;
      return input;
  }
}

/**
 * Set of minor words that typically remain lowercase in title case
 * (unless they are the first or last word of the title).
 */
const MINOR_WORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'but',
  'or',
  'for',
  'nor',
  'on',
  'at',
  'to',
  'by',
  'of',
  'in',
  'as',
  'is',
  'it',
  'up',
  'so',
  'if',
  'be',
]);

/**
 * Capitalizes the first letter of each word while preserving whitespace.
 * Words are split on whitespace boundaries; spacing tokens are kept intact.
 * If a word starts with a non-letter character (e.g. "123abc"), the first
 * letter after the non-letter prefix is capitalized instead.
 * Note: uses Unicode-aware regex, so accented characters are handled correctly.
 *
 * @param input - The text to capitalize.
 * @param locale - Optional locale for case conversion.
 * @returns The text with each word's first letter uppercased and the rest lowercased.
 */
function capitalizeWords(input: string, locale?: string): string {
  return input
    .split(/(\s+)/)
    .map((word) => {
      // Preserve whitespace tokens as-is
      if (/^\s*$/.test(word)) return word;
      return toUpperFirst(word, locale);
    })
    .join('');
}

/**
 * Converts text to Title Case: major words capitalized, minor words lowercase
 * (unless they are the first or last word).
 * Handles leading/trailing whitespace and preserves multiple-space runs.
 *
 * @param input - The text to convert.
 * @param locale - Optional locale for case conversion.
 * @returns The title-cased text.
 */
function titleCase(input: string, locale?: string): string {
  const words = input.split(/(\s+)/);
  return words
    .map((word, i) => {
      // Preserve whitespace
      if (!word.trim()) return word;
      const lower = toLower(word, locale);
      // First and last words always capitalized
      if (i === 0 || i === words.length - 1) {
        return toUpperFirst(word, locale);
      }
      // Capitalize unless it's a minor word
      if (MINOR_WORDS.has(lower)) {
        return lower;
      }
      return toUpperFirst(word, locale);
    })
    .join('');
}

/**
 * Converts text to sentence case: first word capitalized, rest lowercase.
 * Preserves sentence boundaries (period, exclamation, question mark).
 * If the first character is not a letter (e.g. digit or symbol), it is left
 * unchanged and the first letter after it is capitalized instead.
 *
 * @param input - The text to convert.
 * @param locale - Optional locale for case conversion.
 * @returns The sentence-cased text.
 */
function toSentenceCase(input: string, locale?: string): string {
  // First lowercase everything
  let result = toLower(input, locale);
  // Capitalize first letter of the string (Unicode-aware)
  // If the first character isn't a letter (e.g. number, symbol), leave it and
  // capitalize the first subsequent letter instead
  result = result.replace(
    /^\P{L}*\p{L}/u,
    (match) => match.slice(0, -1) + toUpper(match.slice(-1), locale)
  );
  // Capitalize first letter after sentence-ending punctuation (Unicode-aware)
  result = result.replace(
    /([.!?]\s*)(\p{L})/gu,
    (_, punctuation, letter) => punctuation + toUpper(letter, locale)
  );
  return result;
}

/**
 * Splits input into words by spaces, underscores, hyphens, camelCase boundaries,
 * or transitions between letters and digits.
 *
 * Handles mixed input (space, hyphen, underscore, or camelCase-delimited) and
 * splits on letter↔digit boundaries so that "hello2world" becomes
 * ["hello", "2", "world"] for predictable code-style conversions.
 * This is Unicode-aware: accented characters and non-Latin scripts are supported.
 *
 * @param input - The text to split.
 * @returns An array of individual word strings (may be empty if input is empty).
 */
function splitWords(input: string): string[] {
  // First normalize separators to spaces
  const normalized = input
    .replace(/[-_.]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    // Split on letter↔digit boundaries (e.g. "hello2world" → "hello 2 world")
    .replace(/(\p{L})(\d)/gu, '$1 $2')
    .replace(/(\d)(\p{L})/gu, '$1 $2');
  return normalized.split(/\s+/).filter(Boolean);
}

/**
 * Converts text to camelCase: first word lowercase, subsequent words capitalized, no separators.
 * Handles mixed input (space, hyphen, underscore, or camelCase-delimited).
 *
 * @param input - The text to convert.
 * @param locale - Optional locale for case conversion.
 * @returns The camelCased string, or empty string if no words.
 */
function toCamelCase(input: string, locale?: string): string {
  const words = splitWords(input);
  if (words.length === 0) return '';
  const first = words[0];
  if (!first) return '';
  return (
    toLower(first, locale) +
    words
      .slice(1)
      .map((w) => toUpperFirst(w, locale))
      .join('')
  );
}

/**
 * Converts text to PascalCase: all words capitalized, no separators.
 *
 * @param input - The text to convert.
 * @param locale - Optional locale for case conversion.
 * @returns The PascalCase string, or empty string if no words.
 */
function toPascalCase(input: string, locale?: string): string {
  const words = splitWords(input);
  if (words.length === 0) return '';
  return words.map((w) => toUpperFirst(w, locale)).join('');
}

/**
 * Converts text to snake_case: all words lowercase, separated by underscores.
 *
 * @param input - The text to convert.
 * @param locale - Optional locale for case conversion.
 * @returns The snake_cased string.
 */
function toSnakeCase(input: string, locale?: string): string {
  return splitWords(input)
    .map((w) => toLower(w, locale))
    .join('_');
}

/**
 * Converts text to SCREAMING_SNAKE_CASE: all words uppercase, separated by underscores.
 *
 * @param input - The text to convert.
 * @param locale - Optional locale for case conversion.
 * @returns The SCREAMING_SNAKE_CASED string.
 */
function toScreamingSnakeCase(input: string, locale?: string): string {
  return splitWords(input)
    .map((w) => toUpper(w, locale))
    .join('_');
}

/**
 * Converts text to kebab-case: all words lowercase, separated by hyphens.
 *
 * @param input - The text to convert.
 * @param locale - Optional locale for case conversion.
 * @returns The kebab-cased string.
 */
function toKebabCase(input: string, locale?: string): string {
  return splitWords(input)
    .map((w) => toLower(w, locale))
    .join('-');
}

/**
 * Converts text to Train-Case: all words capitalized, separated by hyphens.
 *
 * @param input - The text to convert.
 * @param locale - Optional locale for case conversion.
 * @returns The train-cased string.
 */
function toTrainCase(input: string, locale?: string): string {
  return splitWords(input)
    .map((w) => toUpperFirst(w, locale))
    .join('-');
}

/**
 * Converts text to SCREAMING-KEBAB-CASE: all words uppercase, separated by hyphens.
 *
 * @param input - The text to convert.
 * @param locale - Optional locale for case conversion.
 * @returns The SCREAMING-KEBAB-CASED string.
 */
function toScreamingKebabCase(input: string, locale?: string): string {
  return splitWords(input)
    .map((w) => toUpper(w, locale))
    .join('-');
}

/**
 * Converts text to dot.case: all words lowercase, separated by dots.
 *
 * @param input - The text to convert.
 * @param locale - Optional locale for case conversion.
 * @returns The dot.cased string.
 */
function toDotCase(input: string, locale?: string): string {
  return splitWords(input)
    .map((w) => toLower(w, locale))
    .join('.');
}

/**
 * Converts text to flatcase: all words lowercase, no separators.
 * Useful for URLs, domain names, and compact identifiers.
 *
 * @param input - The text to convert.
 * @param locale - Optional locale for case conversion.
 * @returns The flatcased string.
 */
function toFlatCase(input: string, locale?: string): string {
  return splitWords(input)
    .map((w) => toLower(w, locale))
    .join('');
}

/**
 * Converts text to alternating case (aLtErNaTiNg): even-letter-indexed letters
 * are lowercase, odd-letter-indexed letters are uppercase.
 * Non-alphabetic characters are preserved as-is and do NOT advance the alternation.
 * Handles Unicode surrogate pairs (emoji, non-BMP characters) correctly.
 *
 * @param input - The text to convert.
 * @returns The alternating-cased string.
 */
function toAlternatingCase(input: string, locale?: string): string {
  let letterIndex = 0;
  return Array.from(input)
    .map((char) => {
      const lower = toLower(char, locale);
      const upper = toUpper(char, locale);
      // Non-letter check: if case-insensitive comparison doesn't change the char,
      // it's not a letter (e.g. spaces, digits, symbols)
      if (lower === upper) return char;
      const result = letterIndex % 2 === 0 ? lower : upper;
      letterIndex++;
      return result;
    })
    .join('');
}

/**
 * Converts text to inverse case: all uppercase letters become lowercase,
 * all lowercase letters become uppercase. Non-alphabetic characters are unchanged.
 * Supports Unicode letters (e.g. café -> CAFÉ) via locale-independent comparison.
 * Handles Unicode surrogate pairs (emoji, non-BMP characters) correctly.
 *
 * @param input - The text to convert.
 * @param locale - Optional locale for case conversion.
 * @returns The inverse-cased string.
 */
function toInverseCase(input: string, locale?: string): string {
  return Array.from(input)
    .map((char) => {
      const lower = toLower(char, locale);
      const upper = toUpper(char, locale);
      if (lower === upper) return char; // Not a letter (e.g. digits, spaces, symbols)
      return char === lower ? upper : lower;
    })
    .join('');
}

/**
 * Converts text according to the specified case mode, processing each line
 * independently when {@link lineByLine} is true. Empty lines are preserved.
 *
 * @param input - The text to convert.
 * @param mode - The case transformation mode to apply.
 * @param lineByLine - When true, each line is converted independently.
 * @returns The converted text, or an empty string if input is empty.
 */
export function convertCaseLines(
  input: string,
  mode: CaseMode,
  lineByLine: boolean,
  locale?: string
): string {
  if (!input) return '';
  if (!lineByLine) return convertCase(input, mode, locale);
  // Preserve trailing newline if present — split keeps trailing empty entries
  const lines = input.split('\n');
  const converted = lines.map((line) => convertCase(line, mode, locale));
  return converted.join('\n');
}

/**
 * Returns a human-readable description of what a case mode does.
 *
 * @param mode - The case mode to describe.
 * @returns A short description string, or empty string for unknown modes.
 */
export function getModeDescription(mode: CaseMode): string {
  const descriptions: Record<CaseMode, string> = {
    lowercase: 'Convert everything to lowercase',
    uppercase: 'Convert everything to UPPERCASE',
    capitalize: 'Capitalize the first letter of each word',
    'title-case': 'Title Case — capitalize major words, keep minor words lowercase',
    'sentence-case': 'Sentence case — capitalize first word of each sentence',
    camelCase: 'lowercase-first camelCase',
    PascalCase: 'UpperCamelCase (PascalCase)',
    snake_case: 'lowercase_words_separated_by_underscores',
    SCREAMING_SNAKE_CASE: 'UPPERCASE_WORDS_SEPARATED_BY_UNDERSCORES',
    'kebab-case': 'lowercase-words-separated-by-hyphens',
    'train-case': 'Capitalized-Words-Separated-By-Hyphens (Train-Case)',
    'SCREAMING-KEBAB-CASE': 'UPPERCASE-WORDS-SEPARATED-BY-HYPHENS',
    'dot.case': 'lowercase.words.separated.by.dots',
    flatcase: 'all lowercase, no separators (flatcase)',
    alternating: 'aLtErNaTiNg CaSe',
    inverse: 'Invert the case of each letter',
  };
  return descriptions[mode] ?? '';
}

/**
 * Returns a short label for a case mode shown as a badge/tag in the UI.
 *
 * @param mode - The case mode to get a label for.
 * @returns A short label string, or the mode name itself for unknown modes.
 */
export function getModeLabel(mode: CaseMode): string {
  const labels: Record<CaseMode, string> = {
    lowercase: 'abc',
    uppercase: 'ABC',
    capitalize: 'Abc',
    'title-case': 'Title',
    'sentence-case': 'Sent',
    camelCase: 'camel',
    PascalCase: 'Pascal',
    snake_case: 'snake',
    SCREAMING_SNAKE_CASE: 'SCREAM',
    'kebab-case': 'kebab',
    'train-case': 'Train',
    'SCREAMING-KEBAB-CASE': 'KEBAB',
    'dot.case': 'dot',
    flatcase: 'flat',
    alternating: 'AlTeRnAtE',
    inverse: 'iNVERSE',
  };
  return labels[mode] ?? mode;
}

/**
 * Groups case modes for UI organization.
 * Each group contains a label and an ordered array of its modes.
 */
export const MODE_GROUPS: { label: string; modes: CaseMode[] }[] = [
  {
    label: 'Basic',
    modes: ['lowercase', 'uppercase', 'capitalize', 'title-case', 'sentence-case'],
  },
  {
    label: 'Code',
    modes: [
      'camelCase',
      'PascalCase',
      'snake_case',
      'SCREAMING_SNAKE_CASE',
      'kebab-case',
      'train-case',
      'SCREAMING-KEBAB-CASE',
    ],
  },
  {
    label: 'Special',
    modes: ['dot.case', 'flatcase', 'alternating', 'inverse'],
  },
];
