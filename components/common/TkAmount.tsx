import { formatBDTNumber } from '@/lib/home-demo-data';
import { cn } from '@/lib/utils';

type TkAmountProps = {
  amount: number;
  className?: string;
  symbolClassName?: string;
};

/** BDT price with bold ৳ symbol — matches home page product cards. */
export function TkAmount({
  amount,
  className,
  symbolClassName,
}: TkAmountProps) {
  return (
    <span className={cn('tabular-nums', className)}>
      <span className={cn('font-extrabold', symbolClassName)}>৳</span>
      {formatBDTNumber(amount)}
    </span>
  );
}
