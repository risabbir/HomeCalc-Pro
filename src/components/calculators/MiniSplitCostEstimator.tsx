'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Calculator } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAiAssistance } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  zones: z.string().min(1, 'Number of zones is required.'),
  btuRating: z.string().min(1, 'BTU rating is required.'),
  seerRating: z.string().min(1, 'SEER rating is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function MiniSplitCostEstimator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [costResult, setCostResult] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      zones: '1',
      btuRating: '12000',
      seerRating: '20',
    },
  });

  const onSubmit = (values: FormValues) => {
    const zones = parseInt(values.zones);
    const btu = parseInt(values.btuRating);
    const seer = parseInt(values.seerRating);

    if (zones > 0 && btu > 0 && seer > 0) {
      let costPerZone = 1500;
      if (btu > 12000) costPerZone += (btu - 12000) * 0.1;
      if (seer > 20) costPerZone += (seer - 20) * 50;
      const totalCost = costPerZone * zones + 750 * zones; // +750 for labor per zone
      setCostResult(`~$${totalCost.toFixed(0)} - $${(totalCost * 1.4).toFixed(0)}`);
    } else {
      setCostResult(null);
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
    if (!costResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Number of Zones: ${values.zones}\n` +
      `BTU Rating: ${values.btuRating}\n` +
      `SEER Rating: ${values.seerRating}\n\n`+
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
          Estimate the total cost to purchase and install a ductless mini-split system. Costs can vary based on brand, complexity, and location. Press calculate to see the result.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="zones" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Number of Zones</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 1" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="btuRating" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Total BTU Rating</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 12000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="seerRating" render={({ field }) => (
                    <FormItem>
                        <FormLabel>SEER Rating</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 20" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
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
