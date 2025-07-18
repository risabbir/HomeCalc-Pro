
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

const formSchema = z.object({
  wattage: z.string().min(1, 'Wattage is required.'),
  hoursPerDay: z.string().min(1, 'Hours per day is required.'),
  costPerKwh: z.string().min(1, 'Cost per kWh is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function ApplianceEnergyCostCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [costResult, setCostResult] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wattage: '',
      hoursPerDay: '',
      costPerKwh: '0.17', // Average US cost as of 2024
    },
  });

  const onSubmit = (values: FormValues) => {
    const wattage = parseFloat(values.wattage);
    const hours = parseFloat(values.hoursPerDay);
    const cost = parseFloat(values.costPerKwh);

    if (!isNaN(wattage) && !isNaN(hours) && !isNaN(cost) && wattage > 0 && hours > 0 && cost > 0) {
      const dailyKwh = (wattage * hours) / 1000;
      const annualCost = dailyKwh * 365 * cost;
      setCostResult(`$${annualCost.toFixed(2)} per year`);
    } else {
      setCostResult(null);
    }
  };

  const handleClear = () => {
    form.reset({
      wattage: '',
      hoursPerDay: '',
      costPerKwh: '0.17',
    });
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
            { key: 'Appliance Wattage (W)', value: values.wattage },
            { key: 'Hours Used Per Day', value: values.hoursPerDay },
            { key: 'Cost per kWh ($)', value: values.costPerKwh },
        ],
        results: [
            { key: 'Estimated Annual Cost', value: costResult },
        ]
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            Calculate the annual energy cost of any electrical appliance. Find the appliance's wattage on its label, estimate its daily usage, and enter your local electricity rate (found on your utility bill) for the most accurate results.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="wattage" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5">
                            <FormLabel>Appliance Wattage (W)</FormLabel>
                            <HelpInfo>Check the label on the back or bottom of the appliance. If you see Amps and Volts, multiply them together to get Watts.</HelpInfo>
                        </div>
                        <FormControl><Input type="number" placeholder="e.g., 1500" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="hoursPerDay" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5">
                            <FormLabel>Hours Used Per Day</FormLabel>
                            <HelpInfo>Enter the average number of hours the appliance runs in a 24-hour period.</HelpInfo>
                        </div>
                        <FormControl><Input type="number" placeholder="e.g., 2" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="costPerKwh" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5">
                            <FormLabel>Cost per kWh ($)</FormLabel>
                            <HelpInfo>Found on your electricity bill, this is your rate per kilowatt-hour. The US average is about $0.17.</HelpInfo>
                        </div>
                        <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.17" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate Cost</Button>
              {costResult && (
                <Button type="button" variant="destructive" onClick={handleClear}>
                  <X className="mr-1 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </form>
        </Form>
        {costResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader>
                <CardTitle>Estimated Annual Cost</CardTitle>
                <CardDescription>This is the estimated cost to run this appliance for one year.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-3xl font-bold">{costResult}</p>
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
