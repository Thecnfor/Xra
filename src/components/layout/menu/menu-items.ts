export type MenuItem = {
  label: string;
  href: string;
  description?: string;
};

export const menuItems: MenuItem[] = [
  { label: "主页", href: "/home", description: "返回起点" },
  { label: "VANeuxs", href: "/VANeuxs", description: "探索虚拟艺术新维度" },
  { label: "Kongroo", href: "/Kongroo", description: "袋鼠式敏捷协作空间" },
  { label: "LUMIS", href: "/LUMIS", description: "光影智能交互系统" },
  { label: "CAMPUS", href: "/campus", description: "校园专区" }
];
