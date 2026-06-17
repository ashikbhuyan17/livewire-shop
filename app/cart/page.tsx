import Link from 'next/link';

export default function CartPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-foreground">Your cart</h1>
      <p className="mt-3 text-muted-foreground">
        Use the bag icon in the header to view and edit items in your bag.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block font-medium text-primary hover:underline"
      >
        Continue shopping
      </Link>
    </main>
  );
}
