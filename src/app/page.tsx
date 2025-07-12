
'use client';

import { CalculatorDirectory } from '@/components/calculators/CalculatorDirectory';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Wand2, Calculator, ListChecks } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

const examplePrompts = [
  {
    category: 'HVAC',
    prompts: [
      "I'm replacing the furnace in my 2000 sq ft house in a cold climate.",
      "Planning to add new attic insulation to improve my home's efficiency.",
      "Thinking about upgrading my old AC unit to a new high-efficiency one.",
      "I want to install a mini-split system in my garage workshop.",
      "My energy bills are too high, I think my old AC is the problem.",
      "Need to figure out the right duct size for a new addition to my house.",
      "I want to compare the cost of a new furnace vs. a new heat pump.",
      "How much can I save by using a programmable thermostat?",
      "My home feels stuffy, I need to figure out the right HVAC load.",
      "Estimating the cost for a new 3-ton, 18 SEER heat pump.",
      "I'm considering blown-in cellulose for my attic and need to know how many bags to buy.",
      "What size air conditioner do I need for my 500 sq ft living room?",
      "Figuring out the cost to replace an old, inefficient oil furnace.",
      "I'm planning a new central air system and need to estimate ductwork sizes.",
      "I'm looking at a 2-zone mini-split system and need a cost estimate.",
      "How much could I save annually by upgrading from a 10 SEER to a 16 SEER AC?",
      "I need to add R-30 insulation to my 1200 sq ft attic.",
      "My furnace is old and I need to budget for a replacement.",
      "I'm building a sunroom and need to know what size mini-split to get.",
      "How do I calculate the correct HVAC system size for a 2,500 sq ft home in Zone 4?",
      "Comparing the running costs of a gas furnace versus an electric one.",
      "I want to see the payback period for a high-efficiency AC unit.",
      "Need to know the cost of a new 80,000 BTU gas furnace.",
      "I'm insulating my basement and need to know what R-value to aim for.",
      "What are the expected savings if I set my thermostat back 10 degrees at night?",
    ],
  },
  {
    category: 'Home Improvement',
    prompts: [
      "I want to build a new 12x16 foot deck in my backyard.",
      "I'm planning a full kitchen remodel with semi-custom cabinets and quartz countertops.",
      "I need to repaint my living room and two bedrooms.",
      "I'm installing new laminate flooring in my basement.",
      "I need to pour a concrete slab for a new shed.",
      "I'm redoing my bathroom and need to buy new wallpaper.",
      "I'm trying to budget for a complete kitchen tear-out and remodel.",
      "How many boards do I need for a 20-foot long privacy fence?",
      "I'm painting a 15x20 ft room with 8 ft ceilings and want to know how many gallons I need.",
      "I need to calculate the amount of flooring for an L-shaped room.",
      "How many rolls of wallpaper are needed for a room with a 24-inch pattern repeat?",
      "Estimating the cost for a minor kitchen refresh with stock cabinets and laminate counters.",
      "I need to build a small 8x10 floating deck and need a materials list.",
      "How much concrete do I need for a 4-inch thick, 10x12 patio?",
      "I'm planning to tile my 100 sq ft bathroom floor.",
      "Budgeting for a high-end kitchen remodel with custom cabinets and a new appliance suite.",
      "I have to paint three rooms, each approximately 12x12 ft.",
      "Calculating the number of 5.5-inch wide deck boards for a 20x16 ft deck.",
      "I'm pouring footings for a new pergola and need to know how much concrete to mix.",
      "I'm getting quotes for a kitchen remodel and want a baseline estimate.",
      "How many 16ft deck boards are needed to cover 250 square feet?",
      "I need to paint the exterior of my house, which has about 2000 sq ft of wall surface.",
      "Planning to install vinyl plank flooring in three bedrooms totaling 500 sq ft.",
      "What's the cost difference between a basic and a premium kitchen renovation?",
      "I'm putting up a new fence and need to calculate how many posts I'll need.",
    ],
  },
  {
    category: 'Gardening',
    prompts: [
        "I need to fill three new 4x8 raised garden beds with soil.",
        "I'm fertilizing my 1500 sq ft lawn for the spring.",
        "I need to calculate how much mulch to buy for my flower beds.",
        "Planning my vegetable garden layout and need to figure out soil needs for different beds.",
        "How much topsoil do I need to level out my backyard?",
        "I bought a bag of 10-10-10 fertilizer and need to know how much to use on my vegetable garden.",
        "Starting a container garden on my patio and need to calculate soil volume for various pot sizes.",
        "I'm creating a new flower bed along a 30-foot fence line and need to know how much soil to order.",
        "How many cubic yards of soil do I need for a 10x10 garden that's 6 inches deep?",
        "I have a 5000 sq ft lawn and need to apply a starter fertilizer.",
        "I'm planning to top-dress my lawn with a quarter-inch of compost.",
        "Calculating how much potting mix I need for 10 large containers.",
        "I have a new lawn and need to figure out how much grass seed to buy.",
        "How much fertilizer do I need to apply 1 pound of nitrogen per 1000 sq ft?",
        "I'm building a new retaining wall and need to calculate the backfill.",
        "I need enough soil to fill two 3'x6'x1' raised beds.",
        "I want to apply a 2-inch layer of mulch to all my garden beds, which total about 200 sq ft.",
        "My soil test recommends adding 2 lbs of nitrogen to my garden.",
        "I'm overseeding my lawn and need to know how much seed to buy.",
        "How many bags of soil do I need if each bag is 1.5 cubic feet?",
        "I need to calculate the amount of gravel for a new garden path.",
        "I'm planning a new rose garden and need to amend the soil in a 10x20 ft area.",
        "My lawn is 2,500 sq ft. How much of a 5-10-5 fertilizer should I use?",
        "I'm filling a circular garden bed with a 10-foot diameter.",
        "I'm trying to figure out if it's cheaper to buy soil in bags or in bulk.",
    ],
  },
  {
    category: 'Other',
    prompts: [
      "I'm trying to figure out a budget for a new car purchase.",
      "I'm planning my retirement savings over the next 20 years.",
      "I'm looking to buy a new home and need to understand the mortgage costs.",
      "Comparing the energy usage of my old freezer to a new one.",
      "How much will my $5,000 investment be worth in 10 years at a 7% return?",
      "I need to figure out my monthly payment for a $400,000 mortgage.",
      "I want to see how much I can save on electricity by replacing all my light bulbs with LEDs.",
      "What are the total costs involved in a $25,000 car loan over 5 years?",
      "I'm saving for a down payment and want to see how long it will take.",
      "Calculating the monthly payment on a $500,000 home with a 30-year mortgage.",
      "I want to see the difference in annual cost between my old washing machine and a new one.",
      "I'm planning to invest $500 a month for 30 years and want to see the future value.",
      "I'm buying a car and need to account for a down payment and trade-in value.",
      "What's my PITI on a $350k mortgage with $5,000 in property taxes?",
      "How much energy savings can I expect by upgrading my 20-year-old refrigerator?",
      "I'm trying to reach a savings goal of $100,000.",
      "Calculating the loan payments for a new vehicle with a $40,000 price tag.",
      "How does a 15-year mortgage compare to a 30-year one for a $250,000 loan?",
      "I want to see how much interest I'll pay on a car loan.",
      "I'm upgrading from halogen lights to LED and want to estimate the savings.",
      "I want to start a college fund for my child and need to project its growth.",
      "What's the total cost of ownership for a car, including loan interest?",
      "How much faster can I pay off my mortgage by adding an extra $200 per month?",
      "Comparing two different investment scenarios with different interest rates.",
      "I need to see the energy cost of running my portable heater all winter.",
    ],
  }
];

