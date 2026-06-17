import React from "react";
import ProductCard from "../common/ProductCard";
import { enrichProductForCard } from "@/lib/product-utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function HomeProducts({
  title,
  products,
}: {
  title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[];
}) {
  const list = Array.isArray(products)
    ? products.filter((p) => p != null)
    : [];
  if (list.length === 0) return null;

  return (
    <div className="my-4">
      {title && (
        <h2 className="text-2xl font-bold text-foreground/90 w-full text-center my-8 uppercase">
          {title}
        </h2>
      )}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {list.map((product) => (
            <CarouselItem
              key={product?.id}
              className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
            >
              <ProductCard product={enrichProductForCard(product)} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="secondary"
          className="hidden md:flex -left-4"
        />
        <CarouselNext variant="secondary" className="hidden md:flex -right-4" />
      </Carousel>
    </div>
  );
}

export default HomeProducts;
