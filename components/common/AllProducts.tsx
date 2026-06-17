import SidebarFilters from "@/components/category/SidebarFilters";
import CategoryBanner from "@/public/category_banner.png";
import DealsBanner from "@/public/home_banner_1.webp";
import ProductCard from "@/components/common/ProductCard";
import { Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import CountdownTimer from "./CountdownTimer";
import productPlaceholder from "@/public/product_image.webp";

const demoProducts = [
  {
    id: 1,
    name: "Ifad Nankhatai Bakery Biscuit 200gm",
    image: productPlaceholder,
    originalPrice: 100,
    price: 87,
    discount: 15,
    deliveryTime: "Delivery 1-2 hours",
    badges: [],
  },
  {
    id: 2,
    name: "Ifad Cheesy Bites Biscuits 180(3)10gm",
    image: productPlaceholder,
    originalPrice: 100,
    price: 85,
    discount: 15,
    deliveryTime: "Delivery 1-2 hours",
    badges: [],
  },
  {
    id: 3,
    name: "Cadbury Oreo Biscuit 108.55gm (Buy2 Get1 Free)",
    image: productPlaceholder,
    originalPrice: null,
    price: 360,
    discount: null,
    deliveryTime: "Delivery 1-2 hours",
    badges: ["B2G1"],
  },
  {
    id: 4,
    name: "Cadbury Oreo Biscuits 41.75gm (Buy6 Get2 Free)",
    image: productPlaceholder,
    originalPrice: 370,
    price: 359,
    discount: null,
    deliveryTime: "Delivery 1-2 hours",
    badges: ["Buy & Save", "B2G1"],
  },
  {
    id: 5,
    name: "Pusti Happy Time Lexus Vegetable Crackers Biscuit 350gm",
    image: productPlaceholder,
    originalPrice: null,
    price: 200,
    discount: null,
    deliveryTime: "Delivery 1-2 hours",
    badges: ["B2G1"],
  },
  {
    id: 6,
    name: "Pusti Happy Time Lexus Vegetable Crackers Biscuit 350gm",
    image: productPlaceholder,
    originalPrice: null,
    price: 200,
    discount: null,
    deliveryTime: "Delivery 1-2 hours",
    badges: ["B2G1"],
  },
  {
    id: 7,
    name: "Pusti Happy Time Lexus Vegetable Crackers Biscuit 350gm",
    image: productPlaceholder,
    originalPrice: null,
    price: 200,
    discount: null,
    deliveryTime: "Delivery 1-2 hours",
    badges: ["B2G1"],
  },
  {
    id: 8,
    name: "Pusti Happy Time Lexus Vegetable Crackers Biscuit 350gm",
    image: productPlaceholder,
    originalPrice: null,
    price: 200,
    discount: null,
    deliveryTime: "Delivery 1-2 hours",
    badges: ["B2G1"],
  },
  {
    id: 9,
    name: "Pusti Happy Time Lexus Vegetable Crackers Biscuit 350gm",
    image: productPlaceholder,
    originalPrice: null,
    price: 200,
    discount: null,
    deliveryTime: "Delivery 1-2 hours",
    badges: ["B2G1"],
  },
  {
    id: 10,
    name: "Pusti Happy Time Lexus Vegetable Crackers Biscuit 350gm",
    image: productPlaceholder,
    originalPrice: null,
    price: 200,
    discount: null,
    deliveryTime: "Delivery 1-2 hours",
    badges: ["B2G1"],
  },
];

function AllProducts({
  isOffer = false,
  allProducts,
}: {
  isOffer?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allProducts?: any;
}) {
  const products = allProducts?.data?.data || demoProducts;

  return (
    <>
      <div className="my-2 mb-10 relative">
        <Image
          alt=""
          src={isOffer ? DealsBanner : CategoryBanner}
          className="w-full"
        />
        <div className="md:hidden inline-block absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
          {isOffer && <CountdownTimer isOffer />}
        </div>
      </div>
      <div className="justify-between flex mt-10">
        {!isOffer && (
          <div className="gap-6 sticky top-32 self-start hidden lg:flex">
            <SidebarFilters />
          </div>
        )}

        <div>
          <div className="flex flex-wrap justify-start items-center relative z-10 mb-4">
            <strong className="text-xs lg:text-md font-medium leading-none text-black block w-full sm:w-auto mb-2 sm:mb-0 lg:mb-0 mr-2">
              Sort By :{" "}
            </strong>
            <div>
              {!isOffer && (
                <Sheet>
                  <SheetTrigger asChild className="lg:hidden inline-block">
                    <button
                      type="button"
                      className="cursor-pointer mb-0.5 sm:mb-0 mr-[5px] md:mr-2.5 last:mr-0 lg:mb-0 bg-primary inline-block"
                    >
                      <span className="text-primary-foreground flex items-center gap-1 text-[9px] md:text-sm bg-primary font-medium lg:font-normal rounded-sm px-1.5 lg:px-2.5 py-1 shadow-button">
                        <Filter className="w-3 h-3" />
                        Filter
                      </span>
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="py-12">
                    <SidebarFilters />
                  </SheetContent>
                </Sheet>
              )}

              <button
                type="button"
                className="cursor-pointer inline-block mb-0.5 sm:mb-0 mr-[5px] md:mr-2.5 last:mr-0 lg:mb-0 bg-secondary"
              >
                <span className="text-black text-[9px] md:text-sm bg-secondary font-medium lg:font-normal inline-block rounded-sm px-1.5 lg:px-2.5 py-1 shadow-button">
                  Default
                </span>
              </button>
              <button
                type="button"
                className="cursor-pointer inline-block mb-0.5 sm:mb-0 mr-[5px] md:mr-2.5 last:mr-0 lg:mb-0"
              >
                <span className="text-black text-[9px] md:text-sm font-medium lg:font-normal inline-block rounded-sm px-1.5 lg:px-2.5 py-1 shadow-md">
                  Best sale
                </span>
              </button>
              <button
                type="button"
                className="cursor-pointer inline-block mb-0.5 sm:mb-0 mr-[5px] md:mr-2.5 last:mr-0 lg:mb-0"
              >
                <span className="text-black text-[9px] md:text-sm font-medium lg:font-normal inline-block rounded-sm px-1.5 lg:px-2.5 py-1 shadow-md">
                  Price asc
                </span>
              </button>
              <button
                type="button"
                className="cursor-pointer inline-block mb-0.5 sm:mb-0 mr-[5px] md:mr-2.5 last:mr-0 lg:mb-0"
              >
                <span className="text-black text-[9px] md:text-sm font-medium lg:font-normal inline-block rounded-sm px-1.5 lg:px-2.5 py-1 shadow-md">
                  Price desc
                </span>
              </button>
              <button
                type="button"
                className="cursor-pointer inline-block mb-0.5 sm:mb-0 mr-[5px] md:mr-2.5 last:mr-0 lg:mb-0"
              >
                <span className="text-black text-[9px] md:text-sm font-medium lg:font-normal inline-block rounded-sm px-1.5 lg:px-2.5 py-1 shadow-md">
                  Newest
                </span>
              </button>
            </div>
            <div className="hidden md:inline-block">
              {isOffer && <CountdownTimer isOffer />}
            </div>
          </div>
          <div
            className={
              isOffer
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 items-center mx-auto"
                : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 items-center mx-auto"
            }
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {products?.map((product: any) => (
              <div key={product?.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AllProducts;
