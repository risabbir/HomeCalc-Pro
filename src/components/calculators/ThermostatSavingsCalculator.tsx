
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
import { Download, Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  annualHeatingCost: z.string().min(1, 'Annual heating cost is required.'),
  heatingSetbackTemp: z.string().min(1, 'Heating setback is required.'),
  heatingSetbackHours: z.string().min(1, 'Heating setback hours are required.'),
  annualCoolingCost: z.string().min(1, 'Annual cooling cost is required.'),
  coolingSetupTemp: z.string().min(1, 'Cooling setup is required.'),
  coolingSetupHours: z.string().min(1, 'Cooling setup hours are required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function ThermostatSavingsCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [savingsResult, setSavingsResult] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      annualHeatingCost: '1000',
      heatingSetbackTemp: '7',
      heatingSetbackHours: '8',
      annualCoolingCost: '500',
      coolingSetupTemp: '4',
      coolingSetupHours: '8',
    },
  });

  const onSubmit = (values: FormValues) => {
    const heatingCost = parseFloat(values.annualHeatingCost);
    const coolingCost = parseFloat(values.annualCoolingCost);
    const heatingDegrees = parseFloat(values.heatingSetbackTemp);
    const heatingHours = parseFloat(values.heatingSetbackHours);
    const coolingDegrees = parseFloat(values.coolingSetupTemp);
    const coolingHours = parseFloat(values.coolingSetupHours);

    // Rule of thumb: 1% savings per degree for an 8-hour period.
    const heatingSavingsFactor = (heatingDegrees * (heatingHours / 8)) / 100;
    const coolingSavingsFactor = (coolingDegrees * (coolingHours / 8)) / 100;

    const heatingSavings = heatingCost * heatingSavingsFactor;
    const coolingSavings = coolingCost * coolingSavingsFactor;

    const totalSavings = heatingSavings + coolingSavings;

    if (!isNaN(totalSavings) && totalSavings >= 0) {
      setSavingsResult(`~$${totalSavings.toFixed(2)} per year`);
    } else {
      setSavingsResult(null);
    }
  };

  const handleAiAssist = async () => {
    setLoading(true);
    setAiHint(null);
    const values = form.getValues();
    const parameters = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => value !== '' && value !== undefined)
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
    if (!savingsResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `--- HEATING ---\n` +
      `Annual Heating Bill: $${values.annualHeatingCost}\n` +
      `Temperature Setback: ${values.heatingSetbackTemp}°F\n` +
      `Setback Duration: ${values.heatingSetbackHours} hours/day\n\n`+
      `--- COOLING ---\n` +
      `Annual Cooling Bill: $${values.annualCoolingCost}\n` +
      `Temperature Setup: ${values.coolingSetupTemp}°F\n` +
      `Setup Duration: ${values.coolingSetupHours} hours/day\n\n`+
      `--------------------\n` +
      `Total Estimated Savings: ${savingsResult}\n`;
    
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
            A smart or programmable thermostat is a great way to save on energy costs. By setting back the temperature when you're asleep or away, you can reduce your heating and cooling usage. This calculator estimates your potential annual savings based on the U.S. Department of Energy's formula (approximately 1% savings for each degree of setback over an 8-hour period). Enter your costs and setback settings for both heating and cooling seasons to see your combined potential savings.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-6">
                    <h4 className="text-lg font-semibold border-b pb-2">Heating Savings (Winter)</h4>
                    <FormField control={form.control} name="annualHeatingCost" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Annual Heating Bill ($)</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 1000" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="heatingSetbackTemp" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Temp. Setback (How many degrees lower)</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 7" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="heatingSetbackHours" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Setback Duration (Hours/Day)</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
                 <div className="space-y-6">
                    <h4 className="text-lg font-semibold border-b pb-2">Cooling Savings (Summer)</h4>
                    <FormField control={form.control} name="annualCoolingCost" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Annual Cooling Bill ($)</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 500" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="coolingSetupTemp" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Temp. Setup (How many degrees higher)</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 4" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="coolingSetupHours" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Setup Duration (Hours/Day)</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
            </div>
            
            <Separator />
            
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
