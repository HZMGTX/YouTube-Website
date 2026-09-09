/**
 * Demo listings carry this so nothing on the live site can be mistaken for a real
 * server. Delete the example entries from data/communities.json and it disappears.
 */
export default function ExampleChip() {
  return (
    <span
      title="Demo data, not a real server"
      className="inline-flex items-center rounded-full border border-dashed border-line-strong px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink-3"
    >
      Example
    </span>
  );
}
