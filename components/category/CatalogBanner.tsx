import Image from 'next/image';
import CategoryBanner from '@/public/category_banner.png';

type Props = {
  imagePath?: string | null;
  alt?: string;
};

export default function CatalogBanner({ imagePath, alt = '' }: Props) {
  const base = (process.env.NEXT_PUBLIC_IMG_URL || '').replace(/\/+$/, '');
  const rel = imagePath?.trim().replace(/^\//, '');
  const src = rel && base ? `${base}/${rel}` : CategoryBanner;

  return (
    <section className="relative my-2 mb-6 h-36 overflow-hidden rounded-sm sm:h-44 md:h-52 lg:h-56">
      <Image
        alt={alt}
        src={src}
        fill
        className="object-cover object-center"
        sizes="(max-width: 1536px) 100vw, 95rem"
        priority
      />
    </section>
  );
}
