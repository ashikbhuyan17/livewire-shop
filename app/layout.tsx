import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CartSidebar from '@/components/common/CartSidebar';
import MobileBottomNav from '@/components/common/MobileBottomNav';
import buildCategoryMenu, {
  fetchHeaderCategories,
} from '@/fetch/buildCategoryMenu';
import { Toaster } from '@/components/ui/sonner';
import { getCart } from '@/lib/cart';
import { getWishlistSummary } from '@/lib/wishlist';
import { getCompareSummary } from '@/lib/compare';
import { getNotificationSummary } from '@/lib/notifications';
import WishlistStoreInit from '@/components/common/WishlistStoreInit';
import CompareStoreInit from '@/components/common/CompareStoreInit';
import { getLayoutSessionUser } from '@/lib/auth-session';
import {
  SITE_BRAND_SHORT,
  getSiteSettingsPublic,
  resolveMetadataBase,
  getAbsoluteImageFilename,
} from '@/lib/site';

const LAYOUT_REVALIDATE_SECONDS = 3600;

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

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, headerCategories, initialCart, user] = await Promise.all([
    buildCategoryMenu(),
    fetchHeaderCategories(),
    getCart(),
    getLayoutSessionUser(),
  ]);

  const [wishlistSummary, compareSummary, notificationSummary] = user
    ? await Promise.all([
        getWishlistSummary(),
        getCompareSummary(),
        getNotificationSummary(),
      ])
    : [
        { count: 0, productIds: [] as number[] },
        { count: 0, productIds: [] as number[] },
        { count: 0, unreadCount: 0 },
      ];

  return (
    <html lang="en" className="overflow-x-hidden" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-screen`}
        suppressHydrationWarning
      >
        <>
          <WishlistStoreInit productIds={wishlistSummary.productIds} />
          <CompareStoreInit productIds={compareSummary.productIds} />
          <Header
            categories={categories}
            headerCategories={headerCategories}
            user={user}
          />
          <div className="pb-20 mt-[3.50rem] lg:mt-[9.75rem] lg:pb-0">
            <CartSidebar initialCart={initialCart} />
            {children}
            <Toaster position="top-center" richColors />
            <Footer />
          </div>
          <MobileBottomNav categories={categories} user={user} />
        </>
      </body>
    </html>
  );
}
