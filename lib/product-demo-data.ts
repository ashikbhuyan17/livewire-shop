import type { DemoProduct } from '@/lib/home-demo-data';
import { DEMO_PRODUCTS, formatBDTNumber } from '@/lib/home-demo-data';

export const STATIC_PRODUCT = {
  id: 101,
  slug: 'redmi-15c',
  name: 'Redmi 15C',
  brand: 'Xiaomi',
  subtitle: 'Moonlight Blue | 4/128GB',
  price: 14489,
  originalPrice: 19990,
  regularPrice: 16188,
  discountPercent: 27,
  viewers: 37,
  inStock: true,
  warranty: '1 Year Warranty',
  deliveryDays: '0–3 days',
  minBooking: 5000,
  purchasePoints: 100,
  emiAvailable: true,
  careBadge: 'Livewire Care+ 1 Year',
  images: [
    'https://dazzle.sgp1.cdn.digitaloceanspaces.com/42732/Redmi-Pad-2-Price-in-bangladesh-Mint-Green.jpg',
    'https://dazzle.sgp1.cdn.digitaloceanspaces.com/59086/Redmi-Note-15-Pro-Plus-5G-price-in-Bangladesh-Smoky-Purple.jpg',
    'https://dazzle.sgp1.cdn.digitaloceanspaces.com/42763/OnePlus-13s-Price-in-bangladesh-Green-Silk.jpg',
    'https://dazzle.sgp1.cdn.digitaloceanspaces.com/42787/vivo-Y19s-Pro-Price-in-bangladesh-Glacier-Blue.jpg',
  ],
  quickSpecs: [
    'Display: 6.9" IPS LCD, 120Hz refresh rate, 600 nits peak brightness',
    'Build: IP64 dust & splash resistant, Corning Gorilla Glass 3',
    'Performance: MediaTek Helio G81 Ultra, up to 16GB RAM with virtual RAM',
    'Camera: 50MP AI dual camera, 8MP selfie, 1080p video recording',
    'Battery: 6000 mAh with 33W fast charging, reverse wired charging',
  ],
  colors: [
    {
      id: 'moonlight-blue',
      name: 'Moonlight Blue',
      image:
        'https://dazzle.sgp1.cdn.digitaloceanspaces.com/42787/vivo-Y19s-Pro-Price-in-bangladesh-Glacier-Blue.jpg',
    },
    {
      id: 'midnight-black',
      name: 'Midnight Black',
      image:
        'https://dazzle.sgp1.cdn.digitaloceanspaces.com/59086/Redmi-Note-15-Pro-Plus-5G-price-in-Bangladesh-Smoky-Purple.jpg',
    },
    {
      id: 'mint-green',
      name: 'Mint Green',
      image:
        'https://dazzle.sgp1.cdn.digitaloceanspaces.com/42732/Redmi-Pad-2-Price-in-bangladesh-Mint-Green.jpg',
    },
    {
      id: 'starlight-gold',
      name: 'Starlight Gold',
      image:
        'https://dazzle.sgp1.cdn.digitaloceanspaces.com/42763/OnePlus-13s-Price-in-bangladesh-Green-Silk.jpg',
    },
  ],
  variants: [
    { id: '4-128', label: '4/128GB', price: 14489, regularPrice: 16188 },
    { id: '6-128', label: '6/128GB', price: 16489, regularPrice: 18188 },
    { id: '8-256', label: '8/256GB', price: 19489, regularPrice: 21990 },
    { id: '12-128', label: '12/128GB', price: 21489, regularPrice: 23990 },
  ],
  addons: [
    { id: 'care-1y', label: 'Livewire Care+ 1 Year Extended Warranty', price: 2172 },
    { id: 'care-2y', label: 'Livewire Care+ 2 Year Extended Warranty', price: 3890 },
    { id: 'screen', label: 'Screen Damage Protection Plan', price: 1290 },
    { id: 'battery', label: 'Battery Replacement Plan', price: 990 },
    { id: 'setup', label: 'Premium Setup & Data Transfer', price: 590 },
  ],
  description: `Redmi 15C delivers a large 6.9-inch display, massive 6000mAh battery, and 50MP AI camera — perfect for everyday use in Bangladesh. Genuine product with official warranty, EMI options, and fast delivery from Livewire.`,
  specifications: [
    {
      category: 'BODY',
      items: [
        { label: 'Dimensions', value: '171.6 × 79.5 × 8.0 mm' },
        { label: 'Weight', value: '205 g' },
        { label: 'Build', value: 'Glass front, plastic frame, plastic back' },
        { label: 'Protection', value: 'IP64 dust/splash resistant' },
      ],
    },
    {
      category: 'DISPLAY',
      items: [
        { label: 'Type', value: 'IPS LCD, 120Hz refresh rate' },
        { label: 'Size', value: '6.9 inches' },
        { label: 'Resolution', value: '1080 × 2460 pixels' },
        { label: 'Brightness', value: '600 nits (typ)' },
      ],
    },
    {
      category: 'PLATFORM',
      items: [
        { label: 'OS', value: 'Android 15, HyperOS 2' },
        { label: 'Chipset', value: 'Mediatek Helio G81 Ultra (12 nm)' },
        { label: 'CPU', value: 'Octa-core 2.0 GHz' },
        { label: 'GPU', value: 'Mali-G52 MC2' },
      ],
    },
    {
      category: 'MEMORY',
      items: [
        { label: 'Card slot', value: 'microSDXC (dedicated slot)' },
        { label: 'Internal', value: '128GB 4GB RAM, 256GB 8GB RAM' },
      ],
    },
    {
      category: 'MAIN CAMERA',
      items: [
        { label: 'Dual', value: '50 MP, f/1.8 (wide), auxiliary lens' },
        { label: 'Features', value: 'LED flash, HDR, panorama' },
        { label: 'Video', value: '1080p@30fps' },
      ],
    },
    {
      category: 'BATTERY',
      items: [
        { label: 'Type', value: '6000 mAh, non-removable' },
        { label: 'Charging', value: '33W wired, reverse wired' },
      ],
    },
  ],
  breadcrumbs: [
    { label: 'Home', href: '/' },
    { label: 'Xiaomi', href: '/category/phones' },
    { label: 'Redmi 15C', href: '/product/redmi-15c' },
  ],
} as const;

export type ProductColorId = (typeof STATIC_PRODUCT.colors)[number]['id'];
export type ProductVariantId = (typeof STATIC_PRODUCT.variants)[number]['id'];
export type ProductAddonId = (typeof STATIC_PRODUCT.addons)[number]['id'];

export const RELATED_PRODUCTS: DemoProduct[] = DEMO_PRODUCTS;

export function formatProductPrice(amount: number): string {
  return `BDT ${formatBDTNumber(amount)}`;
}
