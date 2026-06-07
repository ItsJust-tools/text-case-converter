import type { Tool } from '@itsjust/core';
import toolConfig from './tool.config';
import type { TextCaseState, CaseMode } from './types';

const VALID_MODES: CaseMode[] = [
  'lowercase',
  'uppercase',
  'capitalize',
  'title-case',
  'camelCase',
  'PascalCase',
  'snake_case',
  'SCREAMING_SNAKE_CASE',
  'kebab-case',
  'SCREAMING-KEBAB-CASE',
  'dot.case',
  'lowercasing',
  'alternating',
  'inverse',
];

/**
 * Type guard for TextCaseState.
 */
function isTextCaseState(value: unknown): value is TextCaseState {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.input === 'string' &&
    typeof v.mode === 'string' &&
    VALID_MODES.includes(v.mode as CaseMode) &&
    (v.showOutput === undefined || typeof v.showOutput === 'boolean') &&
    (v.autoCopy === undefined || typeof v.autoCopy === 'boolean') &&
    (v.lastOutput === undefined || typeof v.lastOutput === 'string')
  );
}

/**
 * The Tool definition for the Text Case Converter.
 */
export const textCaseTool: Tool<TextCaseState> = {
  id: toolConfig.id,
  name: toolConfig.name,
  version: toolConfig.version,
  config: toolConfig,
  initialState: {
    input: '',
    mode: 'lowercase',
    showOutput: true,
    autoCopy: false,
    lastOutput: '',
  },
  serialize: (state) => JSON.stringify({ input: state.input, mode: state.mode }, null, 2),
  deserialize: (data) => {
    if (isTextCaseState(data)) {
      return {
        success: true,
        data: {
          input: data.input,
          mode: data.mode,
          showOutput: data.showOutput ?? true,
          autoCopy: data.autoCopy ?? false,
          lastOutput: data.lastOutput ?? '',
        },
      };
    }
    return {
      success: false,
      error: 'Invalid data format: expected { input: string, mode: CaseMode }',
    };
  },
  exporters: [],
};
