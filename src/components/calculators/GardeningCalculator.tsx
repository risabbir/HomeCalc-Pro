
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Calculator } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAiAssistance } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  gardenArea: z.string().min(1, 'Garden area is required.'),
  applicationRate: z.string().min(1, 'Application rate is required.'),
  nitrogenRatio: z.string().min(1, 'Required.'),
  phosphorusRatio: z.string().min(1, 'Required.'),
  potassiumRatio: z.string().min(1, 'Required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function GardeningCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [fertilizerResult, setFertilizerResult] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gardenArea: '',
      applicationRate: '1',
      nitrogenRatio: '10',
      phosphorusRatio: '10',
      potassiumRatio: '10',
    },
  });

  const onSubmit = (values: FormValues) => {
    const area = parseFloat(values.gardenArea);
    const appRate = parseFloat(values.applicationRate);
    const n = parseFloat(values.nitrogenRatio);

    if (area > 0 && n > 0 && values.phosphorusRatio && values.potassiumRatio) {
      // Amount of N needed = (Area / 1000) * Application Rate
      const nitrogenNeeded = (area / 1000) * appRate; 
      // Total fertilizer = N needed / (%N in bag)
      const fertilizerAmount = (nitrogenNeeded / (n / 100));
      setFertilizerResult(`${fertilizerAmount.toFixed(2)} lbs of ${values.nitrogenRatio}-${values.phosphorusRatio}-${values.potassiumRatio} fertilizer`);
    } else {
      setFertilizerResult(null);
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
        toast({ title: 'AI Assistance', description: 'We\'ve filled in some values for you.' });
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
    if (!fertilizerResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Garden Area: ${values.gardenArea} sq ft\n` +
      `Application Rate: ${values.applicationRate} lbs of Nitrogen per 1000 sq ft\n` +
      `Fertilizer Ratio (N-P-K): ${values.nitrogenRatio}-${values.phosphorusRatio}-${values.potassiumRatio}\n\n`+
      `--------------------\n` +
      `Amount Needed: ${fertilizerResult}\n`;
    
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
            Give your garden the right amount of nutrients. Enter your garden's area, your desired application rate, and the N-P-K (Nitrogen-Phosphorus-Potassium) ratio from the fertilizer bag to calculate how much to apply.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="gardenArea" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Garden Area (sq ft)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 500" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="applicationRate" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Application Rate</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 1" {...field} /></FormControl>
                     <FormDescription>Lbs of Nitrogen per 1000 sq ft.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}/>
            </div>
            <div>
              <FormLabel>Fertilizer Ratio (N-P-K)</FormLabel>
              <FormDescription>Enter the N-P-K ratio from the fertilizer bag.</FormDescription>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <FormField control={form.control} name="nitrogenRatio" render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="N" {...field} /></FormControl><FormMessage/></FormItem>)}/>
                <FormField control={form.control} name="phosphorusRatio" render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="P" {...field} /></FormControl><FormMessage/></FormItem>)}/>
                <FormField control={form.control} name="potassiumRatio" render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="K" {...field} /></FormControl><FormMessage/></FormItem>)}/>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button type="submit">Calculate</Button>
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
        {fertilizerResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Fertilizer Required</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Estimated Amount</p>
                <p className="text-2xl font-bold">{fertilizerResult}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
