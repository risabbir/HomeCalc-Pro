import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold font-headline text-foreground transition-opacity hover:opacity-80">
              <Logo />
              HomeCalc Pro
            </Link>
            <p className="text-sm">Your trusted partner for home project calculations.</p>
          </div>
          <div className="md:col-start-3">
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
              <li><Link href="#" className="hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} HomeCalc Pro. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
