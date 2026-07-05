const BRAND = 'Livewire';

export type DemoSiteSettings = {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  fav_icon?: string;
  light_logo?: string;
  about_text?: string;
  phone_1?: string;
  mail?: string;
  address?: string;
  copyright_text?: string;
  fb_link?: string;
  insta_link?: string;
  twitter_link?: string;
  youtube_link?: string;
};

export const DEMO_SITE_SETTINGS: DemoSiteSettings = {
  meta_title: `${BRAND} — Premium Smartphone and Gadget Chain`,
  meta_description: `Shop genuine mobiles, laptops, tablets, and gadgets at ${BRAND}. Fast delivery, EMI, and warranty across Bangladesh.`,
  meta_keywords: 'mobile shop, laptop, gadget, Bangladesh, Livewire',
  about_text:
    "Livewire is Bangladesh's premium smartphone and gadget chain — genuine products, best prices, EMI up to 36 months, and fast nationwide delivery.",
  phone_1: '09638001122',
  mail: 'info@livewire.com.bd',
  address: 'Jamuna Future Park, Bashundhara City & outlets across Bangladesh',
  copyright_text: `© ${new Date().getFullYear()} ${BRAND}. All rights reserved.`,
  fb_link: '#',
  insta_link: '#',
  twitter_link: '#',
  youtube_link: '#',
};
