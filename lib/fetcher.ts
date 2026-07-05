'use server';

import { cookies } from 'next/headers';
import { AUTH_TOKEN_COOKIE } from '@/lib/auth-cookies';
import {
  AFFILIATE_CODE_COOKIE,
  clearAffiliateCodeCookie,
  normalizeAffiliateRef,
} from '@/lib/affiliate-cookies';
import { ORDERS_PER_PAGE } from '@/lib/order-utils';

/** Public API – no cookies. Uses Next.js fetch cache (next.revalidate). Returns null when endpoint is missing or non-JSON. */
export async function publicFetcher<T>(
  slug: string,
  options: RequestInit = {},
  revalidate: number = 3600,
): Promise<T | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${slug}`, {
      ...options,
      next: { revalidate },
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      },
    });

    const contentType = res.headers.get('content-type') ?? '';
    if (!res.ok || !contentType.includes('application/json')) {
      return null;
    }

    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetcher<T>(
  slug: string,
  options: RequestInit = {},
  revalidate: number | false = 0,
): Promise<T> {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get(AUTH_TOKEN_COOKIE)?.value;
    console.log('🚀 ~ fetcher ~ token:', token);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${slug}`, {
      ...options,
      next: revalidate ? { revalidate } : undefined,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        'Content-Type': 'application/json',
      },
    });

    return res.json() as Promise<T>;
  } catch (error) {
    console.log('Fetcher Error:', error);
    throw error;
  }
}

/** Vendor storefront reviews (public). */
export type VendorReviewUser = {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  profile_image?: string | null;
};

export type VendorReviewItem = {
  id: number;
  vendor_id?: string;
  user_id?: string;
  rating?: string;
  review?: string;
  created_at?: string;
  updated_at?: string;
  user?: VendorReviewUser;
};

export type VendorReviewsApiResponse = {
  success?: boolean;
  message?: string;
  data?: VendorReviewItem[];
};

export async function fetchVendorReviews(
  vendorId: string,
): Promise<
  { ok: true; data: VendorReviewItem[] } | { ok: false; message: string }
> {
  const id = String(vendorId ?? '').trim();
  if (!/^\d+$/.test(id)) {
    return { ok: false, message: 'Invalid vendor id' };
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl?.trim()) {
    return { ok: false, message: 'API URL not configured' };
  }
  const slug = `/vendor-review/${id}`;
  try {
    const res = await fetch(`${apiUrl}${slug}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      next: { revalidate: 120 },
    });
    if (!res.ok) {
      return {
        ok: false,
        message: `Request failed (${res.status})`,
      };
    }
    const json = (await res.json()) as VendorReviewsApiResponse;
    return {
      ok: true,
      data: Array.isArray(json.data) ? json.data : [],
    };
  } catch (error) {
    console.log('fetchVendorReviews Error:', error);
    return { ok: false, message: 'Could not load reviews' };
  }
}

export type CheckoutOrderProduct = {
  id: string;
  qty: string;
  product_color_id: string;
  product_variant_id: string;
};

export type CheckoutOrderPayload = {
  name: string;
  phone: string;
  email: string;
  address: string;
  customer_note: string;
  shipping_charge_id: number;
  products: CheckoutOrderProduct[];
  coupon_code?: string;
  points_redeem: 0 | 1;
  payment_method: 'cod';
  /** Included only when affiliate_code cookie is set. */
  ref_code?: string | number;
};

export type ApplyCouponPayload = {
  coupon_code: string;
};

export type ApplyCouponData = {
  code?: string;
  discount_type?: string;
  discount_value?: string | number;
  type?: string;
  discount?: string | number;
};

export type ApplyCouponResult = {
  ok: boolean;
  status?: boolean | string;
  message?: string;
  data?: ApplyCouponData;
};

const USER_SETTINGS_ENDPOINT = '/profile-update';
const USER_PASSWORD_ENDPOINT = '/user-update-password';
const PRODUCT_REVIEW_ENDPOINT = '/review';

export type UserSettingsResponse = {
  status?: boolean | string;
  message?: string;
  data?: unknown;
  errors?: unknown;
};

export type UpdatePasswordPayload = {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
};

export async function updateUserPassword(
  payload: UpdatePasswordPayload,
): Promise<UserSettingsResponse> {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get(AUTH_TOKEN_COOKIE)?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${USER_PASSWORD_ENDPOINT}`,
      {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
      },
    );

    let data: UserSettingsResponse = {};
    try {
      data = (await res.json()) as UserSettingsResponse;
    } catch {
      data = {};
    }
    return data;
  } catch (error) {
    console.log('updateUserPassword Error:', error);
    return { status: false, message: 'Network error. Please try again.' };
  }
}

