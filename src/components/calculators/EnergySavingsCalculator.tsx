
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
import { HelpInfo } from '../layout/HelpInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { generatePdf } from '@/lib/pdfGenerator';

const formSchema = z.object({
  costPerKwh: z.string().min(1, 'Cost per kWh is required.'),
  current_wattage: z.string().min(1, 'Wattage is required.'),
  current_hours: z.string().min(1, 'Hours per day is required.'),
  new_wattage: z.string().min(1, 'Wattage is required.'),
  new_hours: z.string().min(1, 'Hours per day is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function EnergySavingsCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [savingsResult, setSavingsResult] = useState<{ annualSavings: number; currentCost: number; newCost: number } | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      costPerKwh: '0.17', // US average 2024
      current_wattage: '',
      current_hours: '',
      new_wattage: '',
      new_hours: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const costKwh = parseFloat(values.costPerKwh);
    const currentWatt = parseFloat(values.current_wattage);
    const currentHours = parseFloat(values.current_hours);
    const newWatt = parseFloat(values.new_wattage);
    const newHours = parseFloat(values.new_hours);

    const isValid = [costKwh, currentWatt, currentHours, newWatt, newHours].every(v => !isNaN(v) && v >= 0);

    if (isValid) {
      const annualHoursCurrent = currentHours * 365;
      const annualHoursNew = newHours * 365;

      const currentCost = (currentWatt / 1000) * annualHoursCurrent * costKwh;
      const newCost = (newWatt / 1000) * annualHoursNew * costKwh;
      const savings = currentCost - newCost;

      setSavingsResult({
        annualSavings: savings,
        currentCost: currentCost,
        newCost: newCost,
      });
    } else {
      setSavingsResult(null);
    }
  };

  const handleClear = () => {
    form.reset();
    setSavingsResult(null);
  };

  const handleDownload = () => {
    const values = form.getValues();
    if (!savingsResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }

    generatePdf({
        title: calculator.name,
        slug: calculator.slug,
        inputs: [
            { key: 'Electricity Cost', value: `$${values.costPerKwh}/kWh` },
            { key: 'Current Appliance Wattage', value: `${values.current_wattage} W` },
            { key: 'Current Usage', value: `${values.current_hours} hrs/day` },
            { key: 'New Appliance Wattage', value: `${values.new_wattage} W` },
            { key: 'New Usage', value: `${values.new_hours} hrs/day` },
        ],
        results: [
            { key: 'Estimated Annual Savings', value: `$${savingsResult.annualSavings.toFixed(2)}` },
            { key: 'Old Appliance Annual Cost', value: `$${savingsResult.currentCost.toFixed(2)}` },
            { key: 'New Appliance Annual Cost', value: `$${savingsResult.newCost.toFixed(2)}` },
        ]
    });
  };
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            Compare two appliances to see the potential savings from an energy-efficient upgrade. For example, compare your old incandescent light bulbs to new LEDs, or an old refrigerator to a new Energy Star model.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className='text-center'>
                <FormField control={form.control} name="costPerKwh" render={({ field }) => (
                    <FormItem className="max-w-xs mx-auto">
                        <div className="flex items-center justify-center gap-1.5">
                            <FormLabel>Your Electricity Cost per kWh ($)</FormLabel>
                            <HelpInfo>Found on your electricity bill. The US average is about $0.17.</HelpInfo>
                        </div>
                        <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.17" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className='space-y-4 p-4 rounded-lg border'>
                    <h3 className='text-lg font-semibold text-center'>Current Appliance</h3>
                    <FormField control={form.control} name="current_wattage" render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-1.5"><FormLabel>Appliance Wattage (W)</FormLabel><HelpInfo>Check the label on the appliance. An old refrigerator might use 700 watts.</HelpInfo></div>
                            <FormControl><Input type="number" placeholder="e.g., 700" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="current_hours" render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-1.5"><FormLabel>Hours Used Per Day</FormLabel><HelpInfo>A refrigerator runs about 8 hours a day. A light bulb might run for 5.</HelpInfo></div>
                            <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
                 <div className='space-y-4 p-4 rounded-lg border'>
                    <h3 className='text-lg font-semibold text-center'>New Appliance</h3>
                    <FormField control={form.control} name="new_wattage" render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-1.5"><FormLabel>Appliance Wattage (W)</FormLabel><HelpInfo>Check the label on the new appliance. An Energy Star refrigerator might use 200 watts.</HelpInfo></div>
                            <FormControl><Input type="number" placeholder="e.g., 200" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="new_hours" render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-1.5"><FormLabel>Hours Used Per Day</FormLabel><HelpInfo>Usage hours will likely be the same for the new appliance.</HelpInfo></div>
                            <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button type="submit">Calculate Savings</Button>
              {savingsResult && (
                <Button type="button" variant="destructive" onClick={handleClear}>
                  Clear<X className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
        {savingsResult && (
          <Card className="mt-6">
            <CardHeader>
                <CardTitle>Your Estimated Savings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <Card className="bg-accent/50 p-4">
                        <p className="text-sm text-muted-foreground">Current Annual Cost</p>
                        <p className="text-2xl font-bold">${savingsResult.currentCost.toFixed(2)}</p>
                    </Card>
                    <Card className="bg-accent/50 p-4">
                        <p className="text-sm text-muted-foreground">New Annual Cost</p>
                        <p className="text-2xl font-bold">${savingsResult.newCost.toFixed(2)}</p>
                    </Card>
                    <Card className="bg-primary/10 text-primary p-4 border-primary/20 border">
                        <p className="text-sm">Potential Annual Savings</p>
                        <p className="text-2xl font-bold">${savingsResult.annualSavings.toFixed(2)}</p>
                    </Card>
                </div>
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
