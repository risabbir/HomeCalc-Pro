import { calculators } from '@/lib/calculators';
import { notFound } from 'next/navigation';

import { HvacCalculator } from '@/components/calculators/HvacCalculator';
import { SeerSavingsCalculator } from '@/components/calculators/SeerSavingsCalculator';
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
      // Existing
      case 'btu-calculator':
        return <HvacCalculator calculator={calculatorData} />;
      case 'seer-savings':
        return <SeerSavingsCalculator calculator={calculatorData} />;
      case 'energy-consumption':
        return <ApplianceEnergyCostCalculator calculator={calculatorData} />;
      case 'paint-coverage':
        return <HomeImprovementCalculator calculator={calculatorData} />;
      case 'fertilizer-needs':
        return <GardeningCalculator calculator={calculatorData} />;
      case 'mortgage-calculator':
        return <GeneralHomeCalculator calculator={calculatorData} />;
      // New
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
      case 'flooring-area':
        return <FlooringCalculator calculator={calculatorData} />;
      case 'wallpaper':
        return <WallpaperCalculator calculator={calculatorData} />;
      case 'soil-volume':
        return <SoilCalculator calculator={calculatorData} />;
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
