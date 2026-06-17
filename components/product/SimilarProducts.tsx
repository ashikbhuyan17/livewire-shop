import React from "react";
import ProductCard from "../common/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { fetcher } from "@/lib/fetcher";

async function SimilarProducts({ slug }: { slug: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products: any = await fetcher(`/related-products/${slug}`);
  return (
    <div className="flex flex-col w-full justify-center items-center mt-8">
      <h1 className="text-xl md:text-2xl font-bold my-4">RELATED PRODUCTS</h1>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {products?.data?.map((product: any) => (
            <CarouselItem
              key={product.id}
              className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="secondary"
          className="hidden md:flex -left-4"
        />
        <CarouselNext variant="secondary" className="hidden md:flex -right-4" />
      </Carousel>{" "}
    </div>
  );
}

export default SimilarProducts;
