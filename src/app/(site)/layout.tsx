import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommandPalette from '@/components/CommandPalette';
import ShortcutsSheet from '@/components/ShortcutsSheet';
import BackToTop from '@/components/BackToTop';
import { getAllCommunities } from '@/lib/communities';

/** Site chrome. /embed sits outside this group and gets none of it. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const communities = getAllCommunities();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-ink"
      >
        Skip to content
      </a>
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <ShortcutsSheet />
      <BackToTop />
      <CommandPalette
        communities={communities.map((c) => ({
          id: c.id,
          name: c.name,
          category: c.category,
          members: c.members,
        }))}
      />
    </>
  );
}
