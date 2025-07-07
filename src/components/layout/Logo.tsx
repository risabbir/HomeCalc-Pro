import { cn } from "@/lib/utils";

export function Logo({ showText = true, className }: { showText?: boolean, className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="text-primary">
        <svg
          className="h-9 w-9"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3.5 10.5L12 3.5L20.5 10.5" />
          <path d="M4.5 21.5V10.5H19.5V21.5H4.5Z" />
          <rect x="7.5" y="12.5" width="9" height="3" rx="0.5" />
          <path d="M8.5 17.5h.01" strokeWidth="2" />
          <path d="M11.5 17.5h.01" strokeWidth="2" />
          <path d="M14.5 17.5h.01" strokeWidth="2" />
          <path d="M8.5 19.5h.01" strokeWidth="2" />
          <path d="M11.5 19.5h.01" strokeWidth="2" />
          <path d="M14.5 19.5h.01" strokeWidth="2" />
        </svg>
      </div>
      {showText && (
        <>
          <span className="text-2xl font-semibold tracking-tight text-foreground hidden sm:inline-block">
            HomeCalc
          </span>
          <span className="text-2xl font-semibold tracking-tight bg-primary text-primary-foreground px-2.5 py-0.5 rounded-lg hidden sm:inline-block">
            Pro
          </span>
        </>
      )}
    </div>
  );
}
