"use client";

import { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/10 backdrop-blur-sm border border-white/5",
        className,
      )}
      style={style}
    />
  );
}
