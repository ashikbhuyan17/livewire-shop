"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const FLYOUT_Z = 220;
const FLYOUT_LEAVE_MS = 200;
const FLYOUT_PANEL_W = 224;

/** Visible category column (scrollport) — used so flyout height matches the left panel exactly */
function getCategoryViewportRect(rowEl: HTMLElement): DOMRect | null {
  const scroll = rowEl.closest(
    "[data-category-scroll]",
  ) as HTMLElement | null;
  if (scroll) return scroll.getBoundingClientRect();

  const shell = rowEl.closest(
    "[data-category-shell]",
  ) as HTMLElement | null;
  if (shell) return shell.getBoundingClientRect();

  let cur: HTMLElement | null = rowEl.parentElement;
  while (cur) {
    const st = window.getComputedStyle(cur);
    if (
      (st.overflowY === "auto" || st.overflowY === "scroll") &&
      cur.clientHeight > 48
    ) {
      return cur.getBoundingClientRect();
    }
    cur = cur.parentElement;
  }
  return null;
}

/** Same row height for category and subcategory rows */
const rowItem =
  "flex min-h-10 w-full items-center gap-2.5 px-2.5 py-0 transition-colors duration-150 ease-out motion-reduce:transition-none";

export default function CategorySidebar({
  isCollapsible = false,
  categories,
  className,
  embedded = false,
}: {
  isCollapsible?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: any[];
  className?: string;
  embedded?: boolean;
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [flyoutBox, setFlyoutBox] = useState<{
    top: number;
    left: number;
    height: number;
  } | null>(null);

  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLeaveTimer = useCallback(() => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  }, []);

  const scheduleCloseFlyout = useCallback(() => {
    if (isCollapsible) return;
    clearLeaveTimer();
    leaveTimer.current = setTimeout(() => {
      setActiveCategory(null);
      setFlyoutBox(null);
      leaveTimer.current = null;
    }, FLYOUT_LEAVE_MS);
  }, [isCollapsible, clearLeaveTimer]);

  const openFlyout = useCallback(
    (name: string) => {
      if (isCollapsible || !name) return;
      clearLeaveTimer();
      setFlyoutBox(null);
      setActiveCategory(name);
    },
    [isCollapsible, clearLeaveTimer],
  );

  const handleClick = (name: string) => {
    if (isCollapsible)
      setActiveCategory((prev) => (prev === name ? null : name));
  };

  const updateFlyoutBox = useCallback(() => {
    if (isCollapsible || !activeCategory) {
      setFlyoutBox(null);
      return;
    }
    const rowEl = rowRefs.current[activeCategory];
    if (!rowEl || typeof window === "undefined") {
      setFlyoutBox(null);
      return;
    }
    const vp = getCategoryViewportRect(rowEl);
    const rowRect = rowEl.getBoundingClientRect();
    const panelW = FLYOUT_PANEL_W;
    const margin = 8;

    let top: number;
    let height: number;
    let left: number;

    if (vp && vp.height >= 48) {
      top = vp.top;
      height = vp.height;
      left = vp.right - 1;
      if (top + height > window.innerHeight - margin) {
        height = Math.max(80, window.innerHeight - margin - top);
      }
      if (top < margin) {
        const cut = margin - top;
        top = margin;
        height = Math.max(80, height - cut);
      }
    } else {
      top = rowRect.top;
      left = rowRect.right - 1;
      height = Math.min(
        320,
        Math.max(120, window.innerHeight - margin - top),
      );
    }

    if (left + panelW > window.innerWidth - margin) {
      const refLeft = vp?.left ?? rowRect.left;
      left = Math.max(margin, refLeft - panelW + 1);
    }

    height = Math.max(80, Math.round(height));
    top = Math.round(top);
    left = Math.round(left);

    setFlyoutBox({ top, left, height });
  }, [activeCategory, isCollapsible]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (isCollapsible || !activeCategory) {
      setFlyoutBox(null);
      return;
    }
    updateFlyoutBox();
    const onScrollOrResize = () => updateFlyoutBox();
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [activeCategory, isCollapsible, updateFlyoutBox]);

  useEffect(() => {
    return () => clearLeaveTimer();
  }, [clearLeaveTimer]);

  const flyoutCategory = categories?.find(
    (c: { name?: string }) => c?.name === activeCategory,
  );
  const flyoutSubs =
    !isCollapsible &&
    activeCategory &&
    flyoutCategory &&
    Array.isArray(flyoutCategory.subcategories)
      ? flyoutCategory.subcategories
      : null;

  const linkFocus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/35 focus-visible:ring-offset-0";

  const flyoutPortal =
    mounted &&
    typeof document !== "undefined" &&
    flyoutSubs &&
    flyoutSubs.length > 0 &&
    flyoutBox &&
    createPortal(
      <div
        className="fixed box-border flex flex-col overflow-hidden border border-gray-200 bg-white shadow-lg"
        style={{
          top: flyoutBox.top,
          left: flyoutBox.left,
          width: FLYOUT_PANEL_W,
          height: flyoutBox.height,
          minHeight: flyoutBox.height,
          maxHeight: flyoutBox.height,
          zIndex: FLYOUT_Z,
        }}
        onMouseEnter={clearLeaveTimer}
        onMouseLeave={scheduleCloseFlyout}
      >
        <div className="shrink-0 border-b border-gray-200 px-2.5 py-2.5">
          <p className="truncate text-sm font-semibold leading-snug text-gray-900">
            {flyoutCategory?.name}
          </p>
        </div>
        <ul className="m-0 min-h-0 flex-1 list-none overflow-y-auto overscroll-y-contain p-0">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {flyoutSubs.map((subcategory: any) => (
            <li key={subcategory?.name} className="m-0">
              <Link
                prefetch
                href={subcategory?.href}
                className={cn(
                  linkFocus,
                  rowItem,
                  "text-[13px] font-medium leading-snug text-gray-800 hover:bg-gray-50 active:bg-gray-100/80",
                )}
              >
                <span className="truncate">{subcategory?.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>,
      document.body,
    );

  const iconWrap =
    "flex h-8 w-8 shrink-0 items-center justify-center border border-gray-200/80 bg-gray-50";

  return (
    <aside
      className={cn(
        "relative flex w-full max-w-full overflow-visible",
        embedded
          ? "bg-transparent"
          : "border border-gray-200/70 bg-white shadow-sm",
        className,
      )}
    >
      {flyoutPortal}
      <div
        className={cn(
          embedded ? "w-full p-0 shadow-none" : "w-72 max-w-full p-0 shadow-none",
        )}
      >
        <nav aria-label="Product categories">
          {categories?.map((category) => {
            const hasSubcategories =
              Array.isArray(category?.subcategories) &&
              category?.subcategories?.length > 0;

            const isActive =
              hasSubcategories && activeCategory === category?.name;

            return (
              <div
                key={category?.name}
                ref={(el) => {
                  rowRefs.current[category?.name] = el;
                }}
                className="relative"
                onMouseEnter={() => {
                  if (!hasSubcategories) return;
                  if (!isCollapsible) openFlyout(category?.name ?? "");
                }}
                onMouseLeave={() => {
                  if (!hasSubcategories) return;
                  if (!isCollapsible) scheduleCloseFlyout();
                }}
              >
                {isCollapsible ? (
                  hasSubcategories ? (
                    <button
                      type="button"
                      onClick={() => handleClick(category?.name)}
                      className={cn(
                        rowItem,
                        "group justify-between text-left",
                        isActive
                          ? "bg-emerald-50/90"
                          : "hover:bg-gray-50 active:bg-gray-100/80",
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span className={iconWrap}>
                          <Image
                            alt=""
                            src={`${process.env.NEXT_PUBLIC_IMG_URL}/${category?.icon}`}
                            width={64}
                            height={64}
                            className="h-5 w-5 object-contain"
                          />
                        </span>
                        <span className="truncate text-[13px] font-medium leading-snug text-gray-800">
                          {category?.name}
                        </span>
                      </span>
                      {isActive ? (
                        <ChevronDown className="h-4 w-4 shrink-0 text-emerald-700/80" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-gray-500" />
                      )}
                    </button>
                  ) : (
                    <Link
                      prefetch
                      href={category?.slug}
                      className={cn(
                        rowItem,
                        linkFocus,
                        "hover:bg-gray-50 active:bg-gray-100/80",
                      )}
                    >
                      <span className={iconWrap}>
                        <Image
                          alt=""
                          src={`${process.env.NEXT_PUBLIC_IMG_URL}/${category?.icon}`}
                          width={64}
                          height={64}
                          className="h-5 w-5 object-contain"
                        />
                      </span>
                      <span className="truncate text-[13px] font-medium leading-snug text-gray-800">
                        {category?.name}
                      </span>
                    </Link>
                  )
                ) : (
                  <div
                    className={cn(
                      rowItem,
                      "justify-between",
                      hasSubcategories && "group",
                      hasSubcategories &&
                        (isActive
                          ? "bg-emerald-50/90"
                          : "hover:bg-gray-50/90"),
                      !hasSubcategories && "cursor-default opacity-90",
                    )}
                  >
                    {hasSubcategories ? (
                      <>
                        <Link
                          prefetch
                          href={category?.slug}
                          className={cn(
                            linkFocus,
                            "flex min-w-0 flex-1 items-center gap-2.5",
                          )}
                        >
                          <span className={iconWrap}>
                            <Image
                              alt=""
                              src={`${process.env.NEXT_PUBLIC_IMG_URL}/${category?.icon}`}
                              width={64}
                              height={64}
                              className="h-5 w-5 object-contain"
                            />
                          </span>
                          <span className="truncate text-[13px] font-medium leading-snug text-gray-800">
                            {category?.name}
                          </span>
                        </Link>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isActive
                              ? "text-emerald-700/70"
                              : "text-gray-300 group-hover:text-gray-500",
                          )}
                          aria-hidden
                        />
                      </>
                    ) : (
                      <Link
                        prefetch
                        href={category?.slug}
                        className={cn(linkFocus, "flex flex-1 items-center gap-2.5")}
                      >
                        <span className={iconWrap}>
                          <Image
                            alt=""
                            src={`${process.env.NEXT_PUBLIC_IMG_URL}/${category?.icon}`}
                            width={64}
                            height={64}
                            className="h-5 w-5 object-contain"
                          />
                        </span>
                        <span className="truncate text-[13px] font-medium leading-snug text-gray-800">
                          {category?.name}
                        </span>
                      </Link>
                    )}
                  </div>
                )}

                {hasSubcategories && isCollapsible && (
                  <div
                    className={cn(
                      "overflow-hidden transition-[max-height,opacity] duration-300 ease-out motion-reduce:transition-none",
                      isActive ? "max-h-64 opacity-100" : "max-h-0 opacity-0",
                    )}
                  >
                    <div className="border-l-2 border-emerald-100 pl-2">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {category?.subcategories?.map((subcategory: any) => (
                        <Link
                          prefetch
                          key={subcategory?.name}
                          href={subcategory?.href}
                          className={cn(
                            linkFocus,
                            rowItem,
                            "pl-4 text-[13px] font-medium leading-snug text-gray-700 hover:bg-gray-50",
                          )}
                        >
                          <span className="truncate">{subcategory?.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
