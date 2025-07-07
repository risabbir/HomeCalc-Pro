import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="https://6000-firebase-studio-1751870790151.cluster-ys234awlzbhwoxmkkse6qo3fz6.cloudworkstations.dev/capra/attachedImages/64d6697e-ee29-40b0-adaf-390271442b96/image_f1765b1c-8205-43a9-828b-5a30a615b6a5.png"
      alt="HomeCalc Pro Logo"
      width={200}
      height={34}
      className={cn("dark:invert", className)}
      priority
      unoptimized
    />
  );
}
