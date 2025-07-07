import { AiRecommendations } from '@/components/calculators/AiRecommendations';
import { HvacCalculator } from '@/components/calculators/HvacCalculator';
import { HomeImprovementCalculator } from '@/components/calculators/HomeImprovementCalculator';
import { GardeningCalculator } from '@/components/calculators/GardeningCalculator';
import { GeneralHomeCalculator } from '@/components/calculators/GeneralHomeCalculator';
import { SeerSavingsCalculator } from '@/components/calculators/SeerSavingsCalculator';
import { ApplianceEnergyCostCalculator } from '@/components/calculators/ApplianceEnergyCostCalculator';
import { calculators, type Calculator } from '@/lib/calculators';
import { Separator } from '@/components/ui/separator';

const CalculatorWrapper = ({ slug, children }: { slug: string, children: React.ReactNode }) => {
    const calculator = calculators.find((c) => c.slug === slug);
    if (!calculator) return null;

    return (
        <section id={slug}>
            <div className="text-center mb-8">
                <calculator.Icon className="h-16 w-16 mx-auto text-primary mb-4" />
                <h2 className="text-4xl font-bold font-headline">{calculator.name}</h2>
                <p className="text-muted-foreground mt-2">{calculator.description}</p>
            </div>
            {children}
        </section>
    );
};

export default function Home() {
  const getCalculatorProps = (slug: string): Omit<Calculator, 'Icon'> => {
      const calc = calculators.find((c) => c.slug === slug);
      if (!calc) throw new Error(`Calculator with slug "${slug}" not found.`);
      const { Icon, ...rest } = calc;
      return rest;
  }

  return (
    <>
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-headline">HomeCalc Pro</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Your one-stop destination for all home-related calculations. From renovation projects to garden planning, we've got you covered.
        </p>
      </section>
      
      <div className="space-y-16">
        <CalculatorWrapper slug="hvac">
            <HvacCalculator calculator={getCalculatorProps('hvac')} />
        </CalculatorWrapper>
        
        <CalculatorWrapper slug="seer-savings">
            <SeerSavingsCalculator calculator={getCalculatorProps('seer-savings')} />
        </CalculatorWrapper>
        
        <CalculatorWrapper slug="appliance-energy-cost">
            <ApplianceEnergyCostCalculator calculator={getCalculatorProps('appliance-energy-cost')} />
        </CalculatorWrapper>

        <CalculatorWrapper slug="home-improvement">
            <HomeImprovementCalculator calculator={getCalculatorProps('home-improvement')} />
        </CalculatorWrapper>

        <CalculatorWrapper slug="gardening">
            <GardeningCalculator calculator={getCalculatorProps('gardening')} />
        </CalculatorWrapper>

        <CalculatorWrapper slug="general-home">
            <GeneralHomeCalculator calculator={getCalculatorProps('general-home')} />
        </CalculatorWrapper>
      </div>

      <Separator className="my-16" />

      <AiRecommendations />
    </>
  );
}
