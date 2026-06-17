'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function ImagePreview({
  src,
  alt,
  className,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'block h-full w-full cursor-zoom-in overflow-hidden rounded-lg',
          className,
        )}
        aria-label={`View ${alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-contain"
        />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[min(92vw,44rem)] border-0 p-2 sm:p-3">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="mx-auto max-h-[min(80vh,36rem)] w-full object-contain"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
