import Link from 'next/link';
import { slugify } from '@/lib/format';

export default function CategoryTiles({
  categories,
}: {
  categories: { category: string; count: number }[];
}) {
  return (
    <section aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="mb-4 text-xl font-semibold tracking-tight text-ink">
        Browse by category
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map(({ category, count }) => (
          <Link
            key={category}
            href={`/category/${slugify(category)}`}
            className="panel panel-interactive flex items-center justify-between gap-2 px-4 py-3.5"
          >
            <span className="truncate text-sm font-medium text-ink">{category}</span>
            <span className="shrink-0 rounded-full bg-raised px-2 py-0.5 text-xs tabular-nums text-ink-3">
              {count}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
