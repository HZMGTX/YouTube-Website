import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/** Root-level, so it renders its own chrome rather than inheriting the site group's. */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="mx-auto flex max-w-lg flex-1 flex-col items-center px-4 py-32 text-center sm:px-6">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">This page does not exist</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-2">
          The listing may have been removed, or the link may be wrong. The directory itself is still here.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-lg bg-accent px-5 text-sm font-medium text-accent-ink transition-[filter] hover:brightness-110"
          >
            Back to the directory
          </Link>
          <Link
            href="/browse"
            className="inline-flex h-11 items-center rounded-lg border border-line px-5 text-sm font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
          >
            Browse everything
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
