import type { LucideIcon } from 'lucide-react';
import { 
  ThermometerSun, Wrench, Sprout, Home, Wind, PlugZap, Building2, AirVent, 
  Heater, Snowflake, Gauge, Square, Wallpaper as WallpaperIcon, Shovel 
} from 'lucide-react';

export interface Calculator {
  slug: string;
  name: string;
  description: string;
  Icon: LucideIcon;
  category: 'HVAC' | 'Home Improvement' | 'Gardening' | 'Other';
}

export const calculators: Calculator[] = [
  // HVAC
  {
    slug: 'hvac-load',
    name: 'HVAC Load Calculator',
    description: 'Determine the total heating and cooling load for a building.',
    Icon: Building2,
    category: 'HVAC',
  },
  {
    slug: 'btu-calculator',
    name: 'BTU Calculator',
    description: 'Estimate the required BTU for heating and cooling a room.',
    Icon: ThermometerSun,
    category: 'HVAC',
  },
  {
    slug: 'duct-size',
    name: 'Duct Size Calculator',
    description: 'Calculate the appropriate size for HVAC ductwork.',
    Icon: AirVent,
    category: 'HVAC',
  },
  {
    slug: 'seer-savings',
    name: 'SEER Energy Savings',
    description: 'Estimate savings from upgrading to a higher SEER-rated AC unit.',
    Icon: Wind,
    category: 'HVAC',
  },
  {
    slug: 'furnace-cost',
    name: 'Furnace Cost Estimator',
    description: 'Estimate the cost of installing a new furnace.',
    Icon: Heater,
    category: 'HVAC',
  },
  {
    slug: 'heat-pump-cost',
    name: 'Heat Pump Cost Estimator',
    description: 'Estimate the cost of installing a new heat pump.',
    Icon: Snowflake,
    category: 'HVAC',
  },
  {
    slug: 'thermostat-savings',
    name: 'Thermostat Savings Calculator',
    description: 'Estimate savings from a programmable thermostat.',
    Icon: Gauge,
    category: 'HVAC',
  },

  // Home Improvement
  {
    slug: 'paint-coverage',
    name: 'Paint Coverage Calculator',
    description: 'Calculate how many gallons of paint you need for your project.',
    Icon: Wrench,
    category: 'Home Improvement',
  },
  {
    slug: 'flooring-area',
    name: 'Flooring Area Calculator',
    description: 'Calculate the square footage for your flooring project.',
    Icon: Square,
    category: 'Home Improvement',
  },
  {
    slug: 'wallpaper',
    name: 'Wallpaper Calculator',
    description: 'Estimate the number of wallpaper rolls needed for a room.',
    Icon: WallpaperIcon,
    category: 'Home Improvement',
  },

  // Gardening
  {
    slug: 'soil-volume',
    name: 'Soil Volume Calculator',
    description: 'Calculate the volume of soil needed for a garden bed.',
    Icon: Shovel,
    category: 'Gardening',
  },
  {
    slug: 'fertilizer-needs',
    name: 'Fertilizer Needs Calculator',
    description: 'Determine the amount of fertilizer for your garden area.',
    Icon: Sprout,
    category: 'Gardening',
  },

  // Other
  {
    slug: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    description: 'Estimate your monthly mortgage payments.',
    Icon: Home,
    category: 'Other',
  },
  {
    slug: 'energy-consumption',
    name: 'Energy Consumption Calculator',
    description: 'Calculate the energy usage and cost of your appliances.',
    Icon: PlugZap,
    category: 'Other',
  },
];
