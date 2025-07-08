import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-baseline gap-1", className)}>
      <span className="text-2xl font-bold tracking-tight text-foreground font-headline">
        HomeCalc
      </span>
      <span
        className="inline-block rounded-md bg-primary px-2 py-1 text-lg font-bold leading-none text-primary-foreground font-headline"
        style={{ boxShadow: '0 4px 14px 0 rgba(1, 149, 223, 0.39)' }}
      >
        Pro
      </span>
    </div>
  );
}
