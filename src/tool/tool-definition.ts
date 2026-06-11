import type { Tool } from '@itsjust/core';
import toolConfig from './tool.config';
import type { TextCaseState, CaseMode } from './types';

/** All valid case modes for validation, type checking, and cycling. */
export const ALL_VALID_MODES: readonly CaseMode[] = [
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

/** Convenience alias for internal use. */
const VALID_MODES = ALL_VALID_MODES;

/**
 * Checks whether an unknown value is a valid TextCaseState.
 *
 * @param value - The value to check.
 * @returns `true` if value is a valid TextCaseState, `false` otherwise.
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
    (v.lastOutput === undefined || typeof v.lastOutput === 'string') &&
    (v.lineByLine === undefined || typeof v.lineByLine === 'boolean')
  );
}

/**
 * The Tool definition for the Text Case Converter.
 * Defines default state, serialization, and deserialization logic.
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
    lineByLine: false,
  },
  serialize: (state) =>
    JSON.stringify(
      {
        input: state.input,
        mode: state.mode,
        showOutput: state.showOutput,
        autoCopy: state.autoCopy,
        lastOutput: state.lastOutput,
        lineByLine: state.lineByLine,
      },
      null,
      2
    ),
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
          lineByLine: data.lineByLine ?? false,
        },
      };
    }
    const validModes = VALID_MODES.join(', ');
    return {
      success: false,
      error: `Invalid data format: expected { input: string, mode: CaseMode } — valid modes: ${validModes}`,
    };
  },
  exporters: [],
};
