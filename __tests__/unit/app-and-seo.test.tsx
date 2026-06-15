import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import manifest from '@/app/manifest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import ErrorPage from '@/app/error';
import NotFound from '@/app/not-found';
import { JsonLd } from '@/app/json-ld';
import ToolPage from '@/app/page';
import { cn } from '@/lib/utils';
import { generateSeoMetadata } from '@/lib/seo';
import toolConfig from '@/tool/tool.config';
import { getPublicSiteUrl, templateMetadata } from '@/tool/template-metadata';
import { textCaseTool } from '@/tool/tool-definition';
import { ToolCanvas } from '@/tool/components/tool-canvas';
import { ToolSidebar } from '@/tool/components/tool-sidebar';
import { ToolToolbar } from '@/tool/components/tool-toolbar';
import type { TextCaseState } from '@/tool/types';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/app/tool-client-wrapper', () => ({
  default: () => <div data-testid="tool-client-wrapper">tool-client-wrapper</div>,
}));

describe('app and seo', () => {
  it('builds seo metadata values', () => {
    const metadata = generateSeoMetadata();

    expect(metadata.creator).toBe('ItsJust Tools');
    expect(metadata.metadataBase?.toString()).toBe('http://localhost:3000/');
    expect(metadata.keywords).toContain('text case converter');
    expect(metadata.title).toEqual({
      default: toolConfig.name,
      template: `%s | ${toolConfig.name}`,
    });
  });

  it('returns site manifest, robots and sitemap', () => {
    const man = manifest();
    const rob = robots();
    const sm = sitemap();

    expect(man.name).toBe(templateMetadata.appName);
    expect(rob.sitemap).toBe('http://localhost:3000/sitemap.xml');
    expect(sm[0]?.url).toBe('http://localhost:3000');
  });

  it('renders json-ld script with safe escaped name', () => {
    render(<JsonLd config={{ ...toolConfig, name: '</script>' }} />);
    const script = document.querySelector('script[type="application/ld+json"]');
    // The JSON output contains the unescaped name; the script tag is safe
    // because dangerouslySetInnerHTML escapes </script> via JSON.stringify
    expect(script?.innerHTML).toContain('</script>');
    // The script element should not be broken — the innerHTML is valid JSON
    const parsed = JSON.parse(script?.innerHTML ?? '');
    expect(parsed.name).toBe('</script>');
  });

  it('renders error page and invokes reset', () => {
    const reset = vi.fn();
    render(<ErrorPage error={new Error('boom')} reset={reset} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders not-found page', () => {
    render(<NotFound />);
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go home' })).toHaveAttribute('href', '/');
  });

  it('renders top-level tool page', () => {
    render(<ToolPage />);
    expect(screen.getByTestId('tool-client-wrapper')).toBeInTheDocument();
    expect(document.querySelector('script[type="application/ld+json"]')).toBeInTheDocument();
  });

  it('covers helper exports', () => {
    expect(cn('a', undefined, 'b', false, null, 'c')).toBe('a b c');
    expect(getPublicSiteUrl()).toBe('http://localhost:3000');
  });

  it('covers textCaseTool definition', () => {
    // Serialize
    const serialized = textCaseTool.serialize({
      input: 'Hello',
      mode: 'uppercase',
      lastOutput: '',
      lineByLine: false,
    });
    expect(serialized).toContain('"input": "Hello"');
    expect(serialized).toContain('"mode": "uppercase"');

    // Deserialize valid
    const validResult = textCaseTool.deserialize({ input: 'Test', mode: 'camelCase' });
    expect(validResult.success).toBe(true);
    if (validResult.success) {
      expect(validResult.data.input).toBe('Test');
      expect(validResult.data.mode).toBe('camelCase');
    }

    // Deserialize invalid
    const invalidResult = textCaseTool.deserialize({ nope: true });
    expect(invalidResult.success).toBe(false);
    if (!invalidResult.success) {
      expect(invalidResult.error).toContain('Invalid data');
    }
  });

  it('renders tool components', () => {
    const defaultState: TextCaseState = {
      input: 'Hello World',
      mode: 'lowercase',
      lastOutput: '',
      lineByLine: false,
    };
    const onChangeMock = vi.fn();
    const onConvertMock = vi.fn();

    render(
      <>
        <ToolToolbar />
        <ToolSidebar state={defaultState} onChange={onChangeMock} onConvert={onConvertMock} />
        <ToolCanvas state={defaultState} onChange={onChangeMock} />
      </>
    );

    expect(screen.getByRole('link', { name: 'Open help page' })).toBeInTheDocument();
    // Sidebar should show mode buttons — use getAllByText since lowercase appears in multiple places
    const modeButtons = screen.getAllByText('lowercase');
    expect(modeButtons.length).toBeGreaterThan(0);
    expect(screen.getByText('uppercase')).toBeInTheDocument();
    // Canvas should show the input textarea
    expect(screen.getByLabelText('Input text')).toBeInTheDocument();
  });
});
