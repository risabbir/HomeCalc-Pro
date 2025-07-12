import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  // To update your logo:
  // 1. Add your logo images (e.g., 'logo-light.png', 'logo-dark.png') to the `public` folder.
  // 2. Replace the `src` values below with the paths to your images (e.g., src="/logo-light.png").

  return (
    <div className={cn("relative w-[150px] h-[40px] md:w-[200px] md:h-[53px]", className)}>
      {/* Light mode logo */}
      <div className="block dark:hidden">
        <Image
          src="https://placehold.co/200x53.png"
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
          src="https://placehold.co/200x53/ffffff/111827.png"
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
