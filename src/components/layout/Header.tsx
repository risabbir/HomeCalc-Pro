import { Logo } from '@/components/layout/Logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="bg-background/80 border-b sticky top-0 z-10 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold transition-opacity hover:opacity-80">
            <Logo />
            <span className='hidden sm:inline-block'>HomeCalc Pro</span>
          </Link>
          <div className="flex items-center gap-4">
            <nav>
              <Button variant="ghost" asChild>
                  <Link href="/#calculators">All Calculators</Link>
              </Button>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
