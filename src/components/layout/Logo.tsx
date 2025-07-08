import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  // HSL values from globals.css for --primary
  const primaryH = 200;
  const primaryS = '99%';
  const primaryL = '44%';
  const shadowColor = `hsla(${primaryH}, ${primaryS}, ${primaryL}, 0.5)`;
  const logoShadow = `0px 8px 25px -5px ${shadowColor}`;

  return (
    <div className={cn("flex items-baseline gap-1", className)}>
      <span className="text-2xl font-bold tracking-tight text-foreground font-headline">
        HomeCalc
      </span>
      <span
        className="inline-block rounded-md bg-primary px-2 py-1 text-lg font-bold leading-none text-primary-foreground font-headline"
        style={{
          boxShadow: logoShadow,
        }}
      >
        Pro
      </span>
    </div>
  );
}
