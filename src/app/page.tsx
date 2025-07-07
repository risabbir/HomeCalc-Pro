import { AiRecommendations } from '@/components/calculators/AiRecommendations';
import { CalculatorDirectory } from '@/components/calculators/CalculatorDirectory';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <>
      <section className="text-center py-16 md:py-20 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-headline text-primary">HomeCalc Pro</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Your one-stop destination for all home-related calculations. From renovation projects to garden planning, we've got you covered.
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
