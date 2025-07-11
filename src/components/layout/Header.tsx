
"use client";

import { Logo } from '@/components/layout/Logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { calculators } from '@/lib/calculators';
import { ChevronDown, Wand2, Heart } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import * as React from 'react';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatedHamburgerIcon } from './AnimatedHamburgerIcon';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMegaMenuOpen, setMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const categories = ['HVAC', 'Home Improvement', 'Gardening', 'Other'];
  const calculatorsByCategory = categories.map(category => ({
    name: category,
    calculators: calculators.filter(calc => calc.category === category),
  })).filter(c => c.calculators.length > 0);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/ai-recommendations', label: 'AI Assistant', Icon: Wand2 },
    { href: '/resources', label: 'Resources' },
    { href: '/about', label: 'About Us' },
  ];

  const getNavLinkClass = (href: string, isStartsWith = false) => {
    const isActive = isStartsWith ? pathname.startsWith(href) : pathname === href;
    return cn(
      "text-foreground/80 hover:text-primary",
      isActive && "text-primary font-semibold"
    );
  };

  const getMobileNavLinkClass = (href: string, isStartsWith = false) => {
      const isActive = isStartsWith ? pathname.startsWith(href) : pathname === href;
      return cn(
          "py-2.5 text-xl font-medium rounded-md px-3 hover:text-primary text-foreground/80",
          isActive ? "text-primary bg-accent" : "hover:bg-accent"
      );
  };

  return (
    <header className="bg-background/90 sticky top-0 z-50 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2 text-base font-medium">
             <Button variant="ghost" asChild>
                <Link href="/" className={getNavLinkClass('/')}>Home</Link>
            </Button>
            
            <div 
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
              className="relative"
            >
              <Button variant="ghost" asChild className={cn(getNavLinkClass('/calculators', true), 'gap-1')}>
                  <Link href="/#calculators">
                    Calculators
                    <ChevronDown className="h-4 w-4 transition-transform" />
                  </Link>
              </Button>
              <div 
                data-state={isMegaMenuOpen ? 'open' : 'closed'}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max max-w-5xl origin-top transition-all duration-300 data-[state=closed]:opacity-0 data-[state=closed]:-translate-y-2 data-[state=open]:opacity-100 data-[state=open]:translate-y-0 data-[state=closed]:pointer-events-none"
              >
                <div
                  className="bg-popover text-popover-foreground rounded-lg border p-6 grid grid-cols-4 gap-x-12 gap-y-6"
                  style={{boxShadow: 'rgba(0, 0, 0, 0.04) 0px 3px 5px'}}
                >
                  {calculatorsByCategory.map((category) => (
                    <div key={category.name}>
                      <h3 className="font-semibold text-foreground mb-4">{category.name}</h3>
                      <ul className="space-y-3">
                        {category.calculators.map(calc => (
                          <li key={calc.slug}>
                            <Link 
                              href={`/calculators/${calc.slug}`} 
                              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors group"
                              onClick={() => setMegaMenuOpen(false)}
                            >
                              <calc.Icon className="h-4 w-4 shrink-0 text-primary/80" />
                              <span className="group-hover:text-primary transition-colors">{calc.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {navLinks.slice(1).map((link) => (
              <Button key={link.href} variant="ghost" asChild>
                <Link href={link.href} className={getNavLinkClass(link.href)}>
                  {link.Icon && <link.Icon className="mr-1.5 h-4 w-4" />}
                  {link.label}
                </Link>
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
             <Button asChild variant="outline" className="hidden sm:inline-flex group hover:bg-primary/90 hover:text-primary-foreground">
                <Link href="https://buymeacoffee.com/your_username" target="_blank" rel="noopener noreferrer">
                    <Heart className="mr-1.5 h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" fill="currentColor" />
                    Support Us
                </Link>
            </Button>
            <ThemeToggle />


            {/* Mobile Nav */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
                    <AnimatedHamburgerIcon open={isMobileMenuOpen} />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-sm flex flex-col p-0">
                    <div className='p-6 pb-0'>
                      <SheetClose asChild>
                        <Link href="/" className="mb-8 inline-block" tabIndex={-1}>
                          <Logo />
                        </Link>
                      </SheetClose>
                    </div>
                    <ScrollArea className='flex-1'>
                      <div className="flex flex-col gap-1 p-6 text-lg">
                          <SheetClose asChild>
                              <Link 
                                href="/"
                                className={getMobileNavLinkClass('/')}
                              >
                                  Home
                              </Link>
                          </SheetClose>

                          <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="calculators" className="border-b-0">
                                  <AccordionTrigger className={cn(
                                      "py-2.5 text-xl font-medium hover:no-underline rounded-md px-3 hover:text-primary",
                                      pathname.startsWith('/calculators') ? "text-primary bg-accent" : "text-foreground/80 hover:bg-accent"
                                  )}>
                                    Calculators
                                  </AccordionTrigger>
                                  <AccordionContent className="pl-5">
                                      <div className="flex flex-col gap-1">
                                      {calculatorsByCategory.map((category) => (
                                          <div key={category.name}>
                                              <h4 className="font-semibold text-lg text-muted-foreground mb-2 mt-3">{category.name}</h4>
                                              <div className="flex flex-col gap-2">
                                              {category.calculators.map(calc => (
                                                  <SheetClose asChild key={calc.slug}>
                                                      <Link 
                                                        href={`/calculators/${calc.slug}`}
                                                        className={cn(
                                                            "hover:text-primary py-2 text-lg rounded-md px-2",
                                                            pathname === `/calculators/${calc.slug}` ? "text-primary bg-accent" : "hover:bg-accent"
                                                        )}
                                                      >
                                                        {calc.name}
                                                      </Link>
                                                  </SheetClose>
                                              ))}
                                              </div>
                                          </div>
                                      ))}
                                      </div>
                                  </AccordionContent>
                              </AccordionItem>
                          </Accordion>
                          
                          {navLinks.slice(1).map((link) => (
                              <SheetClose asChild key={link.href}>
                                  <Link 
                                    href={link.href}
                                    className={getMobileNavLinkClass(link.href)}
                                  >
                                      {link.label}
                                  </Link>
                              </SheetClose>
                          ))}
                            <SheetClose asChild>
                                  <Link 
                                    href="https://buymeacoffee.com/your_username"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(getMobileNavLinkClass(''), "flex items-center gap-2")}
                                  >
                                    <Heart className="h-5 w-5" /> Support Us
                                  </Link>
                            </SheetClose>
                      </div>
                    </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
