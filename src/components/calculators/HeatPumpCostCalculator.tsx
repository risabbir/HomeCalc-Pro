
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpInfo } from '../layout/HelpInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { generatePdf } from '@/lib/pdfGenerator';

const formSchema = z.object({
  homeSize: z.string().min(1, 'Home size is required.'),
  seerRating: z.string().min(1, 'SEER rating is required.'),
  unitSize: z.string().min(1, 'Unit size is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function HeatPumpCostCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [costResult, setCostResult] = useState<string | null>(null);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      homeSize: '2000',
      seerRating: '16',
      unitSize: '3',
    },
  });

  const onSubmit = (values: FormValues) => {
    let size = parseFloat(values.unitSize);
    const seer = parseFloat(values.seerRating);
    let homeSize = parseFloat(values.homeSize);

    if (units === 'metric') {
        homeSize = homeSize * 10.764; // sq m to sq ft
        size = size / 3.517; // kW to tons
    }

    if (size > 0 && seer > 0 && homeSize > 0) {
      let baseCost = 2000 * size; // Base on tonnage
      if (seer > 16) baseCost += (seer - 16) * 500;
      const totalCost = baseCost + 2500; // + for labor & materials
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
            { key: 'Unit Size', value: `${values.unitSize} ${units === 'imperial' ? 'Tons' : 'kW'}` },
            { key: 'SEER2 Rating', value: values.seerRating },
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
            Estimate the installed cost of a new heat pump. The unit's size (capacity) and its SEER2 rating are major cost factors. This is for budget planning only.
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
                <FormField control={form.control} name="homeSize" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5">
                            <FormLabel>Home Size ({units === 'imperial' ? 'sq ft' : 'sq m'})</FormLabel>
                        </div>
                        <FormControl><Input type="number" placeholder="e.g., 2000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="unitSize" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5">
                            <FormLabel>Unit Size ({units === 'imperial' ? 'Tons' : 'kW'})</FormLabel>
                             <HelpInfo>The cooling/heating capacity of the unit. 1 Ton = 12,000 BTU/hr ≈ 3.5 kW.</HelpInfo>
                        </div>
                        <FormControl><Input type="number" step="0.5" placeholder="e.g., 3" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="seerRating" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5">
                            <FormLabel>SEER2 Rating</FormLabel>
                             <HelpInfo>The unit's efficiency rating (SEER2 is the new standard). Higher is more efficient but costs more upfront.</HelpInfo>
                        </div>
                        <FormControl><Input type="number" placeholder="e.g., 16" {...field} /></FormControl>
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
            <CardContent className="flex items-center justify-between">
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
