import AllProducts from "@/components/common/AllProducts";
import Link from "next/link";
import React from "react";
import type { Metadata } from "next";
import { SITE_BRAND_SHORT, buildPageMeta, slugToLabel } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; offerslug: string }>;
}): Promise<Metadata> {
  const { slug, offerslug } = await params;
  const parent = slugToLabel(slug);
  const leaf = slugToLabel(offerslug);
  return buildPageMeta({
    title: `${leaf}`,
    description: `${leaf} promotion under ${parent} — grab deals at ${SITE_BRAND_SHORT}.`,
    pathname: `/offer/${slug}/${offerslug}`,
    keywords: [leaf, parent, "offer", SITE_BRAND_SHORT],
  });
}

function OfferPage() {
  return (
    <div className="max-w-[95rem] mx-auto px-4 py-4">
      <div className="text-sm text-gray-500 justify-between flex items-start mb-4 border-b border-gray-200 pb-3">
        <div className="">
          <Link href="/">Home</Link> &gt;{" "}
          <span className="text-gray-700">Instant Coffee</span>
        </div>
        <div className="text-black font-semibold">Instant Coffee</div>
      </div>
      <AllProducts isOffer />
    </div>
  );
}

export default OfferPage;
