"use client";

import { cn } from "@/lib/utils";
import { selectMenuOpen, selectSetMenuOpen, useAppStore } from "@/stores";

interface MenuButtonProps {
  className?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const MenuButton = ({ className, checked, onChange }: MenuButtonProps) => {
  const menuOpen = useAppStore(selectMenuOpen);
  const setMenuOpen = useAppStore(selectSetMenuOpen);

  const resolvedChecked = checked ?? menuOpen;
  const resolvedOnChange = onChange ?? setMenuOpen;

  return (
    <button
      type="button"
      aria-label={resolvedChecked ? "关闭菜单" : "打开菜单"}
      aria-pressed={resolvedChecked}
      className={cn(
        "group relative inline-flex h-11 w-11 select-none items-center justify-center rounded-full border border-transparent bg-transparent text-foreground/80 backdrop-blur-none transition-colors duration-300 ease-out hover:bg-foreground/6 hover:text-foreground cursor-pointer focus-ring",
        resolvedChecked ? "border-border/60 bg-background/40 backdrop-blur-sm" : null,
        className,
      )}
      onClick={() => resolvedOnChange(!resolvedChecked)}
    >
      <svg
        viewBox="0 0 32 32"
        data-open={resolvedChecked ? "true" : "false"}
        className={cn(
          "h-7 w-7 transition-[rotate] duration-600 ease-in-out data-[open=true]:-rotate-45",
          "data-[open=true]:[&_.line-top-bottom]:[stroke-dasharray:20_300] data-[open=true]:[&_.line-top-bottom]:[stroke-dashoffset:-32.42]",
        )}
      >
        <path
          className="line-top-bottom fill-none stroke-current stroke-3 stroke-linecap-round stroke-linejoin-round transition-[stroke-dasharray,stroke-dashoffset] duration-600 ease-in-out [stroke-dasharray:12_63]"
          d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
        />
        <path
          className="fill-none stroke-current stroke-3 stroke-linecap-round stroke-linejoin-round transition-[stroke-dasharray,stroke-dashoffset] duration-600 ease-in-out"
          d="M7 16 27 16"
        />
      </svg>
    </button>
  );
};

export default MenuButton;
