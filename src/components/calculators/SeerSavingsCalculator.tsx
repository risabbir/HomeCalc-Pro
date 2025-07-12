
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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { HelpInfo } from '../layout/HelpInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { generatePdf } from '@/lib/pdfGenerator';

const formSchema = z.object({
  oldSeer: z.string().min(1, 'Old SEER rating is required.'),
  newSeer: z.string().min(1, 'New SEER rating is required.'),
  coolingBtu: z.string().min(1, 'Cooling capacity is required.'),
  hoursPerDay: z.string().min(1, 'Hours per day is required.'),
  daysPerYear: z.string().min(1, 'Days per year is required.'),
  costPerKwh: z.string().min(1, 'Cost per kWh is required.'),
  unitCost: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const chartConfig = {
  savings: {
    label: "Cumulative Savings",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function SeerSavingsCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [savingsResult, setSavingsResult] = useState<{ annualSavings: number; paybackPeriod: string | null; oldCost: number; newCost: number; } | null>(null);
  const [chartData, setChartData] = useState<{ year: number; savings: number; }[]>([]);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldSeer: '10',
      newSeer: '16',
      coolingBtu: '36000',
      hoursPerDay: '8',
      daysPerYear: '120',
      costPerKwh: '0.17',
      unitCost: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const oldSeer = parseFloat(values.oldSeer);
    const newSeer = parseFloat(values.newSeer);
    const coolingBtu = parseFloat(values.coolingBtu);
    const hoursPerDay = parseFloat(values.hoursPerDay);
    const daysPerYear = parseFloat(values.daysPerYear);
    const costPerKwh = parseFloat(values.costPerKwh);
    const newUnitCost = parseFloat(values.unitCost || '0');

    if (oldSeer > 0 && newSeer > 0 && coolingBtu > 0 && hoursPerDay > 0 && daysPerYear > 0 && costPerKwh > 0) {
      const btuToKwH = 1000;
      const totalHours = hoursPerDay * daysPerYear;
      
      const oldConsumptionKwh = (coolingBtu / oldSeer) * totalHours / btuToKwH;
      const newConsumptionKwh = (coolingBtu / newSeer) * totalHours / btuToKwH;
      
      const oldCost = oldConsumptionKwh * costPerKwh;
      const newCost = newConsumptionKwh * costPerKwh;
      const savings = oldCost - newCost;

      const paybackPeriod = (newUnitCost > 0 && savings > 0) ? (newUnitCost / savings).toFixed(1) + ' years' : null;

      setSavingsResult({
        annualSavings: savings,
        paybackPeriod: paybackPeriod,
        oldCost,
        newCost,
      });

      const newChartData = Array.from({ length: 10 }, (_, i) => ({
        year: i + 1,
        savings: Math.round(savings * (i + 1)),
      }));
      setChartData(newChartData);

    } else {
      setSavingsResult(null);
      setChartData([]);
    }
  };

  const handleClear = () => {
    form.reset();
    setSavingsResult(null);
    setChartData([]);
  };

  const handleDownload = () => {
    const values = form.getValues();
    if (!savingsResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    
    const inputs = [
        { key: 'Old Unit SEER/SEER2', value: values.oldSeer },
        { key: 'New Unit SEER/SEER2', value: values.newSeer },
        { key: 'Cooling Capacity', value: `${values.coolingBtu} BTU/hr` },
        { key: 'Usage per Day', value: `${values.hoursPerDay} hours` },
        { key: 'Usage per Year', value: `${values.daysPerYear} days` },
        { key: 'Electricity Cost', value: `$${values.costPerKwh}/kWh` },
    ];
    if (values.unitCost) {
        inputs.push({ key: 'New Unit Installed Cost', value: `$${values.unitCost}` });
    }

    const results = [
        { key: 'Estimated Annual Savings', value: `$${savingsResult.annualSavings.toFixed(2)}` },
        { key: 'Old System Annual Cost', value: `$${savingsResult.oldCost.toFixed(2)}` },
        { key: 'New System Annual Cost', value: `$${savingsResult.newCost.toFixed(2)}` },
    ];
    if (savingsResult.paybackPeriod) {
        results.push({ key: 'Payback Period', value: savingsResult.paybackPeriod });
    }

    generatePdf({
        title: calculator.name,
        slug: calculator.slug,
        inputs: inputs,
        results: results,
    });
  };
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            See how much you could save by upgrading to a more energy-efficient AC unit. A higher SEER2 (Seasonal Energy Efficiency Ratio 2) rating means lower energy bills. You can find the rating on your unit's yellow EnergyGuide label.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="oldSeer" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Old Unit SEER/SEER2</FormLabel><HelpInfo>Enter the SEER or SEER2 rating of your current AC unit.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="newSeer" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>New Unit SEER/SEER2</FormLabel><HelpInfo>Enter the SEER or SEER2 rating of the new unit you're considering.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 16" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="coolingBtu" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Cooling Capacity (BTU/hr)</FormLabel><HelpInfo>The cooling power of your AC unit. A 3-ton unit is 36,000 BTU/hr.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 36000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="costPerKwh" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Cost per kWh ($)</FormLabel><HelpInfo>Found on your electricity bill. The US average is about $0.17.</HelpInfo></div>
                        <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.17" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="hoursPerDay" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Hours of use / day</FormLabel><HelpInfo>Your average daily runtime during the cooling season.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="daysPerYear" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Days of use / year</FormLabel><HelpInfo>The number of days you typically run your air conditioner per year.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 120" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="unitCost" render={({ field }) => (
                    <FormItem className="md:col-span-3">
                        <div className="flex items-center gap-1.5"><FormLabel>New Unit Installed Cost ($) (Optional)</FormLabel><HelpInfo>Enter the total cost of the new unit and installation to calculate the payback period.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="Enter cost to calculate payback period" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card className="bg-accent/50">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-primary">${savingsResult.annualSavings.toFixed(2)}</CardTitle>
                            <CardDescription>Estimated Annual Savings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm space-y-1">
                                <p>Old System Annual Cost: <span className="font-medium">${savingsResult.oldCost.toFixed(2)}</span></p>
                                <p>New System Annual Cost: <span className="font-medium">${savingsResult.newCost.toFixed(2)}</span></p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-accent/50">
                         <CardHeader>
                            <CardTitle className="text-xl font-bold">{savingsResult.paybackPeriod ?? 'N/A'}</CardTitle>
                            <CardDescription>Payback Period</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">
                                {savingsResult.paybackPeriod ? 'Time until your new unit pays for itself in savings.' : 'Enter the new unit cost to calculate the payback period.'}
                            </p>
                        </CardContent>
                    </Card>
                </div>
                {chartData.length > 0 && (
                    <div>
                        <h4 className="text-lg font-semibold mb-2 text-center">Cumulative Savings Over 10 Years</h4>
                        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                            <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                dataKey="year"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => `Year ${value}`}
                                />
                                <YAxis
                                    tickFormatter={(value) => `$${value}`}
                                    width={80}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent 
                                        labelFormatter={(label, payload) => `Year ${payload?.[0]?.payload.year}`}
                                        formatter={(value) => `$${(value as number).toFixed(2)}`}
                                    />}
                                />
                                <Bar dataKey="savings" fill="var(--color-savings)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </div>
                )}
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
