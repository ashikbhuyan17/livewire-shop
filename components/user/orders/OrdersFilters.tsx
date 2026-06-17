'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { buildOrdersHref, statusToFilterValue } from '@/lib/order-utils';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  statuses: any[];
};

export default function OrdersFilters({ statuses }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const keyword = searchParams.get('keyword')?.trim() ?? '';
  const filter = searchParams.get('filter')?.trim() || 'all';

  const [searchValue, setSearchValue] = useState(keyword);

  const statusValues = useMemo(
    () => new Set(['all', ...statuses.map((s) => statusToFilterValue(s))]),
    [statuses],
  );

  const selectValue = statusValues.has(filter) ? filter : 'all';

  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  useEffect(() => {
    const next = searchValue.trim();
    if (next === keyword) return;

    const t = setTimeout(() => {
      startTransition(() => {
        router.replace(buildOrdersHref({ keyword: next, filter, page: 1 }), {
          scroll: false,
        });
      });
    }, 400);

    return () => clearTimeout(t);
  }, [searchValue, keyword, filter, router]);

  const hasActiveFilters = Boolean(keyword) || filter !== 'all';

  const navigate = (href: string) => {
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  };

  const handleClear = () => {
    setSearchValue('');
    navigate('/user/orders');
  };

  return (
    <Card className="mb-6 border-border shadow-none">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1 space-y-2">
            <span className="text-sm font-medium text-foreground">
              Search by order ID
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="e.g. OR-00049"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-9 pl-10"
              />
            </div>
          </div>

          <div className="w-full shrink-0 space-y-2 sm:w-48">
            <span className="text-sm font-medium text-foreground">Status</span>
            <Select
              value={selectValue}
              onValueChange={(v) => {
                navigate(buildOrdersHref({ filter: v, keyword, page: 1 }));
              }}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="All orders" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}>
                <SelectItem value="all">All Orders</SelectItem>
                {statuses.map((s) => (
                  <SelectItem key={s.id} value={statusToFilterValue(s)}>
                    {s.status_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-9 w-full shrink-0 sm:w-auto"
            disabled={!hasActiveFilters}
            onClick={handleClear}
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
