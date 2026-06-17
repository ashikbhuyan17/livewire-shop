/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetcher } from '@/lib/fetcher';
import { mapCompareItemToRow } from '@/lib/compare-utils';
import CompareInfoBar from '@/components/compare/CompareInfoBar';
import CompareEmptyState from '@/components/compare/CompareEmptyState';
import CompareTable from '@/components/compare/CompareTable';

export default async function ComparePage() {
  const compare: any = await fetcher(
    '/compare',
    { cache: 'no-store' },
    false,
  );
  const raw = Array.isArray(compare?.data) ? compare.data : [];
  const items = raw.map((row: any) => mapCompareItemToRow(row));
  const hasItems = items.length > 0;

  return (
    <main className="min-h-screen max-md:pb-24">
      <div className="mx-auto w-full max-w-[95rem] space-y-5 px-4 py-4">
        <CompareInfoBar count={items.length} />

        {!hasItems ? <CompareEmptyState /> : <CompareTable initialItems={items} />}
      </div>
    </main>
  );
}
