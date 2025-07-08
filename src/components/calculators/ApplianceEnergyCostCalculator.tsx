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
import { getAiAssistance } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2, Wand2, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  wattage: z.string().min(1, 'Wattage is required.'),
  hoursPerDay: z.string().min(1, 'Hours per day is required.'),
  costPerKwh: z.string().min(1, 'Cost per kWh is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function ApplianceEnergyCostCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [costResult, setCostResult] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wattage: '',
      hoursPerDay: '',
      costPerKwh: '0.15', // Average US cost
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
    form.reset();
    setCostResult(null);
    setAiHint(null);
  };

  const handleAiAssist = async () => {
    setLoading(true);
    setAiHint(null);
    const values = form.getValues();
    const parameters = {
        wattage: values.wattage,
        hoursPerDay: values.hoursPerDay,
        costPerKwh: values.costPerKwh,
    };
    try {
      const result = await getAiAssistance({ calculatorType: calculator.name, parameters });
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
    if (!costResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Appliance Wattage: ${values.wattage} W\n` +
      `Hours Used Per Day: ${values.hoursPerDay}\n` +
      `Cost per kWh: $${values.costPerKwh}\n\n`+
      `--------------------\n` +
      `Estimated Annual Cost: ${costResult}\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${calculator.slug}-results.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            Calculate the annual energy cost of an appliance. Enter the appliance's wattage (check the label), its daily usage, and your local electricity rate. The average cost per kWh in the US is pre-filled, but you can find a more accurate rate on your utility bill. Press calculate to see the result.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="wattage" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Appliance Wattage (W)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 1500" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="hoursPerDay" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Hours Used Per Day</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 2" {...field} /></FormControl>
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
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate Cost</Button>
              <Button type="button" variant="outline" onClick={handleAiAssist} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Need a hint? Use AI Assist
              </Button>
               <Button type="button" variant="ghost" onClick={handleClear}>
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </form>
        </Form>
        {aiHint && (
          <Alert className="mt-6"><Wand2 className="h-4 w-4" /><AlertTitle>AI Suggestion</AlertTitle><AlertDescription>{aiHint}</AlertDescription></Alert>
        )}
        {costResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Estimated Annual Cost</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{costResult}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