// Function to get one random item from an array
const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export default function Home() {
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);

  useEffect(() => {
    // Run randomization on client-side only to prevent hydration mismatch
    setSelectedPrompts(examplePrompts.map(category => getRandomItem(category.prompts)));
  }, []);
  
  return (
    <>
      <section className="relative text-center py-20 md:py-32 bg-secondary/50">
         <div 
          className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"
          style={{
            backgroundSize: '30px 30px',
            backgroundImage: 'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
          }}
        ></div>
        <div className="container relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-headline text-primary">Empower Your Home Projects</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Precision calculators for every corner of your home. Plan with confidence, build with precision.
          </p>
          <Button size="lg" asChild className="group">
            <Link href="/#calculators">
              Get Started <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-12 md:py-16">
        <CalculatorDirectory />
        <Separator className="my-16 md:my-24" />

        <section className="bg-secondary rounded-xl p-8 md:p-16 border">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="text-center md:text-left">
                    
                    <h2 className="text-3xl font-bold font-headline mb-4">Not Sure Where to Start?</h2>
                    <p className="text-muted-foreground text-lg mb-8">
                        Describe your project, and our AI assistant will recommend the most relevant calculators for the job. It's the perfect way to discover tools you might not have known you needed.
                    </p>
                    <Button size="lg" asChild className="group">
                        <Link href="/ai-recommendations">
                            Ask our AI Assistant
                            <ArrowRight className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
                <div className="space-y-3">
                    {selectedPrompts.length > 0 && selectedPrompts.map((prompt) => (
                      <Link href={`/ai-recommendations?prompt=${encodeURIComponent(prompt)}`} key={prompt} className="group block">
                          <div className="p-4 border bg-background rounded-lg hover:border-primary/50 hover:bg-accent transition-colors flex items-center justify-between">
                              <span className="font-medium">"{prompt}"</span>
                              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                          </div>
                      </Link>
                    ))}
                </div>
            </div>
        </section>

        <Separator className="my-16 md:my-24" />

        <section>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-headline mb-4">Everything You Need to Plan and Build</h2>
            <p className="text-muted-foreground text-lg mb-12">
              From initial estimates to final details, we provide the tools for confident project planning.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 bg-secondary/50 p-8">
                <div className="flex justify-center mb-4">
                    <div className="bg-background p-4 rounded-full border">
                         <Calculator className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <CardTitle className="text-xl">Comprehensive Calculators</CardTitle>
                <CardDescription className="mt-2">Access a wide range of tools for HVAC, home improvement, gardening, and more, all in one place.</CardDescription>
            </Card>
            <Card className="text-center border-0 bg-secondary/50 p-8">
                 <div className="flex justify-center mb-4">
                    <div className="bg-background p-4 rounded-full border">
                        <Wand2 className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <CardTitle className="text-xl">AI-Powered Assistance</CardTitle>
                <CardDescription className="mt-2">Let our smart assistant recommend the right tools and help you fill in the blanks on complex calculations.</CardDescription>
            </Card>
            <Card className="text-center border-0 bg-secondary/50 p-8">
                 <div className="flex justify-center mb-4">
                    <div className="bg-background p-4 rounded-full border">
                        <ListChecks className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <CardTitle className="text-xl">Expert Guides & Checklists</CardTitle>
                <CardDescription className="mt-2">Go beyond the numbers with our detailed guides and checklists to ensure your project is a success.</CardDescription>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
