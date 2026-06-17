'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Link from 'next/link';

type CategoryItem = {
  name?: string;
  slug?: string;
  image?: string;
};

type ProductCategoriesProps = {
  categories: { data?: CategoryItem[] };
};

export default function ProductCategories({
  categories,
}: ProductCategoriesProps) {
  const [mounted, setMounted] = useState(false);
  const list = categories?.data ?? [];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="px-4 py-6">
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-28 w-28 rounded-lg bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 py-6">
      <div className="relative">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {list.map((category, index) => (
              <CarouselItem
                key={category?.slug ?? index}
                className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/5"
              >
                <Link prefetch={false} href={`/category/${category?.slug}`}>
                  <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all">
                    <div className="aspect-square relative">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMG_URL}/${category?.image}`}
                        alt={category?.name ?? 'Category'}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
                      <Button className="w-full bg-secondary/95 text-black font-bold rounded-full text-xs md:text-sm">
                        {category?.name}
                      </Button>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </div>
    </div>
  );
}
