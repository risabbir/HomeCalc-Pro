import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  // This is a placeholder for the logo image you provided.
  // Once you host your logo, replace the src URL below.
  return (
    <Image
      src="https://placehold.co/240x40.png"
      data-ai-hint="logo home calculator"
      alt="HomeCalc Pro Logo"
      width={160}
      height={27}
      className={cn(className)}
      priority
    />
  );
}
