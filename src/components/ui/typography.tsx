import { cn } from "@/lib/utils";
import * as React from "react";

const H1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
      <h1
        ref={ref}
        className={cn("text-4xl font-extrabold tracking-tight lg:text-5xl", className)}
        {...props}
      />
    )
  );
H1.displayName = "H1";

const H2 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
      <h2
        ref={ref}
        className={cn("text-3xl font-semibold tracking-tight", className)}
        {...props}
      />
    )
  );
H2.displayName = "H2";

const H3 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
      <h3
        ref={ref}
        className={cn("text-2xl font-semibold tracking-tight", className)}
        {...props}
      />
    )
  );
H3.displayName = "H3";

const H4 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
      <h4
        ref={ref}
        className={cn("text-xl font-semibold tracking-tight", className)}
        {...props}
      />
    )
  );
H4.displayName = "H4";

export { H1, H2, H3, H4 };
