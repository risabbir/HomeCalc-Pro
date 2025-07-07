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
import { Download, Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  costPerKwh: z.string().min(1, 'Cost per kWh is required.'),
  current_wattage: z.string().min(1, 'Wattage is required.'),
  current_hours: z.string().min(1, 'Hours per day is required.'),
  new_wattage: z.string().min(1, 'Wattage is required.'),
  new_hours: z.string().min(1, 'Hours per day is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function EnergySavingsCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
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
      `Electricity Cost: $${values.costPerKwh}/kWh\n\n`+
      `--Current Appliance--\n`+
      `Wattage: ${values.current_wattage} W\n` +
      `Hours Used Per Day: ${values.current_hours} hrs\n\n` +
      `--New Appliance--\n`+
      `Wattage: ${values.new_wattage} W\n` +
      `Hours Used Per Day: ${values.new_hours} hrs\n\n` +
      `--Results--\n` +
      `Estimated Annual Savings: $${savingsResult.annualSavings.toFixed(2)}\n`+
      `Old Appliance Annual Cost: $${savingsResult.currentCost.toFixed(2)}\n`+
      `New Appliance Annual Cost: $${savingsResult.newCost.toFixed(2)}\n`;
    
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
            Compare two appliances to see the potential savings. For example, compare your old incandescent light bulbs to new LEDs, or an old refrigerator to a new Energy Star model. Check the appliance label for wattage.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className='text-center'>
                <FormField control={form.control} name="costPerKwh" render={({ field }) => (
                    <FormItem className="max-w-xs mx-auto">
                        <FormLabel>Your Electricity Cost per kWh ($)</FormLabel>
                        <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.17" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-center'>Current Appliance</h3>
                    <FormField control={form.control} name="current_wattage" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Appliance Wattage (W)</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 1500" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="current_hours" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hours Used Per Day</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
                 <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-center'>New Appliance</h3>
                    <FormField control={form.control} name="new_wattage" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Appliance Wattage (W)</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 200" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="new_hours" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hours Used Per Day</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
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
                 <Button variant="ghost" onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download Results</Button>
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
