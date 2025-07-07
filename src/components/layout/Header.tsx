import { Logo } from '@/components/layout/Logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { calculators } from '@/lib/calculators';
import { ChevronDown, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function Header() {
  const categories = ['HVAC', 'Home Improvement', 'Gardening', 'Other'];
  const calculatorsByCategory = categories.map(category => ({
    name: category,
    calculators: calculators.filter(calc => calc.category === category),
  })).filter(c => c.calculators.length > 0);

  return (
    <header className="bg-background/90 border-b sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2 text-base font-medium">
             <Button variant="ghost" asChild><Link href="/">Home</Link></Button>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        Calculators
                        <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="center">
                    {calculatorsByCategory.map((category, index) => (
                        <React.Fragment key={category.name}>
                            <DropdownMenuLabel>{category.name}</DropdownMenuLabel>
                            {category.calculators.map(calc => (
                                <Link href={`/calculators/${calc.slug}`} key={calc.slug} passHref>
                                    <DropdownMenuItem>{calc.name}</DropdownMenuItem>
                                </Link>
                            ))}
                            {index < calculatorsByCategory.length - 1 && <DropdownMenuSeparator />}
                        </React.Fragment>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" asChild><Link href="/faq">FAQ</Link></Button>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Mobile Nav */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-sm">
                    <Link href="/" className="mb-8 inline-block" tabIndex={-1}>
                      <SheetClose asChild>
                        <Logo />
                      </SheetClose>
                    </Link>
                    <div className="flex flex-col gap-4">
                        <SheetClose asChild><Link href="/" className="text-lg font-medium">Home</Link></SheetClose>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="calculators" className="border-b-0">
                                <AccordionTrigger className="text-lg font-medium py-2 hover:no-underline">Calculators</AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-col gap-2 pl-4">
                                    {calculatorsByCategory.map((category) => (
                                        <div key={category.name}>
                                            <h4 className="font-semibold text-muted-foreground mb-2 mt-2">{category.name}</h4>
                                            <div className="flex flex-col gap-1">
                                            {category.calculators.map(calc => (
                                                <SheetClose asChild key={calc.slug}>
                                                    <Link href={`/calculators/${calc.slug}`} className="text-foreground hover:text-primary py-1">{calc.name}</Link>
                                                </SheetClose>
                                            ))}
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <SheetClose asChild><Link href="/faq" className="text-lg font-medium">FAQ</Link></SheetClose>
                    </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
