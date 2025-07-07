import { Logo } from '@/components/layout/Logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-background/80 border-b sticky top-0 z-10 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 text-xl font-bold font-headline transition-opacity hover:opacity-80">
            <Logo />
            HomeCalc Pro
          </Link>
          <nav>
            <Button variant="ghost" asChild>
                <Link href="/#calculators">All Calculators</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
