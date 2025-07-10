
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
                    "absolute block h-[2.5px] w-full transform bg-current transition duration-300 ease-in-out left-0",
                    open ? "rotate-45 top-1/2 -translate-y-1/2" : "top-[6px]"
                )}
            ></span>
            <span
                aria-hidden="true"
                className={cn(
                    "absolute block h-[2.5px] w-full transform bg-current transition duration-300 ease-in-out left-0 top-1/2 -translate-y-1/2",
                    open ? "opacity-0" : ""
                )}
            ></span>
            <span
                aria-hidden="true"
                className={cn(
                    "absolute block h-[2.5px] w-full transform bg-current transition duration-300 ease-in-out left-0",
                    open ? "-rotate-45 top-1/2 -translate-y-1/2" : "bottom-[6px]"
                )}
            ></span>
        </div>
    );
}
