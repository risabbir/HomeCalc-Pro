import { calculators } from '@/lib/calculators';
import { notFound } from 'next/navigation';
import Image from 'next/image';

import { HvacCalculator } from '@/components/calculators/HvacCalculator';
import { SeerSavingsCalculator } from '@/components/calculators/SeerSavingsCalculator';
import { EnergySavingsCalculator } from '@/components/calculators/EnergySavingsCalculator';
import { ApplianceEnergyCostCalculator } from '@/components/calculators/ApplianceEnergyCostCalculator';
import { HomeImprovementCalculator } from '@/components/calculators/HomeImprovementCalculator';
import { GardeningCalculator } from '@/components/calculators/GardeningCalculator';
import { GeneralHomeCalculator } from '@/components/calculators/GeneralHomeCalculator';

import { HvacLoadCalculator } from '@/components/calculators/HvacLoadCalculator';
import { DuctSizeCalculator } from '@/components/calculators/DuctSizeCalculator';
import { FurnaceCostCalculator } from '@/components/calculators/FurnaceCostCalculator';
import { HeatPumpCostCalculator } from '@/components/calculators/HeatPumpCostCalculator';
import { ThermostatSavingsCalculator } from '@/components/calculators/ThermostatSavingsCalculator';
import { FlooringCalculator } from '@/components/calculators/FlooringCalculator';
import { WallpaperCalculator } from '@/components/calculators/WallpaperCalculator';
import { SoilCalculator } from '@/components/calculators/SoilCalculator';
import { AtticInsulationCalculator } from '@/components/calculators/AtticInsulationCalculator';
import { KitchenRemodelEstimator } from '@/components/calculators/KitchenRemodelEstimator';
import { DeckingCalculator } from '@/components/calculators/DeckingCalculator';
import { ConcreteSlabCalculator } from '@/components/calculators/ConcreteSlabCalculator';
import { MiniSplitCostEstimator } from '@/components/calculators/MiniSplitCostEstimator';
import { SavingsCalculator } from '@/components/calculators/SavingsCalculator';
import { CarLoanCalculator } from '@/components/calculators/CarLoanCalculator';

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
      // HVAC
      case 'btu-calculator':
        return <HvacCalculator calculator={calculatorData} />;
      case 'seer-savings-calculator':
        return <SeerSavingsCalculator calculator={calculatorData} />;
      case 'hvac-load':
        return <HvacLoadCalculator calculator={calculatorData} />;
      case 'duct-size':
        return <DuctSizeCalculator calculator={calculatorData} />;
      case 'furnace-cost':
        return <FurnaceCostCalculator calculator={calculatorData} />;
      case 'heat-pump-cost':
        return <HeatPumpCostCalculator calculator={calculatorData} />;
      case 'thermostat-savings':
        return <ThermostatSavingsCalculator calculator={calculatorData} />;
      case 'attic-insulation':
        return <AtticInsulationCalculator calculator={calculatorData} />;
      case 'mini-split-cost':
        return <MiniSplitCostEstimator calculator={calculatorData} />;

      // Home Improvement
      case 'paint-coverage':
        return <HomeImprovementCalculator calculator={calculatorData} />;
      case 'flooring-area':
        return <FlooringCalculator calculator={calculatorData} />;
      case 'wallpaper':
        return <WallpaperCalculator calculator={calculatorData} />;
      case 'kitchen-remodel-cost':
        return <KitchenRemodelEstimator calculator={calculatorData} />;
      case 'decking-calculator':
        return <DeckingCalculator calculator={calculatorData} />;
      case 'concrete-slab-calculator':
        return <ConcreteSlabCalculator calculator={calculatorData} />;

      // Gardening
      case 'fertilizer-needs':
        return <GardeningCalculator calculator={calculatorData} />;
      case 'soil-volume':
        return <SoilCalculator calculator={calculatorData} />;

      // Other
      case 'energy-consumption':
        return <ApplianceEnergyCostCalculator calculator={calculatorData} />;
      case 'mortgage-calculator':
        return <GeneralHomeCalculator calculator={calculatorData} />;
      case 'energy-savings-calculator':
        return <EnergySavingsCalculator calculator={calculatorData} />;
      case 'savings-calculator':
        return <SavingsCalculator calculator={calculatorData} />;
      case 'car-loan-calculator':
        return <CarLoanCalculator calculator={calculatorData} />;


      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
            {calculator.image && (
                <div className="mb-8 overflow-hidden rounded-lg shadow-xl border">
                    <Image
                        src={calculator.image}
                        alt={calculator.name}
                        width={1200}
                        height={400}
                        className="w-full h-auto object-cover"
                        data-ai-hint={calculator.imageHint}
                        priority
                    />
                </div>
            )}
            <div className="text-center mb-12">
                <Icon className="h-16 w-16 mx-auto text-primary mb-4" />
                <h1 className="text-4xl font-bold font-headline">{calculator.name}</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{calculator.description}</p>
            </div>
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
