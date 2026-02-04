"use client";

import React from "react";
import { IconChevronRight, IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/components/features/meta/button";
import { cn } from "@/lib/utils";

interface BreadcrumbNavProps {
    currentPath: string;
    breadcrumbs: string[];
    onNavigate: (path: string) => void;
    onBack: () => void;
}

export function BreadcrumbNav({
    currentPath,
    breadcrumbs,
    onNavigate,
    onBack,
}: BreadcrumbNavProps) {
    return (
        <div className="flex items-center gap-2 mb-4 md:mb-6 text-xs md:sm overflow-x-auto whitespace-nowrap pb-1 scrollbar-hide shrink-0">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("")}
                className={cn(
                    "h-8 md:h-9 px-3 rounded-full transition-all",
                    currentPath === ""
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-foreground/5"
                )}
            >
                全部文件
            </Button>

            {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                    <IconChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground/30 shrink-0" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            const path = "/" + breadcrumbs.slice(0, idx + 1).join("/");
                            onNavigate(path);
                        }}
                        className={cn(
                            "h-8 md:h-9 px-3 rounded-full transition-all",
                            idx === breadcrumbs.length - 1
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-foreground/5"
                        )}
                    >
                        {crumb}
                    </Button>
                </React.Fragment>
            ))}

            {currentPath && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onBack}
                    className="ml-auto h-8 md:h-9 px-3 md:px-4 gap-1.5 md:gap-2 rounded-full border-dashed hover:border-solid transition-all text-[10px] md:text-xs"
                >
                    <IconArrowLeft className="w-3 md:w-3.5 h-3 md:h-3.5" />
                    返回上级
                </Button>
            )}
        </div>
    );
}
