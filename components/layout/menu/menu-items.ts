export type MenuItem = {
  label: string;
  href: string;
  description?: string;
};

export const menuItems: MenuItem[] = [
  { label: "首页", href: "/", description: "返回起点" },
];

