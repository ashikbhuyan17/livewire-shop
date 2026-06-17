import Image from 'next/image';
import Link from 'next/link';
import CoverageAreaImage from '@/public/CoverageArea.jpeg';

type Props = {
  leadBannerUrl?: string;
  leadBannerTitle?: string;
  leadBannerHref?: string;
};

export default function CoverageArea({
  leadBannerUrl,
  leadBannerTitle,
  leadBannerHref,
}: Props) {
  const useApiBanner = Boolean(leadBannerUrl?.trim());
  const trimmedHref = (leadBannerHref || '').trim();
  const hasApiHref = Boolean(trimmedHref && trimmedHref !== '#');

  const apiBannerImage = useApiBanner ? (
    <Image
      alt={leadBannerTitle ?? ''}
      src={leadBannerUrl as string}
      width={1280}
      height={520}
      className="w-full cursor-pointer rounded-sm"
      sizes="(max-width: 768px) 100vw, 68vw"
    />
  ) : null;

  return (
    <div className="my-12 flex flex-col gap-2 md:flex-row">
      {useApiBanner ? (
        <div className="w-full shrink-0 md:w-[68%]">
          {hasApiHref ? (
            <Link href={trimmedHref} prefetch className="block w-full">
              {apiBannerImage}
            </Link>
          ) : (
            apiBannerImage
          )}
        </div>
      ) : (
        <Image
          alt=""
          src={CoverageAreaImage}
          className="w-full cursor-pointer rounded-sm md:w-[68%]"
        />
      )}
      <Link
        prefetch
        className="coverage-area flex flex-col bg-[#F7F5F6] md:col-span-1"
        href="#"
      >
        <div className="bg-[#F7F5F6] px-[5px] md:rounded-t-lg">
          <p className="py-3 text-center text-[13px] font-bold">
            Shwapno Coverage area
          </p>
          <div className="grid grid-cols-2">
            <div className="border-r">
              <div className="flex justify-between px-1.5 py-1 text-[11px] odd:bg-white">
                <span className="font-bold">Dhaka</span>
                <span>-</span>
                <span className="text-main">188 outlets</span>
              </div>
              <div className="flex justify-between px-1.5 py-1 text-[11px] odd:bg-white">
                <span className="font-bold">Chattogram</span>
                <span>-</span>
                <span className="text-main">15 outlets</span>
              </div>
              <div className="flex justify-between px-1.5 py-1 text-[11px] odd:bg-white">
                <span className="font-bold">Cumilla</span>
                <span>-</span>
                <span className="text-main">9 outlets</span>
              </div>
              <div className="flex justify-between px-1.5 py-1 text-[11px] odd:bg-white">
                <span className="font-bold">Manikganj</span>
                <span>-</span>
                <span className="text-main">4 outlets</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between px-1.5 py-1 text-[11px] odd:bg-white">
                <span className="font-bold">Sylhet</span>
                <span>-</span>
                <span className="text-main">12 outlets</span>
              </div>
              <div className="flex justify-between px-1.5 py-1 text-[11px] odd:bg-white">
                <span className="font-bold">Khulna</span>
                <span>-</span>
                <span className="text-main">13 outlets</span>
              </div>
              <div className="flex justify-between px-1.5 py-1 text-[11px] odd:bg-white">
                <span className="font-bold">Gazipur</span>
                <span>-</span>
                <span className="text-main">38 outlets</span>
              </div>
              <div className="flex justify-between px-1.5 py-1 text-[11px] odd:bg-white">
                <span className="font-bold">Barishal</span>
                <span>-</span>
                <span className="text-main">10 outlets</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-auto aspect-[504/127] w-full">
          <Image
            alt="coverage_area"
            loading="lazy"
            width={504}
            height={127}
            decoding="async"
            data-nimg="1"
            className="h-full w-full object-cover"
            src="/web_coverage_area.32a74525.jpg"
          />
        </div>
      </Link>
    </div>
  );
}
