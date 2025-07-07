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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  homeSize: z.string().min(1, 'Home size is required.'),
  seerRating: z.string().min(1, 'SEER rating is required.'),
  unitSize: z.string().min(1, 'Unit size is required.'),
  costResult: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function HeatPumpCostCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      homeSize: '2000',
      seerRating: '16',
      unitSize: '3',
      costResult: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    // Simplified cost estimation logic
    const size = parseFloat(values.unitSize);
    const seer = parseFloat(values.seerRating);
    
    let baseCost = 1500 * size; // Base on tonnage
    if (seer > 16) baseCost += (seer - 16) * 500;

    const totalCost = baseCost + 1500; // +1500 for labor

    form.setValue('costResult', `~$${totalCost.toFixed(0)} - $${(totalCost * 1.6).toFixed(0)}`);
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
      `SEER Rating: ${values.seerRating}\n` +
      `Unit Size: ${values.unitSize} Ton\n\n`+
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
      <CardHeader>
        <CardTitle>{calculator.name}</CardTitle>
        <CardDescription>
            Estimate the installed cost of a new heat pump. The unit's size (in tons) and its SEER rating are major cost factors.
        </CardDescription>
      </CardHeader>
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
                <FormField control={form.control} name="unitSize" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Unit Size (Tons)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 3" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="seerRating" render={({ field }) => (
                    <FormItem>
                        <FormLabel>SEER Rating</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 16" {...field} /></FormControl>
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
