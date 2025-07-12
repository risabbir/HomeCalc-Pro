
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Calculator } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpInfo } from '../layout/HelpInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { generatePdf } from '@/lib/pdfGenerator';

const formSchema = z.object({
  zones: z.string().min(1, 'Number of zones is required.'),
  btuRating: z.string().min(1, 'BTU rating is required.'),
  seerRating: z.string().min(1, 'SEER rating is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function MiniSplitCostEstimator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [costResult, setCostResult] = useState<string | null>(null);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      zones: '1',
      btuRating: '12000',
      seerRating: '20',
    },
  });

  const onSubmit = (values: FormValues) => {
    const zones = parseInt(values.zones);
    let btu = parseInt(values.btuRating);
    const seer = parseInt(values.seerRating);

    if (units === 'metric') {
        btu = btu * 3.41; // Watts to BTU/hr
    }

    if (zones > 0 && btu > 0 && seer > 0) {
      let costPerZone = 1500;
      if (btu > 12000) costPerZone += (btu - 12000) * 0.1;
      if (seer > 20) costPerZone += (seer - 20) * 50;
      const totalCost = costPerZone * zones + 750 * zones; // +750 for labor per zone
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
            { key: 'Number of Zones (Indoor Units)', value: values.zones },
            { key: 'Total Capacity', value: `${values.btuRating} ${units === 'imperial' ? 'BTU/hr' : 'Watts'}` },
            { key: 'SEER2 Rating', value: values.seerRating },
        ],
        results: [
            { key: 'Estimated Installation Cost', value: costResult },
        ],
        disclaimer: 'This is a rough estimate for budget planning only. Costs can vary significantly based on brand, system complexity, and local labor rates. Always get multiple quotes from qualified HVAC contractors.'
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
          Estimate the total cost to purchase and install a ductless mini-split system. Costs can vary based on brand, system capacity, number of indoor units (zones), and location.
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="zones" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5">
                            <FormLabel># of Zones</FormLabel>
                            <HelpInfo>The number of indoor units (heads) you need. One per room is typical.</HelpInfo>
                        </div>
                        <FormControl><Input type="number" placeholder="e.g., 1" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="btuRating" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5">
                            <FormLabel>Total Capacity ({units === 'imperial' ? 'BTU/hr' : 'Watts'})</FormLabel>
                            <HelpInfo>The total cooling/heating capacity of the outdoor unit. This should match the needs of all zones combined.</HelpInfo>
                        </div>
                        <FormControl><Input type="number" placeholder="e.g., 12000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="seerRating" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5">
                            <FormLabel>SEER2 Rating</FormLabel>
                             <HelpInfo>The unit's efficiency rating (SEER2 is the new standard). Higher is more efficient but costs more upfront.</HelpInfo>
                        </div>
                        <FormControl><Input type="number" placeholder="e.g., 20" {...field} /></FormControl>
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
