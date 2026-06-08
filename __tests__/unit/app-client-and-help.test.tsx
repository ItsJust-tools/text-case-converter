import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ToolClient from '@/app/tool-client';
import ToolClientWrapper from '@/app/tool-client-wrapper';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/dynamic', () => ({
  default: () => () => <div data-testid="dynamic-tool-client">dynamic-tool-client</div>,
}));

const mockSetData = vi.fn();
const mockToast = vi.fn();

vi.mock('@itsjust/core', () => ({
  ToolShell: ({ toolbar, sidebar, canvas, statusBar }: Record<string, unknown>) => (
    <div data-testid="tool-shell">
      <div>{toolbar as ReactNode}</div>
      <div>{sidebar as ReactNode}</div>
      <div>{canvas as ReactNode}</div>
      <div>{statusBar as ReactNode}</div>
    </div>
  ),
  useTool: () => ({
    state: {
      data: {
        input: 'Hello',
        mode: 'lowercase',
        showOutput: true,
        autoCopy: false,
        lastOutput: '',
      },
      setData: mockSetData,
      isDirty: false,
      lastSaved: 'just now',
    },
    toast: mockToast,
    supportedFormats: ['json'],
    handleExport: vi.fn(),
    importFromFile: vi.fn(),
    isImporting: false,
    toolbarActions: { canUndo: false, canRedo: false, onUndo: vi.fn(), onRedo: vi.fn() },
  }),
}));

vi.mock('@/tool', () => ({
  toolConfig: {
    id: 'text-case-converter',
    name: 'Text Case Converter',
    version: '1.0.0',
    features: { sidebar: true },
    theme: { brand: 'Text Case Converter' },
  },
  ALL_VALID_MODES: [
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
    'lowercasing',
    'alternating',
    'inverse',
  ],
  templateBaseVersion: '1.1.0',
  textCaseTool: {},
  ToolCanvas: ({ state }: { state: { input: string } }) => <div>canvas:{state.input}</div>,
  ToolToolbar: () => <div>toolbar</div>,
  ToolSidebar: ({ state }: { state: { input: string } }) => <div>sidebar:{state.input}</div>,
}));

describe('app client and help page', () => {
  beforeEach(() => {
    mockSetData.mockReset();
    mockToast.mockReset();
  });

  it('renders dynamic tool client wrapper', () => {
    render(<ToolClientWrapper />);
    expect(screen.getByTestId('dynamic-tool-client')).toBeInTheDocument();
  });

  it('renders tool client with toolbar, sidebar, canvas, and status bar', () => {
    render(<ToolClient />);

    expect(screen.getByTestId('tool-shell')).toBeInTheDocument();
    expect(screen.getByText('toolbar')).toBeInTheDocument();
    expect(screen.getByText('canvas:Hello')).toBeInTheDocument();
    expect(screen.getByText('sidebar:Hello')).toBeInTheDocument();
    expect(screen.getByText('Template v1.1.0')).toBeInTheDocument();
    expect(screen.getByText('5 chars')).toBeInTheDocument(); // "Hello".length = 5
  });
});
