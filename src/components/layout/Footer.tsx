
import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-base text-muted-foreground max-w-sm">
              Your one-stop destination for a wide range of home-related calculators. From home improvement and energy savings to gardening and financial planning, we provide the tools to help you plan with confidence.
            </p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Calculators</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/#hvac" className="text-muted-foreground hover:text-primary transition-colors">HVAC</Link></li>
                <li><Link href="/#home-improvement" className="text-muted-foreground hover:text-primary transition-colors">Home Improvement</Link></li>
                <li><Link href="/#gardening" className="text-muted-foreground hover:text-primary transition-colors">Gardening</Link></li>
                <li><Link href="/#calculators" className="text-muted-foreground hover:text-primary transition-colors">All Calculators</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/resources/deck-checklist" className="text-muted-foreground hover:text-primary transition-colors">Deck Checklist</Link></li>
                <li><Link href="/resources/paint-finish-guide" className="text-muted-foreground hover:text-primary transition-colors">Paint Guide</Link></li>
                <li><Link href="/resources/kitchen-layout-guide" className="text-muted-foreground hover:text-primary transition-colors">Kitchen Layouts</Link></li>
                 <li><Link href="/resources" className="text-muted-foreground hover:text-primary transition-colors">All Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/legal" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} HomeCalc Pro. All Rights Reserved.</p>
          <p>A project by R. Sabbir, with assistance from Firebase Studio, and powered by Gemini.</p>
        </div>
      </div>
    </footer>
  );
}
