'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Calculator } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAiAssistance } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  oldSeer: z.string().min(1, 'Old SEER rating is required.'),
  newSeer: z.string().min(1, 'New SEER rating is required.'),
  coolingBtu: z.string().min(1, 'Cooling capacity is required.'),
  hoursPerDay: z.string().min(1, 'Hours per day is required.'),
  daysPerYear: z.string().min(1, 'Days per year is required.'),
  costPerKwh: z.string().min(1, 'Cost per kWh is required.'),
  savingsResult: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function SeerSavingsCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
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
      savingsResult: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const btuToKwH = 1000;
    const oldConsumption = (parseFloat(values.coolingBtu) / parseFloat(values.oldSeer)) / btuToKwH;
    const newConsumption = (parseFloat(values.coolingBtu) / parseFloat(values.newSeer)) / btuToKwH;
    
    const totalHours = parseFloat(values.hoursPerDay) * parseFloat(values.daysPerYear);
    
    const oldCost = oldConsumption * totalHours * parseFloat(values.costPerKwh);
    const newCost = newConsumption * totalHours * parseFloat(values.costPerKwh);
    
    const savings = oldCost - newCost;
    
    form.setValue('savingsResult', `~$${savings.toFixed(2)} per year`);
  };

  const handleAiAssist = async () => {
    setLoading(true);
    setAiHint(null);
    const values = form.getValues();
    const parameters = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => value !== '' && value !== undefined && key !== 'savingsResult')
    );
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
    if (!values.savingsResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Old SEER Rating: ${values.oldSeer}\n` +
      `New SEER Rating: ${values.newSeer}\n` +
      `Cooling Capacity: ${values.coolingBtu} BTU/hr\n` +
      `Usage: ${values.hoursPerDay} hrs/day, ${values.daysPerYear} days/yr\n` +
      `Electricity Cost: $${values.costPerKwh}/kWh\n\n`+
      `--------------------\n` +
      `Estimated Annual Savings: ${values.savingsResult}\n`;
    
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
  
  const savingsResult = form.watch('savingsResult');

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle>SEER Savings Calculator</CardTitle></CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            <div className="flex flex-wrap gap-2">
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
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Estimated Annual Savings</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{savingsResult}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
