"use client";

import { useState, useRef, type MouseEvent } from "react";
import Image from "next/image";

interface ProductImageZoomProps {
  src: string;
  zoomScale?: number;
}

export function ProductImage({ src, zoomScale = 2 }: ProductImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setTransformOrigin(`${x}% ${y}%`);
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setTransformOrigin("center center");
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-square bg-gray-100 overflow-hidden cursor-zoom-in"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative w-full h-full transition-transform duration-300 ease-out"
        style={{
          transform: isZoomed ? `scale(${zoomScale})` : "scale(1)",
          transformOrigin: transformOrigin,
        }}
      >
        <Image
          src={src}
          alt={""}
          fill
          className="object-cover w-[30rem] rounded-sm"
        />
      </div>
    </div>
  );
}
