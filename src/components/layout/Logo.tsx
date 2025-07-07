import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="https://storage.googleapis.com/aifirebase-dev-staging-1p-bucket/projects/project-883314144415/files/logo.png"
      alt="HomeCalc Pro Logo"
      width={160}
      height={27}
      className={cn(className)}
      priority
    />
  );
}
