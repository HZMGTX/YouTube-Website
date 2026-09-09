import Link from 'next/link';
import { slugify } from '@/lib/format';

export default function TagPill({ tag, size = 'sm' }: { tag: string; size?: 'sm' | 'md' }) {
  return (
    <Link
      href={`/tag/${slugify(tag)}`}
      className={`inline-flex items-center rounded-full border border-line bg-raised text-ink-2 transition-colors hover:border-line-strong hover:text-ink ${
        size === 'md' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs'
      }`}
    >
      {tag}
    </Link>
  );
}
