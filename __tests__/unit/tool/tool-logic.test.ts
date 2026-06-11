import { describe, it, expect } from 'vitest';
import { createMockToolState } from '@itsjust/core/testing';
import { textCaseTool } from '@/tool/tool-definition';
import {
  convertCase,
  getModeDescription,
  getModeLabel,
  MODE_GROUPS,
} from '@/tool/lib/case-converter';
import type { TextCaseState, CaseMode } from '@/tool/types';

describe('TextCase converter logic', () => {
  describe('convertCase', () => {
    it('returns empty string for empty input', () => {
      expect(convertCase('', 'lowercase')).toBe('');
      expect(convertCase('', 'camelCase')).toBe('');
      expect(convertCase('', 'alternating')).toBe('');
    });

    it('converts to lowercase', () => {
      expect(convertCase('Hello World', 'lowercase')).toBe('hello world');
      expect(convertCase('HELLO', 'lowercase')).toBe('hello');
      expect(convertCase('MIXED Case 123!', 'lowercase')).toBe('mixed case 123!');
    });

    it('converts to UPPERCASE', () => {
      expect(convertCase('Hello World', 'uppercase')).toBe('HELLO WORLD');
      expect(convertCase('hello', 'uppercase')).toBe('HELLO');
      expect(convertCase('123 abc', 'uppercase')).toBe('123 ABC');
    });

    it('capitalizes each word preserving whitespace', () => {
      expect(convertCase('hello world', 'capitalize')).toBe('Hello World');
      expect(convertCase('hELLO', 'capitalize')).toBe('Hello');
      expect(convertCase('hello   world', 'capitalize')).toBe('Hello   World');
      expect(convertCase('  hello world', 'capitalize')).toBe('  Hello World');
      expect(convertCase('hello', 'capitalize')).toBe('Hello');
    });

    it('converts to Title Case', () => {
      expect(convertCase('the quick brown fox', 'title-case')).toBe('The Quick Brown Fox');
      expect(convertCase('a tale of two cities', 'title-case')).toBe('A Tale of Two Cities');
      expect(convertCase('the', 'title-case')).toBe('The');
      expect(convertCase('the end', 'title-case')).toBe('The End');
    });

    it('converts to Sentence Case', () => {
      expect(convertCase('hello world', 'sentence-case')).toBe('Hello world');
      expect(convertCase('hello. world', 'sentence-case')).toBe('Hello. World');
      expect(convertCase('first sentence. second sentence! third?', 'sentence-case')).toBe(
        'First sentence. Second sentence! Third?'
      );
      expect(convertCase('', 'sentence-case')).toBe('');
      expect(convertCase('über cool. nächste sentence', 'sentence-case')).toBe(
        'Über cool. Nächste sentence'
      );
    });

    it('converts to camelCase', () => {
      expect(convertCase('hello world', 'camelCase')).toBe('helloWorld');
      expect(convertCase('hello-world', 'camelCase')).toBe('helloWorld');
      expect(convertCase('hello_world', 'camelCase')).toBe('helloWorld');
      expect(convertCase('HelloWorld', 'camelCase')).toBe('helloWorld');
      expect(convertCase('HELLO WORLD', 'camelCase')).toBe('helloWorld');
    });

    it('converts to PascalCase', () => {
      expect(convertCase('hello world', 'PascalCase')).toBe('HelloWorld');
      expect(convertCase('hello-world', 'PascalCase')).toBe('HelloWorld');
      expect(convertCase('hello_world', 'PascalCase')).toBe('HelloWorld');
      expect(convertCase('helloWorld', 'PascalCase')).toBe('HelloWorld');
    });

    it('converts to snake_case', () => {
      expect(convertCase('hello world', 'snake_case')).toBe('hello_world');
      expect(convertCase('helloWorld', 'snake_case')).toBe('hello_world');
      expect(convertCase('hello-world', 'snake_case')).toBe('hello_world');
    });

    it('converts to SCREAMING_SNAKE_CASE', () => {
      expect(convertCase('hello world', 'SCREAMING_SNAKE_CASE')).toBe('HELLO_WORLD');
      expect(convertCase('fooBar', 'SCREAMING_SNAKE_CASE')).toBe('FOO_BAR');
    });

    it('converts to kebab-case', () => {
      expect(convertCase('hello world', 'kebab-case')).toBe('hello-world');
      expect(convertCase('helloWorld', 'kebab-case')).toBe('hello-world');
      expect(convertCase('hello_world', 'kebab-case')).toBe('hello-world');
    });

    it('converts to Train-Case', () => {
      expect(convertCase('hello world', 'train-case')).toBe('Hello-World');
      expect(convertCase('helloWorld', 'train-case')).toBe('Hello-World');
      expect(convertCase('hello_world', 'train-case')).toBe('Hello-World');
      expect(convertCase('hello-world', 'train-case')).toBe('Hello-World');
    });

    it('converts to SCREAMING-KEBAB-CASE', () => {
      expect(convertCase('hello world', 'SCREAMING-KEBAB-CASE')).toBe('HELLO-WORLD');
      expect(convertCase('fooBar', 'SCREAMING-KEBAB-CASE')).toBe('FOO-BAR');
    });

    it('converts to dot.case', () => {
      expect(convertCase('hello world', 'dot.case')).toBe('hello.world');
      expect(convertCase('helloWorld', 'dot.case')).toBe('hello.world');
    });

    it('converts to flatcase', () => {
      expect(convertCase('Hello World', 'flatcase')).toBe('helloworld');
      expect(convertCase('hello-world', 'flatcase')).toBe('helloworld');
      expect(convertCase('helloWorld', 'flatcase')).toBe('helloworld');
      expect(convertCase('hello_world', 'flatcase')).toBe('helloworld');
      expect(convertCase('HELLO WORLD', 'flatcase')).toBe('helloworld');
    });

    it('converts to alternating case', () => {
      expect(convertCase('hello', 'alternating')).toBe('hElLo');
      expect(convertCase('HELLO', 'alternating')).toBe('hElLo');
      expect(convertCase('hello world', 'alternating')).toBe('hElLo WoRlD');
    });

    it('converts to inverse case', () => {
      expect(convertCase('Hello World', 'inverse')).toBe('hELLO wORLD');
      expect(convertCase('ABC', 'inverse')).toBe('abc');
      expect(convertCase('Österreich', 'inverse')).toBe('öSTERREICH');
    });

    it('handles non-alphabetic characters in alternating case', () => {
      expect(convertCase('h1', 'alternating')).toBe('h1');
      expect(convertCase('123', 'alternating')).toBe('123');
      expect(convertCase('a1b2c3', 'alternating')).toBe('a1B2c3');
    });

    it('handles alternating case with mixed separators', () => {
      // Underscores and hyphens are treated as separators, not letters
      expect(convertCase('hello_world', 'alternating')).toBe('hElLo_WoRlD');
      expect(convertCase('hello-world', 'alternating')).toBe('hElLo-WoRlD');
      expect(convertCase('hello.world', 'alternating')).toBe('hElLo.WoRlD');
    });

    it('handles alternating case with empty or single character', () => {
      expect(convertCase('', 'alternating')).toBe('');
      expect(convertCase('a', 'alternating')).toBe('a');
      expect(convertCase('A', 'alternating')).toBe('a');
      expect(convertCase('ab', 'alternating')).toBe('aB');
    });

    it('handles non-alphabetic characters in inverse case', () => {
      expect(convertCase('Hello 123!', 'inverse')).toBe('hELLO 123!');
      expect(convertCase('123', 'inverse')).toBe('123');
      expect(convertCase('Café', 'inverse')).toBe('cAFÉ');
    });

    it('converts single characters correctly', () => {
      expect(convertCase('a', 'uppercase')).toBe('A');
      expect(convertCase('A', 'lowercase')).toBe('a');
      expect(convertCase('a', 'capitalize')).toBe('A');
      expect(convertCase('a', 'alternating')).toBe('a');
      expect(convertCase('a', 'inverse')).toBe('A');
      expect(convertCase('a', 'camelCase')).toBe('a');
      expect(convertCase('a', 'PascalCase')).toBe('A');
    });

    it('handles sentence-case with non-letter first character', () => {
      // Number first — should skip and capitalize the first letter instead
      expect(convertCase('123 hello world', 'sentence-case')).toBe('123 Hello world');
      // Symbol first — should skip and capitalize the first letter
      expect(convertCase('!hello world', 'sentence-case')).toBe('!Hello world');
      // Dash/underscore first — should skip and capitalize the first letter
      expect(convertCase('-hello world', 'sentence-case')).toBe('-Hello world');
    });

    it('handles sentence-case with sentence-ending punctuation followed by non-letter', () => {
      expect(convertCase('hello. 123 world', 'sentence-case')).toBe('Hello. 123 world');
      // Parentheses after punctuation: no space between ')' and next letter, so not a new sentence
      expect(convertCase('stop! (wait) more.', 'sentence-case')).toBe('Stop! (wait) more.');
    });

    it('handles sentence-case with leading/trailing whitespace', () => {
      expect(convertCase('  hello world', 'sentence-case')).toBe('  Hello world');
      expect(convertCase('hello   ', 'sentence-case')).toBe('Hello   ');
    });

    it('handles sentence-case with unicode sentence starters', () => {
      expect(convertCase('über cool. nächste satz', 'sentence-case')).toBe(
        'Über cool. Nächste satz'
      );
    });

    it('handles leading and trailing whitespace', () => {
      expect(convertCase('  hello', 'uppercase')).toBe('  HELLO');
      expect(convertCase('hello  ', 'lowercase')).toBe('hello  ');
    });

    it('handles mixed separators for code-style conversions', () => {
      expect(convertCase('foo_bar-baz', 'camelCase')).toBe('fooBarBaz');
      expect(convertCase('foo_bar-baz', 'PascalCase')).toBe('FooBarBaz');
      expect(convertCase('foo_BAR-baz', 'snake_case')).toBe('foo_bar_baz');
    });

    it('splits on letter-to-digit boundaries for code-style conversions', () => {
      expect(convertCase('hello2world', 'camelCase')).toBe('hello2World');
      expect(convertCase('hello2world', 'PascalCase')).toBe('Hello2World');
      expect(convertCase('hello2world', 'snake_case')).toBe('hello_2_world');
      expect(convertCase('hello2world', 'kebab-case')).toBe('hello-2-world');
      expect(convertCase('version1point5', 'camelCase')).toBe('version1Point5');
      expect(convertCase('abc123def', 'snake_case')).toBe('abc_123_def');
    });

    it('handles surrogate pairs (emoji) in alternating and inverse case', () => {
      // Emoji should be preserved as-is in alternating case
      expect(convertCase('a😀b', 'alternating')).toBe('a😀B');
      // Emoji should be preserved as-is in inverse case
      expect(convertCase('a😀b', 'inverse')).toBe('A😀B');
    });

    it('defaults to returning input for unknown mode', () => {
      expect(convertCase('test', 'invalid-mode' as CaseMode)).toBe('test');
    });
  });

  describe('getModeDescription', () => {
    it('returns a description for each mode', () => {
      const allModes: CaseMode[] = [
        'lowercase',
        'uppercase',
        'capitalize',
        'title-case',
        'sentence-case',
        'camelCase',
        'PascalCase',
        'snake_case',
        'SCREAMING_SNAKE_CASE',
        'kebab-case',
        'train-case',
        'SCREAMING-KEBAB-CASE',
        'dot.case',
        'flatcase',
        'alternating',
        'inverse',
      ];
      for (const mode of allModes) {
        expect(getModeDescription(mode)).toBeTruthy();
      }
    });

    it('returns empty string for unknown mode', () => {
      expect(getModeDescription('unknown' as CaseMode)).toBe('');
    });
  });

  describe('getModeLabel', () => {
    it('returns a label for each mode', () => {
      expect(getModeLabel('lowercase')).toBe('abc');
      expect(getModeLabel('uppercase')).toBe('ABC');
      expect(getModeLabel('camelCase')).toBe('camel');
      expect(getModeLabel('sentence-case')).toBe('Sent');
      expect(getModeLabel('train-case')).toBe('Train');
    });

    it('returns mode as fallback for unknown mode', () => {
      expect(getModeLabel('unknown' as CaseMode)).toBe('unknown');
    });

    it('returns labels for all 16 modes', () => {
      const modes: CaseMode[] = [
        'lowercase',
        'uppercase',
        'capitalize',
        'title-case',
        'sentence-case',
        'camelCase',
        'PascalCase',
        'snake_case',
        'SCREAMING_SNAKE_CASE',
        'kebab-case',
        'train-case',
        'SCREAMING-KEBAB-CASE',
        'dot.case',
        'flatcase',
        'alternating',
        'inverse',
      ];
      for (const mode of modes) {
        expect(getModeLabel(mode)).toBeTruthy();
      }
    });
  });

  describe('MODE_GROUPS', () => {
    it('contains all 16 modes across all groups', () => {
      const allGrouped = MODE_GROUPS.flatMap((g) => g.modes);
      expect(allGrouped).toHaveLength(16);
      expect(allGrouped).toContain('lowercase');
      expect(allGrouped).toContain('alternating');
      expect(allGrouped).toContain('flatcase');
      expect(allGrouped).toContain('SCREAMING-KEBAB-CASE');
      expect(allGrouped).toContain('sentence-case');
      expect(allGrouped).toContain('train-case');
      expect(allGrouped).toContain('inverse');
    });

    it('assigns each mode to exactly one group', () => {
      const seen = new Set<CaseMode>();
      for (const group of MODE_GROUPS) {
        for (const mode of group.modes) {
          expect(seen.has(mode)).toBe(false);
          seen.add(mode);
        }
      }
      expect(seen.size).toBe(16);
    });
  });

  describe('exhaustive mode coverage', () => {
    it('converts every CaseMode even with numbers and special chars', () => {
      const input = 'Hello 123 World!';
      const allModes: CaseMode[] = [
        'lowercase',
        'uppercase',
        'capitalize',
        'title-case',
        'sentence-case',
        'camelCase',
        'PascalCase',
        'snake_case',
        'SCREAMING_SNAKE_CASE',
        'kebab-case',
        'train-case',
        'SCREAMING-KEBAB-CASE',
        'dot.case',
        'flatcase',
        'alternating',
        'inverse',
      ];
      for (const mode of allModes) {
        const result = convertCase(input, mode);
        expect(result).toBeTruthy();
        // Output should never be empty for non-empty input
        expect(result.length).toBeGreaterThan(0);
      }
    });

    it('handles unicode and accented characters in code-style conversions', () => {
      expect(convertCase('über cool', 'camelCase')).toBe('überCool');
      expect(convertCase('über cool', 'PascalCase')).toBe('ÜberCool');
      expect(convertCase('über cool', 'snake_case')).toBe('über_cool');
      expect(convertCase('naïve café', 'kebab-case')).toBe('naïve-café');
    });

    it('handles trailing separators gracefully', () => {
      expect(convertCase('hello world ', 'camelCase')).toBe('helloWorld');
      expect(convertCase('hello world-', 'PascalCase')).toBe('HelloWorld');
      expect(convertCase('hello world_', 'snake_case')).toBe('hello_world');
      expect(convertCase('-hello world', 'camelCase')).toBe('helloWorld');
    });
  });
});

