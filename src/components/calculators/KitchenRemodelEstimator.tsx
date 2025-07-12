
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { HelpInfo } from '../layout/HelpInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { generatePdf } from '@/lib/pdfGenerator';

const formSchema = z.object({
  kitchenSize: z.string().min(1, 'Kitchen size is required.'),
  cabinets: z.enum(['stock', 'semi-custom', 'custom']),
  countertops: z.enum(['laminate', 'solid-surface', 'granite-quartz']),
  appliances: z.enum(['basic', 'mid-range', 'high-end']),
});

type FormValues = z.infer<typeof formSchema>;

const COST_FACTORS = {
    cabinets: { stock: 50, 'semi-custom': 125, custom: 250 },
    countertops: { laminate: 20, 'solid-surface': 50, 'granite-quartz': 100 },
    appliances: { basic: 20, 'mid-range': 50, 'high-end': 100 },
    base: 50, // Base cost for labor, plumbing, electrical, flooring, etc. per sqft
};

export function KitchenRemodelEstimator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [costResult, setCostResult] = useState<string | null>(null);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kitchenSize: '',
      cabinets: 'semi-custom',
      countertops: 'granite-quartz',
      appliances: 'mid-range',
    },
  });

  const onSubmit = (values: FormValues) => {
    let size = parseFloat(values.kitchenSize);

    if (units === 'metric') {
        size = size * 10.764; // sq m to sq ft
    }
    
    if (size > 0 && values.cabinets && values.countertops && values.appliances) {
      const costPerSqFt = COST_FACTORS.base +
          COST_FACTORS.cabinets[values.cabinets] +
          COST_FACTORS.countertops[values.countertops] +
          COST_FACTORS.appliances[values.appliances];
          
      const estimatedCost = size * costPerSqFt;
      const minCost = estimatedCost * 0.8;
      const maxCost = estimatedCost * 1.2;
      setCostResult(`$${minCost.toLocaleString(undefined, {maximumFractionDigits: 0})} - $${maxCost.toLocaleString(undefined, {maximumFractionDigits: 0})}`);
    } else {
      setCostResult(null);
    }
  };

  const handleClear = () => {
    form.reset();
    setCostResult(null);
  };

  const handleDownload = () => {
    const values = form.getValues();
    if (!costResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    
    generatePdf({
        title: calculator.name,
        slug: calculator.slug,
        inputs: [
            { key: 'Kitchen Size', value: `${values.kitchenSize} ${units === 'imperial' ? 'sq ft' : 'sq m'}` },
            { key: 'Cabinet Quality', value: values.cabinets },
            { key: 'Countertop Material', value: values.countertops },
            { key: 'Appliance Tier', value: values.appliances },
        ],
        results: [
            { key: 'Estimated Cost Range', value: costResult },
        ],
        disclaimer: 'This is a rough estimate for budget planning only and does not include structural changes, moving plumbing/gas lines, or high-end finishes. Always get multiple quotes from qualified contractors.'
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            Budget for your dream kitchen. Select your kitchen's size and the quality level for major components to get a cost estimate. This is for budget planning only and is not a formal quote. Check our <Link href="/resources/kitchen-layout-guide" className="text-primary underline">Layout Guide</Link> to get started.
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
                <FormField control={form.control} name="kitchenSize" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Kitchen Size ({units === 'imperial' ? 'sq ft' : 'sq m'})</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 200" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="cabinets" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5">
                            <FormLabel>Cabinet Quality</FormLabel>
                            <HelpInfo>Stock: Off-the-shelf. Semi-custom: Some modifications. Custom: Built to order.</HelpInfo>
                        </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="stock">Stock</SelectItem>
                          <SelectItem value="semi-custom">Semi-Custom</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="countertops" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5">
                            <FormLabel>Countertop Material</FormLabel>
                             <HelpInfo>Laminate: Most affordable. Solid Surface: Mid-range. Granite/Quartz: Premium.</HelpInfo>
                        </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="laminate">Laminate</SelectItem>
                          <SelectItem value="solid-surface">Solid Surface</SelectItem>
                          <SelectItem value="granite-quartz">Granite / Quartz</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="appliances" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <div className="flex items-center gap-1.5">
                            <FormLabel>Appliance Tier</FormLabel>
                            <HelpInfo>Basic: Standard models. Mid-range: Better features and brands. High-end: Luxury and professional-grade appliances.</HelpInfo>
                        </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="mid-range">Mid-Range</SelectItem>
                          <SelectItem value="high-end">High-End</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )}/>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Estimate Cost</Button>
              {costResult && (
                <Button type="button" variant="destructive" onClick={handleClear}>
                  Clear<X className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
        {costResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Estimated Remodel Cost</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">{costResult}</p>
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
