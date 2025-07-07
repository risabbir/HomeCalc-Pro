
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Schema for the Annual Savings Estimator
const annualSavingsSchema = z.object({
  annualHeatingCost: z.string().min(1, 'Annual heating cost is required.'),
  heatingSetbackTemp: z.string().min(1, 'Heating setback is required.'),
  heatingSetbackHours: z.string().min(1, 'Heating setback hours are required.'),
  annualCoolingCost: z.string().min(1, 'Annual cooling cost is required.'),
  coolingSetupTemp: z.string().min(1, 'Cooling setup is required.'),
  coolingSetupHours: z.string().min(1, 'Cooling setup hours are required.'),
});
type AnnualSavingsFormValues = z.infer<typeof annualSavingsSchema>;

// Schema for the Payback Period Calculator
const paybackSchema = z.object({
    thermostatCost: z.string().min(1, 'Thermostat cost is required.'),
    annualHvacCost: z.string().min(1, 'Annual HVAC cost is required.'),
    savingsPercentage: z.string().min(1, 'Savings percentage is required.'),
});
type PaybackFormValues = z.infer<typeof paybackSchema>;


export function ThermostatSavingsCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [savingsResult, setSavingsResult] = useState<string | null>(null);
  const [paybackResult, setPaybackResult] = useState<string | null>(null);
  const { toast } = useToast();

  // Form and logic for Annual Savings Estimator
  const annualSavingsForm = useForm<AnnualSavingsFormValues>({
    resolver: zodResolver(annualSavingsSchema),
    defaultValues: {
      annualHeatingCost: '1000',
      heatingSetbackTemp: '7',
      heatingSetbackHours: '8',
      annualCoolingCost: '500',
      coolingSetupTemp: '4',
      coolingSetupHours: '8',
    },
  });

  const onAnnualSavingsSubmit = (values: AnnualSavingsFormValues) => {
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
    const values = annualSavingsForm.getValues();
    const parameters = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => value !== '' && value !== undefined)
    );
    try {
      const result = await getAiAssistance({ calculatorType: calculator.name, parameters });
      if (result.autoCalculatedValues) {
        Object.entries(result.autoCalculatedValues).forEach(([key, value]) => {
          annualSavingsForm.setValue(key as keyof AnnualSavingsFormValues, String(value));
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

  const handleSavingsDownload = () => {
    const values = annualSavingsForm.getValues();
    if (!savingsResult) return;
    const content = `HomeCalc Pro - ${calculator.name} Results (Annual Savings)\n\n` +
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
    a.download = `thermostat-savings-results.txt`;
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Form and logic for Payback Period Calculator
  const paybackForm = useForm<PaybackFormValues>({
    resolver: zodResolver(paybackSchema),
    defaultValues: {
        thermostatCost: '150',
        annualHvacCost: '1500',
        savingsPercentage: '12',
    },
  });

  const onPaybackSubmit = (values: PaybackFormValues) => {
    const cost = parseFloat(values.thermostatCost);
    const annualBill = parseFloat(values.annualHvacCost);
    const percentage = parseFloat(values.savingsPercentage);

    if (cost > 0 && annualBill > 0 && percentage > 0) {
        const annualSavings = annualBill * (percentage / 100);
        if (annualSavings > 0) {
            const paybackMonths = (cost / annualSavings) * 12;
            setPaybackResult(`${paybackMonths.toFixed(1)} months`);
        } else {
            setPaybackResult('Savings must be greater than zero.');
        }
    } else {
        setPaybackResult(null);
    }
  };

  const handlePaybackDownload = () => {
    const values = paybackForm.getValues();
    if (!paybackResult) return;
    const content = `HomeCalc Pro - ${calculator.name} Results (Payback Period)\n\n` +
        `Thermostat Cost: $${values.thermostatCost}\n` +
        `Annual HVAC Cost: $${values.annualHvacCost}\n` +
        `Expected Savings: ${values.savingsPercentage}%\n\n` +
        `--------------------\n` +
        `Estimated Payback Period: ${paybackResult}\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thermostat-payback-results.txt`;
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{calculator.name}</CardTitle>
        <CardDescription>
            Estimate your potential energy savings from using a programmable or smart thermostat. Choose a calculator below to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
         <Tabs defaultValue="annual-savings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="annual-savings">Annual Savings Estimator</TabsTrigger>
                <TabsTrigger value="payback-period">Payback Period Calculator</TabsTrigger>
            </TabsList>

            <TabsContent value="annual-savings">
                <Card>
                    <CardHeader>
                        <CardTitle>Annual Savings Estimator</CardTitle>
                        <CardDescription>
                            Calculate your yearly savings based on temperature setbacks for heating and cooling seasons. This is based on the U.S. Department of Energy's formula (approx. 1% savings per degree of setback over 8 hours).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...annualSavingsForm}>
                        <form onSubmit={annualSavingsForm.handleSubmit(onAnnualSavingsSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <div className="space-y-6">
                                    <h4 className="text-lg font-semibold border-b pb-2">Heating Savings (Winter)</h4>
                                    <FormField control={annualSavingsForm.control} name="annualHeatingCost" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Annual Heating Bill ($)</FormLabel>
                                            <FormControl><Input type="number" placeholder="e.g., 1000" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField control={annualSavingsForm.control} name="heatingSetbackTemp" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Temp. Setback (How many degrees lower)</FormLabel>
                                            <FormControl><Input type="number" placeholder="e.g., 7" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField control={annualSavingsForm.control} name="heatingSetbackHours" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Setback Duration (Hours/Day)</FormLabel>
                                            <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                </div>
                                <div className="space-y-6">
                                    <h4 className="text-lg font-semibold border-b pb-2">Cooling Savings (Summer)</h4>
                                    <FormField control={annualSavingsForm.control} name="annualCoolingCost" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Annual Cooling Bill ($)</FormLabel>
                                            <FormControl><Input type="number" placeholder="e.g., 500" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField control={annualSavingsForm.control} name="coolingSetupTemp" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Temp. Setup (How many degrees higher)</FormLabel>
                                            <FormControl><Input type="number" placeholder="e.g., 4" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField control={annualSavingsForm.control} name="coolingSetupHours" render={({ field }) => (
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
                            <CardHeader><CardTitle>Total Estimated Annual Savings</CardTitle></CardHeader>
                            <CardContent className="flex items-center justify-between">
                            <p className="text-2xl font-bold">{savingsResult}</p>
                            <Button variant="ghost" size="icon" onClick={handleSavingsDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
                            </CardContent>
                        </Card>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="payback-period">
                <Card>
                    <CardHeader>
                        <CardTitle>Payback Period Calculator</CardTitle>
                        <CardDescription>
                            Find out how long it will take for a new smart thermostat to pay for itself in energy savings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...paybackForm}>
                            <form onSubmit={paybackForm.handleSubmit(onPaybackSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormField control={paybackForm.control} name="thermostatCost" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Thermostat Cost ($)</FormLabel>
                                            <FormControl><Input type="number" placeholder="e.g., 150" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField control={paybackForm.control} name="annualHvacCost" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Annual HVAC Bill ($)</FormLabel>
                                            <FormControl><Input type="number" placeholder="e.g., 1500" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField control={paybackForm.control} name="savingsPercentage" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Expected Savings (%)</FormLabel>
                                            <FormControl><Input type="number" placeholder="e.g., 12" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                </div>
                                <Button type="submit">Calculate Payback</Button>
                            </form>
                        </Form>
                         {paybackResult && (
                            <Card className="mt-6 bg-accent">
                                <CardHeader><CardTitle>Estimated Payback Period</CardTitle></CardHeader>
                                <CardContent className="flex items-center justify-between">
                                <p className="text-2xl font-bold">{paybackResult}</p>
                                <Button variant="ghost" size="icon" onClick={handlePaybackDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
         </Tabs>
      </CardContent>
    </Card>
  );
}
