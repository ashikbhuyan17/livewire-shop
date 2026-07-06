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
  Linkedin,
  MessageCircle,
} from 'lucide-react';
import buildCategoryMenu from '@/fetch/buildCategoryMenu';
import FooterCategories from '@/components/common/FooterCategories';
import FooterNewsletterForm from '@/components/common/FooterNewsletterForm';
import { footerPageHref, getFooterPages } from '@/lib/footer-pages';
import {
  getAbsoluteImageFilename,
  getSiteSettingsPublic,
  SITE_BRAND_SHORT,
} from '@/lib/site';

const COMPANY_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Store Location', href: '/our-outlets' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Brands', href: '/brands' },
  { label: 'Contact', href: '/contact' },
] as const;

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

function resolveWhatsappLink(value?: string): string | null {
  const raw = value?.trim();
  if (!raw || raw === '#') return null;
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  const digits = raw.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : null;
}

function isValidSocialLink(value?: string): value is string {
  const raw = value?.trim();
  return Boolean(raw && raw !== '#');
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M16.5 3a5.5 5.5 0 0 0 1 10.8v2.7a8.2 8.2 0 1 1-6.8-8.1v3.1a3.5 3.5 0 1 0 2.5 3.3V3h3.3z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 3a9 9 0 0 0-3.6 17.3c-.1-1.1-.2-2.8.1-4.1.2-.9 1.4-6 1.4-6s-.4-.8-.4-2c0-1.9 1.1-3.3 2.5-3.3 1.2 0 1.8.9 1.8 2 0 1.2-.8 3-1.2 4.7-.3 1.4.7 2.5 2.1 2.5 2.5 0 4.4-2.6 4.4-6.4 0-3.3-2.4-5.6-5.8-5.6-4 0-6.3 3-6.3 6.1 0 1.2.5 2.5 1.1 3.2.1.1.1.2.1.3l-.4 1.6c0 .2-.1.2-.3.1-1.4-.6-2.2-2.5-2.2-4.5 0-3.7 2.7-7.1 7.8-7.1 4.1 0 7.3 2.9 7.3 6.8 0 4.1-2.6 7.4-6.2 7.4-1.2 0-2.4-.6-2.8-1.4l-.8 3c-.3 1-.9 2.2-1.3 3A9 9 0 1 0 12 3z" />
    </svg>
  );
}

export default async function Footer() {
  const [settings, categoryMenu, footerPages] = await Promise.all([
    getSiteSettingsPublic(),
    buildCategoryMenu(),
    getFooterPages(),
  ]);

  const footerCategories =
    categoryMenu.length > 0 ? categoryMenu.slice(0, 8) : [];
  const weAcceptItems = settings.weaccept ?? [];
  const logoSrc = getAbsoluteImageFilename(settings.light_logo) || '/livewire.png';

  const aboutText = settings.about_text?.trim() || '';
  const phone = settings.phone_1 || '';
  const email = settings.mail || '';
  const address = settings.address || '';
  const copyright = settings.copyright_text || '';
  const whatsappLink = resolveWhatsappLink(settings.whatsapp);

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
          <FooterNewsletterForm />
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-gradient-to-b from-[#024a96] to-[#023d7a] text-white">
        <div className="mx-auto grid max-w-[95rem] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-14">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block">
              <Image
                src={logoSrc}
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
              {isValidSocialLink(settings.fb_link) ? (
                <SocialLink href={settings.fb_link} label="Facebook">
                  <Facebook className="h-4 w-4" />
                </SocialLink>
              ) : null}
              {isValidSocialLink(settings.insta_link) ? (
                <SocialLink href={settings.insta_link} label="Instagram">
                  <Instagram className="h-4 w-4" />
                </SocialLink>
              ) : null}
              {isValidSocialLink(settings.twitter_link) ? (
                <SocialLink href={settings.twitter_link} label="Twitter">
                  <Twitter className="h-4 w-4" />
                </SocialLink>
              ) : null}
              {isValidSocialLink(settings.linkedin_link) ? (
                <SocialLink href={settings.linkedin_link} label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </SocialLink>
              ) : null}
              {isValidSocialLink(settings.youtube_link) ? (
                <SocialLink href={settings.youtube_link} label="YouTube">
                  <Youtube className="h-4 w-4" />
                </SocialLink>
              ) : null}
              {whatsappLink ? (
                <SocialLink href={whatsappLink} label="WhatsApp">
                  <MessageCircle className="h-4 w-4" />
                </SocialLink>
              ) : null}
              {isValidSocialLink(settings.tiktok_link) ? (
                <SocialLink href={settings.tiktok_link} label="TikTok">
                  <TikTokIcon className="h-4 w-4" />
                </SocialLink>
              ) : null}
              {isValidSocialLink(settings.pinterest_link) ? (
                <SocialLink href={settings.pinterest_link} label="Pinterest">
                  <PinterestIcon className="h-4 w-4" />
                </SocialLink>
              ) : null}
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
            <FooterCategories categories={footerCategories} />
          </div>

          {/* Policies */}
          {footerPages.length > 0 ? (
            <div className="lg:col-span-2">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-secondary">
                Policies
              </h3>
              <ul className="space-y-2.5 text-sm">
                {footerPages.map((page) => (
                  <li key={page.id ?? page.slug}>
                    <Link
                      href={footerPageHref(page.slug!)}
                      className="text-blue-50/85 transition hover:translate-x-0.5 hover:text-white"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Payment */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-secondary">
              We Accept
            </h3>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              {weAcceptItems.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2.5">
                  {weAcceptItems.map((item) => {
                    const imageSrc = getAbsoluteImageFilename(item.image);
                    return (
                      <div
                        key={item.id ?? item.title}
                        className="flex h-10 min-w-[3.5rem] items-center justify-center rounded-lg bg-white/90 px-2"
                        title={item.title}
                      >
                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt={item.title || 'Payment method'}
                            width={72}
                            height={32}
                            className="h-7 w-auto max-w-[4.5rem] object-contain"
                          />
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-700">
                            {item.title}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Image
                  src="/Payments.SslCommerz.png"
                  alt="Accepted payment methods"
                  width={280}
                  height={48}
                  className="h-auto w-full max-w-[220px] object-contain brightness-0 invert opacity-90"
                />
              )}
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
