import GadgetHome from '@/components/home/GadgetHome';
import type { Metadata } from 'next';
import { SITE_BRAND_SHORT, buildPageMeta } from '@/lib/site';

export const metadata: Metadata = buildPageMeta({
  title: 'Best Mobile, Laptop and Gadget Shop in Bangladesh',
  description: `Shop genuine mobiles, laptops, tablets, smart watches, and gadgets at the best price in Bangladesh — fast delivery, EMI, and warranty with ${SITE_BRAND_SHORT}.`,
  pathname: '/',
  keywords: [
    'mobile shop Bangladesh',
    'laptop price BD',
    'gadget store Dhaka',
    'iPhone Bangladesh',
    'flash sale phones',
    SITE_BRAND_SHORT,
  ],
});

export default function Home() {
  return <GadgetHome />;
}
