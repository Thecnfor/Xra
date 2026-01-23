"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/provider";
import { selectMenuOpen } from "@/stores/selectors";
import { getHeaderNavItemsForPathname, type HeaderNavItem } from "./nav-items";

export type HeaderNavProps = {
    items?: HeaderNavItem[];
    className?: string;
};

export function HeaderNav({ items, className }: HeaderNavProps) {
    const pathname = usePathname();
    const resolvedItems = items ?? getHeaderNavItemsForPathname(pathname);
    const menuOpen = useAppStore(selectMenuOpen);
    const [ready, setReady] = React.useState(false);

    React.useEffect(() => {
        const raf = requestAnimationFrame(() => setReady(true));
        return () => cancelAnimationFrame(raf);
    }, []);

    if (resolvedItems.length === 0) return null;

    const count = resolvedItems.length;

    return (
        <nav
            aria-label="主导航"
            aria-hidden={menuOpen}
            className={cn("flex items-center", menuOpen && "pointer-events-none", className)}
        >
            <ul className="flex items-center gap-5">
                {resolvedItems.map((item, index) => (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            tabIndex={menuOpen ? -1 : undefined}
                            data-xra-state={menuOpen ? "out" : ready ? "in" : "pre"}
                            className={cn(
                                "group relative inline-flex h-11 items-center rounded-full px-2.5 text-[13px] font-medium tracking-[0.16em]",
                                "text-foreground/60 transition-colors duration-500 ease-out hover:text-foreground focus-ring",
                                "xra-header-nav-item",
                            )}
                            style={{
                                transitionDelay: menuOpen
                                    ? `${(count - 1 - index) * 55}ms`
                                    : `${120 + index * 70}ms`,
                            }}
                        >
                            <span className="pointer-events-none absolute inset-x-2.5 -bottom-0.5 h-px bg-linear-to-r from-transparent via-foreground/22 to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
