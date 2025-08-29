
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
  wallArea: z.string().min(1, 'Wall area is required.'),
  ceilingArea: z.string().optional(),
  sheetSize: z.enum(['4x8', '4x12']),
});

type FormValues = z.infer<typeof formSchema>;

interface Result {
    sheets: number;
    screws: number;
    compound: number;
}

export function DrywallCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [result, setResult] = useState<Result | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wallArea: '',
      ceilingArea: '0',
      sheetSize: '4x8',
    },
  });

  const onSubmit = (values: FormValues) => {
    const walls = parseFloat(values.wallArea);
    const ceiling = parseFloat(values.ceilingArea || '0');

    if (walls < 0 || ceiling < 0) {
        toast({ title: 'Invalid Area', description: 'Please enter non-negative values.', variant: 'destructive' });
        return;
    }
    
    const totalArea = (walls + ceiling) * 1.1; // Add 10% for waste
    const sheetArea = values.sheetSize === '4x8' ? 32 : 48;

    const sheets = Math.ceil(totalArea / sheetArea);
    // Approx. 1 lb of screws per 300 sq ft
    const screws = Math.ceil(totalArea / 300);
    // Approx. 1 (4.5 gal) bucket of compound per 450 sq ft
    const compound = Math.ceil(totalArea / 450);

    setResult({ sheets, screws, compound });
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
            { key: 'Total Wall Area', value: `${values.wallArea} sq ft` },
            { key: 'Ceiling Area', value: `${values.ceilingArea || '0'} sq ft` },
            { key: 'Drywall Sheet Size', value: `${values.sheetSize} ft` },
        ],
        results: [
            { key: 'Drywall Sheets Needed', value: `~${result.sheets} sheets (includes 10% waste)` },
            { key: 'Drywall Screws Needed', value: `~${result.screws} lbs` },
            { key: 'Joint Compound Needed', value: `~${result.compound} buckets (4.5 gal)` },
        ]
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            Estimate all the materials for your drywall project. Enter the total square footage of your walls and ceiling to get an estimate for sheets, screws, and joint compound. See our <Link href="/resources/drywall-guide" className="text-primary underline">Drywall Guide</Link> for installation tips.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="wallArea" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Wall Area (sq ft)</FormLabel><HelpInfo>The total square footage of all walls to be drywalled. (Length x Height for each wall, then add them up). Do not subtract for doors/windows.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 400" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="ceilingArea" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Ceiling Area (sq ft) (Optional)</FormLabel><HelpInfo>The total square footage of the ceiling. Enter 0 if not drywalling the ceiling.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 150" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="sheetSize" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Drywall Sheet Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="4x8">4 ft x 8 ft</SelectItem>
                          <SelectItem value="4x12">4 ft x 12 ft</SelectItem>
                        </SelectContent>
                      </Select>
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
                 <CardDescription>Includes a 10% waste factor.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="text-lg font-bold space-y-2">
                    <li>~{result.sheets} sheets of drywall</li>
                    <li>~{result.screws} lbs of screws</li>
                    <li>~{result.compound} buckets of joint compound (4.5 gal)</li>
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
