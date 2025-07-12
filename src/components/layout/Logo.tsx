import { cn } from "@/lib/utils";
import Image from "next/image";

// Base64 encoded SVG of the logo to avoid storing a static file
const logoSrc = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdoPSI2MCIgdmlld0JveD0iMCAwIDMwMCA2MCI+CiAgPGcgc3R5bGU9ImZvbnQtZmFtaWx5OiBTeXN0ZW0tVVksIHVpLXNhbnMtc2VyaWY7IGZvbnQtd2VpZ2h0OiBib2xkOyI+CiAgICA8dGV4dCB4PSIxMCIgeT0iNDIiIHN0eWxlPSJmb250LXNpemU6IDQwcHg7IGZpbGw6ICMwMDA7Ij5Ib21lQ2FsYzwvdGV4dD4KICAgIDxyZWN0IHg9IjIzMCIgeT0iMCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjYwIiByeD0iMTIiIHJ5PSIxMiIgc3R5bGU9ImZpbGw6ICMwMEE5RTk7IiAvPgogICAgPHRleHQgeD0iMjM4IiB5PSI0MiIgc3R5bGU9ImZvbnQtc2l6ZTogMzBweDsgZmlsbDogI2ZmZjsiPlBybzwvdGV4dD4KICA8L2c+Cjwvc3ZnPg==";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
       <Image
          src={logoSrc}
          alt="HomeCalc Pro Logo"
          width={150}
          height={30}
          priority
        />
    </div>
  );
}
