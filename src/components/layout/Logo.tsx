import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-baseline gap-1", className)}>
      <span className="text-2xl font-bold tracking-tight text-foreground font-headline">
        HomeCalc
      </span>
      <span
        className="inline-block rounded-md bg-primary px-2 py-1 text-lg font-bold leading-none text-primary-foreground font-headline"
        style={{
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1), 0 0 20px 4px rgba(1, 149, 223, 0.4)',
        }}
      >
        Pro
      </span>
    </div>
  );
}
