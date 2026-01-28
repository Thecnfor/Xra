export type SidebarSubEntry =
    | {
        type: "item";
        key: string;
        label: string;
        href: string;
    }
    | {
        type: "label";
        label: string;
    };

export type SidebarTopItem =
    | {
        key: string;
        label: string;
        href: string;
        children?: never;
    }
    | {
        key: string;
        label: string;
        children: SidebarSubEntry[];
        href?: never;
    };

export const sidebarMenuItems: SidebarTopItem[] = [
    {
        key: "home",
        label: "首页",
        href: "/",
    },
    {
        key: "van",
        label: "VANeuxs",
        children: [
            { type: "label", label: "首页" },
            { type: "item", key: "van-entry", label: "进入 VANeuxs", href: "/VANeuxs" },
            { type: "label", label: "分析" },
            { type: "item", key: "van-analytics", label: "数据分析", href: "/VANeuxs" },
            { type: "label", label: "报表" },
            { type: "item", key: "van-reports", label: "报表中心", href: "/VANeuxs" },
        ],
    },
];
