import type { Community } from '@/lib/types';

/**
 * Example listings deliberately carry no invite, so they render a disabled control
 * rather than a link to nowhere.
 */
export default function JoinButton({
  community,
  size = 'md',
  className = '',
}: {
  community: Community;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const dimensions =
    size === 'lg' ? 'h-11 px-5 text-sm' : size === 'sm' ? 'h-8 px-3 text-xs' : 'h-9 px-4 text-sm';
  const shared = `inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors ${dimensions} ${className}`;

  if (!community.invite) {
    return (
      <span
        aria-disabled="true"
        title="Example listing — no invite"
        className={`${shared} cursor-not-allowed border border-dashed border-line-strong text-ink-3`}
      >
        Example listing
      </span>
    );
  }

  return (
    <a
      href={community.invite}
      target="_blank"
      rel="noreferrer noopener"
      className={`${shared} relative z-10 bg-accent text-accent-ink hover:brightness-110 active:brightness-95`}
    >
      Join
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" aria-hidden="true">
        <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sr-only">{community.name} on Discord, opens in a new tab</span>
    </a>
  );
}
