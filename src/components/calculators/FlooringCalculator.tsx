
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Calculator } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAiAssistance } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  roomWidth: z.string().min(1, 'Room width is required.'),
  roomLength: z.string().min(1, 'Room length is required.'),
  wasteFactor: z.string().min(1, 'Waste factor is required.'),
  boxCoverage: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Result {
    totalArea: number;
    boxesNeeded: number | null;
}

export function FlooringCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [flooringResult, setFlooringResult] = useState<Result | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomWidth: '',
      roomLength: '',
      wasteFactor: '10', // 10% waste is standard
      boxCoverage: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const width = parseFloat(values.roomWidth);
    const length = parseFloat(values.roomLength);
    const waste = parseFloat(values.wasteFactor);
    const coverage = parseFloat(values.boxCoverage || '0');

    if (width > 0 && length > 0 && waste >= 0) {
      const area = width * length;
      const totalArea = area * (1 + (waste/100));
      const boxesNeeded = coverage > 0 ? Math.ceil(totalArea / coverage) : null;
      setFlooringResult({ totalArea, boxesNeeded });
    } else {
      setFlooringResult(null);
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
    if (!flooringResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    let content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Room Width: ${values.roomWidth} ft\n` +
      `Room Length: ${values.roomLength} ft\n` +
      `Waste Factor: ${values.wasteFactor}%\n`;

    if (values.boxCoverage) {
        content += `Coverage per Box: ${values.boxCoverage} sq ft\n`;
    }

    content += `\n--------------------\n` +
      `Total Flooring Needed: ${flooringResult.totalArea.toFixed(2)} sq ft\n`;
    
    if(flooringResult.boxesNeeded) {
        content += `Estimated Boxes to Buy: ${flooringResult.boxesNeeded} boxes\n`;
    }
    
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
            Measure your room's width and length to find the total area. Don't forget to add a waste factor (typically 5-15%) to account for cuts and mistakes. Press calculate to see the result.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="roomWidth" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Room Width (ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="roomLength" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Room Length (ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 12" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="wasteFactor" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Waste Factor (%)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
             <FormField control={form.control} name="boxCoverage" render={({ field }) => (
                <FormItem>
                    <FormLabel>Box Coverage (Optional)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 22.5" {...field} /></FormControl>
                    <FormDescription>Enter the sq ft coverage per box to calculate how many boxes to buy.</FormDescription>
                    <FormMessage />
                </FormItem>
            )}/>
            
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
        {flooringResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Total Flooring Required</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">
                {flooringResult.totalArea.toFixed(2)} sq ft
                {flooringResult.boxesNeeded && <span className="text-lg text-muted-foreground ml-2"> (~{flooringResult.boxesNeeded} boxes)</span>}
              </p>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
