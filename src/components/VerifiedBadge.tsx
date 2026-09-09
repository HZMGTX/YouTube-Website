export default function VerifiedBadge({ className = 'size-4' }: { className?: string }) {
  return (
    <span title="Verified listing" className="inline-flex shrink-0 items-center text-accent">
      <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
        <path
          d="m12 3 2.2 1.6 2.7-.2.9 2.6 2.2 1.6-.9 2.6.9 2.6-2.2 1.6-.9 2.6-2.7-.2L12 21l-2.2-1.6-2.7.2-.9-2.6L4 15.4l.9-2.6L4 10.2l2.2-1.6.9-2.6 2.7.2L12 3Z"
          fill="currentColor"
          opacity="0.16"
        />
        <path d="m8.8 12.2 2.2 2.2 4.4-4.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sr-only">Verified listing</span>
    </span>
  );
}
