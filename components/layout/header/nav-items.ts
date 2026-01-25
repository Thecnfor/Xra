export type HeaderNavItem = {
    label: string;
    href: string;
};

const homeHeaderNavItems: HeaderNavItem[] = [
    { label: "VANeuxs", href: "/VANeuxs" },
    { label: "Kongroo", href: "/Kongroo" },
    { label: "LUMIS", href: "/LUMIS" },
    { label: "GDUFE", href: "/GDUFE" },
    { label: "HOME", href: "/" },
];

export function getHeaderNavItemsForPathname(pathname: string): HeaderNavItem[] {
    if (pathname === "/") return homeHeaderNavItems;
    return [];
}
