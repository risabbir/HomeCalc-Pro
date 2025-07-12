
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
      "My energy bill is too high, what can I do to lower it?",
      "What size furnace do I need for a 2,000 sq ft house in a cold climate?",
      "Is it worth upgrading my old AC unit to a new one?",
      "How much would it cost to install a mini-split system in my garage?",
      "Estimate the cost of a new heat pump for my home.",
      "How much can I save by using a programmable thermostat?",
      "How much attic insulation should I have for my climate zone?",
      "What size ducts do I need for my HVAC system?",
    ],
  },
  {
    category: 'Home Improvement',
    prompts: [
      "I want to build a new deck and a fence in my backyard.",
      "I need to repaint my living room and I'm not sure what kind of paint to use.",
      "How much will it cost to remodel my kitchen?",
      "Calculate the amount of flooring I need for two bedrooms.",
      "How many rolls of wallpaper do I need for an accent wall?",
      "I'm pouring a concrete slab for a new shed, how much concrete do I need?",
      "I'm planning a full kitchen remodel with semi-custom cabinets and quartz countertops.",
      "Calculate the materials for a 12x16 foot deck.",
    ],
  },
  {
    category: 'Other',
    prompts: [
      "Help me estimate my monthly mortgage payment.",
      "How much soil do I need to fill a new raised garden bed?",
      "What would my monthly payment be for a $30,000 car loan?",
      "How much will my investment be worth in 10 years with monthly contributions?",
      "Calculate the annual running cost of my old refrigerator.",
      "How much fertilizer do I need for my 500 sq ft lawn?",
      "Compare the energy cost of my old AC unit to a new one.",
      "What's my estimated mortgage payment on a $400,000 loan?",
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