describe('TextCaseTool definition', () => {
  it('initializes with default state', () => {
    const tool = textCaseTool;
    expect(tool.initialState.input).toBe('');
    expect(tool.initialState.mode).toBe('lowercase');
    expect(tool.initialState.showOutput).toBe(true);
    expect(tool.initialState.autoCopy).toBe(false);
    expect(tool.initialState.lastOutput).toBe('');
  });

  it('serializes state to JSON', () => {
    const json = textCaseTool.serialize({ input: 'Hello', mode: 'uppercase' } as TextCaseState);
    const parsed = JSON.parse(json);
    expect(parsed.input).toBe('Hello');
    expect(parsed.mode).toBe('uppercase');
  });

  it('deserializes valid state object', () => {
    const result = textCaseTool.deserialize({ input: 'Test', mode: 'camelCase' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.input).toBe('Test');
      expect(result.data.mode).toBe('camelCase');
    }
  });

  it('deserializes with train-case mode', () => {
    const result = textCaseTool.deserialize({ input: 'hello world', mode: 'train-case' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.mode).toBe('train-case');
    }
  });

  it('deserializes with sentence-case mode', () => {
    const result = textCaseTool.deserialize({ input: 'hello world', mode: 'sentence-case' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.mode).toBe('sentence-case');
    }
  });

  it('deserialize fills defaults for missing optional fields', () => {
    const result = textCaseTool.deserialize({ input: 'Hi', mode: 'uppercase' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.showOutput).toBe(true);
      expect(result.data.autoCopy).toBe(false);
      expect(result.data.lastOutput).toBe('');
    }
  });

  it('rejects null data', () => {
    const result = textCaseTool.deserialize(null);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain('Invalid data');
  });

  it('rejects non-object data', () => {
    const result = textCaseTool.deserialize('string');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain('Invalid data');
  });

  it('rejects object without input', () => {
    const result = textCaseTool.deserialize({ mode: 'lowercase' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain('Invalid data');
  });

  it('rejects object with non-string input', () => {
    const result = textCaseTool.deserialize({ input: 123, mode: 'lowercase' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain('Invalid data');
  });

  it('rejects object with invalid mode', () => {
    const result = textCaseTool.deserialize({ input: 'test', mode: 'invalid-mode' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain('Invalid data');
  });

  it('rejects object with non-string mode', () => {
    const result = textCaseTool.deserialize({ input: 'test', mode: 42 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain('Invalid data');
  });
});

describe('createMockToolState with TextCaseState', () => {
  it('initializes with default state', () => {
    const state = createMockToolState<TextCaseState>({
      input: '',
      mode: 'lowercase',
      showOutput: true,
      autoCopy: false,
      lastOutput: '',
      lineByLine: false,
    });
    expect(state.data.input).toBe('');
    expect(state.data.mode).toBe('lowercase');
  });

  it('updates state', () => {
    const state = createMockToolState<TextCaseState>({
      input: '',
      mode: 'lowercase',
      showOutput: true,
      autoCopy: false,
      lastOutput: '',
      lineByLine: false,
    });
    state.setData((prev) => ({ ...prev, input: 'Hello World' }));
    expect(state.data.input).toBe('Hello World');
  });

  it('supports train-case and sentence-case modes', () => {
    const trainState = createMockToolState<TextCaseState>({
      input: 'hello world',
      mode: 'train-case',
      showOutput: true,
      autoCopy: false,
      lastOutput: '',
      lineByLine: false,
    });
    expect(trainState.data.mode).toBe('train-case');

    const sentenceState = createMockToolState<TextCaseState>({
      input: 'hello world',
      mode: 'sentence-case',
      showOutput: true,
      autoCopy: false,
      lastOutput: '',
      lineByLine: false,
    });
    expect(sentenceState.data.mode).toBe('sentence-case');
  });
});
