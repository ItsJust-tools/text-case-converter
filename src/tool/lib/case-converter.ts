import type { CaseMode } from '../types';

/**
 * Converts text according to the specified case mode.
 *
 * @param input - The text to convert.
 * @param mode - The case transformation mode to apply.
 * @returns The converted text, or an empty string if input is empty.
 */
export function convertCase(input: string, mode: CaseMode): string {
  if (!input) return '';

  switch (mode) {
    case 'lowercase':
      return input.toLowerCase();
    case 'uppercase':
      return input.toUpperCase();
    case 'capitalize':
      return capitalizeWords(input);
    case 'title-case':
      return titleCase(input);
    case 'sentence-case':
      return toSentenceCase(input);
    case 'camelCase':
      return toCamelCase(input);
    case 'PascalCase':
      return toPascalCase(input);
    case 'snake_case':
      return toSnakeCase(input);
    case 'SCREAMING_SNAKE_CASE':
      return toScreamingSnakeCase(input);
    case 'kebab-case':
      return toKebabCase(input);
    case 'train-case':
      return toTrainCase(input);
    case 'SCREAMING-KEBAB-CASE':
      return toScreamingKebabCase(input);
    case 'dot.case':
      return toDotCase(input);
    case 'flatcase':
      return toFlatCase(input);
    case 'alternating':
      return toAlternatingCase(input);
    case 'inverse':
      return toInverseCase(input);
    default:
      // Exhaustiveness guard: if TypeScript complains here, a CaseMode is unhandled
      const _exhaustiveCheck: never = mode;
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
 *
 * @param input - The text to capitalize.
 * @returns The text with each word's first letter uppercased and the rest lowercased.
 */
function capitalizeWords(input: string): string {
  return input
    .split(/(\s+)/)
    .map((word) => {
      // Preserve whitespace tokens as-is
      if (/^\s*$/.test(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

/**
 * Converts text to Title Case: major words capitalized, minor words lowercase
 * (unless they are the first or last word).
 *
 * @param input - The text to convert.
 * @returns The title-cased text.
 */
function titleCase(input: string): string {
  const words = input.split(/(\s+)/);
  return words
    .map((word, i) => {
      // Preserve whitespace
      if (!word.trim()) return word;
      const lower = word.toLowerCase();
      // First and last words always capitalized
      if (i === 0 || i === words.length - 1) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      // Capitalize unless it's a minor word
      if (MINOR_WORDS.has(lower)) {
        return lower;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

/**
 * Converts text to sentence case: first word capitalized, rest lowercase.
 * Preserves sentence boundaries (period, exclamation, question mark).
 *
 * @param input - The text to convert.
 * @returns The sentence-cased text.
 */
function toSentenceCase(input: string): string {
  // First lowercase everything
  let result = input.toLowerCase();
  // Capitalize first letter of the string (Unicode-aware)
  result = result.replace(/^\p{L}/u, (first) => first.toUpperCase());
  // Capitalize first letter after sentence-ending punctuation (Unicode-aware)
  result = result.replace(
    /([.!?]\s*)(\p{L})/gu,
    (_, punctuation, letter) => punctuation + letter.toUpperCase()
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
 *
 * @param input - The text to split.
 * @returns An array of individual word strings.
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
 * @returns The camelCased string, or empty string if no words.
 */
function toCamelCase(input: string): string {
  const words = splitWords(input);
  if (words.length === 0) return '';
  const first = words[0];
  if (!first) return '';
  return (
    first.toLowerCase() +
    words
      .slice(1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('')
  );
}

/**
 * Converts text to PascalCase: all words capitalized, no separators.
 *
 * @param input - The text to convert.
 * @returns The PascalCase string, or empty string if no words.
 */
function toPascalCase(input: string): string {
  const words = splitWords(input);
  if (words.length === 0) return '';
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

/**
 * Converts text to snake_case: all words lowercase, separated by underscores.
 *
 * @param input - The text to convert.
 * @returns The snake_cased string.
 */
function toSnakeCase(input: string): string {
  return splitWords(input)
    .map((w) => w.toLowerCase())
    .join('_');
}

/**
 * Converts text to SCREAMING_SNAKE_CASE: all words uppercase, separated by underscores.
 *
 * @param input - The text to convert.
 * @returns The SCREAMING_SNAKE_CASED string.
 */
function toScreamingSnakeCase(input: string): string {
  return splitWords(input)
    .map((w) => w.toUpperCase())
    .join('_');
}

/**
 * Converts text to kebab-case: all words lowercase, separated by hyphens.
 *
 * @param input - The text to convert.
 * @returns The kebab-cased string.
 */
function toKebabCase(input: string): string {
  return splitWords(input)
    .map((w) => w.toLowerCase())
    .join('-');
}

/**
 * Converts text to Train-Case: all words capitalized, separated by hyphens.
 *
 * @param input - The text to convert.
 * @returns The train-cased string.
 */
function toTrainCase(input: string): string {
  return splitWords(input)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('-');
}

/**
 * Converts text to SCREAMING-KEBAB-CASE: all words uppercase, separated by hyphens.
 *
 * @param input - The text to convert.
 * @returns The SCREAMING-KEBAB-CASED string.
 */
function toScreamingKebabCase(input: string): string {
  return splitWords(input)
    .map((w) => w.toUpperCase())
    .join('-');
}

/**
 * Converts text to dot.case: all words lowercase, separated by dots.
 *
 * @param input - The text to convert.
 * @returns The dot.cased string.
 */
function toDotCase(input: string): string {
  return splitWords(input)
    .map((w) => w.toLowerCase())
    .join('.');
}

/**
 * Converts text to flatcase: all words lowercase, no separators.
 * Useful for URLs, domain names, and compact identifiers.
 *
 * @param input - The text to convert.
 * @returns The flatcased string.
 */
function toFlatCase(input: string): string {
  return splitWords(input)
    .map((w) => w.toLowerCase())
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
function toAlternatingCase(input: string): string {
  let letterIndex = 0;
  return Array.from(input)
    .map((char) => {
      const lower = char.toLowerCase();
      const upper = char.toUpperCase();
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
 * @returns The inverse-cased string.
 */
function toInverseCase(input: string): string {
  return Array.from(input)
    .map((char) => {
      const lower = char.toLowerCase();
      const upper = char.toUpperCase();
      if (lower === upper) return char; // Not a letter (e.g. digits, spaces, symbols)
      return char === lower ? upper : lower;
    })
    .join('');
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
