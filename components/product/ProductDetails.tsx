/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { AUTH_TOKEN_COOKIE } from '@/lib/auth-cookies';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import ProductPurchaseSection from '@/components/product/ProductPurchaseSection';
import WishlistButton from './WishlistButton';
import CompareButton from './CompareButton';
import ProductReviewSection from './ProductReviewSection';

async function ProductDetails({
  slug,
  product: productRes,
}: {
  slug: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
}) {
  const p = productRes?.data;
  const vendorStoreId = p?.vendor?.id ?? p?.vendor_id;
  const hasVendorStore =
    vendorStoreId != null &&
    String(vendorStoreId).trim() !== '' &&
    String(vendorStoreId) !== '0';

  const cookieStore = await cookies();
  const isAuthenticated = !!cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  const productReviews = p?.reviews ?? p?.product_reviews ?? p?.ratings ?? [];

  return (
    <>
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>{' '}
        <span className="mx-1">/</span>
        <span className="text-foreground font-medium">{p?.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
        <ProductPurchaseSection
          productId={Number(p?.id)}
          productName={String(p?.name ?? '')}
          productSku={p?.SKU}
          thumbnailImg={p?.thumbnail_img}
          productData={p}
        />

        {/* Right: Trust / delivery / share */}
        <div className="lg:col-span-3">
          <Card className="border rounded-xl p-4 bg-white lg:sticky lg:top-28 shadow-sm">
            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-lg bg-secondary/20 text-primary">
                  <Truck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-foreground">
                    Fast delivery
                  </div>
                  <div className="text-muted-foreground">
                    Delivered within 1–2 hours
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-lg bg-secondary/20 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-foreground">
                    Quality assured
                  </div>
                  <div className="text-muted-foreground">
                    Authentic & authorized products
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/20 p-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-lg bg-white text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground">
                      Delivery location
                    </div>
                    <Link
                      href="#"
                      className="text-primary hover:underline font-medium"
                    >
                      Select your delivery location
                    </Link>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <WishlistButton productId={Number(p?.id)} />
                  <CompareButton productId={Number(p?.id)} />
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Share Facebook"
                    className="border-border/70 hover:bg-secondary/10"
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Share Twitter"
                    className="border-border/70 hover:bg-secondary/10"
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Share Instagram"
                    className="border-border/70 hover:bg-secondary/10"
                  >
                    <Instagram className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this product with friends and family.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-foreground">
                    Secure payment
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    SSLCommerz
                  </span>
                </div>
                <Image
                  alt="Payment methods"
                  src="/Payments.SslCommerz.png"
                  width={400}
                  height={120}
                  className="w-full max-w-[240px] opacity-90"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <Separator />

        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-foreground">Description</h2>
          <div className="text-sm leading-relaxed text-muted-foreground">
            {p?.short_description || '—'}
          </div>
        </div>

        {p?.long_description ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Details</h3>
            <div
              className="prose prose-sm max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: p?.long_description }}
            />
            {hasVendorStore ? (
              <div className="pt-4 not-prose">
                <Button
                  asChild
                  className="h-10 rounded-full bg-headerBg px-6 text-sm font-semibold text-white shadow-sm hover:bg-[#267322]"
                >
                  <Link
                    href={`/vendor-store/${String(vendorStoreId)}`}
                    prefetch={false}
                  >
                    GO TO STORE
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
        {!p?.long_description && hasVendorStore ? (
          <div className="pt-1">
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-full border-headerBg/40 px-6 text-sm font-semibold text-headerBg hover:bg-headerBg/10"
            >
              <Link
                href={`/vendor-store/${String(vendorStoreId)}`}
                prefetch={false}
              >
                GO TO STORE
              </Link>
            </Button>
          </div>
        ) : null}
      </div>

      <ProductReviewSection
        productId={p?.id}
        vendorId={vendorStoreId}
        reviews={productReviews}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
}

export default ProductDetails;
