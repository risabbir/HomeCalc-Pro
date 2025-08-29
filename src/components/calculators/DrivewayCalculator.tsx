
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Calculator } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
  baseDepth: z.string().min(1, 'Base depth is required'),
  materialCost: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Result {
    baseVolume: number;
    materialAmount: string;
    totalCost: string | null;
}

export function DrivewayCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [result, setResult] = useState<Result | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      length: '50',
      width: '10',
      thickness: '4',
      material: 'concrete',
      baseDepth: '6',
      materialCost: ''
    },
  });

  const onSubmit = (values: FormValues) => {
    const length = parseFloat(values.length);
    const width = parseFloat(values.width);
    const thickness = parseFloat(values.thickness);
    const baseDepth = parseFloat(values.baseDepth) / 12;
    const cost = parseFloat(values.materialCost || '0');

    if (length <= 0 || width <= 0 || thickness <= 0) {
        toast({ title: 'Invalid Dimensions', description: 'Please enter positive values.', variant: 'destructive' });
        return;
    }

    const area = length * width;
    const baseVolume = (area * baseDepth) / 27; // in cubic yards

    let materialAmount = '';
    let totalCost = null;
    let materialVolume = 0;
    
    switch (values.material) {
        case 'concrete':
            materialVolume = (area * (thickness / 12)) / 27; // cu yards
            materialAmount = `${materialVolume.toFixed(2)} cubic yards of concrete`;
            if(cost > 0) totalCost = (baseVolume * 40 + materialVolume * cost).toLocaleString('en-US', { style: 'currency', currency: 'USD' }); // gravel ~$40/yd
            break;
        case 'asphalt':
            materialVolume = (area * (thickness / 12) * 145) / 2000; // tons
            materialAmount = `${materialVolume.toFixed(2)} tons of asphalt`;
            if(cost > 0) totalCost = (baseVolume * 40 + materialVolume * cost).toLocaleString('en-US', { style: 'currency', currency: 'USD' }); // asphalt ~$150/ton
            break;
        case 'pavers':
            materialVolume = Math.ceil(area * 1.05); // # of pavers (assuming 1 sq ft per paver for simplicity of cost)
            const paversNeeded = Math.ceil(area / ((8*4)/144) * 1.05); // 5% waste
            materialAmount = `${paversNeeded} pavers (4"x8")`;
            if(cost > 0) totalCost = (baseVolume * 40 + materialVolume * cost).toLocaleString('en-US', { style: 'currency', currency: 'USD' }); // pavers ~$5/sqft
            break;
    }

    setResult({ baseVolume, materialAmount, totalCost });
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
    
    const pdfResults = [
        { key: 'Gravel Base Needed', value: `${result.baseVolume.toFixed(2)} cubic yards` },
        { key: 'Top Material Needed', value: result.materialAmount },
    ];

    if (result.totalCost) {
        pdfResults.push({key: 'Estimated Material Cost', value: result.totalCost});
    }

    generatePdf({
        title: calculator.name,
        slug: calculator.slug,
        inputs: [
            { key: 'Driveway Length', value: `${values.length} ft` },
            { key: 'Driveway Width', value: `${values.width} ft` },
            { key: 'Material Type', value: values.material.charAt(0).toUpperCase() + values.material.slice(1) },
            { key: 'Material Thickness', value: `${values.thickness} in` },
            { key: 'Gravel Base Depth', value: `${values.baseDepth} in` },
            { key: 'Material Cost per unit', value: `$${values.materialCost || '0'}` },
        ],
        results: pdfResults,
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            Estimate the materials needed for your new driveway project, including the crucial gravel base and the top material (concrete, asphalt, or pavers). See our <Link href="/resources/driveway-guide" className="text-primary underline">Driveway Guide</Link> for details on material pros and cons.
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
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Material Thickness (in)</FormLabel><HelpInfo>The depth of the top layer of material. 4 inches is common for concrete/asphalt.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 4" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="baseDepth" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Gravel Base Depth (in)</FormLabel><HelpInfo>The depth of the compacted gravel base. 4-8 inches is standard, with deeper bases for colder climates or heavy vehicle traffic.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 6" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="materialCost" render={({ field }) => (
                    <FormItem className='md:col-span-2'>
                        <div className="flex items-center gap-1.5"><FormLabel>Material Cost (Optional)</FormLabel><HelpInfo>Enter cost per cubic yard (Concrete), per ton (Asphalt), or per sq. ft. (Pavers) for a cost estimate.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 150" {...field} /></FormControl>
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
                 <CardDescription>Includes materials for the base and top layer.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="text-lg font-bold space-y-2">
                    <li>~{result.baseVolume.toFixed(2)} cubic yards of gravel base</li>
                    <li>{result.materialAmount}</li>
                     {result.totalCost && <li className="text-primary pt-2">Est. Material Cost: {result.totalCost}</li>}
                </ul>
            </CardContent>
             <CardFooter>
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
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
