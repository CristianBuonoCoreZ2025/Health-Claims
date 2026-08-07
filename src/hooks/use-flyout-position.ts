"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";

interface FlyoutPosition {
  top?: number;
  bottom?: number;
}

function calculatePosition(
  itemRect: DOMRect,
  flyoutRect: DOMRect,
  viewportH: number,
): FlyoutPosition {
  const MARGIN = 8;
  const spaceBelow = viewportH - itemRect.top - MARGIN;
  const spaceAbove = itemRect.bottom - MARGIN;
  const flyoutH = flyoutRect.height;

  if (flyoutH <= spaceBelow) {
    return { top: 0 };
  }
  if (flyoutH <= spaceAbove) {
    return { bottom: 0 };
  }
  if (spaceBelow >= spaceAbove) {
    return { top: -itemRect.top + MARGIN };
  }
  return { bottom: -(viewportH - itemRect.bottom) + MARGIN };
}

export function useFlyoutPosition(open: boolean) {
  const itemRef = useRef<HTMLDivElement>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<FlyoutPosition>({ top: 0 });

  useLayoutEffect(() => {
    if (!open || !itemRef.current || !flyoutRef.current) return;
    const itemRect = itemRef.current.getBoundingClientRect();
    const flyoutRect = flyoutRef.current.getBoundingClientRect();
    setPosition(calculatePosition(itemRect, flyoutRect, window.innerHeight));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = () => {
      if (!itemRef.current || !flyoutRef.current) return;
      const itemRect = itemRef.current.getBoundingClientRect();
      const flyoutRect = flyoutRef.current.getBoundingClientRect();
      setPosition(calculatePosition(itemRect, flyoutRect, window.innerHeight));
    };
    window.addEventListener("resize", handler);
    window.addEventListener("scroll", handler, true);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("scroll", handler, true);
    };
  }, [open]);

  return { itemRef, flyoutRef, position };
}
