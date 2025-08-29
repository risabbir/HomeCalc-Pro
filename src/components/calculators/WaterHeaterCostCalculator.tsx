
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Calculator } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, X } from 'lucide-react';
import { HelpInfo } from '../layout/HelpInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { generatePdf } from '@/lib/pdfGenerator';
import Link from 'next/link';

const formSchema = z.object({
  hotWaterUsage: z.string().min(1, 'Required.'),
  energyRate: z.string().min(1, 'Required.'),
  groundwaterTemp: z.string().min(1, 'Required.'),
  setTemp: z.string().min(1, 'Required.'),
  tankCost: z.string().optional(),
  tanklessCost: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Result {
    tankCost: number;
    tanklessCost: number;
    savings: number;
    payback: string | null;
}

export function WaterHeaterCostCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [result, setResult] = useState<Result | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hotWaterUsage: '60',
      energyRate: '0.17', // $/kWh
      groundwaterTemp: '50', // Fahrenheit
      setTemp: '120', // Fahrenheit
      tankCost: '1500',
      tanklessCost: '3000',
    },
  });

  const onSubmit = (values: FormValues) => {
    const usage = parseFloat(values.hotWaterUsage);
    const rate = parseFloat(values.energyRate);
    const tempIn = parseFloat(values.groundwaterTemp);
    const tempOut = parseFloat(values.setTemp);
    const costTank = parseFloat(values.tankCost || '0');
    const costTankless = parseFloat(values.tanklessCost || '0');

    if ([usage, rate, tempIn, tempOut].some(v => isNaN(v) || v <= 0)) {
        toast({ title: 'Invalid Inputs', description: 'Please enter valid positive numbers.', variant: 'destructive' });
        return;
    }

    const tempRise = tempOut - tempIn;
    const btuPerDay = usage * 8.33 * tempRise;
    const kwhPerDay = btuPerDay / 3412; // 1 kWh = 3412 BTU

    // Efficiencies
    const tankEfficiency = 0.90; // Avg. for modern electric tank
    const tanklessEfficiency = 0.98; // Avg. for electric tankless

    const kwhTank = kwhPerDay / tankEfficiency;
    const kwhTankless = kwhPerDay / tanklessEfficiency;

    const annualCostTank = kwhTank * 365 * rate;
    const annualCostTankless = kwhTankless * 365 * rate;
    const annualSavings = annualCostTank - annualCostTankless;

    let payback = null;
    if (costTankless > costTank && annualSavings > 0) {
        payback = ((costTankless - costTank) / annualSavings).toFixed(1) + ' years';
    }

    setResult({
        tankCost: annualCostTank,
        tanklessCost: annualCostTankless,
        savings: annualSavings,
        payback: payback,
    });
  };

  const handleClear = () => {
    form.reset();
    setResult(null);
  };

  const handleDownload = () => {
    const values = form.getValues();
    if (!result) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    
    generatePdf({
        title: calculator.name,
        slug: calculator.slug,
        inputs: [
            { key: 'Hot Water Usage', value: `${values.hotWaterUsage} gal/day` },
            { key: 'Energy Rate', value: `$${values.energyRate}/kWh` },
            { key: 'Groundwater Temp', value: `${values.groundwaterTemp}°F` },
            { key: 'Water Heater Temp', value: `${values.setTemp}°F` },
            { key: 'Tank Unit Cost', value: `$${values.tankCost || '0'}` },
            { key: 'Tankless Unit Cost', value: `$${values.tanklessCost || '0'}` },
        ],
        results: [
            { key: 'Tank Annual Cost', value: `$${result.tankCost.toFixed(2)}` },
            { key: 'Tankless Annual Cost', value: `$${result.tanklessCost.toFixed(2)}` },
            { key: 'Annual Savings (Tankless)', value: `$${result.savings.toFixed(2)}` },
            { key: 'Payback Period', value: result.payback || 'N/A' },
        ],
        disclaimer: 'This is an estimate for electric models. Gas rates and unit efficiencies vary. Labor costs not included.'
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
          Compare the estimated annual energy costs of a standard electric tank water heater versus an electric tankless model. Enter your household's usage and local energy rate to see the potential savings. For details on different types, see our <Link href="/resources/water-heater-guide" className="text-primary underline">Water Heater Guide</Link>.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="hotWaterUsage" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Hot Water Usage (gal/day)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 60" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="energyRate" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Energy Rate ($/kWh)</FormLabel><HelpInfo>Your cost per kilowatt-hour from your electric bill.</HelpInfo></div>
                        <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.17" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="groundwaterTemp" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Groundwater Temp (°F)</FormLabel><HelpInfo>The temperature of water entering your home. Varies by region (e.g., 50°F North, 70°F South).</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="setTemp" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Water Heater Set Temp (°F)</FormLabel><HelpInfo>The temperature your water heater is set to. 120°F is standard.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 120" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="tankCost" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tank Unit Cost ($) (Optional)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 1500" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="tanklessCost" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tankless Unit Cost ($) (Optional)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 3000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate Costs</Button>
              {result && (
                <Button type="button" variant="destructive" onClick={handleClear}>
                  Clear<X className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
        {result && (
          <Card className="mt-6 bg-accent">
            <CardHeader>
                <CardTitle>Estimated Annual Energy Costs</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-background rounded-lg border">
                        <p className="text-sm text-muted-foreground">Tank Heater</p>
                        <p className="text-2xl font-bold">${result.tankCost.toFixed(2)}/yr</p>
                    </div>
                     <div className="p-4 bg-background rounded-lg border">
                        <p className="text-sm text-muted-foreground">Tankless Heater</p>
                        <p className="text-2xl font-bold">${result.tanklessCost.toFixed(2)}/yr</p>
                    </div>
                     <div className="p-4 bg-primary/10 text-primary rounded-lg border border-primary/20 md:col-span-2">
                        <p className="text-sm">Tankless Savings</p>
                        <p className="text-2xl font-bold">${result.savings.toFixed(2)}/yr</p>
                        {result.payback && <p className="text-sm">Payback period: {result.payback}</p>}
                    </div>
                </div>
            </CardContent>
             <CardFooter>
                <TooltipProvider>
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={handleDownload} variant="secondary">
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Download results as PDF</p>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
