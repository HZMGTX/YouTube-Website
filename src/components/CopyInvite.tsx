'use client';

import { toast } from './Toast';

export default function CopyInvite({ invite, className = '' }: { invite: string; className?: string }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(invite);
      toast('Invite copied');
    } catch {
      // Clipboard access is blocked in some embedded contexts; show the link instead.
      window.prompt('Copy this invite link', invite);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy invite link"
      className={`grid size-9 place-items-center rounded-lg border border-line text-ink-2 transition-colors hover:border-line-strong hover:text-ink ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
        <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M5 15V6a1 1 0 0 1 1-1h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="sr-only">Copy invite link</span>
    </button>
  );
}
