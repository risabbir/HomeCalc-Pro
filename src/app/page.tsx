import { CalculatorDirectory } from '@/components/calculators/CalculatorDirectory';
import { AiRecommendations } from '@/components/calculators/AiRecommendations';

export default function Home() {
  return (
    <>
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-headline">HomeCalc Pro</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Your one-stop destination for all home-related calculations. From renovation projects to garden planning, we've got you covered.
        </p>
      </section>
      <CalculatorDirectory />
      <AiRecommendations />
    </>
  );
}
