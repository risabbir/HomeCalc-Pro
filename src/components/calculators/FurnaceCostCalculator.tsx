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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  homeSize: z.string().min(1, 'Home size is required.'),
  furnaceType: z.enum(['gas', 'electric', 'oil']),
  efficiency: z.enum(['standard', 'high']),
  costResult: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function FurnaceCostCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      homeSize: '',
      furnaceType: 'gas',
      efficiency: 'standard',
      costResult: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    // Simplified cost estimation logic
    let baseCost = 0;
    if (values.furnaceType === 'gas') baseCost = 2000;
    if (values.furnaceType === 'electric') baseCost = 1500;
    if (values.furnaceType === 'oil') baseCost = 2500;

    if (values.efficiency === 'high') baseCost *= 1.5;

    const sizeMultiplier = parseFloat(values.homeSize) / 1500;
    const totalCost = baseCost * sizeMultiplier + 1000; // +1000 for labor

    form.setValue('costResult', `~$${totalCost.toFixed(0)} - $${(totalCost * 1.5).toFixed(0)}`);
  };

  const handleAiAssist = async () => {
    setLoading(true);
    setAiHint(null);
    const values = form.getValues();
    const parameters = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => value !== '' && value !== undefined && key !== 'costResult')
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
    if (!values.costResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Home Size: ${values.homeSize} sq ft\n` +
      `Furnace Type: ${values.furnaceType}\n` +
      `Efficiency: ${values.efficiency}\n\n`+
      `--------------------\n` +
      `Estimated Cost: ${values.costResult}\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${calculator.slug}-results.txt`;
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const costResult = form.watch('costResult');

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle>{calculator.name}</CardTitle></CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="homeSize" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Home Size (sq ft)</FormLabel>
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

            <div className="flex flex-wrap gap-2">
              <Button type="submit">Estimate Cost</Button>
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
