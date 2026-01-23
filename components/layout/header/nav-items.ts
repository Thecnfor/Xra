export type HeaderNavItem = {
    label: string;
    href: string;
};

const homeHeaderNavItems: HeaderNavItem[] = [
    { label: "VANeuxs", href: "/vaneuxs" },
    { label: "Kongroo", href: "/kongroo" },
    { label: "LUMIS", href: "/lumis" },
    { label: "HOME", href: "/" },
];

export function getHeaderNavItemsForPathname(pathname: string): HeaderNavItem[] {
    if (pathname === "/") return homeHeaderNavItems;
    return [];
}
