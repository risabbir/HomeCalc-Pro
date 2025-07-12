import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <svg
        width="150"
        height="40"
        viewBox="0 0 150 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="HomeCalc Pro Logo"
      >
        <text
          x="0"
          y="28"
          fontFamily="var(--font-sans), sans-serif"
          fontSize="24"
          fontWeight="bold"
          fill="hsl(var(--foreground))"
          className="transition-colors"
        >
          HomeCalc
        </text>
        <rect
          x="118"
          y="8"
          width="32"
          height="24"
          rx="4"
          fill="hsl(var(--primary))"
          className="transition-colors"
        />
        <text
          x="121.5"
          y="28"
          fontFamily="var(--font-sans), sans-serif"
          fontSize="24"
          fontWeight="bold"
          fill="hsl(var(--primary-foreground))"
          className="transition-colors"
        >
          Pro
        </text>
      </svg>
    </div>
  );
}
