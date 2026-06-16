import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help — Text Case Converter',
  description:
    'Learn how to use the Text Case Converter tool: supported case modes, keyboard shortcuts, locale support, and tips.',
};

/**
 * Help page for the Text Case Converter tool.
 * Provides documentation on all case modes, keyboard shortcuts,
 * locale support, and usage tips.
 */
export default function HelpPage() {
  return (
    <main
      id="main-content"
      className="help-page"
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: 'clamp(1.5rem, 4vw, 3rem)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        lineHeight: 1.7,
        color: 'var(--foreground)',
      }}
    >
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          fontSize: '0.875rem',
          color: 'var(--accent)',
          textDecoration: 'none',
          marginBottom: '1.5rem',
        }}
      >
        ← Back to converter
      </Link>

      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
        Text Case Converter — Help
      </h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 2rem', fontSize: '0.9375rem' }}>
        A privacy-first, client-side tool for converting text between different cases. All
        processing happens in your browser — nothing is sent to any server.
      </p>

      <Section title="Getting Started">
        <p>
          Type or paste text into the input area, then select a case mode from the sidebar or use
          the <kbd style={kbdStyle}>Ctrl+Enter</kbd> shortcut. The output updates in real-time as
          you type or change modes.
        </p>
      </Section>

      <Section title="Supported Case Modes">
        <p>The tool supports 16 case modes, organized into three groups:</p>

        <h3 style={h3Style}>Basic</h3>
        <ModeTable
          rows={[
            { mode: 'lowercase', example: 'hello world', output: 'hello world' },
            { mode: 'UPPERCASE', example: 'Hello World', output: 'HELLO WORLD' },
            { mode: 'Capitalize', example: 'hello world', output: 'Hello World' },
            { mode: 'Title Case', example: 'the quick brown fox', output: 'The Quick Brown Fox' },
            { mode: 'Sentence case', example: 'hello world', output: 'Hello world' },
          ]}
        />

        <h3 style={h3Style}>Code</h3>
        <ModeTable
          rows={[
            { mode: 'camelCase', example: 'hello world', output: 'helloWorld' },
            { mode: 'PascalCase', example: 'hello world', output: 'HelloWorld' },
            { mode: 'snake_case', example: 'hello world', output: 'hello_world' },
            { mode: 'SCREAMING_SNAKE_CASE', example: 'hello world', output: 'HELLO_WORLD' },
            { mode: 'kebab-case', example: 'hello world', output: 'hello-world' },
            { mode: 'Train-Case', example: 'hello world', output: 'Hello-World' },
            { mode: 'SCREAMING-KEBAB-CASE', example: 'hello world', output: 'HELLO-WORLD' },
          ]}
        />

        <h3 style={h3Style}>Special</h3>
        <ModeTable
          rows={[
            { mode: 'dot.case', example: 'hello world', output: 'hello.world' },
            { mode: 'flatcase', example: 'Hello World', output: 'helloworld' },
            { mode: 'aLtErNaTiNg', example: 'hello world', output: 'hElLo WoRlD' },
            { mode: 'iNVERSE', example: 'Hello World', output: 'hELLO wORLD' },
          ]}
        />
      </Section>

      <Section title="Keyboard Shortcuts">
        <ShortcutTable
          rows={[
            { keys: 'Ctrl+Enter', description: 'Apply the selected case transformation' },
            { keys: 'Ctrl+Shift+C', description: 'Copy transformed text to clipboard' },
            { keys: 'Ctrl+Shift+R', description: 'Clear input and reset to defaults' },
            { keys: 'Ctrl+Shift+T', description: 'Cycle through all 16 case modes' },
            { keys: 'Ctrl+Z', description: 'Undo the last change' },
            { keys: 'Ctrl+Shift+Z', description: 'Redo a previously undone change' },
          ]}
        />
        <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
          On macOS, use <kbd style={kbdStyle}>⌘</kbd> instead of <kbd style={kbdStyle}>Ctrl</kbd>.
        </p>
      </Section>

      <Section title="Locale Support">
        <p>
          Some languages have special case conversion rules. Select a locale from the sidebar to
          handle these correctly:
        </p>
        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
          <li>
            <strong>Turkish (tr):</strong> Handles i/İ/ı correctly (e.g., <code>İSTANBUL</code> →{' '}
            <code>istanbul</code>)
          </li>
          <li>
            <strong>German (de):</strong> Handles ß/SS correctly (e.g., <code>straße</code> →{' '}
            <code>STRASSE</code>)
          </li>
          <li>
            <strong>Azerbaijani (az):</strong> Similar to Turkish i/İ/ı rules
          </li>
          <li>
            <strong>Lithuanian (lt):</strong> Handles Lithuanian-specific case rules
          </li>
          <li>
            <strong>Dutch (nl):</strong> Handles Ĳ/ĳ ligature correctly
          </li>
        </ul>
      </Section>

      <Section title="Line-by-Line Mode">
        <p>
          When enabled, each line of multi-line text is converted independently. This is useful when
          you have a list of items that should each be converted separately (e.g., a list of file
          names to convert to kebab-case).
        </p>
      </Section>

      <Section title="Chaining Transformations">
        <p>
          You can chain multiple transformations by using the <strong>Swap Output → Input</strong>
          or <strong>Copy Output to Input</strong> buttons. This lets you, for example:
        </p>
        <ol style={{ paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
          <li>
            Convert <code>hello_world_example</code> to <code>helloWorldExample</code> (snake_case →
            camelCase)
          </li>
          <li>Swap the output to input</li>
          <li>
            Convert <code>helloWorldExample</code> to <code>Hello-World-Example</code> (camelCase →
            Train-Case)
          </li>
        </ol>
      </Section>

      <Section title="Privacy">
        <p>
          This tool runs entirely in your browser. No text is sent to any server, no cookies are
          used for tracking, and no data is stored externally. Your text never leaves your device.
        </p>
      </Section>

      <Section title="Accessibility">
        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
          <li>Dark mode support (automatic or manual toggle)</li>
          <li>High contrast mode for better readability</li>
          <li>Keyboard navigation with visible focus indicators</li>
          <li>Screen reader announcements for output changes</li>
          <li>Skip-to-content link for keyboard users</li>
        </ul>
      </Section>

      <div
        style={{
          marginTop: '2.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border)',
          fontSize: '0.8125rem',
          color: 'var(--muted)',
        }}
      >
        <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
          ← Back to Text Case Converter
        </Link>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Internal helper components                                        */
/* ------------------------------------------------------------------ */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        marginBottom: '1.75rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <h2
        style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          margin: '0 0 0.75rem',
          color: 'var(--foreground)',
        }}
      >
        {title}
      </h2>
      <div style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>{children}</div>
    </section>
  );
}

