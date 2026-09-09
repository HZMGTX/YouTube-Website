/**
 * The site's only identifying mark. Deliberately geometric — three connected nodes,
 * suggesting a group — because the site carries no name or logotype. Do not replace
 * this with lettering; see src/lib/site.ts.
 */
export default function Mark({ className = 'size-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 6.5 6 17h12L12 6.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" opacity="0.45" />
      <circle cx="12" cy="6.5" r="2.6" fill="currentColor" />
      <circle cx="6" cy="17" r="2.6" fill="currentColor" opacity="0.75" />
      <circle cx="18" cy="17" r="2.6" fill="currentColor" opacity="0.55" />
    </svg>
  );
}
