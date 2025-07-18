
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
  length: z.string().min(1, 'Length is required.'),
  width: z.string().min(1, 'Width is required.'),
  thickness: z.string().min(1, 'Thickness is required.'),
  wasteFactor: z.string().min(1, 'Waste factor is required.'),
});

type FormValues = z.infer<typeof formSchema>;

interface Result {
    volume: number;
    bagsNeeded: number;
}

export function ConcreteSlabCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [concreteResult, setConcreteResult] = useState<Result | null>(null);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      length: '',
      width: '',
      thickness: '4',
      wasteFactor: '10',
    },
  });

  const onSubmit = (values: FormValues) => {
    let length = parseFloat(values.length);
    let width = parseFloat(values.width);
    let thickness = parseFloat(values.thickness);
    const waste = parseFloat(values.wasteFactor);

    if (units === 'metric') {
      length = length * 3.28084; // m to ft
      width = width * 3.28084; // m to ft
      thickness = thickness / 2.54; // cm to in
    }
    
    if (length > 0 && width > 0 && thickness > 0 && waste >= 0) {
      const thicknessInFeet = thickness / 12;
      const cubicFeet = length * width * thicknessInFeet;
      const cubicFeetWithWaste = cubicFeet * (1 + waste / 100);
      
      const bagsNeeded = Math.ceil(cubicFeetWithWaste / 0.6); // Assuming 80lb bag yields ~0.6 cu ft

      let volumeForDisplay: number;
      if (units === 'imperial') {
        volumeForDisplay = cubicFeetWithWaste / 27; // cubic yards
      } else {
        volumeForDisplay = cubicFeetWithWaste * 0.0283168; // cubic meters
      }

      setConcreteResult({ volume: volumeForDisplay, bagsNeeded });
    } else {
      setConcreteResult(null);
    }
  }

  const handleClear = () => {
    form.reset();
    setConcreteResult(null);
  };

  const handleDownload = () => {
    const values = form.getValues();
    if (!concreteResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    
    generatePdf({
        title: calculator.name,
        slug: calculator.slug,
        inputs: [
            { key: 'Slab Length', value: `${values.length} ${units === 'imperial' ? 'ft' : 'm'}` },
            { key: 'Slab Width', value: `${values.width} ${units === 'imperial' ? 'ft' : 'm'}` },
            { key: 'Slab Thickness', value: `${values.thickness} ${units === 'imperial' ? 'in' : 'cm'}` },
            { key: 'Waste Factor', value: `${values.wasteFactor}%` },
        ],
        results: [
            { key: 'Concrete for Delivery', value: `${concreteResult.volume.toFixed(2)} ${units === 'imperial' ? 'cubic yards' : 'cubic meters'}` },
            { key: 'Concrete in Bags', value: `~${concreteResult.bagsNeeded} (80lb / 36kg) bags` },
        ]
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            Planning a foundation, patio, or sidewalk? Enter the dimensions of your slab to calculate the volume of concrete required. The result is given in cubic yards/meters for bulk delivery and in estimated 80lb bags for smaller projects.
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
                <FormField control={form.control} name="length" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5">
                            <FormLabel>Slab Length ({units === 'imperial' ? 'ft' : 'm'})</FormLabel>
                        </div>
                        <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="width" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5">
                            <FormLabel>Slab Width ({units === 'imperial' ? 'ft' : 'm'})</FormLabel>
                        </div>
                        <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="thickness" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5">
                            <FormLabel>Slab Thickness ({units === 'imperial' ? 'in' : 'cm'})</FormLabel>
                            <HelpInfo>Standard residential slabs are often 4 inches (10 cm) thick.</HelpInfo>
                        </div>
                        <FormControl><Input type="number" placeholder="e.g., 4" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="wasteFactor" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5">
                            <FormLabel>Waste Factor (%)</FormLabel>
                            <HelpInfo>Accounts for uneven ground and spillage. 5-10% is standard.</HelpInfo>
                        </div>
                        <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate</Button>
              {concreteResult && (
                <Button type="button" variant="destructive" onClick={handleClear}>
                  Clear<X className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
        {concreteResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader>
                <CardTitle>Concrete Needed</CardTitle>
                <CardDescription>Results include the waste factor you provided.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-2xl font-bold">{concreteResult.volume.toFixed(2)} {units === 'imperial' ? 'cubic yards' : 'cubic meters'}</p>
                <p className="text-muted-foreground">or ~{concreteResult.bagsNeeded} (80lb / 36kg) bags</p>
              </div>
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
