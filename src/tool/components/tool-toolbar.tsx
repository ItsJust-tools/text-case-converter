'use client';

import Link from 'next/link';

export function ToolToolbar() {
  return (
    <div className="case-toolbar">
      <Link href="/help" className="toolbar-btn toolbar-btn--help" aria-label="Open help page">
        Help
      </Link>
    </div>
  );
}
