import InfoBarBack from '@/components/common/InfoBarBack';
import { MAX_COMPARE_PRODUCTS } from '@/lib/compare-utils';

type Props = {
  count: number;
};

export default function CompareInfoBar({ count }: Props) {
  return (
    <div className="flex w-full flex-col gap-2 border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between md:mt-[-7px]">
      <div className="flex items-center gap-3">
        <InfoBarBack />
        <div>
          <h2 className="text-lg font-semibold text-black">Compare products</h2>
          <p className="text-sm text-muted-foreground">
            Side-by-side specs and pricing — up to {MAX_COMPARE_PRODUCTS} items
          </p>
        </div>
      </div>
      {count > 0 && (
        <p className="text-sm font-medium text-primary">
          {count} of {MAX_COMPARE_PRODUCTS} selected
        </p>
      )}
    </div>
  );
}
