
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Calculator } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpInfo } from '../layout/HelpInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { generatePdf } from '@/lib/pdfGenerator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  length: z.string().min(1, 'Length is required.'),
  width: z.string().min(1, 'Width is required.'),
  depth: z.string().min(1, 'Depth is required.'),
  bagSize: z.string().optional(),
  materialType: z.enum(['topsoil', 'mulch', 'compost', 'gravel']),
  soilAmendments: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Result {
    cubicFeet: number;
    cubicYards: number;
    bagsNeeded: number | null;
}

export function SoilCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [soilResult, setSoilResult] = useState<Result | null>(null);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      length: '',
      width: '',
      depth: '6',
      bagSize: '',
      materialType: 'topsoil',
      soilAmendments: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    let length = parseFloat(values.length);
    let width = parseFloat(values.width);
    let depth = parseFloat(values.depth);
    let bagSize = parseFloat(values.bagSize || '0');

    if (units === 'metric') {
        length = length * 3.28084; // m to ft
        width = width * 3.28084; // m to ft
        depth = depth / 2.54; // cm to in
        bagSize = bagSize / 28.317; // liters to cu ft
    }

    if (length > 0 && width > 0 && depth > 0) {
      const depthInFeet = depth / 12; // convert inches to feet
      const cubicFeet = length * width * depthInFeet;
      const cubicYards = cubicFeet / 27;
      const bagsNeeded = bagSize > 0 ? Math.ceil(cubicFeet / bagSize) : null;
      setSoilResult({cubicFeet, cubicYards, bagsNeeded});
    } else {
      setSoilResult(null);
    }
  };

  const handleClear = () => {
    form.reset();
    setSoilResult(null);
  };

  const handleDownload = () => {
    const values = form.getValues();
    if (!soilResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    
    const inputs = [
        { key: 'Material Type', value: values.materialType.charAt(0).toUpperCase() + values.materialType.slice(1) },
        { key: 'Bed Length', value: `${values.length} ${units === 'imperial' ? 'ft' : 'm'}` },
        { key: 'Bed Width', value: `${values.width} ${units === 'imperial' ? 'ft' : 'm'}` },
        { key: 'Material Depth', value: `${values.depth} ${units === 'imperial' ? 'in' : 'cm'}` },
    ];
    if (values.bagSize) {
        inputs.push({ key: 'Bag Size', value: `${values.bagSize} ${units === 'imperial' ? 'cu ft' : 'liters'}` });
    }
    if (values.soilAmendments) {
        inputs.push({ key: 'Soil Amendments', value: values.soilAmendments });
    }


    const cubicMeters = soilResult.cubicFeet / 35.315;
    const resultVol = units === 'imperial' 
      ? `${soilResult.cubicFeet.toFixed(2)} cu ft (${soilResult.cubicYards.toFixed(2)} cu yd)`
      : `${cubicMeters.toFixed(2)} cu m`;
    
    const results = [
        { key: 'Total Volume Needed', value: resultVol }
    ];
    if (soilResult.bagsNeeded) {
        results.push({ key: 'Estimated Bags Needed', value: `${soilResult.bagsNeeded} bags` });
    }
    results.push({key: 'Preparation Tip', value: 'Mix soil amendments (if any) with the top layer of existing soil before adding new material.'})


    generatePdf({
        title: calculator.name,
        slug: calculator.slug,
        inputs: inputs,
        results: results
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            Starting a new garden bed or topping up an old one? Calculate the volume of soil or mulch you'll need. Results are provided in cubic feet/yards for bulk delivery and in estimated bags for smaller jobs.
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
            <FormField control={form.control} name="materialType" render={({ field }) => (
                <FormItem>
                    <FormLabel>Material Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="topsoil">Topsoil</SelectItem>
                        <SelectItem value="mulch">Mulch</SelectItem>
                        <SelectItem value="compost">Compost</SelectItem>
                        <SelectItem value="gravel">Gravel / Rocks</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}/>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="length" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bed Length ({units === 'imperial' ? 'ft' : 'm'})</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="width" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bed Width ({units === 'imperial' ? 'ft' : 'm'})</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 4" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="depth" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Depth ({units === 'imperial' ? 'in' : 'cm'})</FormLabel><HelpInfo>Recommended depth for most vegetable gardens is 6-12 inches (15-30 cm). For mulch, 2-3 inches is typical.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 6" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="bagSize" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Bag Size ({units === 'imperial' ? 'cu ft' : 'liters'}) (Optional)</FormLabel><HelpInfo>Enter the volume of the bags you plan to buy to estimate the required quantity.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder={units === 'imperial' ? "e.g., 1.5" : "e.g., 50"} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="soilAmendments" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Soil Amendments (Optional)</FormLabel><HelpInfo>List any amendments you plan to add, like compost or fertilizer. This is for your records in the PDF download.</HelpInfo></div>
                        <FormControl><Input type="text" placeholder="e.g., Compost, Peat Moss" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate</Button>
              {soilResult && (
                <Button type="button" variant="destructive" onClick={handleClear}>
                  Clear<X className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
        {soilResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader>
                <CardTitle>Volume Needed</CardTitle>
                <CardDescription>The total amount of material required for your project dimensions.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-2xl font-bold">
                {units === 'imperial' ? `${soilResult.cubicFeet.toFixed(2)} cu ft` : `${(soilResult.cubicFeet / 35.315).toFixed(2)} cu m`}
                {units === 'imperial' && <span className="text-lg text-muted-foreground ml-2">({soilResult.cubicYards.toFixed(2)} cu yd)</span>}
                {soilResult.bagsNeeded && <span className="block text-base font-normal text-muted-foreground">Approx. {soilResult.bagsNeeded} bags</span>}
              </p>
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
