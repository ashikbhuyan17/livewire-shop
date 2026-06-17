import { cache } from 'react';
import { publicFetcher } from '@/lib/fetcher';

const REVALIDATE = 3600;

export type Branch = {
  id?: number;
  name?: string;
  code?: string;
  phone?: string;
  email?: string;
  address?: string;
  lat?: string;
  lng?: string;
  status?: string;
};

export type Outlet = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

type BranchesResponse = {
  status?: boolean;
  message?: string;
  data?: Branch[];
};

function isBranchActive(branch: Branch): boolean {
  const status = String(branch.status ?? '1').trim();
  return status === '1' || status === 'true' || status === 'active';
}

export function mapBranchToOutlet(branch: Branch): Outlet | null {
  if (!isBranchActive(branch)) return null;

  const lat = parseFloat(String(branch.lat ?? ''));
  const lng = parseFloat(String(branch.lng ?? ''));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const name = branch.name?.trim();
  const address = branch.address?.trim();
  if (!name || !address) return null;

  const id = branch.code?.trim() || String(branch.id ?? '');
  if (!id) return null;

  return { id, name, address, lat, lng };
}

export const fetchBranches = cache(async (): Promise<Outlet[]> => {
  try {
    const res = await publicFetcher<BranchesResponse>(
      '/branch',
      {},
      REVALIDATE,
    );
    if (!res?.status || !Array.isArray(res.data)) return [];
    return res.data
      .map(mapBranchToOutlet)
      .filter((o): o is Outlet => o !== null);
  } catch {
    return [];
  }
});
