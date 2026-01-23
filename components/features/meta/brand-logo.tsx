import { cn } from "@/lib/utils"

interface BrandLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function BrandLogo({ className, size = "lg" }: BrandLogoProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center select-none", className)}>
      <h1 
        className={cn(
          "font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-black via-black/70 to-black/40 dark:from-white dark:via-white/70 dark:to-white/40",
          size === "lg" && "text-7xl sm:text-8xl md:text-9xl",
          size === "md" && "text-5xl sm:text-6xl md:text-7xl",
          size === "sm" && "text-3xl sm:text-4xl"
        )}
      >
        XRak
      </h1>
      <span 
        className={cn(
          "uppercase tracking-[0.5em] text-black/60 dark:text-white/60 font-medium",
          size === "lg" && "mt-4 text-sm sm:text-base",
          size === "md" && "mt-3 text-xs sm:text-sm",
          size === "sm" && "mt-2 text-[10px]"
        )}
      >
        Studio
      </span>
    </div>
  )
}
