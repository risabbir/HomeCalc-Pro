import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-[150px] h-[40px] md:w-[200px] md:h-[53px]", className)}>
      {/* Light mode logo */}
      <div className="block dark:hidden">
        <Image
          src="/logo-light.png"
          alt="HomeCalc Pro Logo"
          fill
          priority
          sizes="(max-width: 768px) 150px, 200px"
          data-ai-hint="logo light"
        />
      </div>
      {/* Dark mode logo */}
      <div className="hidden dark:block">
        <Image
          src="/logo-dark.png"
          alt="HomeCalc Pro Logo"
          fill
          priority
          sizes="(max-width: 768px) 150px, 200px"
          data-ai-hint="logo dark"
        />
      </div>
    </div>
  );
}
