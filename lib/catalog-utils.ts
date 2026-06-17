export const CATALOG_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price_asc', label: 'Low to high' },
  { value: 'price_dsc', label: 'High to low' },
] as const;

export type CatalogSort = (typeof CATALOG_SORT_OPTIONS)[number]['value'];

export type CatalogSearchParamsInput = {
  min?: string;
  max?: string;
  filter?: string;
  tags?: string | string[];
  'tags[]'?: string | string[];
  page?: string;
};

export type ParsedCatalogParams = {
  min: number;
  max: number;
  filter: CatalogSort | '';
  tags: string[];
  page: number;
};

export function hasActiveCatalogFilters(params: ParsedCatalogParams): boolean {
  return Boolean(params.filter) || params.tags.length > 0;
}

const DEFAULT_MAX = 99_999_999;

export function parseCatalogSearchParams(
  sp: CatalogSearchParamsInput,
): ParsedCatalogParams {
  const rawTags = sp['tags[]'] ?? sp.tags;
  let tags: string[] = [];
  if (Array.isArray(rawTags)) {
    tags = rawTags.map((t) => String(t).trim()).filter(Boolean);
  } else if (rawTags) {
    tags = [String(rawTags).trim()].filter(Boolean);
  }

  const filterRaw = String(sp.filter ?? '').trim();
  const filter = CATALOG_SORT_OPTIONS.some((o) => o.value === filterRaw)
    ? (filterRaw as CatalogSort)
    : '';

  const min = Math.max(0, Number(sp.min) || 0);
  const max = Math.max(min, Number(sp.max) || DEFAULT_MAX);
  const page = Math.max(1, parseInt(String(sp.page ?? '1'), 10) || 1);

  return { min, max, filter, tags, page };
}

/** Query string for category/subcategory product APIs. */
export function buildCatalogQueryString(params: ParsedCatalogParams): string {
  const qs = new URLSearchParams();
  if (params.filter) qs.set('filter', params.filter);
  params.tags.forEach((tag) => qs.append('tags[]', tag));
  if (params.min > 0) qs.set('min', String(params.min));
  if (params.max < DEFAULT_MAX) qs.set('max', String(params.max));
  if (params.page > 1) qs.set('page', String(params.page));
  const s = qs.toString();
  return s ? `?${s}` : '';
}

export function buildCatalogPageHref(
  pathname: string,
  params: ParsedCatalogParams,
  overrides?: Partial<ParsedCatalogParams>,
) {
  const next = { ...params, ...overrides };
  if (overrides && !('page' in overrides)) {
    next.page = 1;
  }
  return `${pathname}${buildCatalogQueryString(next)}`;
}

export type CatalogPaginated = {
  products: Record<string, unknown>[];
  currentPage: number;
  lastPage: number;
  total: number;
};

export function parseCatalogProductsResponse(res: unknown): CatalogPaginated {
  const root = res as {
    data?: {
      data?: unknown[];
      current_page?: number;
      last_page?: number;
      total?: number;
    };
  };
  const paginated = root?.data;
  const products = Array.isArray(paginated?.data)
    ? (paginated.data as Record<string, unknown>[])
    : [];
  return {
    products,
    currentPage: paginated?.current_page ?? 1,
    lastPage: paginated?.last_page ?? 1,
    total: paginated?.total ?? products.length,
  };
}

/** Parse `tag_names` JSON string from product rows. */
export function parseProductTagNames(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof raw !== 'string' || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map((t) => String(t).trim()).filter(Boolean);
    }
  } catch {
    return raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}
