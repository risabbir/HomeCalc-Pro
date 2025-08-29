
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
import { HelpInfo } from '../layout/HelpInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { generatePdf } from '@/lib/pdfGenerator';
import Link from 'next/link';

const formSchema = z.object({
  roofArea: z.string().min(1, 'Roof area is required.'),
  roofPitch: z.string().min(1, 'Roof pitch is required.'),
  wasteFactor: z.string().min(1, 'Waste factor is required.'),
  materialCost: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PITCH_MULTIPLIER = {
    '1/12': 1.003, '2/12': 1.014, '3/12': 1.031, '4/12': 1.054,
    '5/12': 1.083, '6/12': 1.118, '7/12': 1.158, '8/12': 1.202,
    '9/12': 1.250, '10/12': 1.302, '11/12': 1.357, '12/12': 1.414,
};

interface Result {
    squares: number;
    bundles: number;
    totalCost: string | null;
}

export function RoofingCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [result, setResult] = useState<Result | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roofArea: '',
      roofPitch: '6/12',
      wasteFactor: '15',
      materialCost: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const area = parseFloat(values.roofArea);
    const pitch = values.roofPitch as keyof typeof PITCH_MULTIPLIER;
    const waste = parseFloat(values.wasteFactor) / 100;
    const costPerSquare = parseFloat(values.materialCost || '0');

    if (area <= 0) {
        toast({ title: 'Invalid Area', description: 'Please enter a positive value for roof area.', variant: 'destructive' });
        return;
    }

    const actualRoofArea = area * PITCH_MULTIPLIER[pitch];
    const totalAreaWithWaste = actualRoofArea * (1 + waste);
    
    // 1 square = 100 sq ft
    const squares = totalAreaWithWaste / 100;
    // 3 bundles per square is standard for asphalt shingles
    const bundles = Math.ceil(squares * 3);

    const totalCost = costPerSquare > 0 ? (squares * costPerSquare).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : null;

    setResult({ squares, bundles, totalCost });
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
    
    const results = [
        { key: 'Roofing Squares Needed', value: `${result.squares.toFixed(2)} squares` },
        { key: 'Shingle Bundles Needed', value: `~${result.bundles} bundles` },
    ];

    if (result.totalCost) {
        results.push({ key: 'Estimated Material Cost', value: result.totalCost });
    }

    generatePdf({
        title: calculator.name,
        slug: calculator.slug,
        inputs: [
            { key: 'Ground-Level Area', value: `${values.roofArea} sq ft` },
            { key: 'Roof Pitch', value: `${values.roofPitch}` },
            { key: 'Waste Factor', value: `${values.wasteFactor}%` },
            ...(values.materialCost ? [{ key: 'Cost per Square', value: `$${values.materialCost}` }] : []),
        ],
        results: results,
        disclaimer: 'Estimate is for standard asphalt shingles (3 bundles/square). Does not include underlayment, flashing, or other accessories.'
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
          Estimate the materials for your roofing project. Enter the ground-level area your roof covers and its pitch to get the number of "squares" (100 sq ft sections) and shingle bundles needed. For more details, check our <Link href="/resources/roofing-guide" className="text-primary underline">Roofing Guide</Link>.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="roofArea" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Roof Area (sq ft)</FormLabel><HelpInfo>The ground-level square footage that the roof covers, not the actual surface area.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 1500" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="roofPitch" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5"><FormLabel>Roof Pitch</FormLabel><HelpInfo>The steepness of the roof. Format is Rise/Run (e.g., 6/12 means 6" of vertical rise for every 12" of horizontal run).</HelpInfo></div>
                         <FormControl>
                            <select {...field} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                                {Object.keys(PITCH_MULTIPLIER).map(pitch => <option key={pitch} value={pitch}>{pitch}</option>)}
                            </select>
                         </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="wasteFactor" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Waste Factor (%)</FormLabel><HelpInfo>Accounts for cuts, especially on complex roofs with hips and valleys. 10-15% is standard.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 15" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="materialCost" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Cost per Square ($) (Optional)</FormLabel><HelpInfo>Enter the cost per "square" (100 sq ft) of your chosen material for a cost estimate.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 120" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate Materials</Button>
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
                <CardTitle>Estimated Materials</CardTitle>
                <CardDescription>Includes waste factor.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-lg font-bold">~{result.squares.toFixed(2)} squares</p>
                <p className="text-lg font-bold">~{result.bundles} bundles (shingles)</p>
                {result.totalCost && <p className="text-lg font-bold mt-2">Est. Material Cost: {result.totalCost}</p>}
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
