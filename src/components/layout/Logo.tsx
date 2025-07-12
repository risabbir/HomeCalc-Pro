
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  // STEP 1: Go to a site like base64-image.de to convert your logo files to text.
  // STEP 2: Paste the text for your light mode logo here.
  const logoLightSrc = "data:image/png;base64,PLACEHOLDER_FOR_LIGHT_LOGO_BASE64_STRING";

  // STEP 3: Paste the text for your dark mode logo here.
  const logoDarkSrc = "data:image/png;base64,PLACEHOLDER_FOR_DARK_LOGO_BASE64_STRING";

  return (
    <div className={cn("relative w-[150px] h-[40px] md:w-[200px] md:h-[53px]", className)}>
      {/* Light mode logo */}
      <div className="block dark:hidden">
        <Image
          src={logoLightSrc}
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
          src={logoDarkSrc}
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
