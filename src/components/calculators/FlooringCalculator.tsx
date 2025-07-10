
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

const formSchema = z.object({
  roomWidth: z.string().min(1, 'Room width is required.'),
  roomLength: z.string().min(1, 'Room length is required.'),
  wasteFactor: z.string().min(1, 'Waste factor is required.'),
  boxCoverage: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Result {
    totalArea: number;
    boxesNeeded: number | null;
}

export function FlooringCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [flooringResult, setFlooringResult] = useState<Result | null>(null);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomWidth: '',
      roomLength: '',
      wasteFactor: '10', // 10% waste is standard
      boxCoverage: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    let width = parseFloat(values.roomWidth);
    let length = parseFloat(values.roomLength);
    const waste = parseFloat(values.wasteFactor);
    let coverage = parseFloat(values.boxCoverage || '0');

    if (units === 'metric') {
      width = width * 3.28084; // meters to feet
      length = length * 3.28084; // meters to feet
      coverage = coverage * 10.764; // sq meters to sq feet
    }

    if (width > 0 && length > 0 && waste >= 0) {
      const area = width * length; // area in sq ft
      const totalAreaImperial = area * (1 + (waste/100));
      
      const boxesNeeded = coverage > 0 ? Math.ceil(totalAreaImperial / coverage) : null;
      
      const totalAreaForDisplay = units === 'metric' ? totalAreaImperial / 10.764 : totalAreaImperial;

      setFlooringResult({ totalArea: totalAreaForDisplay, boxesNeeded });
    } else {
      setFlooringResult(null);
    }
  };
  
  const handleClear = () => {
    form.reset();
    setFlooringResult(null);
  };

  const handleDownload = () => {
    const values = form.getValues();
    if (!flooringResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const unitLabelArea = units === 'imperial' ? 'sq ft' : 'sq m';
    let content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Units: ${units}\n` +
      `Room Width: ${values.roomWidth} ${units === 'imperial' ? 'ft' : 'm'}\n` +
      `Room Length: ${values.roomLength} ${units === 'imperial' ? 'ft' : 'm'}\n` +
      `Waste Factor: ${values.wasteFactor}%\n`;

    if (values.boxCoverage) {
        content += `Coverage per Box: ${values.boxCoverage} ${unitLabelArea}\n`;
    }

    content += `\n--------------------\n` +
      `Total Flooring Needed: ${flooringResult.totalArea.toFixed(2)} ${unitLabelArea}\n`;
    
    if(flooringResult.boxesNeeded) {
        content += `Estimated Boxes to Buy: ${flooringResult.boxesNeeded} boxes\n`;
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
            Measure your room's width and length to find the total area. It is crucial to add a waste factor to account for cuts, mistakes, and board selection. See our <Link href="/resources/how-to-measure" className="text-primary underline">Measuring Guide</Link> for tips.
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
                <FormField control={form.control} name="roomWidth" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Room Width ({units === 'imperial' ? 'ft' : 'm'})</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="roomLength" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Room Length ({units === 'imperial' ? 'ft' : 'm'})</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 12" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="wasteFactor" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5">
                            <FormLabel>Waste Factor (%)</FormLabel>
                            <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent>
                                <p className="max-w-xs">Standard layouts: 10%. Complex rooms or diagonal/herringbone patterns: 15-20%.</p>
                            </TooltipContent></Tooltip></TooltipProvider>
                        </div>
                        <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
             <FormField control={form.control} name="boxCoverage" render={({ field }) => (
                <FormItem>
                    <div className="flex items-center gap-1.5">
                        <FormLabel>Box Coverage ({units === 'imperial' ? 'sq ft' : 'sq m'}) (Optional)</FormLabel>
                        <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Enter the area coverage listed on the flooring box to estimate how many you need to buy.</p></TooltipContent></Tooltip></TooltipProvider>
                    </div>
                    <FormControl><Input type="number" placeholder={units === 'imperial' ? "e.g., 22.5" : "e.g., 2.1"} {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate</Button>
              {flooringResult && (
                <Button type="button" variant="destructive" onClick={handleClear}>
                  Clear<X className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
        {flooringResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Total Flooring Required</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">
                {flooringResult.totalArea.toFixed(2)} {units === 'imperial' ? 'sq ft' : 'sq m'}
                {flooringResult.boxesNeeded && <span className="text-lg text-muted-foreground ml-2"> (~{flooringResult.boxesNeeded} boxes)</span>}
              </p>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
