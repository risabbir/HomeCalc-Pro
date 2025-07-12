import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-[150px] h-[40px]", className)}>
      <Image
        src="https://placehold.co/150x40.png"
        alt="HomeCalc Pro Logo"
        width={150}
        height={40}
        data-ai-hint="logo"
      />
    </div>
  );
}
