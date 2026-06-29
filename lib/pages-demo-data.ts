export type DemoBlog = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
};

export type DemoRelatedPost = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
};

export type DemoOutlet = {
  id: string;
  name: string;
  address: string;
  phone: string;
  image: string;
  offDay?: string;
  mapUrl: string;
};

export const BLOG_CATEGORIES = ['Technology', 'Mobile', 'Reviews', 'Tips'] as const;

export const DEMO_BLOGS: DemoBlog[] = [
  {
    id: 'b1',
    slug: 'iphone-17-pro-max-price-bangladesh',
    title: 'iPhone 17 Pro Max Price in Bangladesh: Early Estimates & Insights',
    excerpt:
      'Looking for the iPhone 17 Pro Max price in Bangladesh? Discover expected pricing, specs, and early availability insights from Livewire.',
    image:
      'https://dazzle.sgp1.cdn.digitaloceanspaces.com/75550/iPhone-17-Pro-Max-Pro-Price-in-Bangladesh.jpg',
    author: 'Admin',
    date: '06 Apr, 2026',
    category: 'Technology',
  },
  {
    id: 'b2',
    slug: 'iphone-17-concept-future-unveiled',
    title: 'iPhone 17 Concept: Future of the iPhone Series Unveiled',
    excerpt:
      'Explore the iPhone 17 concept with leaks on design, features, and Apple\u2019s future vision. Stay ahead with Livewire.',
    image:
      'https://dazzle.sgp1.cdn.digitaloceanspaces.com/42763/OnePlus-13s-Price-in-bangladesh-Green-Silk.jpg',
    author: 'Admin',
    date: '18 Jul, 2025',
    category: 'Technology',
  },
  {
    id: 'b3',
    slug: 'iphone-17-pro-camera-upgrades-2025',
    title: 'iPhone 17 Pro Camera Upgrades | What\u2019s New in 2025?',
    excerpt:
      'Discover the iPhone 17 Pro camera upgrades, including new sensors, spatial video, and AI-powered photography. Brought to you by Livewire.',
    image:
      'https://dazzle.sgp1.cdn.digitaloceanspaces.com/59086/Redmi-Note-15-Pro-Plus-5G-price-in-Bangladesh-Smoky-Purple.jpg',
    author: 'Admin',
    date: '18 Jul, 2025',
    category: 'Reviews',
  },
  {
    id: 'b4',
    slug: 'iphone-17-pro-max-colors-2025',
    title: 'iPhone 17 Pro Max Colors in 2025 | Full List & First Look',
    excerpt:
      'Explore all expected iPhone 17 Pro Max colors including new titanium finishes. See what Apple may launch in 2025 — by Livewire.',
    image:
      'https://dazzle.sgp1.cdn.digitaloceanspaces.com/42787/vivo-Y19s-Pro-Price-in-bangladesh-Glacier-Blue.jpg',
    author: 'Admin',
    date: '18 Jul, 2025',
    category: 'Mobile',
  },
  {
    id: 'b5',
    slug: 'redmi-pad-2-review',
    title: 'Redmi Pad 2 Review: Best Budget Tablet of 2026?',
    excerpt:
      'Is the Redmi Pad 2 worth it? Full review covering display, performance, battery, and value for money in Bangladesh.',
    image:
      'https://dazzle.sgp1.cdn.digitaloceanspaces.com/42732/Redmi-Pad-2-Price-in-bangladesh-Mint-Green.jpg',
    author: 'Admin',
    date: '12 Jun, 2025',
    category: 'Reviews',
  },
  {
    id: 'b6',
    slug: 'best-smartphones-under-20000',
    title: 'Best Smartphones Under ৳20,000 in Bangladesh (2026)',
    excerpt:
      'Tight budget? Here are the best value-for-money smartphones under ৳20,000 you can buy right now from Livewire.',
    image:
      'https://dazzle.sgp1.cdn.digitaloceanspaces.com/110995/xiaomi-17t.jpg',
    author: 'Admin',
    date: '02 Jun, 2025',
    category: 'Tips',
  },
];

export function getBlogBySlug(slug: string): DemoBlog | undefined {
  return DEMO_BLOGS.find((b) => b.slug === slug);
}

export function getRelatedBlogs(slug: string, limit = 3): DemoBlog[] {
  return DEMO_BLOGS.filter((b) => b.slug !== slug).slice(0, limit);
}

