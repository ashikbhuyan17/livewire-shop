import Link from 'next/link';
import ProductGallery from './ProductGallery';
import ProductPurchasePanel from './ProductPurchasePanel';
import ProductSpecTabs from './ProductSpecTabs';
import RelatedProductsRow from './RelatedProductsRow';
import { STATIC_PRODUCT } from '@/lib/product-demo-data';

export default function ProductDetailDemo() {
  return (
    <div className="mx-auto max-w-[95rem] px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
      {/* Breadcrumb */}
      <nav
        className="mb-4 flex flex-wrap items-center gap-1 text-xs text-slate-500 sm:text-sm"
        aria-label="Breadcrumb"
      >
        {STATIC_PRODUCT.breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="inline-flex items-center gap-1">
            {i > 0 && <span className="text-slate-300">/</span>}
            {i === STATIC_PRODUCT.breadcrumbs.length - 1 ? (
              <span className="font-medium text-slate-800">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="transition hover:text-primary">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Main product section */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-10 xl:gap-12">
        <div className="lg:sticky lg:top-[calc(9.75rem+5px)] lg:z-20 lg:self-start">
          <ProductGallery />
        </div>
        <div className="lg:sticky lg:top-[calc(9.75rem+5px)] lg:z-20 lg:max-h-[calc(100vh-9.75rem-5px)] lg:self-start lg:overflow-y-auto lg:overscroll-y-contain lg:pr-1 [-ms-overflow-style:auto] [scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:hsl(var(--muted-foreground)/0.35)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30">
          <ProductPurchasePanel />
        </div>
      </div>

      <RelatedProductsRow />
      <ProductSpecTabs />
    </div>
  );
}
