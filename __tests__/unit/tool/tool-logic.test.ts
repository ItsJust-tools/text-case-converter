import { describe, it, expect } from 'vitest';
import { createMockToolState } from '@itsjust/core/testing';
import { textCaseTool } from '@/tool/tool-definition';
import { convertCase, getModeDescription, getModeLabel, MODE_GROUPS } from '@/tool/lib/case-converter';
import type { TextCaseState, CaseMode } from '@/tool/types';

describe('TextCase converter logic', () => {
  describe('convertCase', () => {
    it('returns empty string for empty input', () => {
      expect(convertCase('', 'lowercase')).toBe('');
      expect(convertCase('', 'camelCase')).toBe('');
    });

    it('converts to lowercase', () => {
      expect(convertCase('Hello World', 'lowercase')).toBe('hello world');
      expect(convertCase('HELLO', 'lowercase')).toBe('hello');
    });

    it('converts to UPPERCASE', () => {
      expect(convertCase('Hello World', 'uppercase')).toBe('HELLO WORLD');
      expect(convertCase('hello', 'uppercase')).toBe('HELLO');
    });

    it('capitalizes each word', () => {
      expect(convertCase('hello world', 'capitalize')).toBe('Hello World');
      expect(convertCase('hELLO', 'capitalize')).toBe('Hello');
    });

    it('converts to Title Case', () => {
      expect(convertCase('the quick brown fox', 'title-case')).toBe('The Quick Brown Fox');
      expect(convertCase('a tale of two cities', 'title-case')).toBe('A Tale of Two Cities');
    });

    it('converts to camelCase', () => {
      expect(convertCase('hello world', 'camelCase')).toBe('helloWorld');
      expect(convertCase('hello-world', 'camelCase')).toBe('helloWorld');
      expect(convertCase('hello_world', 'camelCase')).toBe('helloWorld');
      expect(convertCase('HelloWorld', 'camelCase')).toBe('helloWorld');
    });

    it('converts to PascalCase', () => {
      expect(convertCase('hello world', 'PascalCase')).toBe('HelloWorld');
      expect(convertCase('hello-world', 'PascalCase')).toBe('HelloWorld');
    });

    it('converts to snake_case', () => {
      expect(convertCase('hello world', 'snake_case')).toBe('hello_world');
      expect(convertCase('helloWorld', 'snake_case')).toBe('hello_world');
      expect(convertCase('hello-world', 'snake_case')).toBe('hello_world');
    });

    it('converts to SCREAMING_SNAKE_CASE', () => {
      expect(convertCase('hello world', 'SCREAMING_SNAKE_CASE')).toBe('HELLO_WORLD');
    });

    it('converts to kebab-case', () => {
      expect(convertCase('hello world', 'kebab-case')).toBe('hello-world');
      expect(convertCase('helloWorld', 'kebab-case')).toBe('hello-world');
    });

    it('converts to SCREAMING-KEBAB-CASE', () => {
      expect(convertCase('hello world', 'SCREAMING-KEBAB-CASE')).toBe('HELLO-WORLD');
    });

    it('converts to dot.case', () => {
      expect(convertCase('hello world', 'dot.case')).toBe('hello.world');
    });

    it('converts to lowercasing', () => {
      expect(convertCase('Hello World', 'lowercasing')).toBe('hello_world');
    });

    it('converts to alternating case', () => {
      expect(convertCase('hello', 'alternating')).toBe('hElLo');
    });

    it('converts to inverse case', () => {
      expect(convertCase('Hello World', 'inverse')).toBe('hELLO wORLD');
    });

    it('handles non-alphabetic characters in alternating case', () => {
      expect(convertCase('h1', 'alternating')).toBe('h1');
      expect(convertCase('123', 'alternating')).toBe('123');
    });

    it('handles non-alphabetic characters in inverse case', () => {
      expect(convertCase('Hello 123!', 'inverse')).toBe('hELLO 123!');
    });

    it('defaults to returning input for unknown mode', () => {
      expect(convertCase('test', 'invalid-mode' as CaseMode)).toBe('test');
    });
  });

  describe('getModeDescription', () => {
    it('returns a description for each mode', () => {
      const allModes: CaseMode[] = [
        'lowercase', 'uppercase', 'capitalize', 'title-case',
        'camelCase', 'PascalCase', 'snake_case', 'SCREAMING_SNAKE_CASE',
        'kebab-case', 'SCREAMING-KEBAB-CASE', 'dot.case', 'lowercasing',
        'alternating', 'inverse',
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
    });

    it('returns mode as fallback for unknown mode', () => {
      expect(getModeLabel('unknown' as CaseMode)).toBe('unknown');
    });
  });

  describe('MODE_GROUPS', () => {
    it('contains all modes across all groups', () => {
      const allGrouped = MODE_GROUPS.flatMap(g => g.modes);
      expect(allGrouped).toHaveLength(14);
      expect(allGrouped).toContain('lowercase');
      expect(allGrouped).toContain('alternating');
      expect(allGrouped).toContain('SCREAMING-KEBAB-CASE');
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
    });
    expect(state.data.input).toBe('');
    expect(state.data.mode).toBe('lowercase');
  });

  it('updates state', () => {
    const state = createMockToolState<TextCaseState>({
      input: '',
      mode: 'lowercase',
    });
    state.setData((prev) => ({ ...prev, input: 'Hello World' }));
    expect(state.data.input).toBe('Hello World');
  });
});