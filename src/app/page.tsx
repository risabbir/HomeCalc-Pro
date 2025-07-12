
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
      "I'm replacing the furnace in my 2000 sq ft house.",
      "Planning to add new attic insulation to improve my home's efficiency.",
      "Thinking about upgrading my old AC unit to a new high-efficiency one.",
      "I want to install a mini-split system in my garage workshop.",
      "My goal is to lower my energy bill by upgrading my HVAC system.",
      "I'm considering a new heat pump for my home.",
    ],
  },
  {
    category: 'Home Improvement',
    prompts: [
      "I want to build a new 12x16 foot deck and a fence in my backyard.",
      "I'm planning a full kitchen remodel with semi-custom cabinets and quartz countertops.",
      "I need to repaint my living room and two bedrooms.",
      "I'm installing new laminate flooring in my basement.",
      "I need to put up wallpaper on an accent wall in my dining room.",
      "I'm pouring a concrete slab for a new backyard shed.",
    ],
  },
  {
    category: 'Other',
    prompts: [
      "I'm trying to figure out a budget for a new car purchase.",
      "I need to fill three new raised garden beds with soil.",
      "I'm planning my retirement savings over the next 20 years.",
      "I'm looking to buy a new home and need to understand the mortgage costs.",
      "I'm fertilizing my 1500 sq ft lawn for the spring.",
      "Comparing the energy usage of my old freezer to a new one.",
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
