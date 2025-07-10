
'use client';

import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface HelpInfoProps {
  children: React.ReactNode;
}

export function HelpInfo({ children }: HelpInfoProps) {
  const isMobile = useIsMobile();

  const triggerButton = (
    <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full" type="button" aria-label="More information">
      <HelpCircle className="h-4 w-4 text-muted-foreground" />
    </Button>
  );

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          {triggerButton}
        </PopoverTrigger>
        <PopoverContent className="text-sm">
          {children}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {triggerButton}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{children}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
