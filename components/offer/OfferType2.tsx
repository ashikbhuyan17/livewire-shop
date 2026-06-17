import Image from "next/image";
import OfferBanner1 from "@/public/offer_banner1.png";
import OfferBanner2 from "@/public/offer_banner2.png";
import React from "react";
import productPlaceholder from "@/public/product_image.webp";
import ProductCard from "../common/ProductCard";

const products = [
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

function OfferType2() {
  return (
    <div>
      <div>
        <Image alt="" src={OfferBanner1} className="w-full" />
        <h1 className="text-2xl w-full text-center my-4 font-semibold text-black">
          Buy & Save More
        </h1>
        <Image alt="" src={OfferBanner2} className="w-full" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 items-center mx-auto mt-4">
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default OfferType2;
