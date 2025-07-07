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
  totalArea: z.string().min(1, 'Total area is required.'),
  climateZone: z.string().min(1, 'Climate zone is required.'),
  windowsArea: z.string().min(1, 'Windows area is required.'),
  loadResult: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function HvacLoadCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalArea: '',
      climateZone: '5',
      windowsArea: '',
      loadResult: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    // Simplified Manual J calculation for demonstration
    const area = parseFloat(values.totalArea);
    const windows = parseFloat(values.windowsArea);
    const climateFactor = 30 - (parseFloat(values.climateZone) * 2);

    const coolingLoad = (area * climateFactor) + (windows * 100);
    const heatingLoad = (area * (50 - climateFactor));

    form.setValue('loadResult', `Cooling: ${coolingLoad.toFixed(0)} BTU/hr | Heating: ${heatingLoad.toFixed(0)} BTU/hr`);
  };

  const handleAiAssist = async () => {
    setLoading(true);
    setAiHint(null);
    const values = form.getValues();
    const parameters = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => value !== '' && value !== undefined && key !== 'loadResult')
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
    if (!values.loadResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Total Area: ${values.totalArea} sq ft\n` +
      `Climate Zone: ${values.climateZone}\n` +
      `Windows Area: ${values.windowsArea} sq ft\n\n`+
      `--------------------\n` +
      `Estimated Load: ${values.loadResult}\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${calculator.slug}-results.txt`;
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const loadResult = form.watch('loadResult');

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle>{calculator.name}</CardTitle></CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="totalArea" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Total Area (sq ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 2000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="windowsArea" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Windows Area (sq ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 150" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="climateZone" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Climate Zone (1-7)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="submit">Calculate Load</Button>
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
        {loadResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Estimated HVAC Load</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">{loadResult}</p>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
