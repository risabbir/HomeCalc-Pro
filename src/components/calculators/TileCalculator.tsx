
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
  areaToTile: z.string().min(1, 'Area is required.'),
  tileWidth: z.string().min(1, 'Tile width is required.'),
  tileLength: z.string().min(1, 'Tile length is required.'),
  wasteFactor: z.string().min(1, 'Waste factor is required.'),
  groutWidth: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Result {
    tilesNeeded: number;
    totalArea: number;
}

export function TileCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [result, setResult] = useState<Result | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      areaToTile: '',
      tileWidth: '12',
      tileLength: '12',
      wasteFactor: '10',
      groutWidth: '0.125',
    },
  });

  const onSubmit = (values: FormValues) => {
    const area = parseFloat(values.areaToTile) * 144; // to sq inches
    const tileW = parseFloat(values.tileWidth);
    const tileL = parseFloat(values.tileLength);
    const grout = parseFloat(values.groutWidth || '0');
    const waste = parseFloat(values.wasteFactor) / 100;

    if (area <= 0 || tileW <= 0 || tileL <= 0) {
        toast({ title: 'Invalid dimensions', description: 'Please enter positive values.', variant: 'destructive' });
        return;
    }

    const singleTileArea = (tileW + grout) * (tileL + grout);
    const tilesNeededRaw = area / singleTileArea;
    const tilesNeeded = Math.ceil(tilesNeededRaw * (1 + waste));
    const totalArea = (tilesNeeded * tileW * tileL) / 144;

    setResult({ tilesNeeded, totalArea });
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
    
    generatePdf({
        title: calculator.name,
        slug: calculator.slug,
        inputs: [
            { key: 'Area to Tile', value: `${values.areaToTile} sq ft` },
            { key: 'Tile Size (W x L)', value: `${values.tileWidth}" x ${values.tileLength}"` },
            { key: 'Grout Line Width', value: `${values.groutWidth || '0'}"` },
            { key: 'Waste Factor', value: `${values.wasteFactor}%` },
        ],
        results: [
            { key: 'Tiles Needed', value: `${result.tilesNeeded} tiles` },
            { key: 'Total Material Required', value: `${result.totalArea.toFixed(2)} sq ft (includes waste)` },
        ]
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
          Calculate the number of tiles needed for a floor, wall, or backsplash. Enter the total area to be tiled and the size of a single tile. Don't forget a waste factor for cuts and mistakes. Explore our <Link href="/resources/tile-installation-guide" className="text-primary underline">Tile Guide</Link> for more tips.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="areaToTile" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Area to Tile (sq ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 100" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="tileWidth" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Single Tile Width (in)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 12" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="tileLength" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Single Tile Length (in)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 12" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="groutWidth" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Grout Line Width (in)</FormLabel><HelpInfo>The space between tiles. 1/8" (0.125) is common for floors.</HelpInfo></div>
                        <FormControl><Input type="number" step="0.0625" placeholder="e.g., 0.125" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="wasteFactor" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Waste Factor (%)</FormLabel><HelpInfo>10% for simple layouts, 15-20% for diagonal or complex patterns.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate Tiles</Button>
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
                <CardTitle>Estimated Materials Needed</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-2xl font-bold">~{result.tilesNeeded} tiles</p>
                <p className="text-muted-foreground">{result.totalArea.toFixed(2)} sq ft of material (including waste)</p>
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
