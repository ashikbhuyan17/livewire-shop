import Link from 'next/link';

type Crumb = { label: string; href?: string };

export default function CatalogBreadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 flex flex-wrap items-start justify-between gap-2 border-b border-gray-200 pb-3 text-sm text-gray-500"
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1">
            {i > 0 ? <span aria-hidden>&gt;</span> : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
      {items.length > 0 ? (
        <span className="font-semibold text-black">
          {items[items.length - 1]?.label}
        </span>
      ) : null}
    </nav>
  );
}
