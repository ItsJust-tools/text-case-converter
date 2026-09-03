import { describe, it, expect } from 'vitest';
import { sanitizeFilename } from '../../src/engines/sanitize-filename';

describe('sanitizeFilename', () => {
  it('leaves safe filenames unchanged', () => {
    expect(sanitizeFilename('my-report.json')).toBe('my-report.json');
    expect(sanitizeFilename('hello world.txt')).toBe('hello world.txt');
  });

  it('replaces reserved characters with dashes', () => {
    expect(sanitizeFilename('a/b\\c:d*e?f"g<h>i|j.txt')).toBe('a-b-c-d-e-f-g-h-i-j.txt');
  });

  it('replaces percent sign', () => {
    expect(sanitizeFilename('100% done.png')).toBe('100- done.png');
  });

  it('strips control characters', () => {
    expect(sanitizeFilename('line\nbreak\u0000null.txt')).toBe('line-break-null.txt');
  });

  it('removes leading dots (hidden files)', () => {
    expect(sanitizeFilename('.hidden.json')).toBe('hidden.json');
    expect(sanitizeFilename('..double.json')).toBe('double.json');
  });

  it('removes trailing dots and spaces', () => {
    expect(sanitizeFilename('trailing.')).toBe('trailing');
    expect(sanitizeFilename('trailing . ')).toBe('trailing');
  });

  it('handles reserved Windows device names', () => {
    expect(sanitizeFilename('CON.txt')).toBe('_CON.txt');
    expect(sanitizeFilename('com1.json')).toBe('_com1.json');
    expect(sanitizeFilename('LPT9.png')).toBe('_LPT9.png');
  });

  it('enforces a maximum length of 100 characters', () => {
    const long = 'a'.repeat(150) + '.json';
    const result = sanitizeFilename(long);
    expect(result.length).toBeLessThanOrEqual(105); // 100 base + '.json'
    expect(result.endsWith('.json')).toBe(true);
    expect(result.slice(0, -5).length).toBe(100);
  });

  it('falls back to a safe default when nothing usable remains', () => {
    expect(sanitizeFilename('')).toBe('export');
    expect(sanitizeFilename('...')).toBe('export');
    expect(sanitizeFilename('   ')).toBe('export');
  });

  it('preserves the extension', () => {
    expect(sanitizeFilename('report.final.json')).toBe('report.final.json');
    expect(sanitizeFilename('no-extension')).toBe('no-extension');
  });
});
