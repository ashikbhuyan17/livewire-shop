export type DemoProduct = {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice: number;
  badge?: string;
  badgeEmoji?: string;
  variant?: string;
  viewers?: number;
  inStock?: boolean;
};

export type HeroBanner = {
  id: string;
  image: string;
  alt: string;
  href?: string;
};

export type CategoryItem = {
  name: string;
  slug: string;
  image: string;
};

export const TRUST_ITEMS = [
  { icon: 'shield', label: '100% Genuine Products' },
  { icon: 'truck', label: 'Super fast Delivery' },
  { icon: 'credit-card', label: '36 Months Installments' },
  { icon: 'refresh', label: '2 Years Replacement' },
  { icon: 'tag', label: 'Best Price in BD' },
] as const;

export const HERO_BANNERS: HeroBanner[] = [
  {
    id: 'hero-main',
    image:
      'https://dazzle.sgp1.cdn.digitaloceanspaces.com/110996/xiaomi-17t-(1).jpg',
    alt: 'Xiaomi 17T — flagship smartphone',
    href: '#',
  },
  {
    id: 'hero-iphone',
    image:
      'https://dazzle.sgp1.cdn.digitaloceanspaces.com/94866/IPHONE-17-seriesv5.jpg.jpeg',
    alt: 'iPhone 17 Series',
    href: '#',
  },
  {
    id: 'hero-xiaomi',
    image:
      'https://dazzle.sgp1.cdn.digitaloceanspaces.com/110995/xiaomi-17t.jpg',
    alt: 'Xiaomi 17T',
    href: '#',
  },
  {
    id: 'hero-mart',
    image:
      'https://dazzle.sgp1.cdn.digitaloceanspaces.com/110994/dazzle-mart.jpg',
    alt: 'Dazzle Mart offers',
    href: '#',
  },
];

export const CATEGORIES: CategoryItem[] = [
  { name: 'Phones', slug: 'phones', image: '/categories/phones.jpeg' },
  { name: 'Tablet', slug: 'tablet', image: '/categories/tablet.jpeg' },
  { name: 'Laptop', slug: 'laptop', image: '/categories/laptop.jpeg' },
  {
    name: 'Smart Watch',
    slug: 'smart-watch',
    image: '/categories/watch.jpeg',
  },
  { name: 'AirPods', slug: 'airpods', image: '/categories/airpods.jpeg' },
  { name: 'Sounds', slug: 'sounds', image: '/categories/sounds.jpeg' },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: '/categories/accessories.jpeg',
  },
  { name: 'Gadgets', slug: 'gadgets', image: '/categories/gadget.jpeg' },
  { name: 'Earbuds', slug: 'earbuds', image: '/categories/earbuds.jpeg' },
  {
    name: 'Phone Cases',
    slug: 'phone-cases',
    image: '/categories/cases.jpeg',
  },
  {
    name: 'Screen Protectors',
    slug: 'screen-protectors',
    image: '/categories/screen.jpeg',
  },
  {
    name: 'Over-Ear Headphones',
    slug: 'headphones',
    image: '/categories/headphones.jpeg',
  },
  {
    name: 'MacBook Case',
    slug: 'macbook-case',
    image: '/categories/macbook.jpeg',
  },
  {
    name: 'Power Banks',
    slug: 'power-banks',
    image: '/categories/powerbanks.jpeg',
  },
  { name: 'Adapters', slug: 'adapters', image: '/categories/adapters.jpeg' },
  { name: 'Smart TV', slug: 'smart-tv', image: '/categories/tv.jpeg' },
];

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 'iphone-17-pro-max',
    name: 'iPhone 17 Pro Max',
    slug: 'iphone-17-pro-max',
    image:
      'https://dazzle.sgp1.cdn.digitaloceanspaces.com/75550/iPhone-17-Pro-Max-Pro-Price-in-Bangladesh.jpg',
    price: 152990,
    originalPrice: 264990,
    badge: 'Hot Product',
    badgeEmoji: '🔥',
    inStock: true,
  },
  {
    id: 'redmi-pad-2',
    name: 'Redmi Pad 2',
    slug: 'redmi-pad-2',
    image:
      'https://dazzle.sgp1.cdn.digitaloceanspaces.com/42732/Redmi-Pad-2-Price-in-bangladesh-Mint-Green.jpg',
    price: 23490,
    originalPrice: 29990,
    badge: 'Discount',
    badgeEmoji: '💰',
    inStock: true,
  },
  {
    id: 'oneplus-13s',
    name: 'OnePlus 13s',
    slug: 'oneplus-13s',
    image:
      'https://dazzle.sgp1.cdn.digitaloceanspaces.com/42763/OnePlus-13s-Price-in-bangladesh-Green-Silk.jpg',
    price: 72990,
    originalPrice: 79990,
    badge: 'High Demand',
    badgeEmoji: '👍',
    variant: 'Green Silk · 12/256GB',
    viewers: 33,
    inStock: true,
  },
  {
    id: 'vivo-y19s-pro',
    name: 'Vivo Y19s Pro',
    slug: 'vivo-y19s-pro',
    image:
      'https://dazzle.sgp1.cdn.digitaloceanspaces.com/42787/vivo-Y19s-Pro-Price-in-bangladesh-Glacier-Blue.jpg',
    price: 16999,
    originalPrice: 19999,
    badge: 'Top Selling',
    badgeEmoji: '🛍️',
    variant: '6/128GB',
    viewers: 48,
    inStock: true,
  },
  {
    id: 'redmi-note-15-pro-plus',
    name: 'Redmi Note 15 Pro Plus 5G',
    slug: 'redmi-note-15-pro-plus-5g',
    image:
      'https://dazzle.sgp1.cdn.digitaloceanspaces.com/59086/Redmi-Note-15-Pro-Plus-5G-price-in-Bangladesh-Smoky-Purple.jpg',
    price: 37390,
    originalPrice: 44390,
    badge: 'Hot Product',
    badgeEmoji: '🔥',
    variant: 'Smoky Purple · 12/256GB',
    viewers: 30,
    inStock: true,
  },
];

export const FLASH_SALE_PRODUCTS = DEMO_PRODUCTS;

export const BEST_DEAL_PRODUCTS = [
  DEMO_PRODUCTS[0],
  DEMO_PRODUCTS[4],
  DEMO_PRODUCTS[2],
  DEMO_PRODUCTS[1],
  DEMO_PRODUCTS[3],
  DEMO_PRODUCTS[0],
];

export const RECENTLY_ADDED_PRODUCTS = [
  DEMO_PRODUCTS[3],
  DEMO_PRODUCTS[1],
  DEMO_PRODUCTS[4],
  DEMO_PRODUCTS[2],
  DEMO_PRODUCTS[0],
  DEMO_PRODUCTS[3],
];

export function formatBDT(amount: number): string {
  return `৳ ${formatBDTNumber(amount)}`;
}

export function formatBDTNumber(amount: number): string {
  return new Intl.NumberFormat('en-IN').format(amount);
}

export function discountPercent(price: number, originalPrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
