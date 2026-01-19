import { cn } from "@/lib/utils"
import React from "react"

interface FullScreenContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function FullScreenContainer({ children, className, ...props }: FullScreenContainerProps) {
  return (
    <main
      className={cn(
        "relative z-10 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4",
        className
      )}
      {...props}
    >
      {children}
    </main>
  )
}
