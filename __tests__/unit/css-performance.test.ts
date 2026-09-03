import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, extname, relative } from 'path';

/**
 * CSS Performance regression test — Issue #38.
 *
 * `transition-all` / `transition-property: all` forces the browser to animate
 * expensive layout properties (width, height, margin, padding), triggering
 * needless composite recalculations and 60fps frame drops on low-powered
 * devices. All UI should use specific composite properties instead
 * (e.g. transition-colors, transition-opacity, transition-transform).
 */

const ROOT = process.cwd();

function collectCssFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectCssFiles(full, out);
    } else if (extname(entry.name) === '.css') {
      out.push(full);
    }
  }
  return out;
}

function allCssFiles() {
  return [
    ...collectCssFiles(join(ROOT, 'src')),
    ...collectCssFiles(join(ROOT, 'packages/core/src')),
  ];
}

describe('CSS performance (issue #38)', () => {
  it('does not use generic transition-all or transition-property: all', () => {
    const offenders = [];
    for (const file of allCssFiles()) {
      const text = readFileSync(file, 'utf-8');
      // Match either `transition: all`, `transition-property: all` or `transition-all`.
      if (
        /(?:transition|transition-property)\s*:\s*all\b/i.test(text) ||
        /\btransition-all\b/.test(text)
      ) {
        offenders.push(relative(ROOT, file));
      }
    }
    expect(offenders, `Generic transition-all found in: ${offenders.join(', ')}`).toEqual([]);
  });

  it('CSS source files are tracked', () => {
    const files = allCssFiles();
    // Sanity: the guard above must actually scan files.
    expect(files.length).toBeGreaterThan(0);
    const sample = files[0];
    expect(statSync(sample).size).toBeGreaterThan(0);
  });
});
