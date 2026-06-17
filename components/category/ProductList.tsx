import ProductCard from '@/components/common/ProductCard';
import { enrichProductForCard } from '@/lib/product-utils';

type Props = {
  products: Record<string, unknown>[];
  emptyTitle?: string;
  emptyHint?: string;
};

export default function ProductList({
  products,
  emptyTitle = 'No products found',
  emptyHint = 'Try changing filters or browse another category.',
}: Props) {
  if (!products.length) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
        <p className="text-lg font-semibold text-foreground">{emptyTitle}</p>
        <p className="mt-2 text-sm text-muted-foreground">{emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <div key={String(product.id ?? product.slug)}>
          <ProductCard product={enrichProductForCard(product)} />
        </div>
      ))}
    </div>
  );
}
