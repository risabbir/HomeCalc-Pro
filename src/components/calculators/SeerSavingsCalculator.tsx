
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
import { Download, X, HelpCircle } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    let content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `--Inputs--\n`+
      `Old SEER Rating: ${values.oldSeer}\n` +
      `New SEER Rating: ${values.newSeer}\n` +
      `Cooling Capacity: ${values.coolingBtu} BTU/hr\n` +
      `Usage: ${values.hoursPerDay} hrs/day, ${values.daysPerYear} days/yr\n` +
      `Electricity Cost: $${values.costPerKwh}/kWh\n`;
    
    if (values.unitCost) {
      content += `New Unit Cost: $${values.unitCost}\n`;
    }

    content += `\n--Results--\n` +
      `Estimated Annual Savings: $${savingsResult.annualSavings.toFixed(2)}\n`;

    if (savingsResult.paybackPeriod) {
        content += `Payback Period: ${savingsResult.paybackPeriod}\n`;
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
                        <div className="flex items-center gap-1.5"><FormLabel>Old Unit SEER/SEER2</FormLabel><TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Enter the SEER or SEER2 rating of your current AC unit.</p></TooltipContent></Tooltip></TooltipProvider></div>
                        <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="newSeer" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>New Unit SEER/SEER2</FormLabel><TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Enter the SEER or SEER2 rating of the new unit you're considering.</p></TooltipContent></Tooltip></TooltipProvider></div>
                        <FormControl><Input type="number" placeholder="e.g., 16" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="coolingBtu" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Cooling Capacity (BTU/hr)</FormLabel><TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>The cooling power of your AC unit. A 3-ton unit is 36,000 BTU/hr.</p></TooltipContent></Tooltip></TooltipProvider></div>
                        <FormControl><Input type="number" placeholder="e.g., 36000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="costPerKwh" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Cost per kWh ($)</FormLabel><TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Found on your electricity bill. The US average is about $0.17.</p></TooltipContent></Tooltip></TooltipProvider></div>
                        <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.17" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="hoursPerDay" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Hours of use / day</FormLabel><TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Your average daily runtime during the cooling season.</p></TooltipContent></Tooltip></TooltipProvider></div>
                        <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="daysPerYear" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Days of use / year</FormLabel><TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>The number of days you typically run your air conditioner per year.</p></TooltipContent></Tooltip></TooltipProvider></div>
                        <FormControl><Input type="number" placeholder="e.g., 120" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="unitCost" render={({ field }) => (
                    <FormItem className="md:col-span-3">
                        <div className="flex items-center gap-1.5"><FormLabel>New Unit Installed Cost ($) (Optional)</FormLabel><TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Enter the total cost of the new unit and installation to calculate the payback period.</p></TooltipContent></Tooltip></TooltipProvider></div>
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
                 <Button variant="ghost" onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download Results</Button>
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
