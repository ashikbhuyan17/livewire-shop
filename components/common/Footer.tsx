import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ArrowRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { publicFetcher } from '@/lib/fetcher';
import { getLegalPages, legalPageHref } from '@/lib/legal-pages';
import { CATEGORIES } from '@/lib/home-demo-data';
import { SITE_BRAND_SHORT } from '@/lib/site';

const COMPANY_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Our Outlets', href: '/our-outlets' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Brands', href: '/brands' },
  { label: 'Contact', href: '/contact' },
] as const;

const DEFAULT_ABOUT =
  'Livewire is Bangladesh\'s premium smartphone and gadget chain — genuine products, best prices, EMI up to 36 months, and fast nationwide delivery.';

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:border-secondary hover:bg-secondary hover:text-slate-900"
    >
      {children}
    </Link>
  );
}

export default async function Footer() {
  const [siteSettings, categories, legalPages] = await Promise.all([
    publicFetcher('/settings', {}, 3600),
    publicFetcher('/categories', {}, 3600),
    getLegalPages(),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settings = siteSettings as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiCategories = ((categories as any)?.data ?? []).slice(0, 8);
  const footerCategories =
    apiCategories.length > 0
      ? apiCategories.map((c: { name: string; slug: string }) => ({
          name: c.name,
          slug: c.slug,
        }))
      : CATEGORIES.slice(0, 8);

  const aboutText = settings?.data?.about_text?.trim() || DEFAULT_ABOUT;
  const phone = settings?.data?.phone_1 || '09638001122';
  const email = settings?.data?.mail || 'info@livewire.com.bd';
  const address =
    settings?.data?.address ||
    'Jamuna Future Park, Bashundhara City & outlets across Bangladesh';
  const copyright =
    settings?.data?.copyright_text ||
    `© ${new Date().getFullYear()} ${SITE_BRAND_SHORT}. All rights reserved.`;

  return (
    <footer className="mt-14 border-t border-primary/20">
      {/* Newsletter CTA strip */}
      <div className="bg-secondary">
        <div className="mx-auto flex max-w-[95rem] flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <div className="text-center sm:text-left">
            <p className="text-sm font-bold uppercase tracking-wider text-primary">
              Stay in the loop
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900 sm:text-lg">
              Get deals on phones, laptops &amp; gadgets
            </p>
          </div>
          <form className="w-full max-w-lg sm:max-w-xl">
            <div className="flex h-12 items-center gap-1 overflow-hidden rounded-full bg-white p-1.5 pl-4 shadow-[0_6px_24px_rgba(2,80,162,0.14)] ring-1 ring-primary/15 sm:h-[3.25rem] sm:pl-5">
              <Input
                type="email"
                placeholder="Your email address"
                required
                className="h-full min-w-0 flex-1 border-0 bg-transparent px-0 text-sm text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-base"
              />
              <Button
                type="submit"
                className="h-9 shrink-0 gap-1.5 rounded-full bg-primary px-4 text-xs font-bold uppercase tracking-wide text-white shadow-sm hover:bg-primary/90 sm:h-10 sm:px-5 sm:text-sm"
              >
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-gradient-to-b from-[#024a96] to-[#023d7a] text-white">
        <div className="mx-auto grid max-w-[95rem] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-14">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block">
              <Image
                src="/livewire.png"
                alt={SITE_BRAND_SHORT}
                width={480}
                height={120}
                className="h-10 w-auto max-w-[11rem] object-contain sm:h-11"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-blue-100/90">
              {aboutText}
            </p>

            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-start gap-3 text-blue-50/90">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <span>{address}</span>
              </li>
              <li>
                <Link
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 text-blue-50/90 transition hover:text-secondary"
                >
                  <Phone className="h-4 w-4 shrink-0 text-secondary" />
                  {phone}
                </Link>
              </li>
              <li>
                <Link
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 break-all text-blue-50/90 transition hover:text-secondary"
                >
                  <Mail className="h-4 w-4 shrink-0 text-secondary" />
                  {email}
                </Link>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <SocialLink href={settings?.data?.fb_link || '#'} label="Facebook">
                <Facebook className="h-4 w-4" />
              </SocialLink>
              <SocialLink
                href={settings?.data?.insta_link || '#'}
                label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </SocialLink>
              <SocialLink
                href={settings?.data?.twitter_link || '#'}
                label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </SocialLink>
              <SocialLink
                href={settings?.data?.youtube_link || '#'}
                label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </SocialLink>
            </div>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-secondary">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-50/85 transition hover:translate-x-0.5 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-secondary">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              {footerCategories.map(
                (category: { name: string; slug: string }) => (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="text-blue-50/85 transition hover:translate-x-0.5 hover:text-white"
                    >
                      {category.name}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-secondary">
              Legal
            </h3>
            {legalPages.length > 0 ? (
              <ul className="space-y-2.5 text-sm">
                {legalPages.map((page) => (
                  <li key={page.id ?? page.slug}>
                    <Link
                      href={legalPageHref(page.slug!)}
                      className="text-blue-50/85 transition hover:translate-x-0.5 hover:text-white"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2.5 text-sm text-blue-50/85">
                <li>
                  <Link href="/pages/terms" className="hover:text-white">
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/pages/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/pages/warranty" className="hover:text-white">
                    Warranty Policy
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Payment */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-secondary">
              We Accept
            </h3>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <Image
                src="/Payments.SslCommerz.png"
                alt="Accepted payment methods"
                width={280}
                height={48}
                className="h-auto w-full max-w-[220px] object-contain brightness-0 invert opacity-90"
              />
              <p className="mt-3 text-xs leading-relaxed text-blue-100/70">
                Secure checkout with bKash, cards &amp; EMI partners.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[95rem] flex-col items-center justify-between gap-3 px-4 py-5 text-center text-xs text-blue-100/70 sm:flex-row sm:px-6 sm:text-left lg:px-8">
            <p>{copyright}</p>
            <p>
              Developed by{' '}
              <Link
                href="https://danpitetech.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-secondary transition hover:text-white"
              >
                Danpite.Tech
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
