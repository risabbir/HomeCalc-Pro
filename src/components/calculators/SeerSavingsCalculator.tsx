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
import { getAiAssistance } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2, Wand2, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

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
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
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
      costPerKwh: '0.15',
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

  const handleAiAssist = async () => {
    setLoading(true);
    setAiHint(null);
    const values = form.getValues();
    try {
      const result = await getAiAssistance({ calculatorType: calculator.name, parameters: values });
      if (result.autoCalculatedValues) {
        Object.entries(result.autoCalculatedValues).forEach(([key, value]) => {
          form.setValue(key as keyof FormValues, String(value));
        });
        toast({ title: 'AI Assistance', description: "We've filled in some values for you." });
      }
      if (result.hintsAndNextSteps) {
        setAiHint(result.hintsAndNextSteps);
      }
    } catch (error) {
      toast({ title: 'AI Error', description: 'Could not get assistance from AI.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
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
            See how much you could save by upgrading to a more energy-efficient AC unit. A higher SEER (Seasonal Energy Efficiency Ratio) rating means lower energy bills. You can find the SEER rating on your current unit's yellow EnergyGuide label. Note: SEER2 ratings are the new 2023+ standard. For this estimation, you can use a SEER2 value directly in the SEER fields. Press calculate to see the result.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="oldSeer" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Old Unit SEER Rating</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="newSeer" render={({ field }) => (
                    <FormItem>
                        <FormLabel>New Unit SEER Rating</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 16" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="coolingBtu" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cooling Capacity (BTU/hr)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 36000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="costPerKwh" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cost per kWh ($)</FormLabel>
                        <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.15" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="hoursPerDay" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Hours of use / day</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="daysPerYear" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Days of use / year</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 120" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="unitCost" render={({ field }) => (
                    <FormItem className="md:col-span-3">
                        <FormLabel>New Unit Cost ($) (Optional)</FormLabel>
                        <FormControl><Input type="number" placeholder="Enter cost to calculate payback period" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button type="submit">Calculate Savings</Button>
              <Button type="button" variant="outline" onClick={handleAiAssist} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                AI Assist
              </Button>
            </div>
          </form>
        </Form>
        {aiHint && (
          <Alert className="mt-6"><Wand2 className="h-4 w-4" /><AlertTitle>AI Suggestion</AlertTitle><AlertDescription>{aiHint}</AlertDescription></Alert>
        )}
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
