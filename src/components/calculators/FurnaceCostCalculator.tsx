
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  homeSize: z.string().min(1, 'Home size is required.'),
  furnaceType: z.enum(['gas', 'electric', 'oil']),
  efficiency: z.enum(['standard', 'high']),
});

type FormValues = z.infer<typeof formSchema>;

export function FurnaceCostCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [costResult, setCostResult] = useState<string | null>(null);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      homeSize: '',
      furnaceType: 'gas',
      efficiency: 'standard',
    },
  });

  const onSubmit = (values: FormValues) => {
    let homeSize = parseFloat(values.homeSize);

    if (units === 'metric') {
        homeSize = homeSize * 10.764; // sq m to sq ft
    }

    if (homeSize > 0 && values.furnaceType && values.efficiency) {
      let baseCost = 0;
      if (values.furnaceType === 'gas') baseCost = 2000;
      if (values.furnaceType === 'electric') baseCost = 1500;
      if (values.furnaceType === 'oil') baseCost = 2500;

      if (values.efficiency === 'high') baseCost *= 1.5;

      const sizeMultiplier = homeSize / 1500;
      const totalCost = baseCost * sizeMultiplier + 1000; // +1000 for labor

      setCostResult(`~$${totalCost.toFixed(0)} - $${(totalCost * 1.5).toFixed(0)}`);
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
    try {
      const result = await getAiAssistance({ calculatorType: calculator.name, parameters: {...values, units} });
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
      `Home Size: ${values.homeSize} ${units === 'imperial' ? 'sq ft' : 'sq m'}\n` +
      `Furnace Type: ${values.furnaceType}\n` +
      `Efficiency: ${values.efficiency}\n\n`+
      `--------------------\n` +
      `Estimated Cost: ${costResult}\n`;
    
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
            Get a rough estimate for a new furnace installation. Cost depends heavily on home size, fuel type, efficiency rating (AFUE), and local labor rates. Press calculate to see the result.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <div className="flex justify-start mb-4">
                <Tabs defaultValue="imperial" onValueChange={(value) => setUnits(value as 'imperial' | 'metric')} className="w-auto">
                    <TabsList>
                        <TabsTrigger value="imperial">Imperial</TabsTrigger>
                        <TabsTrigger value="metric">Metric</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="homeSize" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Home Size ({units === 'imperial' ? 'sq ft' : 'sq m'})</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 2000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="furnaceType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Furnace Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="gas">Gas</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                          <SelectItem value="oil">Oil</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="efficiency" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Efficiency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard (80%)</SelectItem>
                          <SelectItem value="high">High (95% AFUE)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )}/>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate Cost</Button>
              <Button type="button" variant="outline" onClick={handleAiAssist} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                AI Assist
              </Button>
              {costResult && (
                <Button type="button" variant="ghost" onClick={handleClear}>
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </form>
        </Form>
        {aiHint && (
          <Alert className="mt-6"><Wand2 className="h-4 w-4" /><AlertTitle>AI Suggestion</AlertTitle><AlertDescription>{aiHint}</AlertDescription></Alert>
        )}
        {costResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Estimated Installation Cost</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">{costResult}</p>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
