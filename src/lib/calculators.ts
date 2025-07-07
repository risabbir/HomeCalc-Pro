import type { LucideIcon } from 'lucide-react';
import { ThermometerSun, Wrench, Sprout, Home, Wind, PlugZap } from 'lucide-react';

export interface Calculator {
  slug: string;
  name: string;
  description: string;
  Icon: LucideIcon;
}

export const calculators: Calculator[] = [
  {
    slug: 'hvac',
    name: 'HVAC Calculator',
    description: 'Calculate heating and cooling needs for your home.',
    Icon: ThermometerSun,
  },
  {
    slug: 'seer-savings',
    name: 'SEER Savings Calculator',
    description: 'Estimate energy savings from a more efficient AC unit.',
    Icon: Wind,
  },
  {
    slug: 'appliance-energy-cost',
    name: 'Appliance Energy Cost',
    description: 'Calculate the annual energy cost of home appliances.',
    Icon: PlugZap,
  },
  {
    slug: 'home-improvement',
    name: 'Home Improvement Calculator',
    description: 'Estimate costs for your next home renovation project.',
    Icon: Wrench,
  },
  {
    slug: 'gardening',
    name: 'Gardening Calculator',
    description: 'Plan your garden with soil and fertilizer calculations.',
    Icon: Sprout,
  },
  {
    slug: 'general-home',
    name: 'General Home Calculator',
    description: 'A collection of various calculators for everyday home needs.',
    Icon: Home,
  },
];
