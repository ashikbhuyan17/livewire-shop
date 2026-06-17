'use client';

// import { useState } from "react";
import savingsBanner from '@/public/savings.webp';
// import DraggableSlider from "@/components/common/DraggableSlider";
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ProductCard from '../common/ProductCard';
import { enrichProductForCard } from '@/lib/product-utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import productPlaceholder from '@/public/product_image.webp';

// const categories = [
//   "Tea Others",
//   "Full Cream Milk",
//   "Frozen Snacks Others",
//   "Toast Biscuit",
//   "Regular Spice",
//   "Pasta",
//   "Noodles",
//   "Soft Drinks",
// ];

const fakeProducts = [
  {
    id: 1,
    name: 'Ifad Nankhatai Bakery Biscuit 200gm',
    image: productPlaceholder,
    originalPrice: 100,
    price: 87,
    discount: 15,
    deliveryTime: 'Delivery 1-2 hours',
    badges: [],
  },
  {
    id: 2,
    name: 'Ifad Cheesy Bites Biscuits 180(3)10gm',
    image: productPlaceholder,
    originalPrice: 100,
    price: 85,
    discount: 15,
    deliveryTime: 'Delivery 1-2 hours',
    badges: [],
  },
  {
    id: 3,
    name: 'Cadbury Oreo Biscuit 108.55gm (Buy2 Get1 Free)',
    image: productPlaceholder,
    originalPrice: null,
    price: 360,
    discount: null,
    deliveryTime: 'Delivery 1-2 hours',
    badges: ['B2G1'],
  },
  {
    id: 4,
    name: 'Cadbury Oreo Biscuits 41.75gm (Buy6 Get2 Free)',
    image: productPlaceholder,
    originalPrice: 370,
    price: 359,
    discount: null,
    deliveryTime: 'Delivery 1-2 hours',
    badges: ['Buy & Save', 'B2G1'],
  },
  {
    id: 5,
    name: 'Pusti Happy Time Lexus Vegetable Crackers Biscuit 350gm',
    image: productPlaceholder,
    originalPrice: null,
    price: 200,
    discount: null,
    deliveryTime: 'Delivery 1-2 hours',
    badges: ['B2G1'],
  },
  {
    id: 6,
    name: 'Pusti Happy Time Lexus Vegetable Crackers Biscuit 350gm',
    image: productPlaceholder,
    originalPrice: null,
    price: 200,
    discount: null,
    deliveryTime: 'Delivery 1-2 hours',
    badges: ['B2G1'],
  },
  {
    id: 7,
    name: 'Pusti Happy Time Lexus Vegetable Crackers Biscuit 350gm',
    image: productPlaceholder,
    originalPrice: null,
    price: 200,
    discount: null,
    deliveryTime: 'Delivery 1-2 hours',
    badges: ['B2G1'],
  },
  {
    id: 8,
    name: 'Pusti Happy Time Lexus Vegetable Crackers Biscuit 350gm',
    image: productPlaceholder,
    originalPrice: null,
    price: 200,
    discount: null,
    deliveryTime: 'Delivery 1-2 hours',
    badges: ['B2G1'],
  },
  {
    id: 9,
    name: 'Pusti Happy Time Lexus Vegetable Crackers Biscuit 350gm',
    image: productPlaceholder,
    originalPrice: null,
    price: 200,
    discount: null,
    deliveryTime: 'Delivery 1-2 hours',
    badges: ['B2G1'],
  },
  {
    id: 10,
    name: 'Pusti Happy Time Lexus Vegetable Crackers Biscuit 350gm',
    image: productPlaceholder,
    originalPrice: null,
    price: 200,
    discount: null,
    deliveryTime: 'Delivery 1-2 hours',
    badges: ['B2G1'],
  },
];

export default function Deals({
  layOut,
  allProducts,
  isOffer = true,
  title,
  flashBannerUrl = '',
  flashBannerHref,
  flashBannerTitle,
}: {
  layOut: 'xl:flex-row-reverse' | 'xl:flex-row';
  isOffer?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allProducts?: any;
  title?: string;
  flashBannerUrl?: string;
  flashBannerHref?: string;
  flashBannerTitle?: string;
}) {
  // const [activeCategory, setActiveCategory] = useState(0);

  const products = allProducts ?? fakeProducts;
  const trimmedHref = (flashBannerHref || '').trim();
  const hasFlashBannerLink = Boolean(trimmedHref && trimmedHref !== '#');

  return (
    <div className={cn('flex flex-col gap-4 p-2 md:p-6', layOut)}>
      {/* Main Deals Section */}
      <div className={cn('rounded-2xl p-2 md:p-6 shadow-lg w-full bg-gray-50')}>
        {/* Header */}
        <div className="flex justify-between flex-col md:flex-row sm:items-center gap-3 mb-4 md:mb-6">
          {isOffer && (
            <h1 className="text-xl sm:text-2xl flex gap-2 font-bold text-foreground">
              {title || 'WEEKDAY DEALS!!!'}
            </h1>
          )}

          {/* Date Badges */}

          <div>
            {/* <DraggableSlider className="max-w-2xl">
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(index)}
                  className={cn(
                    "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap text-xs font-medium transition-all duration-200 flex-shrink-0",
                    index === activeCategory
                      ? "bg-secondary text-secondary-foreground shadow-md scale-105"
                      : "bg-card/80 text-foreground hover:bg-card hover:shadow-sm"
                  )}
                >
                  {category}
                </button>
              ))}
            </DraggableSlider> */}
          </div>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-[70rem]"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {products?.map((product: any) => (
              <CarouselItem
                key={product.id}
                className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4"
              >
                <ProductCard product={enrichProductForCard(product)} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="secondary"
            className="hidden md:flex -left-4"
          />
          <CarouselNext
            variant="secondary"
            className="hidden md:flex -right-4"
          />
        </Carousel>
      </div>

      {/* Special Savings Sidebar (Desktop Only) */}
      <div className="hidden xl:block w-[320px] relative rounded-2xl overflow-hidden shadow-lg">
        {flashBannerUrl ? (
          hasFlashBannerLink ? (
            <Link href={trimmedHref} prefetch className="block h-full w-full">
              <Image
                alt={flashBannerTitle ?? 'Special Savings'}
                src={flashBannerUrl}
                width={640}
                height={800}
                className="w-full h-full object-cover rounded-2xl"
                sizes="320px"
              />
            </Link>
          ) : (
            <Image
              alt={flashBannerTitle ?? 'Special Savings'}
              src={flashBannerUrl}
              width={640}
              height={800}
              className="w-full h-full object-cover rounded-2xl"
              sizes="320px"
            />
          )
        ) : (
          <Image
            alt="Special Savings"
            src={savingsBanner}
            className="w-full h-full object-cover rounded-2xl"
          />
        )}
      </div>
    </div>
  );
}
