"use client";

import MenuButton from "@/components/features/meta/menu";

export function HeaderActions() {
  return (
    <div className="flex items-center justify-center">
      <MenuButton className="h-10 w-10 text-neutral-900 dark:text-neutral-100" />
    </div>
  );
}
