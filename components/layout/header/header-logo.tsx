import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type XRAKProps = {
  className?: string;
  href?: string;
  priority?: boolean;
};

export function XRAK({ className, href = "/", priority = true }: XRAKProps) {
  return (
    <Link
      href={href}
      aria-label="XRAK"
      className={cn("flex items-center", className)}
    >
      <Image
        src="/img/XRAK_black.png"
        alt="XRAK"
        width={60.775}
        height={33.15}
        priority={priority}
        sizes="61px"
        className="xra-header-logo h-[1.16rem] w-auto select-none dark:invert"
        draggable={false}
      />
    </Link>
  );
}
