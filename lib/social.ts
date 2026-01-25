import type { ComponentType } from "react";
import {
    IconBrandBilibili,
    IconBrandGithub,
    IconBrandTelegram,
    IconBrandX,
    IconBrandYoutube,
    IconMail,
} from "@tabler/icons-react";

export type SocialIcon = ComponentType<{ className?: string; size?: number; stroke?: number }>;

export type SocialLink = {
    id: string;
    label: string;
    href: string;
    icon: SocialIcon;
};

export const SOCIAL_LINKS: readonly SocialLink[] = [
    { id: "github", label: "GitHub", href: "https://github.com/", icon: IconBrandGithub },
    { id: "x", label: "X", href: "https://x.com/", icon: IconBrandX },
    { id: "youtube", label: "YouTube", href: "https://www.youtube.com/", icon: IconBrandYoutube },
    { id: "bilibili", label: "Bilibili", href: "https://space.bilibili.com/", icon: IconBrandBilibili },
    { id: "telegram", label: "Telegram", href: "https://t.me/", icon: IconBrandTelegram },
    { id: "email", label: "Email", href: "mailto:hello@example.com", icon: IconMail },
];
