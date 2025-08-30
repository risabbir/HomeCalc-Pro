
import { cn } from "@/lib/utils";

interface AnimatedHamburgerIconProps {
    open: boolean;
    className?: string;
}

export function AnimatedHamburgerIcon({ open, className }: AnimatedHamburgerIconProps) {
    return (
        <div className={cn("relative h-7 w-7", className)}>
            <span
                aria-hidden="true"
                className={cn(
                    "absolute block h-0.5 w-6 transform bg-current transition duration-300 ease-in-out",
                    open ? "rotate-45" : "-translate-y-2",
                    "left-1/2 -translate-x-1/2 top-1/2"
                )}
            ></span>
            <span
                aria-hidden="true"
                className={cn(
                    "absolute block h-0.5 w-6 transform bg-current transition duration-300 ease-in-out",
                    open ? "opacity-0" : "",
                    "left-1/2 -translate-x-1/2 top-1/2"
                )}
            ></span>
            <span
                aria-hidden="true"
                className={cn(
                    "absolute block h-0.5 w-6 transform bg-current transition duration-300 ease-in-out",
                    open ? "-rotate-45" : "translate-y-2",
                    "left-1/2 -translate-x-1/2 top-1/2"
                )}
            ></span>
        </div>
    );
}