export async function submitUserSettingsForm(
  formData: FormData,
): Promise<UserSettingsResponse> {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get(AUTH_TOKEN_COOKIE)?.value;
    console.log('🚀 ~ submitUserSettingsForm ~ token:', token);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${USER_SETTINGS_ENDPOINT}`,
      {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          Accept: 'application/json',
        },
        body: formData,
        cache: 'no-store',
      },
    );

    let data: UserSettingsResponse = {};
    try {
      data = (await res.json()) as UserSettingsResponse;
    } catch {
      data = {};
    }
    return data;
  } catch (error) {
    console.log('submitUserSettingsForm Error:', error);
    return { status: false, message: 'Network error. Please try again.' };
  }
}

export async function submitUserSettingsWithFields(fields: {
  name: string;
  email: string;
  phone: string;
  emergency_number: string;
  district: string;
  city: string;
  address: string;
  existingImageRelativePath?: string;
}): Promise<UserSettingsResponse> {
  const formData = new FormData();
  formData.append('name', fields.name);
  formData.append('email', fields.email);
  formData.append('phone', fields.phone);
  formData.append('emergency_number', fields.emergency_number);
  formData.append('district', fields.district);
  formData.append('city', fields.city);
  formData.append('address', fields.address);

  const path = fields.existingImageRelativePath?.trim();
  if (path) {
    const base = (process.env.NEXT_PUBLIC_IMG_URL || '').replace(/\/+$/, '');
    const rel = path.replace(/^\/+/, '');
    const url = base ? `${base}/${rel}` : rel;
    try {
      const imgRes = await fetch(url, { cache: 'no-store' });
      if (imgRes.ok) {
        const buf = await imgRes.arrayBuffer();
        const ct =
          imgRes.headers.get('content-type') || 'application/octet-stream';
        const blob = new Blob([buf], { type: ct });
        const filename = rel.split('/').pop() || 'profile-image';
        formData.append('image', blob, filename);
      } else {
        formData.append('image', path);
      }
    } catch {
      formData.append('image', path);
    }
  }

  return submitUserSettingsForm(formData);
}

export async function submitProductReview(
  formData: FormData,
): Promise<UserSettingsResponse> {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get(AUTH_TOKEN_COOKIE)?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${PRODUCT_REVIEW_ENDPOINT}`,
      {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          Accept: 'application/json',
        },
        body: formData,
        cache: 'no-store',
      },
    );

    let data: UserSettingsResponse = {};
    try {
      data = (await res.json()) as UserSettingsResponse;
    } catch {
      data = {};
    }
    return data;
  } catch (error) {
    console.log('submitProductReview Error:', error);
    return { status: false, message: 'Network error. Please try again.' };
  }
}

export async function submitProductReviewWithFields(fields: {
  product_id: string | number;
  vendor_id: string | number;
  ratting: number;
  review: string;
  image?: File | null;
}): Promise<UserSettingsResponse> {
  const formData = new FormData();
  formData.append('product_id', String(fields.product_id));
  formData.append('vendor_id', String(fields.vendor_id));
  formData.append('ratting', String(fields.ratting));
  formData.append('review', fields.review);
  if (fields.image instanceof File) {
    formData.append('image', fields.image, fields.image.name);
  }
  return submitProductReview(formData);
}

export async function placeOrder(
  payload: CheckoutOrderPayload,
): Promise<unknown> {
  const cookiesStore = await cookies();
  const token = cookiesStore.get(AUTH_TOKEN_COOKIE)?.value;
  const affiliateCode = normalizeAffiliateRef(
    cookiesStore.get(AFFILIATE_CODE_COOKIE)?.value,
  );

  const orderBody: CheckoutOrderPayload = {
    ...payload,
    ...(affiliateCode
      ? {
          ref_code: /^\d+$/.test(affiliateCode)
            ? Number(affiliateCode)
            : affiliateCode,
        }
      : {}),
  };
  console.log('🚀 ~ placeOrder ~ orderBody:', orderBody);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-place`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderBody),
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const obj =
      data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
    const msg =
      (typeof obj.message === 'string' && obj.message) ||
      (typeof obj.error === 'string' && obj.error) ||
      (Array.isArray(obj.errors) &&
        typeof obj.errors[0] === 'string' &&
        obj.errors[0]) ||
      `Order failed (${res.status})`;
    throw new Error(msg);
  }

  if (affiliateCode) {
    await clearAffiliateCodeCookie();
  }

  return data;
}

export async function applyCoupon(
  payload: ApplyCouponPayload,
): Promise<ApplyCouponResult> {
  const cookiesStore = await cookies();
  const token = cookiesStore.get(AUTH_TOKEN_COOKIE)?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apply-coupon`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  let data: Record<string, unknown> = {};
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    data = {};
  }

  return { ok: res.ok, ...data } as ApplyCouponResult;
}

export type ApiEnvelope<T = unknown> = {
  status?: boolean;
  message?: string;
  data?: T;
};

export type OrdersPaginatedData = {
  data?: unknown[];
  current_page?: number;
  last_page?: number;
  total?: number;
};

/** Order status options for filters. */
export async function fetchOrderStatuses(): Promise<ApiEnvelope<unknown[]>> {
  return fetcher<ApiEnvelope<unknown[]>>(
    '/order-status',
    { cache: 'no-store' },
    false,
  );
}

