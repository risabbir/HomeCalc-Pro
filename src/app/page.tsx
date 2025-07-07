import { CalculatorDirectory } from '@/components/calculators/CalculatorDirectory';
import { AiRecommendations } from '@/components/calculators/AiRecommendations';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-headline text-primary">HomeCalc Pro</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
             Your one-stop destination for all home-related calculations. From renovation projects to garden planning, we've got you covered.
          </p>
          <Button size="lg" asChild>
            <Link href="/#calculators">
              Get Started <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-16">
        <CalculatorDirectory />
        <Separator className="my-24" />
        <AiRecommendations />
      </div>
    </>
  );
}
