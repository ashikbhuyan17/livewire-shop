import Link from 'next/link';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import type { Metadata } from 'next';
import {
  buildPageMeta,
  getSiteSettingsPublic,
  SITE_BRAND_SHORT,
} from '@/lib/site';

export const metadata: Metadata = buildPageMeta({
  title: 'Contact us',
  description: `Get in touch with ${SITE_BRAND_SHORT} — customer support, partnerships, and store inquiries.`,
  pathname: '/contact',
  keywords: ['contact Livewire', 'customer support', 'gadget shop help'],
});

export default async function ContactPage() {
  const settings = await getSiteSettingsPublic();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[95rem] px-3 py-4 sm:px-4 sm:py-5 lg:px-6">
        <nav
          className="mb-3 flex flex-wrap items-center gap-1 text-xs text-slate-500 sm:text-sm"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition hover:text-primary">
            Home
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-800">Contact</span>
        </nav>

        <div className="mb-4 sm:mb-5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Contact Us
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Questions about orders, products, or support? Send us a message.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 lg:gap-8">
          <ContactForm />
          <ContactInfo
            address={settings.address || ''}
            email={settings.mail || ''}
            phone={settings.phone_1 || ''}
          />
        </div>
      </div>
    </main>
  );
}
