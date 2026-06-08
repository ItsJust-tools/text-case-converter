import type { CaseMode } from '../types';

/**
 * Converts text according to the specified case mode.
 */
export function convertCase(input: string, mode: CaseMode): string {
  if (!input) return '';

  switch (mode) {
    case 'lowercase':
      return input.toLowerCase();
    case 'uppercase':
      return input.toUpperCase();
    case 'capitalize':
      return input
        .split(/(\s+)/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
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
    case 'lowercasing':
      return splitWords(input)
        .map((w) => w.toLowerCase())
        .join('_');
    case 'alternating':
      return toAlternatingCase(input);
    case 'inverse':
      return toInverseCase(input);
    default:
      return input;
  }
}

/** Small words that typically remain lowercase in title case. */
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
 */
function toSentenceCase(input: string): string {
  // First lowercase everything
  let result = input.toLowerCase();
  // Capitalize first letter of the string
  result = result.replace(/^\w/, (first) => first.toUpperCase());
  // Capitalize first letter after sentence-ending punctuation
  result = result.replace(/([.!?]\s*)(\w)/g, (_, punctuation, letter) => punctuation + letter.toUpperCase());
  return result;
}

/** Splits input into words by spaces, underscores, hyphens, or camelCase boundaries. */
function splitWords(input: string): string[] {
  // First normalize separators to spaces
  const normalized = input
    .replace(/[-_.]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
  return normalized.split(/\s+/).filter(Boolean);
}

function toCamelCase(input: string): string {
  const words = splitWords(input);
  if (words.length === 0) return '';
  const first = words[0];
  if (!first) return '';
  const rest = words.slice(1);
  return (
    first.toLowerCase() +
    rest.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')
  );
}

function toPascalCase(input: string): string {
  const words = splitWords(input);
  if (words.length === 0) return '';
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

function toSnakeCase(input: string): string {
  return splitWords(input)
    .map((w) => w.toLowerCase())
    .join('_');
}

function toScreamingSnakeCase(input: string): string {
  return splitWords(input)
    .map((w) => w.toUpperCase())
    .join('_');
}

function toKebabCase(input: string): string {
  return splitWords(input)
    .map((w) => w.toLowerCase())
    .join('-');
}

function toTrainCase(input: string): string {
  return splitWords(input)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('-');
}

function toScreamingKebabCase(input: string): string {
  return splitWords(input)
    .map((w) => w.toUpperCase())
    .join('-');
}

function toDotCase(input: string): string {
  return splitWords(input)
    .map((w) => w.toLowerCase())
    .join('.');
}

function toAlternatingCase(input: string): string {
  return input
    .split('')
    .map((char, i) => (i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
    .join('');
}

function toInverseCase(input: string): string {
  return input
    .split('')
    .map((char) => {
      if (char >= 'a' && char <= 'z') return char.toUpperCase();
      if (char >= 'A' && char <= 'Z') return char.toLowerCase();
      return char;
    })
    .join('');
}

/**
 * Returns a human-readable description of what a case mode does.
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
    lowercasing: 'lowercase_with_underscores',
    alternating: 'aLtErNaTiNg CaSe',
    inverse: 'Invert the case of each letter',
  };
  return descriptions[mode] ?? '';
}

/**
 * Returns a short label for a case mode shown as a badge/tag.
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
    lowercasing: 'l_',
    alternating: 'AlTeRnAtE',
    inverse: 'iNVERSE',
  };
  return labels[mode] ?? mode;
}

/**
 * Groups case modes for UI organization.
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
    modes: ['dot.case', 'lowercasing', 'alternating', 'inverse'],
  },
];
