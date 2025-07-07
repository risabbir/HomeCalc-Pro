import { AiRecommendations } from '@/components/calculators/AiRecommendations';
import { CalculatorDirectory } from '@/components/calculators/CalculatorDirectory';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <section className="relative text-center py-20 md:py-28 bg-gradient-to-b from-primary/5 to-transparent overflow-hidden">
        <div className="absolute inset-0">
            <Image
                src="https://placehold.co/1920x1080.png"
                alt="Blueprint of a house"
                data-ai-hint="blueprint house"
                fill
                className="object-cover opacity-5"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="container relative">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-headline text-primary">HomeCalc Pro</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Your complete toolkit for smart home planning and calculations. From HVAC upgrades to DIY projects, get the numbers you need.
          </p>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-8">
        <CalculatorDirectory />
        <Separator className="my-16" />
        <AiRecommendations />
      </div>
    </>
  );
}
