
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
  length: z.string().min(1, 'Length is required.'),
  width: z.string().min(1, 'Width is required.'),
  depth: z.string().min(1, 'Depth is required.'),
  bagSize: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Result {
    cubicFeet: number;
    cubicYards: number;
    bagsNeeded: number | null;
}

export function SoilCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [soilResult, setSoilResult] = useState<Result | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      length: '',
      width: '',
      depth: '6',
      bagSize: ''
    },
  });

  const onSubmit = (values: FormValues) => {
    const length = parseFloat(values.length);
    const width = parseFloat(values.width);
    const depth = parseFloat(values.depth);
    const bagSize = parseFloat(values.bagSize || '0');

    if (length > 0 && width > 0 && depth > 0) {
      const depthInFeet = depth / 12; // convert inches to feet
      const cubicFeet = length * width * depthInFeet;
      const cubicYards = cubicFeet / 27;
      const bagsNeeded = bagSize > 0 ? Math.ceil(cubicFeet / bagSize) : null;
      setSoilResult({cubicFeet, cubicYards, bagsNeeded});
    } else {
      setSoilResult(null);
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
    if (!soilResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    let content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Bed Length: ${values.length} ft\n` +
      `Bed Width: ${values.width} ft\n` +
      `Soil Depth: ${values.depth} inches\n`;

    if (values.bagSize) {
        content += `Bag Size: ${values.bagSize} cu ft\n`;
    }

    content += `\n--------------------\n` +
      `Total Soil Needed: ${soilResult.cubicFeet.toFixed(2)} cu ft (or ${soilResult.cubicYards.toFixed(2)} cu yd)\n`;

    if (soilResult.bagsNeeded) {
        content += `Estimated Bags Needed: ${soilResult.bagsNeeded} bags\n`;
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
            Starting a new garden bed or topping up an old one? Calculate the volume of soil you'll need in cubic feet and cubic yards. Press calculate to see the result.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="length" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bed Length (ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="width" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bed Width (ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 4" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="depth" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Soil Depth (inches)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 6" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>

            <FormField control={form.control} name="bagSize" render={({ field }) => (
                <FormItem>
                    <FormLabel>Bag Size (cu ft) (Optional)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 1.5" {...field} /></FormControl>
                    <FormDescription>Enter the size of the bags you plan to buy to estimate quantity.</FormDescription>
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
        {soilResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Soil Volume Needed</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">
                {soilResult.cubicFeet.toFixed(2)} cu ft
                <span className="text-lg text-muted-foreground ml-2">({soilResult.cubicYards.toFixed(2)} cu yd)</span>
                {soilResult.bagsNeeded && <span className="block text-base font-normal text-muted-foreground">Approx. {soilResult.bagsNeeded} bags</span>}
              </p>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
