import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import ThemeScript from '@/components/ThemeScript';
import Toaster from '@/components/Toast';
import ServiceWorker from '@/components/ServiceWorker';
import { SITE } from '@/lib/site';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  // No `openGraph.siteName`: the site shows no name of its own. See src/lib/site.ts.
  title: { default: SITE.title, template: `%s — ${SITE.title}` },
  description: SITE.description,
  applicationName: SITE.title,
  openGraph: { type: 'website', title: SITE.title, description: SITE.description, locale: 'en' },
  twitter: { card: 'summary_large_image', title: SITE.title, description: SITE.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0b0b10' },
    { media: '(prefers-color-scheme: light)', color: '#f6f6f8' },
  ],
};

/**
 * Root layout holds only the document shell. Site chrome lives in the (site) route
 * group so /embed can render a bare card for iframing.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-dvh antialiased`}>
        <ThemeScript />
        {children}
        <Toaster />
        <ServiceWorker />
      </body>
    </html>
  );
}
