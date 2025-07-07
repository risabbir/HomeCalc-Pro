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
  wallArea: z.string().min(1, 'Wall area is required.'),
  coats: z.string().min(1, 'Number of coats is required.'),
  paintGallons: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

export function HomeImprovementCalculator({ calculator }: { calculator: Calculator }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { wallArea: '', coats: '2', paintGallons: '' },
  });

  const onSubmit = (values: FormValues) => {
    const GALLONS_PER_SQFT = 350;
    const area = parseFloat(values.wallArea);
    const coats = parseInt(values.coats, 10);
    const gallonsNeeded = (area * coats) / GALLONS_PER_SQFT;
    form.setValue('paintGallons', `${gallonsNeeded.toFixed(2)} gallons`);
  };

  const handleAiAssist = async () => {
    setLoading(true);
    setAiHint(null);
    const values = form.getValues();
    const parameters = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value !== '' && value !== undefined && key !== 'paintGallons')
    );

    try {
      const result = await getAiAssistance({ calculatorType: calculator.name, parameters });
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
    if (!values.paintGallons) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const content = `HomeCalc Pro - ${calculator.name} (Paint Estimation)\n\n` +
      `Total Wall Area: ${values.wallArea} sq ft\n` +
      `Number of Coats: ${values.coats}\n\n` +
      `--------------------\n` +
      `Paint Needed: ${values.paintGallons}\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paint-estimation-results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const paintGallons = form.watch('paintGallons');

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Paint Estimator</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="wallArea" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Wall Area (sq ft)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 400" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
              <FormField control={form.control} name="coats" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Coats</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 2" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit">Estimate Paint</Button>
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
        {paintGallons && (
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Paint Estimation</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Gallons of Paint Needed</p>
                <p className="text-2xl font-bold">{paintGallons}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
