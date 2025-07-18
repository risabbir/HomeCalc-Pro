
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
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { HelpInfo } from '../layout/HelpInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { generatePdf } from '@/lib/pdfGenerator';

const formSchema = z.object({
  roomLength: z.string().min(1, 'Room length is required.'),
  roomWidth: z.string().min(1, 'Room width is required.'),
  wallHeight: z.string().min(1, 'Wall height is required.'),
  coats: z.string().min(1, 'Number of coats is required.'),
  numWindows: z.string().optional(),
  numDoors: z.string().optional(),
  includeCeiling: z.boolean().optional(),
});
type FormValues = z.infer<typeof formSchema>;

export function HomeImprovementCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [paintResult, setPaintResult] = useState<string | null>(null);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
        roomLength: '',
        roomWidth: '',
        wallHeight: '8',
        coats: '2',
        numWindows: '0',
        numDoors: '0',
        includeCeiling: false,
    },
  });

  const onSubmit = (values: FormValues) => {
    let length = parseFloat(values.roomLength);
    let width = parseFloat(values.roomWidth);
    let height = parseFloat(values.wallHeight);
    const coats = parseInt(values.coats, 10);
    const windows = parseInt(values.numWindows || '0', 10);
    const doors = parseInt(values.numDoors || '0', 10);

    const GALLONS_PER_SQFT = 350;
    const LITERS_PER_SQ_METER = 9.8; // Approx. coverage for metric

    if (units === 'metric') {
        length = length * 3.28084; // m to ft for underlying logic
        width = width * 3.28084; // m to ft
        height = height * 3.28084; // m to ft
    }

    if (length > 0 && width > 0 && height > 0 && coats > 0) {
      const wallArea = 2 * (length + width) * height;
      const areaToSubtract = (windows * 15) + (doors * 21); // Standard imperial area for windows and doors
      let paintableArea = wallArea - areaToSubtract;

      if(values.includeCeiling) {
        const ceilingArea = length * width;
        paintableArea += ceilingArea;
      }
      
      if (units === 'imperial') {
          const gallonsNeeded = (paintableArea * coats) / GALLONS_PER_SQFT;
          setPaintResult(`${gallonsNeeded.toFixed(2)} gallons`);
      } else {
          const paintableAreaMetric = paintableArea / 10.764; // sq ft to sq m
          const litersNeeded = (paintableAreaMetric * coats) / LITERS_PER_SQ_METER;
          setPaintResult(`${litersNeeded.toFixed(2)} liters`);
      }

    } else {
      setPaintResult(null);
    }
  };

  const handleClear = () => {
    form.reset();
    setPaintResult(null);
  };

  const handleDownload = () => {
    const values = form.getValues();
    if (!paintResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }

    generatePdf({
        title: calculator.name,
        slug: calculator.slug,
        inputs: [
            { key: 'Room Length', value: `${values.roomLength} ${units === 'imperial' ? 'ft' : 'm'}` },
            { key: 'Room Width', value: `${values.roomWidth} ${units === 'imperial' ? 'ft' : 'm'}` },
            { key: 'Wall Height', value: `${values.wallHeight} ${units === 'imperial' ? 'ft' : 'm'}` },
            { key: '# of Doors', value: values.numDoors || '0' },
            { key: '# of Windows', value: values.numWindows || '0' },
            { key: 'Coats of Paint', value: values.coats },
            { key: 'Paint Ceiling?', value: values.includeCeiling ? 'Yes' : 'No' },
        ],
        results: [
            { key: 'Total Paint Needed', value: paintResult },
        ]
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            Figure out exactly how much paint you'll need for your next project. Enter your room's dimensions and the number of coats you plan to apply. We'll automatically subtract standard-sized areas for doors and windows. Need help measuring? Check our <Link href="/resources/how-to-measure" className="text-primary underline">handy guide</Link>.
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
              <FormField control={form.control} name="roomLength" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Length ({units === 'imperial' ? 'ft' : 'm'})</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 12" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
              <FormField control={form.control} name="roomWidth" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Width ({units === 'imperial' ? 'ft' : 'm'})</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
              <FormField control={form.control} name="wallHeight" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wall Height ({units === 'imperial' ? 'ft' : 'm'})</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
            </div>
             <div className="space-y-2">
                <h4 className="font-medium">Details &amp; Coats</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-md border p-4">
                    <FormField control={form.control} name="numDoors" render={({ field }) => (
                        <FormItem>
                             <div className="flex items-center gap-1.5"><FormLabel># of Doors</FormLabel><HelpInfo>We subtract 21 sq ft (2 sq m) per door.</HelpInfo></div>
                            <FormControl><Input type="number" placeholder="e.g., 1" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="numWindows" render={({ field }) => (
                        <FormItem>
                             <div className="flex items-center gap-1.5"><FormLabel># of Windows</FormLabel><HelpInfo>We subtract 15 sq ft (1.4 sq m) per window.</HelpInfo></div>
                            <FormControl><Input type="number" placeholder="e.g., 2" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="coats" render={({ field }) => (
                        <FormItem>
                             <div className="flex items-center gap-1.5"><FormLabel>Coats of Paint</FormLabel><HelpInfo>Two coats are recommended for best coverage, especially when changing colors.</HelpInfo></div>
                            <FormControl><Input type="number" placeholder="e.g., 2" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
                 <div className="pt-2">
                    <FormField
                        control={form.control}
                        name="includeCeiling"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                Also paint the ceiling?
                                </FormLabel>
                                <FormDescription>
                                Check this box to include the ceiling area in the calculation.
                                </FormDescription>
                            </div>
                            </FormItem>
                        )}
                        />
                </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate</Button>
              {paintResult && (
                <Button type="button" variant="destructive" onClick={handleClear}>
                  Clear<X className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
        {paintResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader>
                <CardTitle>Paint Estimation</CardTitle>
                <CardDescription>The total amount of paint required for your project.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-2xl font-bold">{paintResult}</p>
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
