"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState, MouseEvent } from "react";

interface CategorySliderProps {
  children: React.ReactNode;
  className?: string;
}

const DraggableSlider: React.FC<CategorySliderProps> = ({
  children,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    scrollRef.current.classList.add("cursor-grabbing");
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    scrollRef.current?.classList.remove("cursor-grabbing");
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    scrollRef.current?.classList.remove("cursor-grabbing");
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // control drag speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-auto scrollbar-hide select-none cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {children}
      </div>
    </div>
  );
};

export default DraggableSlider;
