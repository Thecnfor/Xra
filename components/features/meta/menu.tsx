"use client";

import { cn } from "@/lib/utils";

interface MenuButtonProps {
  className?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const MenuButton = ({ className, checked, onChange }: MenuButtonProps) => {
  return (
    <label className={cn("cursor-pointer block", className)}>
      <input
        type="checkbox"
        className="hidden peer"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <svg
        viewBox="0 0 32 32"
        className={cn(
          "h-[3em] transition-transform duration-600 ease-in-out peer-checked:-rotate-45",
          // 当 peer (input) 被选中时，修改子元素 .line-top-bottom 的样式
          "peer-checked:[&_.line-top-bottom]:[stroke-dasharray:20_300] peer-checked:[&_.line-top-bottom]:[stroke-dashoffset:-32.42]",
        )}
      >
        <path
          className="line-top-bottom fill-none stroke-current stroke-[3] stroke-linecap-round stroke-linejoin-round transition-[stroke-dasharray,stroke-dashoffset] duration-600 ease-in-out [stroke-dasharray:12_63]"
          d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
        />
        <path
          className="fill-none stroke-current stroke-[3] stroke-linecap-round stroke-linejoin-round transition-[stroke-dasharray,stroke-dashoffset] duration-600 ease-in-out"
          d="M7 16 27 16"
        />
      </svg>
    </label>
  );
};

export default MenuButton;
