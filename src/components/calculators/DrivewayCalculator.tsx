
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpInfo } from '../layout/HelpInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { generatePdf } from '@/lib/pdfGenerator';
import Link from 'next/link';

const formSchema = z.object({
  length: z.string().min(1, 'Length is required.'),
  width: z.string().min(1, 'Width is required.'),
  thickness: z.string().min(1, 'Thickness is required.'),
  material: z.enum(['asphalt', 'concrete', 'pavers']),
});

type FormValues = z.infer<typeof formSchema>;

interface Result {
    baseVolume: number;
    materialAmount: string;
}

export function DrivewayCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [result, setResult] = useState<Result | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      length: '',
      width: '',
      thickness: '4',
      material: 'concrete',
    },
  });

  const onSubmit = (values: FormValues) => {
    const length = parseFloat(values.length);
    const width = parseFloat(values.width);
    const thickness = parseFloat(values.thickness);

    if (length <= 0 || width <= 0 || thickness <= 0) {
        toast({ title: 'Invalid Dimensions', description: 'Please enter positive values.', variant: 'destructive' });
        return;
    }

    const area = length * width;
    const baseDepth = 6 / 12; // 6 inches of gravel base
    const baseVolume = (area * baseDepth) / 27; // in cubic yards

    let materialAmount = '';
    
    switch (values.material) {
        case 'concrete':
            const concreteVolume = (area * (thickness / 12)) / 27; // cu yards
            materialAmount = `${concreteVolume.toFixed(2)} cubic yards of concrete`;
            break;
        case 'asphalt':
            const asphaltWeight = (area * (thickness / 12) * 145) / 2000; // tons
            materialAmount = `${asphaltWeight.toFixed(2)} tons of asphalt`;
            break;
        case 'pavers':
            // Assume standard 4x8 paver
            const paverArea = (4*8)/144;
            const paversNeeded = Math.ceil(area / paverArea * 1.05); // 5% waste
            materialAmount = `${paversNeeded} pavers (4"x8")`;
            break;
    }

    setResult({ baseVolume, materialAmount });
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
            { key: 'Driveway Length', value: `${values.length} ft` },
            { key: 'Driveway Width', value: `${values.width} ft` },
            { key: 'Material Type', value: values.material.charAt(0).toUpperCase() + values.material.slice(1) },
            { key: 'Material Thickness', value: `${values.thickness} in` },
        ],
        results: [
            { key: 'Gravel Base Needed', value: `${result.baseVolume.toFixed(2)} cubic yards` },
            { key: 'Top Material Needed', value: result.materialAmount },
        ]
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            Estimate the materials needed for your new driveway project, including the gravel base and the top material (concrete, asphalt, or pavers). See our <Link href="/resources/driveway-guide" className="text-primary underline">Driveway Guide</Link> for details.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="material" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Driveway Material</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="concrete">Concrete</SelectItem>
                          <SelectItem value="asphalt">Asphalt</SelectItem>
                          <SelectItem value="pavers">Pavers</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="length" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Driveway Length (ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="width" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Driveway Width (ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="thickness" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <div className="flex items-center gap-1.5"><FormLabel>Material Thickness (in)</FormLabel><HelpInfo>The depth of the top layer of material. 4 inches is common for concrete/asphalt.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 4" {...field} /></FormControl>
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
                 <CardDescription>Assumes a 6-inch gravel base.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="text-lg font-bold space-y-2">
                    <li>~{result.baseVolume.toFixed(2)} cubic yards of gravel base</li>
                    <li>{result.materialAmount}</li>
                </ul>
            </CardContent>
             <CardContent>
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
