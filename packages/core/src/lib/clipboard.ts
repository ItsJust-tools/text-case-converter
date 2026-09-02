/**
 * Clipboard helpers with graceful fallback.
 *
 * `navigator.clipboard.writeText` rejects when the page is loaded in an
 * unauthenticated iframe, over plain HTTP (e.g. local staging), or when the
 * browser's clipboard permission is denied by policy. To keep copy operations
 * reliable in those environments we fall back to the legacy
 * `document.execCommand("copy")` path using an off-screen textarea.
 */

/**
 * Copies `text` to the system clipboard.
 *
 * Tries the modern async Clipboard API first. If it is unavailable or rejects,
 * falls back to a synchronous `document.execCommand("copy")` on a temporary
 * off-screen textarea. Returns `true` when the copy succeeded, `false`
 * otherwise (e.g. the fallback was also blocked).
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof text !== 'string' || text.length === 0) {
    return false;
  }

  // 1) Modern async Clipboard API (secure contexts only).
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the legacy path below.
    }
  }

  // 2) Legacy fallback: execCommand("copy") on an off-screen textarea.
  return copyWithExecCommand(text);
}

/**
 * Reads text from the system clipboard.
 *
 * Tries the modern async Clipboard API first. If it is unavailable or rejects
 * (insecure origins, permission denials, iframes), falls back to a legacy
 * `document.execCommand("paste")` on a temporary off-screen textarea. Returns
 * the pasted text, or `null` when no text could be read.
 */
export async function readTextFromClipboard(): Promise<string | null> {
  if (navigator.clipboard?.readText) {
    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch {
      // Fall through to the legacy path below.
    }
  }

  return readWithExecCommand();
}

/**
 * Legacy read path using `document.execCommand("paste")`.
 *
 * Creates a temporary, off-screen textarea, focuses it, issues the paste
 * command, and reads back the resulting value. The textarea is always removed
 * afterwards, even on error.
 */
export function readWithExecCommand(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const textarea = document.createElement('textarea');
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';

  document.body.appendChild(textarea);

  let value: string | null = null;
  try {
    textarea.focus();
    textarea.select();
    if (document.execCommand('paste')) {
      value = textarea.value || null;
    }
  } catch {
    value = null;
  } finally {
    document.body.removeChild(textarea);
  }

  return value;
}

/**
 * Legacy copy path using `document.execCommand("copy")`.
 *
 * Creates a temporary, off-screen textarea, selects its contents, and issues
 * the copy command. The textarea is always removed afterwards, even on error.
 */
export function copyWithExecCommand(text: string): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  // Keep it off-screen and non-interactive so it never flashes or steals focus.
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';

  document.body.appendChild(textarea);

  let succeeded = false;
  try {
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    succeeded = document.execCommand('copy');
  } catch {
    succeeded = false;
  } finally {
    document.body.removeChild(textarea);
  }

  return succeeded;
}
