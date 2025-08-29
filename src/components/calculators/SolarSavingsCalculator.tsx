
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
  avgBill: z.string().min(1, 'Required.'),
  sunlightHours: z.string().min(1, 'Required.'),
  installCost: z.string().min(1, 'Required.'),
  energyRate: z.string().min(1, 'Required.'),
  incentives: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Result {
    annualSavings: number;
    paybackPeriod: number;
    lifetimeSavings: number;
    systemSize: number;
    environmentalImpact: {
        co2: string;
        trees: number;
    }
}

export function SolarSavingsCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [result, setResult] = useState<Result | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avgBill: '150',
      sunlightHours: '4.5',
      installCost: '20000',
      energyRate: '0.17',
      incentives: '6000', // e.g., 30% federal tax credit on a 20k system
    },
  });

  const onSubmit = (values: FormValues) => {
    const bill = parseFloat(values.avgBill);
    const sunHours = parseFloat(values.sunlightHours);
    const cost = parseFloat(values.installCost);
    const rate = parseFloat(values.energyRate);
    const incentives = parseFloat(values.incentives || '0');

    if ([bill, sunHours, cost, rate, incentives].some(v => isNaN(v) || v < 0)) {
        toast({ title: 'Invalid Inputs', description: 'Please enter valid numbers.', variant: 'destructive' });
        return;
    }

    const annualUsageKwh = (bill * 12) / rate;
    const systemSizeKw = (annualUsageKwh / (sunHours * 365)) / 0.85; // 0.85 = avg system efficiency factor
    const annualProductionKwh = systemSizeKw * sunHours * 365 * 0.85;
    
    // Assume solar covers 95% of usage, up to what's produced
    const savedKwh = Math.min(annualUsageKwh * 0.95, annualProductionKwh);
    const annualSavings = savedKwh * rate;
    const netCost = cost - incentives;
    const paybackPeriod = netCost / annualSavings;
    const lifetimeSavings = (annualSavings * 25) - netCost;

    // Environmental Impact: 1 MWh = 0.37 metric tons CO2. 1 tree sequesters ~48 lbs CO2/yr.
    const lifetimeProductionMwh = (annualProductionKwh * 25) / 1000;
    const co2SavedMetricTons = lifetimeProductionMwh * 0.37;
    const treesEquivalent = Math.round((co2SavedMetricTons * 2204.62) / 48);


    setResult({ 
        annualSavings, 
        paybackPeriod, 
        lifetimeSavings, 
        systemSize: systemSizeKw,
        environmentalImpact: {
            co2: co2SavedMetricTons.toFixed(2),
            trees: treesEquivalent,
        }
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
            { key: 'Average Monthly Bill', value: `$${values.avgBill}` },
            { key: 'Energy Rate', value: `$${values.energyRate}/kWh` },
            { key: 'Peak Sunlight Hours/Day', value: `${values.sunlightHours} hrs` },
            { key: 'Gross Installation Cost', value: `$${values.installCost}` },
            { key: 'Incentives & Tax Credits', value: `$${values.incentives || '0'}` },
        ],
        results: [
            { key: 'Recommended System Size', value: `${result.systemSize.toFixed(2)} kW` },
            { key: 'Estimated Annual Savings', value: `$${result.annualSavings.toFixed(2)}` },
            { key: 'Simple Payback Period', value: `${result.paybackPeriod.toFixed(1)} years` },
            { key: '25-Year Net Savings', value: `$${result.lifetimeSavings.toLocaleString(undefined, {maximumFractionDigits: 0})}` },
            { key: 'Lifetime CO2 Reduction', value: `${result.environmentalImpact.co2} metric tons` },
            { key: 'Equivalent to Planting', value: `${result.environmentalImpact.trees} trees` },
        ],
        disclaimer: 'This is a simplified financial estimate. Actual performance and savings depend on many factors including system orientation, weather, and utility policies.'
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
          Estimate the financial benefits of installing a solar panel system. This tool provides a simple payback and return on investment calculation. For details, check our <Link href="/resources/solar-panel-guide" className="text-primary underline">Solar Guide</Link>.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="avgBill" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Average Monthly Electric Bill ($)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 150" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="energyRate" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Your Electric Rate ($/kWh)</FormLabel><HelpInfo>Find this on your utility bill.</HelpInfo></div>
                        <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.17" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="sunlightHours" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Peak Sunlight Hours / Day</FormLabel><HelpInfo>The average hours of direct sun your roof gets daily. Varies by location (e.g., 3.5 in Seattle, 5.5 in Phoenix).</HelpInfo></div>
                        <FormControl><Input type="number" step="0.1" placeholder="e.g., 4.5" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="installCost" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Gross Installation Cost ($)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 20000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="incentives" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <div className="flex items-center gap-1.5"><FormLabel>Incentives ($) (Optional)</FormLabel><HelpInfo>The total value of federal, state, and local tax credits or rebates.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 6000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate Savings</Button>
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
                <CardTitle>Solar Project Financial Estimate</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-2 bg-background rounded-lg border">
                    <p className="text-sm text-muted-foreground">System Size</p>
                    <p className="text-xl font-bold">{result.systemSize.toFixed(2)} kW</p>
                </div>
                 <div className="p-2 bg-background rounded-lg border">
                    <p className="text-sm text-muted-foreground">Annual Savings</p>
                    <p className="text-xl font-bold">${result.annualSavings.toFixed(0)}</p>
                </div>
                 <div className="p-2 bg-background rounded-lg border">
                    <p className="text-sm text-muted-foreground">Payback</p>
                    <p className="text-xl font-bold">{result.paybackPeriod.toFixed(1)} yrs</p>
                </div>
                 <div className="p-2 bg-background rounded-lg border">
                    <p className="text-sm text-muted-foreground">25-Yr Savings</p>
                    <p className="text-xl font-bold">${result.lifetimeSavings.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </div>
                <div className="col-span-2 md:col-span-4 p-4 bg-green-500/10 text-green-800 dark:text-green-300 rounded-lg border border-green-500/20">
                    <p className="text-sm font-semibold">Lifetime Environmental Impact</p>
                    <p className="text-lg">~{result.environmentalImpact.co2} metric tons of CO2 offset, the equivalent of planting {result.environmentalImpact.trees} trees!</p>
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