/** User orders list — supports filter, keyword search, pagination. */
export async function fetchUserOrders(params?: {
  filter?: string;
  keyword?: string;
  page?: number;
  perPage?: number;
}): Promise<ApiEnvelope<OrdersPaginatedData>> {
  const filter = (params?.filter ?? 'all').trim() || 'all';
  const keyword = (params?.keyword ?? '').trim();
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? ORDERS_PER_PAGE;
  const qs = new URLSearchParams();
  qs.set('filter', filter);
  qs.set('per_page', String(perPage));
  if (keyword) qs.set('keyword', keyword);
  if (page > 1) qs.set('page', String(page));
  return fetcher<ApiEnvelope<OrdersPaginatedData>>(
    `/orders?${qs.toString()}`,
    { cache: 'no-store' },
    false,
  );
}

/** Single order by invoice id (e.g. OR-00049). */
export async function fetchOrderDetails(invoiceId: string) {
  const id = String(invoiceId ?? '').trim();
  if (!id) {
    return { status: false, message: 'Invalid order', data: [] };
  }
  return fetcher(
    `/order-details/${encodeURIComponent(id)}`,
    { cache: 'no-store' },
    false,
  );
}

export type CreateTicketPayload = {
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  type?: string;
  image?: string;
};

export type TicketStoreResponse = {
  status?: boolean;
  message?: string;
  ticket?: { ticket_id?: string };
  data?: { ticket_id?: string };
};

/** Create a support ticket (JSON body). */
export async function createTicket(
  payload: CreateTicketPayload,
): Promise<TicketStoreResponse> {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get(AUTH_TOKEN_COOKIE)?.value;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket-store`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    let data: TicketStoreResponse = {};
    try {
      data = (await res.json()) as TicketStoreResponse;
    } catch {
      data = {};
    }
    return data;
  } catch (error) {
    console.log('createTicket error:', error);
    return { status: false, message: 'Failed to create ticket' };
  }
}

/** Submit ticket reply (multipart FormData: ticket_id, message, optional image file). */
export async function submitTicketReply(
  formData: FormData,
): Promise<{ status?: boolean; message?: string }> {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get(AUTH_TOKEN_COOKIE)?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ticket-replay-submit`,
      {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          Accept: 'application/json',
        },
        body: formData,
        cache: 'no-store',
      },
    );

    let data: { status?: boolean; message?: string } = {};
    try {
      data = (await res.json()) as { status?: boolean; message?: string };
    } catch {
      data = {};
    }
    return data;
  } catch (error) {
    console.log('Submit ticket reply error:', error);
    return { status: false, message: 'Failed to send reply' };
  }
}

export type AffiliateOrdersResponse = {
  status?: boolean;
  message?: string;
  data?: {
    current_status_filter?: string;
    orders?: unknown[];
  };
};

export type AffiliateWithdrawalHistoryResponse = {
  status?: boolean;
  message?: string;
  data?: unknown[];
};

export type AffiliateWithdrawalPageResponse = {
  status?: boolean;
  message?: string;
  data?: { account_balance?: string | number };
};

export type AffiliateShopResponse = {
  status?: boolean;
  message?: string;
  data?: {
    user?: { name?: string; ref_code?: string | null };
    affiliate_links?: { affiliate_url?: string };
  };
};

export type WithdrawalRequestPayload = {
  amount: string;
  payment_method: string;
  account_number: string;
  payment_details: string;
};

export type WithdrawalRequestResponse = {
  status?: boolean | string;
  message?: string;
  errors?: unknown;
};

export async function fetchAffiliateOrders(
  userId: number | string,
): Promise<AffiliateOrdersResponse> {
  return fetcher<AffiliateOrdersResponse>(
    `/affiliate-order/${userId}`,
    { cache: 'no-store' },
    false,
  );
}

export async function fetchAffiliateWithdrawalHistory(
  userId: number | string,
): Promise<AffiliateWithdrawalHistoryResponse> {
  return fetcher<AffiliateWithdrawalHistoryResponse>(
    `/affiliate-withdrawal-history/${userId}`,
    { cache: 'no-store' },
    false,
  );
}

export async function fetchAffiliateWithdrawalPage(): Promise<AffiliateWithdrawalPageResponse> {
  return fetcher<AffiliateWithdrawalPageResponse>(
    '/affiliate-withdrawal',
    { cache: 'no-store' },
    false,
  );
}

export async function fetchAffiliateShop(): Promise<AffiliateShopResponse> {
  return fetcher<AffiliateShopResponse>(
    '/affiliate-shop',
    { cache: 'no-store' },
    false,
  );
}

export async function submitWithdrawalRequest(
  payload: WithdrawalRequestPayload,
): Promise<WithdrawalRequestResponse> {
  const cookiesStore = await cookies();
  const token = cookiesStore.get(AUTH_TOKEN_COOKIE)?.value;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/withdrawal-request`,
    {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    },
  );

  let data: WithdrawalRequestResponse = {};
  try {
    data = (await res.json()) as WithdrawalRequestResponse;
  } catch {
    data = {};
  }

  if (!res.ok && !data.message) {
    data.message = `Request failed (${res.status})`;
  }

  return data;
}
