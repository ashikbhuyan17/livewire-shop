import OutletsSection from '@/components/our-outlets/OutletsSection';
import { fetchBranches } from '@/lib/branches';

export default async function OurOutletsPage() {
  const outlets = await fetchBranches();
  return <OutletsSection outlets={outlets} />;
}
