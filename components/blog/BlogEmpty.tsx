import Link from 'next/link';
import { BookOpen, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlogEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-16 text-center sm:py-24">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-headerBg/10 ring-1 ring-headerBg/15">
        <BookOpen className="h-8 w-8 text-headerBg" />
      </div>
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">
        No blog posts yet
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
        We&apos;re preparing fresh articles about groceries, recipes, and smart
        shopping. Check back soon.
      </p>
      <Button
        asChild
        className="mt-8 gap-2 rounded-full bg-headerBg px-6 hover:bg-headerBg/90"
        size="lg"
      >
        <Link href="/">
          <ShoppingBag className="h-4 w-4" />
          Continue shopping
        </Link>
      </Button>
    </div>
  );
}
