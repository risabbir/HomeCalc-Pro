
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  // This component is now set up to use your local logo files.
  // To update your logo:
  // 1. Create a `public` folder at the root of your project if it doesn't exist.
  // 2. Add your logo images to the `public` folder. Name them `logo-light.png` and `logo-dark.png`.
  // 3. The `src` paths below point to these files.

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
        />
      </div>
    </div>
  );
}
