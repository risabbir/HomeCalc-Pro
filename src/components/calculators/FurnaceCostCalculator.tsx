
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Calculator } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { HelpInfo } from '../layout/HelpInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { generatePdf } from '@/lib/pdfGenerator';

const formSchema = z.object({
  homeSize: z.string().min(1, 'Home size is required.'),
  furnaceType: z.enum(['gas', 'electric', 'oil']),
  efficiency: z.enum(['standard', 'high']),
  climateZone: z.string().min(1, 'Climate zone is required.'),
});

type FormValues = z.infer<typeof formSchema>;

const CLIMATE_ZONE_FACTORS: { [key: string]: number } = {
  '1': 30, '2': 35, '3': 40, '4': 45, '5': 50, '6': 55, '7': 60, '8': 60
};

export function FurnaceCostCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [costResult, setCostResult] = useState<string | null>(null);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      homeSize: '',
      furnaceType: 'gas',
      efficiency: 'standard',
      climateZone: '5',
    },
  });

  const onSubmit = (values: FormValues) => {
    let homeSize = parseFloat(values.homeSize);

    if (units === 'metric') {
        homeSize = homeSize * 10.764; // sq m to sq ft
    }

    if (homeSize > 0 && values.furnaceType && values.efficiency && values.climateZone) {
      const btuNeeded = homeSize * CLIMATE_ZONE_FACTORS[values.climateZone as keyof typeof CLIMATE_ZONE_FACTORS];
      
      let baseCost = 0;
      if (values.furnaceType === 'gas') baseCost = 3000;
      if (values.furnaceType === 'electric') baseCost = 2500;
      if (values.furnaceType === 'oil') baseCost = 4000;

      if (values.efficiency === 'high') baseCost *= 1.5;

      const sizeMultiplier = btuNeeded / 80000;
      const totalCost = baseCost * sizeMultiplier + 2000;

      setCostResult(`$${(totalCost * 0.8).toFixed(0)} - $${(totalCost * 1.2).toFixed(0)}`);
    } else {
      setCostResult(null);
    }
  };

  const handleClear = () => {
    form.reset();
    setCostResult(null);
  };

  const handleDownload = () => {
    const values = form.getValues();
    if (!costResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }

    generatePdf({
        title: calculator.name,
        slug: calculator.slug,
        inputs: [
            { key: 'Home Size', value: `${values.homeSize} ${units === 'imperial' ? 'sq ft' : 'sq m'}` },
            { key: 'Furnace Type', value: values.furnaceType },
            { key: 'Efficiency Level', value: values.efficiency },
            { key: 'U.S. Climate Zone', value: `Zone ${values.climateZone}` },
        ],
        results: [
            { key: 'Estimated Installation Cost', value: costResult },
        ],
        disclaimer: 'This is for budget planning only. Costs can vary significantly based on your location, home complexity, and choice of contractor. Always get multiple quotes from local HVAC professionals.'
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            Get a rough estimate for a new furnace installation. Cost depends heavily on home size, fuel type, efficiency rating (AFUE), climate, and local labor rates. This is for budget planning only.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <div className="flex justify-start mb-4">
                <Tabs defaultValue="imperial" onValueChange={(value) => setUnits(value as 'imperial' | 'metric')} className="w-auto">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="imperial">Imperial</TabsTrigger>
                        <TabsTrigger value="metric">Metric</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="homeSize" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5">
                            <FormLabel>Home Size ({units === 'imperial' ? 'sq ft' : 'sq m'})</FormLabel>
                        </div>
                        <FormControl><Input type="number" placeholder="e.g., 2000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="climateZone" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5">
                            <FormLabel>U.S. Climate Zone</FormLabel>
                            <HelpInfo>Colder zones require more powerful (and expensive) furnaces. See our <Link href="/resources/climate-zone-map" className="text-primary underline">map</Link> to find yours.</HelpInfo>
                        </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          {Object.keys(CLIMATE_ZONE_FACTORS).map(zone => (
                             <SelectItem key={zone} value={zone}>Zone {zone}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="furnaceType" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5">
                            <FormLabel>Furnace Type</FormLabel>
                            <HelpInfo>Gas is most common, electric is cheaper to install but more expensive to run, and oil is used in fewer regions.</HelpInfo>
                        </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="gas">Gas</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                          <SelectItem value="oil">Oil</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="efficiency" render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1.5">
                        <FormLabel>Efficiency (AFUE)</FormLabel>
                        <HelpInfo>Annual Fuel Utilization Efficiency. High-efficiency (95%+) units cost more upfront but save money on fuel over time.</HelpInfo>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard (~80%)</SelectItem>
                          <SelectItem value="high">High (95%+)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )}/>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Estimate Cost</Button>
              {costResult && (
                <Button type="button" variant="destructive" onClick={handleClear}>
                  Clear<X className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
        {costResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Estimated Installation Cost</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-2xl font-bold">{costResult}</p>
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
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
