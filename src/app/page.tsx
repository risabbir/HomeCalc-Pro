import { CalculatorDirectory } from '@/components/calculators/CalculatorDirectory';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Wand2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <>
      <section className="relative text-center py-20 md:py-32 bg-secondary/50">
         <div 
          className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"
          style={{
            backgroundSize: '30px 30px',
            backgroundImage: 'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
          }}
        ></div>
        <div className="container relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-headline text-primary">Empower Your Home Projects</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Precision calculators for every corner of your home. Plan with confidence, build with precision.
          </p>
          <Button size="lg" asChild className="group">
            <Link href="/#calculators">
              Get Started <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-16">
        <CalculatorDirectory />
        <Separator className="my-24" />
        <section className="bg-secondary/50 rounded-xl p-8 md:p-16 border">
            <div className="text-center max-w-3xl mx-auto">
                <Wand2 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold font-headline mb-4">Not Sure Where to Start?</h2>
                <p className="text-muted-foreground text-lg mb-8">
                    Describe your project, and our AI assistant will recommend the most relevant calculators for the job. It's the perfect way to discover tools you might not have known you needed.
                </p>
                <Button size="lg" asChild className="group">
                    <Link href="/ai-recommendations">
                        Ask our AI Assistant
                        <ArrowRight className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
            </div>
        </section>
      </div>
    </>
  );
}