export const DEMO_RELATED_POSTS: DemoRelatedPost[] = [
  {
    id: 'r1',
    title: 'Poco F5 Price, Specs & Full Review',
    excerpt:
      'Poco F5 full review: specs, performance, gaming, camera, battery, price, pros & cons, and buying guide.',
    image:
      'https://dazzle.sgp1.cdn.digitaloceanspaces.com/42763/OnePlus-13s-Price-in-bangladesh-Green-Silk.jpg',
  },
  {
    id: 'r2',
    title: 'Poco M6 Pro Full Specs, Price & Review',
    excerpt:
      'Poco M6 Pro full review, specs, price, camera, battery, pros & cons, and buying guide. Is it worth it?',
    image:
      'https://dazzle.sgp1.cdn.digitaloceanspaces.com/42732/Redmi-Pad-2-Price-in-bangladesh-Mint-Green.jpg',
  },
  {
    id: 'r3',
    title: 'Infinix Hot 40 Price, Specs & Full Review',
    excerpt:
      'Infinix Hot 40 full specs, features, price, pros & cons, and buying guide. Is it worth it? Read our review.',
    image:
      'https://dazzle.sgp1.cdn.digitaloceanspaces.com/42787/vivo-Y19s-Pro-Price-in-bangladesh-Glacier-Blue.jpg',
  },
  {
    id: 'r4',
    title: 'Samsung Galaxy A55 Hands-On Review',
    excerpt:
      'Samsung Galaxy A55 detailed review: display, performance, camera samples, battery life and final verdict.',
    image:
      'https://dazzle.sgp1.cdn.digitaloceanspaces.com/59086/Redmi-Note-15-Pro-Plus-5G-price-in-Bangladesh-Smoky-Purple.jpg',
  },
];

const STORE_IMG_1 =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80';
const STORE_IMG_2 =
  'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=900&q=80';
const STORE_IMG_3 =
  'https://images.unsplash.com/photo-1604754742629-3e5728249d73?auto=format&fit=crop&w=900&q=80';
const STORE_IMG_4 =
  'https://images.unsplash.com/photo-1567958451986-2de427a4a0be?auto=format&fit=crop&w=900&q=80';
const STORE_IMG_5 =
  'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=900&q=80';
const STORE_IMG_6 =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80';

export const DEMO_OUTLETS: DemoOutlet[] = [
  {
    id: 'o1',
    name: 'Livewire Hypermarket — Bashundhara City Shopping Mall',
    address:
      'Shop No - 35 to 51, Block B, Level 7 (Gold Floor), Bashundhara City Shopping Mall, Dhaka',
    phone: '09638001122',
    image: STORE_IMG_1,
    mapUrl: 'https://maps.google.com/?q=Bashundhara+City+Shopping+Mall+Dhaka',
  },
  {
    id: 'o2',
    name: 'Livewire — Bashundhara City Branch',
    address:
      'Shop No - 23, Basement 1, Bashundhara City Shopping Mall, Panthapath',
    phone: '09638001122',
    image: STORE_IMG_2,
    offDay: 'Tuesday',
    mapUrl: 'https://maps.google.com/?q=Bashundhara+City+Panthapath',
  },
  {
    id: 'o3',
    name: 'Meridian Kohinoor City — CTG',
    address:
      'Shop No - 509 & 510, 5th floor, Meridian Kohinoor City (MKC), Chittagong Wasa Circle, 344 Mohammad Ali road',
    phone: '09638001122',
    image: STORE_IMG_3,
    mapUrl: 'https://maps.google.com/?q=Meridian+Kohinoor+City+Chittagong',
  },
  {
    id: 'o4',
    name: 'Livewire Care Point',
    address:
      'Shop No 35 to 51, Block B, Level 7 (Gold Floor), Bashundhara City Shopping mall, Dhaka',
    phone: '09638001122',
    image: STORE_IMG_4,
    mapUrl: 'https://maps.google.com/?q=Bashundhara+City+Care+Point',
  },
  {
    id: 'o5',
    name: 'Jamuna Future Park — Branch 3',
    address:
      'Shop No: 4A-025A2, West Court, Level 4, Block A, Jamuna Future Park, Dhaka 1229',
    phone: '09638001122',
    image: STORE_IMG_5,
    offDay: 'Wednesday',
    mapUrl: 'https://maps.google.com/?q=Jamuna+Future+Park+Dhaka',
  },
  {
    id: 'o6',
    name: 'Livewire Online Store (Corporate & Web Orders Only)',
    address:
      '8th floor, Jumairah Fairmount Tower, Muradpur, CDA Avenue, Chittagong',
    phone: '09638001122',
    image: STORE_IMG_6,
    mapUrl: 'https://maps.google.com/?q=CDA+Avenue+Chittagong',
  },
];
