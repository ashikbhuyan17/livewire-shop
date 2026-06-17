import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Props = {
  logoSrc?: string;
  className?: string;
};

export default function BrandLogoLink({
  logoSrc = '/livewire.png',
  className,
}: Props) {
  return (
    <Link
      prefetch
      href="/"
      className={cn(
        'flex shrink-0 outline-none focus-visible:outline-none',
        className,
      )}
    >
      <Image
        src={logoSrc}
        width={480}
        height={120}
        alt="Livewire — Premium Smartphone and Gadget Chain"
        className="h-8 w-auto max-w-[8.5rem] object-contain object-left sm:h-9 sm:max-w-[10rem] lg:h-10 lg:max-w-[11.5rem]"
        priority
      />
    </Link>
  );
}
