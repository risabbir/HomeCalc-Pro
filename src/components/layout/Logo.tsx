import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-[150px] h-[40px] md:w-[200px] md:h-[53px]", className)}>
      <Image
        src="/logo.png"
        alt="HomeCalc Pro Logo"
        fill
        data-ai-hint="logo"
      />
    </div>
  );
}
