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
          boxShadow: 'hsla(200, 99%, 44%, 0.4) 0px 5px 15px',
        }}
      >
        Pro
      </span>
    </div>
  );
}
