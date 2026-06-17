/** Partner (affiliate) users have a non-empty ref_code on their profile. */
export function isPartnerUser(
  refCode: string | number | null | undefined,
): boolean {
  if (refCode == null) return false;
  const value = String(refCode).trim();
  return value.length > 0 && value.toLowerCase() !== 'null';
}

export function buildPartnerShareUrl(
  refCode: string,
  affiliateUrl?: string | null,
): string {
  const ref = String(refCode).trim();
  if (!ref) return '';

  const base =
    String(affiliateUrl ?? '').trim() ||
    `${String(process.env.NEXT_PUBLIC_BASE_URL ?? '').replace(/\/+$/, '')}/?ref=`;

  if (!base) return `?ref=${encodeURIComponent(ref)}`;

  if (base.endsWith('=')) {
    return `${base}${ref}`;
  }
  if (base.includes('ref=') && !base.endsWith('=')) {
    return base;
  }
  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}ref=${encodeURIComponent(ref)}`;
}

export function withdrawalStatusLabel(status: string | number | null | undefined): {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
} {
  const s = String(status ?? '').trim();
  if (s === '1' || s.toLowerCase() === 'approved' || s.toLowerCase() === 'paid') {
    return { label: 'Approved', variant: 'default' };
  }
  if (s === '2' || s.toLowerCase() === 'rejected') {
    return { label: 'Rejected', variant: 'destructive' };
  }
  return { label: 'Pending', variant: 'secondary' };
}
