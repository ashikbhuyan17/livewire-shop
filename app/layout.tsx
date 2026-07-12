import type { Metadata } from 'next';
import { Suspense } from 'react';
import localFont from 'next/font/local';
import './globals.css';
import Footer from '@/components/common/Footer';
import { Toaster } from '@/components/ui/sonner';
import { LayoutHeader } from '@/components/layout/LayoutHeader';
import { LayoutMobileNav } from '@/components/layout/LayoutMobileNav';
// import { HeaderSkeleton } from '@/components/layout/PageSkeletons';
import {
  SITE_BRAND_SHORT,
  getSiteSettingsPublic,
  resolveMetadataBase,
  getAbsoluteImageFilename,
} from '@/lib/site';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteSettingsPublic();
  const defaultTitle =
    data.meta_title?.trim() ||
    `${SITE_BRAND_SHORT} — Premium Smartphone and Gadget Chain`;
  const description =
    data.meta_description?.trim() ||
    `Shop genuine mobiles, laptops, tablets, and gadgets at ${SITE_BRAND_SHORT}. Fast delivery, EMI, and warranty across Bangladesh.`;
  const keywords =
    data.meta_keywords
      ?.split(',')
      .map((k: string) => k.trim())
      .filter(Boolean) ?? [];
  const fav = getAbsoluteImageFilename(data.fav_icon);
  const og = getAbsoluteImageFilename(data.light_logo);

  return {
    metadataBase: resolveMetadataBase(),
    title: {
      default: defaultTitle,
      template: `%s · ${SITE_BRAND_SHORT}`,
    },
    description,
    ...(keywords.length ? { keywords } : {}),
    applicationName: SITE_BRAND_SHORT,
    referrer: 'origin-when-cross-origin',
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    icons: fav
      ? { icon: [{ url: fav }], shortcut: [fav], apple: [{ url: fav }] }
      : undefined,
    openGraph: {
      title: defaultTitle,
      description,
      siteName: SITE_BRAND_SHORT,
      locale: 'en_US',
      type: 'website',
      ...(og ? { images: [{ url: og, alt: defaultTitle }] } : {}),
    },
    twitter: {
      card: og ? 'summary_large_image' : 'summary_large_image',
      title: defaultTitle,
      description,
      ...(og ? { images: [og] } : {}),
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-screen`}
        suppressHydrationWarning
      >
        <LayoutHeader />

        <div className="pb-20 mt-[3.50rem] lg:mt-[9.75rem] lg:pb-0">
          {children}

          <Toaster position="top-right" richColors />

          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <LayoutMobileNav />
        </Suspense>
      </body>
    </html>
  );
}