function ModeTable({ rows }: { rows: { mode: string; example: string; output: string }[] }) {
  return (
    <div
      style={{
        overflowX: 'auto',
        marginBottom: '1rem',
        fontSize: '0.8125rem',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
        }}
      >
        <thead>
          <tr style={{ background: 'var(--muted-bg)' }}>
            <Th>Mode</Th>
            <Th>Example Input</Th>
            <Th>Output</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.mode} style={{ borderTop: '1px solid var(--border)' }}>
              <Td>
                <code style={codeStyle}>{row.mode}</code>
              </Td>
              <Td>{row.example}</Td>
              <Td>
                <code style={codeStyle}>{row.output}</code>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ShortcutTable({ rows }: { rows: { keys: string; description: string }[] }) {
  return (
    <div
      style={{
        overflowX: 'auto',
        marginBottom: '0.5rem',
        fontSize: '0.8125rem',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
        }}
      >
        <thead>
          <tr style={{ background: 'var(--muted-bg)' }}>
            <Th>Shortcut</Th>
            <Th>Description</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.keys} style={{ borderTop: '1px solid var(--border)' }}>
              <Td>
                <kbd style={kbdStyle}>{row.keys}</kbd>
              </Td>
              <Td>{row.description}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: 'left',
        padding: '0.5rem 0.75rem',
        fontWeight: 600,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--muted)',
      }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: '0.5rem 0.75rem', color: 'var(--foreground)' }}>{children}</td>;
}

const kbdStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.125rem 0.375rem',
  background: 'var(--muted-bg)',
  border: '1px solid var(--border)',
  borderRadius: '0.25rem',
  fontFamily: 'ui-monospace, Menlo, Monaco, monospace',
  fontSize: '0.75rem',
  color: 'var(--foreground)',
  whiteSpace: 'nowrap',
};

const codeStyle: React.CSSProperties = {
  fontFamily: 'ui-monospace, Menlo, Monaco, monospace',
  fontSize: '0.75rem',
  background: 'var(--accent-subtle)',
  padding: '0.125rem 0.375rem',
  borderRadius: '0.25rem',
  color: 'var(--accent)',
};

const h3Style: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 600,
  margin: '1rem 0 0.5rem',
  color: 'var(--foreground)',
};
