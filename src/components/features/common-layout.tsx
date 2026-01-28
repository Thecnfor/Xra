import { cn } from "@/lib/utils";

export function CommonLayout({
    children,
    className,
    ...props
}: React.ComponentProps<"main">) {
    return (
        <main
            className={cn(
                "min-h-dvh",
                className
            )}
            {...props}
        >
            {children}
        </main>
    );
}
