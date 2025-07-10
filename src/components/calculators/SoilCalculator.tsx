
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
import { Download, X, HelpCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const formSchema = z.object({
  length: z.string().min(1, 'Length is required.'),
  width: z.string().min(1, 'Width is required.'),
  depth: z.string().min(1, 'Depth is required.'),
  bagSize: z.string().optional(),
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
      bagSize: ''
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
    let content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Bed Length: ${values.length} ${units === 'imperial' ? 'ft' : 'm'}\n` +
      `Bed Width: ${values.width} ${units === 'imperial' ? 'ft' : 'm'}\n` +
      `Soil Depth: ${values.depth} ${units === 'imperial' ? 'in' : 'cm'}\n`;

    if (values.bagSize) {
        content += `Bag Size: ${values.bagSize} ${units === 'imperial' ? 'cu ft' : 'liters'}\n`;
    }
    
    const cubicMeters = soilResult.cubicFeet / 35.315;
    const resultVol = units === 'imperial' 
      ? `${soilResult.cubicFeet.toFixed(2)} cu ft (${soilResult.cubicYards.toFixed(2)} cu yd)`
      : `${cubicMeters.toFixed(2)} cu m`;

    content += `\n--------------------\n` +
      `Total Soil Needed: ${resultVol}\n`;

    if (soilResult.bagsNeeded) {
        content += `Estimated Bags Needed: ${soilResult.bagsNeeded} bags\n`;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${calculator.slug}-results.txt`;
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            Starting a new garden bed or topping up an old one? Calculate the volume of soil you'll need. Results are provided in cubic feet/yards for bulk delivery and in estimated bags for smaller jobs.
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
                        <div className="flex items-center gap-1.5"><FormLabel>Soil Depth ({units === 'imperial' ? 'in' : 'cm'})</FormLabel><Popover><PopoverTrigger asChild><Button variant="ghost" size="icon" className="h-5 w-5 rounded-full" type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></Button></PopoverTrigger><PopoverContent><p>Recommended depth for most vegetable gardens is 6-12 inches (15-30 cm).</p></PopoverContent></Popover></div>
                        <FormControl><Input type="number" placeholder="e.g., 6" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>

            <FormField control={form.control} name="bagSize" render={({ field }) => (
                <FormItem>
                    <div className="flex items-center gap-1.5"><FormLabel>Bag Size ({units === 'imperial' ? 'cu ft' : 'liters'}) (Optional)</FormLabel><Popover><PopoverTrigger asChild><Button variant="ghost" size="icon" className="h-5 w-5 rounded-full" type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></Button></PopoverTrigger><PopoverContent><p>Enter the volume of the bags you plan to buy to estimate the required quantity.</p></PopoverContent></Popover></div>
                    <FormControl><Input type="number" placeholder={units === 'imperial' ? "e.g., 1.5" : "e.g., 50"} {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>

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
            <CardHeader><CardTitle>Soil Volume Needed</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">
                {units === 'imperial' ? `${soilResult.cubicFeet.toFixed(2)} cu ft` : `${(soilResult.cubicFeet / 35.315).toFixed(2)} cu m`}
                {units === 'imperial' && <span className="text-lg text-muted-foreground ml-2">({soilResult.cubicYards.toFixed(2)} cu yd)</span>}
                {soilResult.bagsNeeded && <span className="block text-base font-normal text-muted-foreground">Approx. {soilResult.bagsNeeded} bags</span>}
              </p>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
