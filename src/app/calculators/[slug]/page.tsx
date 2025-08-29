
import { calculators } from '@/lib/calculators';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

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

// New Calculators
import { VentilationFanCalculator } from '@/components/calculators/VentilationFanCalculator';
import { DehumidifierCalculator } from '@/components/calculators/DehumidifierCalculator';
import { RoofingCalculator } from '@/components/calculators/RoofingCalculator';
import { TileCalculator } from '@/components/calculators/TileCalculator';
import { DrywallCalculator } from '@/components/calculators/DrywallCalculator';
import { FenceCalculator } from '@/components/calculators/FenceCalculator';
import { WaterHeaterCostCalculator } from '@/components/calculators/WaterHeaterCostCalculator';
import { DrivewayCalculator } from '@/components/calculators/DrivewayCalculator';
import { SolarSavingsCalculator } from '@/components/calculators/SolarSavingsCalculator';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const calculator = calculators.find((c) => c.slug === params.slug);
  
  if (!calculator) {
    return {
      title: 'Calculator Not Found | HomeCalc Pro',
      description: 'The calculator you are looking for could not be found.',
    }
  }

  // Generate a more SEO-friendly title, e.g., "Paint Coverage Calculator | Free DIY Estimator"
  const title = `${calculator.name} | Free Online Estimator`;
  
  return {
    title,
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
      case 'ventilation-fan-cfm':
        return <VentilationFanCalculator calculator={calculatorData} />;
      case 'dehumidifier-size':
        return <DehumidifierCalculator calculator={calculatorData} />;

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
      case 'roofing-materials':
        return <RoofingCalculator calculator={calculatorData} />;
      case 'tile-calculator':
        return <TileCalculator calculator={calculatorData} />;
      case 'drywall-calculator':
        return <DrywallCalculator calculator={calculatorData} />;
      case 'fence-materials':
        return <FenceCalculator calculator={calculatorData} />;
      case 'driveway-materials':
        return <DrivewayCalculator calculator={calculatorData} />;

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
      case 'water-heater-energy-cost':
        return <WaterHeaterCostCalculator calculator={calculatorData} />;
      case 'solar-savings':
        return <SolarSavingsCalculator calculator={calculatorData} />;


      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline">{calculator.name}</h1>
                <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">{calculator.description}</p>
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
