import type { LucideIcon } from 'lucide-react';
import React from 'react';
import { 
  ThermometerSun, Sprout, Home, Wind, PlugZap, Building2, AirVent, 
  Heater, Snowflake, Gauge, Square, Wallpaper as WallpaperIcon, Shovel,
  CookingPot, Construction, Layers, Fan, TrendingUp, Lightbulb,
  Car, CircleDollarSign, Paintbrush, Layers3
} from 'lucide-react';

export interface Calculator {
  slug: string;
  name: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  category: 'HVAC' | 'Home Improvement' | 'Gardening' | 'Other';
}

export const calculators: Calculator[] = [
  // HVAC
  {
    slug: 'hvac-load',
    name: 'HVAC Load Calculator',
    description: 'Determine the total heating and cooling load for a building (Manual J).',
    Icon: Building2,
    category: 'HVAC',
  },
  {
    slug: 'btu-calculator',
    name: 'AC Size (BTU) Calculator',
    description: 'Estimate the required BTU for cooling a room.',
    Icon: ThermometerSun,
    category: 'HVAC',
  },
  {
    slug: 'duct-size',
    name: 'Duct Size Calculator',
    description: 'Calculate the appropriate size for residential HVAC ductwork.',
    Icon: AirVent,
    category: 'HVAC',
  },
  {
    slug: 'seer-savings-calculator',
    name: 'SEER Savings Calculator',
    description: 'Estimate savings and payback period by upgrading to a more efficient AC unit.',
    Icon: TrendingUp,
    category: 'HVAC',
  },
   {
    slug: 'mini-split-cost',
    name: 'Mini-Split Cost Estimator',
    description: 'Estimate the cost to install a ductless mini-split system.',
    Icon: Fan,
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
    description: 'Estimate savings from setting back your programmable thermostat.',
    Icon: Gauge,
    category: 'HVAC',
  },
  {
    slug: 'attic-insulation',
    name: 'Attic Insulation Calculator',
    description: 'Determine the R-value and amount of insulation needed for your attic.',
    Icon: Layers3,
    category: 'HVAC',
  },

  // Home Improvement
  {
    slug: 'paint-coverage',
    name: 'Paint Coverage Calculator',
    description: 'Calculate how many gallons of paint you need for your project.',
    Icon: Paintbrush,
    category: 'Home Improvement',
  },
  {
    slug: 'flooring-area',
    name: 'Flooring Calculator',
    description: 'Calculate the square footage and waste for your flooring project.',
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
  {
    slug: 'kitchen-remodel-cost',
    name: 'Kitchen Remodel Estimator',
    description: 'Get a ballpark estimate for your kitchen renovation project.',
    Icon: CookingPot,
    category: 'Home Improvement',
  },
  {
    slug: 'decking-calculator',
    name: 'Decking Materials Calculator',
    description: 'Calculate materials needed for building a deck.',
    Icon: Construction,
    category: 'Home Improvement',
  },
  {
    slug: 'concrete-slab-calculator',
    name: 'Concrete Slab Calculator',
    description: 'Estimate the amount of concrete needed for a slab.',
    Icon: Layers,
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
    description: 'Estimate your monthly mortgage payments including taxes and insurance.',
    Icon: Home,
    category: 'Other',
  },
  {
    slug: 'energy-consumption',
    name: 'Appliance Energy Cost',
    description: 'Calculate the energy usage and cost of a single appliance.',
    Icon: PlugZap,
    category: 'Other',
  },
  {
    slug: 'energy-savings-calculator',
    name: 'Energy Savings Calculator',
    description: 'Compare annual costs of two appliances to see potential savings from an upgrade.',
    Icon: Lightbulb,
    category: 'Other',
  },
  {
    slug: 'savings-calculator',
    name: 'Savings Calculator',
    description: 'Estimate the future value of your savings or investments.',
    Icon: CircleDollarSign,
    category: 'Other',
  },
  {
    slug: 'car-loan-calculator',
    name: 'Car Loan Calculator',
    description: 'Calculate your monthly car loan payment.',
    Icon: Car,
    category: 'Other',
  },
];
