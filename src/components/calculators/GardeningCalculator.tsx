
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Calculator } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpInfo } from '../layout/HelpInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { generatePdf } from '@/lib/pdfGenerator';

const formSchema = z.object({
  gardenArea: z.string().min(1, 'Garden area is required.'),
  applicationRate: z.string().min(1, 'Application rate is required.'),
  nitrogenRatio: z.string().min(1, 'Required.'),
  phosphorusRatio: z.string().min(1, 'Required.'),
  potassiumRatio: z.string().min(1, 'Required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function GardeningCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [fertilizerResult, setFertilizerResult] = useState<string | null>(null);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gardenArea: '',
      applicationRate: '1',
      nitrogenRatio: '10',
      phosphorusRatio: '10',
      potassiumRatio: '10',
    },
  });

  const onSubmit = (values: FormValues) => {
    let area = parseFloat(values.gardenArea);
    let appRate = parseFloat(values.applicationRate);
    const n = parseFloat(values.nitrogenRatio);

    if (units === 'metric') {
        area = area * 10.764; // sq m to sq ft
        appRate = appRate * 0.2048; // kg/100 sq m to lbs/1000 sq ft
    }

    if (area > 0 && n > 0 && values.phosphorusRatio && values.potassiumRatio) {
      const nitrogenNeeded = (area / 1000) * appRate; 
      let fertilizerAmount = (nitrogenNeeded / (n / 100)); // in lbs
      
      let resultUnit = 'lbs';
      if (units === 'metric') {
        fertilizerAmount = fertilizerAmount * 0.453592; // lbs to kg
        resultUnit = 'kg';
      }

      setFertilizerResult(`${fertilizerAmount.toFixed(2)} ${resultUnit} of ${values.nitrogenRatio}-${values.phosphorusRatio}-${values.potassiumRatio} fertilizer`);
    } else {
      setFertilizerResult(null);
    }
  };

  const handleClear = () => {
    form.reset();
    setFertilizerResult(null);
  };

  const handleDownload = () => {
    const values = form.getValues();
    if (!fertilizerResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    
    generatePdf({
        title: calculator.name,
        slug: calculator.slug,
        inputs: [
            { key: 'Garden Area', value: `${values.gardenArea} ${units === 'imperial' ? 'sq ft' : 'sq m'}` },
            { key: 'Application Rate', value: `${values.applicationRate} ${units === 'imperial' ? 'lbs of Nitrogen per 1000 sq ft' : 'kg of N per 100 sq m'}` },
            { key: 'Fertilizer Ratio (N-P-K)', value: `${values.nitrogenRatio}-${values.phosphorusRatio}-${values.potassiumRatio}` },
        ],
        results: [
            { key: 'Amount Needed', value: fertilizerResult },
        ]
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            Give your garden the right amount of nutrients without over-fertilizing. Use recommendations from a soil test for the most accurate application rate.
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
                <FormField control={form.control} name="gardenArea" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Garden Area ({units === 'imperial' ? 'sq ft' : 'sq m'})</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 500" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="applicationRate" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5">
                            <FormLabel>Application Rate</FormLabel>
                            <HelpInfo>The amount of actual nitrogen to apply. A soil test will give you a precise recommendation. 1 lb/1000 sq ft is a common rate for lawns.</HelpInfo>
                        </div>
                        <FormControl><Input type="number" placeholder="e.g., 1" {...field} /></FormControl>
                        <FormDescription>{units === 'imperial' ? 'Lbs of Nitrogen per 1000 sq ft.' : 'Kg of N per 100 sq m.'}</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            <div>
                 <div className="flex items-center gap-1.5">
                    <FormLabel>Fertilizer Ratio (N-P-K)</FormLabel>
                    <HelpInfo>The three numbers on the fertilizer bag, representing Nitrogen-Phosphorus-Potassium content.</HelpInfo>
                </div>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <FormField control={form.control} name="nitrogenRatio" render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="N" {...field} /></FormControl><FormMessage/></FormItem>)}/>
                <FormField control={form.control} name="phosphorusRatio" render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="P" {...field} /></FormControl><FormMessage/></FormItem>)}/>
                <FormField control={form.control} name="potassiumRatio" render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="K" {...field} /></FormControl><FormMessage/></FormItem>)}/>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate</Button>
              {fertilizerResult && (
                <Button type="button" variant="destructive" onClick={handleClear}>
                  Clear<X className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
        {fertilizerResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader>
                <CardTitle>Fertilizer Required</CardTitle>
                <CardDescription>The total amount of your specific fertilizer to apply.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-2xl font-bold">{fertilizerResult}</p>
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
