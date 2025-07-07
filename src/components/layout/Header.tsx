import { Logo } from '@/components/layout/Logo';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-background/80 border-b sticky top-0 z-10 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 text-xl font-bold font-headline transition-opacity hover:opacity-80">
            <Logo />
            HomeCalc Pro
          </Link>
        </div>
      </div>
    </header>
  );
}
