'use client';

import Link from 'next/link';

/**
 * Truncates and sanitizes an error message for safe display to the user.
 * Prevents exposing overly long or sensitive internal error details.
 *
 * @param error - The caught error object.
 * @returns A safe, user-friendly error message string.
 */
function safeErrorMessage(error: Error & { digest?: string }): string {
  if (!error.message) return 'An unexpected error occurred.';
  // Limit length to avoid rendering huge error dumps
  if (error.message.length > 200) {
    return error.message.slice(0, 197) + '...';
  }
  return error.message;
}

/**
 * Error page displayed when a runtime error is caught by the Next.js error boundary.
 * Provides a "Try again" button and a link back to the home page.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const displayMessage = safeErrorMessage(error);

  return (
    <div className="error-page">
      <div className="error-card">
        <div className="error-icon">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 3L25 24H3L14 3z" />
            <path d="M14 10v6" />
            <circle cx="14" cy="20" r="0.5" fill="currentColor" />
          </svg>
        </div>
        <h1>Something went wrong</h1>
        <p>{displayMessage}</p>
        <div className="error-actions">
          <button onClick={reset} className="error-btn-primary">
            Try again
          </button>
          <Link href="/" className="error-btn-secondary">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
