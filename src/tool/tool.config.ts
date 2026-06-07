import type { ToolConfig } from '@itsjust/core';
import packageJson from '../../package.json';

/** The version of the template package this tool was built from. */
export const templateBaseVersion = packageJson.version;

/**
 * Configuration for the Text Case Converter tool.
 */
const toolConfig = {
  id: 'text-case-converter',
  name: 'Text Case Converter',
  description: 'Convert text between different cases — lowercase, UPPERCASE, Title Case, camelCase, snake_case, kebab-case, PascalCase, and more.',
  version: '1.0.0',
  exportFormats: ['json'],
  features: {
    export: false,
    autoSave: true,
    undoRedo: false,
    sidebar: true,
    statusBar: true,
    darkMode: true,
  },
  theme: {
    accent: '#8b5cf6',
    accentHover: '#7c3aed',
    accentSubtle: 'rgba(139, 92, 246, 0.08)',
    brand: 'Text Case Converter',
    icon: '\u{1F520}', /* 🔠 */
  },
  shortcuts: [
    {
      title: 'Text Case Converter',
      shortcuts: [
        { keys: 'Ctrl+Enter', label: 'Convert', description: 'apply the selected case transformation' },
        { keys: 'Ctrl+Shift+C', label: 'Copy Output', description: 'copy transformed text to clipboard' },
        { keys: 'Ctrl+Shift+R', label: 'Reset', description: 'clear input and reset state' },
        { keys: 'Ctrl+Shift+T', label: 'Toggle Case', description: 'cycle through case modes' },
      ],
    },
  ],
} satisfies ToolConfig;

export default toolConfig;