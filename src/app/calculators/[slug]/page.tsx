import { calculators, type Calculator } from '@/lib/calculators';
import { notFound } from 'next/navigation';
import { HvacCalculator } from '@/components/calculators/HvacCalculator';
import { HomeImprovementCalculator } from '@/components/calculators/HomeImprovementCalculator';
import { GardeningCalculator } from '@/components/calculators/GardeningCalculator';
import { GeneralHomeCalculator } from '@/components/calculators/GeneralHomeCalculator';
import { SeerSavingsCalculator } from '@/components/calculators/SeerSavingsCalculator';
import { ApplianceEnergyCostCalculator } from '@/components/calculators/ApplianceEnergyCostCalculator';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const calculator = calculators.find((c) => c.slug === params.slug);
  if (!calculator) {
    return {
      title: 'Calculator Not Found',
    }
  }
  return {
    title: `${calculator.name} | HomeCalc Pro`,
    description: calculator.description,
  }
}

export default function CalculatorPage({ params }: { params: { slug: string } }) {
  const calculator = calculators.find((c) => c.slug === params.slug);

  if (!calculator) {
    notFound();
  }

  const { Icon, ...calculatorData } = calculator;

  const renderCalculator = () => {
    switch (params.slug) {
      case 'hvac':
        return <HvacCalculator calculator={calculatorData} />;
      case 'seer-savings':
        return <SeerSavingsCalculator calculator={calculatorData} />;
      case 'appliance-energy-cost':
        return <ApplianceEnergyCostCalculator calculator={calculatorData} />;
      case 'home-improvement':
        return <HomeImprovementCalculator calculator={calculatorData} />;
      case 'gardening':
        return <GardeningCalculator calculator={calculatorData} />;
      case 'general-home':
        return <GeneralHomeCalculator calculator={calculatorData} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <Icon className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold font-headline">{calculator.name}</h1>
        <p className="text-muted-foreground mt-2">{calculator.description}</p>
      </div>
      {renderCalculator()}
    </div>
  );
}

export async function generateStaticParams() {
    return calculators.map((calc) => ({
        slug: calc.slug,
    }));
}
