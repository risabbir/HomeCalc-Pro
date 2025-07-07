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
  airFlow: z.string().min(1, 'Air Flow (CFM) is required.'),
  frictionLoss: z.string().min(1, 'Friction loss is required.'),
  ductType: z.string().min(1, 'Duct type is required.'),
  ductSizeResult: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function DuctSizeCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      airFlow: '',
      frictionLoss: '0.1',
      ductType: 'Round Metal',
      ductSizeResult: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    // Simplified calculation for demonstration
    const cfm = parseFloat(values.airFlow);
    const friction = parseFloat(values.frictionLoss);
    const diameter = Math.pow((4 * cfm) / (Math.PI * 100 * friction), 1/2.5) * 12;
    form.setValue('ductSizeResult', `Recommended: ${diameter.toFixed(1)}-inch round duct`);
  };

  const handleAiAssist = async () => {
    setLoading(true);
    setAiHint(null);
    const values = form.getValues();
    const parameters = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => value !== '' && value !== undefined && key !== 'ductSizeResult')
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
    if (!values.ductSizeResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Air Flow: ${values.airFlow} CFM\n` +
      `Friction Loss: ${values.frictionLoss} in. w.g./100 ft\n` +
      `Duct Type: ${values.ductType}\n\n`+
      `--------------------\n` +
      `Result: ${values.ductSizeResult}\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${calculator.slug}-results.txt`;
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const ductSizeResult = form.watch('ductSizeResult');

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle>{calculator.name}</CardTitle></CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="airFlow" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Air Flow (CFM)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 800" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="frictionLoss" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Friction Loss (in. w.g./100 ft)</FormLabel>
                        <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.1" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="submit">Calculate Size</Button>
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
        {ductSizeResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Recommended Duct Size</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">{ductSizeResult}</p>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
