import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-foreground transition-opacity hover:opacity-80">
              <Logo />
              HomeCalc Pro
            </Link>
            <p className="text-sm text-muted-foreground">Your trusted partner for home project calculations.</p>
          </div>
          <div className="md:col-start-3">
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
              <li><Link href="/resources" className="text-muted-foreground hover:text-primary">Helpful Articles</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/legal" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/legal" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HomeCalc Pro. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
