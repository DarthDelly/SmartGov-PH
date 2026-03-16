"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

interface AppLogoProps {
  /** "sm" = sidebar expanded, "lg" = auth pages */
  size?: "sm" | "lg";
  /** When true, uses the small icon variant (SMALL1.x.png) */
  collapsed?: boolean;
  className?: string;
  /** Override rendered pixel width */
  width?: number;
}

export function AppLogo({ size = "lg", collapsed = false, className, width: widthProp }: AppLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const width = widthProp ?? (collapsed ? 36 : size === "sm" ? 140 : 220);

  if (!mounted) {
    return <div style={{ width, height: collapsed ? 36 : 48 }} className={className} />;
  }

  const src = collapsed
    ? resolvedTheme === "dark"
      ? "/img/SMALL1.2.png"
      : "/img/SMALL1.1.png"
    : resolvedTheme === "dark"
    ? "/img/WHITE.png"
    : "/img/BLUE.png";

  return (
    <Image
      src={src}
      alt="SmartGov PH"
      width={500}
      height={200}
      style={{ width, height: "auto" }}
      className={className}
      priority
    />
  );
}
