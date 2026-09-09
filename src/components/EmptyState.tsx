export default function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="panel flex flex-col items-center gap-3 px-6 py-16 text-center">
      <svg viewBox="0 0 24 24" className="size-8 text-ink-3" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8.5 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="max-w-sm text-sm leading-relaxed text-ink-2">{body}</p>
      {action}
    </div>
  );
}
