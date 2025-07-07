import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ showText = true, className }: { showText?: boolean, className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="https://cdn-icons-png.flaticon.com/512/2825/2825684.png"
        alt="HomeCalc Pro Logo"
        width={36}
        height={36}
        className="h-9 w-9"
      />
      {showText && (
        <>
          <span className="text-2xl font-semibold tracking-tight text-foreground hidden sm:inline-block">
            HomeCalc
          </span>
          <span className="text-2xl font-semibold tracking-tight bg-primary text-primary-foreground px-2.5 py-0.5 rounded-lg hidden sm:inline-block">
            Pro
          </span>
        </>
      )}
    </div>
  );
}
