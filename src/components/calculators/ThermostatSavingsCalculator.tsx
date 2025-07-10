
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
import { Download, X, HelpCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const formSchema = z.object({
  annualHvacCost: z.string().min(1, 'Annual HVAC cost is required.'),
  setbackDegrees: z.string().min(1, 'Setback degrees is required.'),
  setbackHours: z.string().min(1, 'Setback hours per day is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function ThermostatSavingsCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [savingsResult, setSavingsResult] = useState<string | null>(null);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      annualHvacCost: '1500',
      setbackDegrees: '8',
      setbackHours: '8',
    },
  });

  const onSubmit = (values: FormValues) => {
    const cost = parseFloat(values.annualHvacCost);
    let degrees = parseFloat(values.setbackDegrees);
    const hours = parseFloat(values.setbackHours);
    
    if (cost > 0 && degrees > 0 && hours > 0) {
      const savingsPerDegree = units === 'imperial' ? 0.01 : 0.018;
      const savingsPercentage = (degrees * savingsPerDegree * (hours / 8));
      const annualSavings = cost * savingsPercentage;
      setSavingsResult(`~$${annualSavings.toFixed(2)} per year`);
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
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Annual HVAC Cost: $${values.annualHvacCost}\n` +
      `Average Setback: ${values.setbackDegrees}°${units === 'imperial' ? 'F' : 'C'} for ${values.setbackHours} hrs/day\n\n`+
      `--------------------\n` +
      `Estimated Savings: ${savingsResult}\n`;
    
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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            Estimate your potential energy savings from using a programmable or smart thermostat. The calculation assumes roughly 1% savings for every degree Fahrenheit (1.8% per Celsius) of temperature setback over an 8-hour period.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-start mb-4">
                <Tabs defaultValue="imperial" onValueChange={(value) => setUnits(value as 'imperial' | 'metric')} className="w-auto">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="imperial">Imperial (°F)</TabsTrigger>
                        <TabsTrigger value="metric">Metric (°C)</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="annualHvacCost" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5"><FormLabel>Annual HVAC Cost ($)</FormLabel><TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Your total estimated yearly cost for heating and cooling.</p></TooltipContent></Tooltip></TooltipProvider></div>
                        <FormControl><Input type="number" placeholder="e.g., 1500" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="setbackDegrees" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5"><FormLabel>Avg. Setback ({units === 'imperial' ? '°F' : 'C'})</FormLabel><TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>The number of degrees you turn your thermostat up (in summer) or down (in winter).</p></TooltipContent></Tooltip></TooltipProvider></div>
                        <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="setbackHours" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5"><FormLabel>Setback Hours/Day</FormLabel><TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>The number of hours per day the thermostat is at the setback temperature (e.g., while at work or asleep).</p></TooltipContent></Tooltip></TooltipProvider></div>
                        <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
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
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Estimated Annual Savings</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">{savingsResult}</p>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
