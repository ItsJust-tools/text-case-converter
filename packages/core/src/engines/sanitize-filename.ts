/**
 * Sanitizes a generated export filename so it is safe to use across
 * Windows, macOS, and Linux filesystems.
 *
 * Handles:
 *  - Reserved characters: `\ / : * ? " < > |`
 *  - Control characters (C0/C1) and other non-printable characters
 *  - Leading dots (hidden files on Unix) and trailing dots/spaces (Windows)
 *  - Reserved Windows device names (CON, PRN, AUX, NUL, COM1-9, LPT1-9)
 *  - Maximum length of 100 characters (excluding the extension)
 *
 * @param filename - The raw filename to sanitize.
 * @returns A filesystem-safe filename.
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return 'export';

  // Split off the extension so we can preserve it while truncating the base.
  // Only treat a trailing dot followed by alphanumerics as a real extension.
  const match = /^(.*?)(\.[A-Za-z0-9]+)?$/.exec(filename);
  const base = match?.[1] ?? filename;
  const extension = match?.[2] ?? '';

  // Replace reserved characters and control characters with a dash.
  let sanitized = base
    .replace(/[/\\?%*:|"<>]/g, '-')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

  // Remove leading dots (hidden files) and trailing dots/spaces (Windows).
  sanitized = sanitized.replace(/^\.+/, '').replace(/[.\s]+$/, '');

  // Guard against reserved Windows device names.
  const deviceName = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.exec(sanitized);
  if (deviceName) {
    sanitized = `_${sanitized}`;
  }

  // Enforce a maximum base length of 100 characters.
  if (sanitized.length > 100) {
    sanitized = sanitized.slice(0, 100).replace(/[.\s]+$/, '');
  }

  // Fall back to a safe default if nothing usable remains.
  if (!sanitized) {
    sanitized = 'export';
  }

  return `${sanitized}${extension}`;
}
