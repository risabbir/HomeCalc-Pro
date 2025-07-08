
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

const formSchema = z.object({
  length: z.string().min(1, 'Length is required.'),
  width: z.string().min(1, 'Width is required.'),
  thickness: z.string().min(1, 'Thickness is required.'),
  wasteFactor: z.string().min(1, 'Waste factor is required.'),
});

type FormValues = z.infer<typeof formSchema>;

interface Result {
    cubicYards: number;
    bagsNeeded: number;
}

export function ConcreteSlabCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [concreteResult, setConcreteResult] = useState<Result | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      length: '',
      width: '',
      thickness: '4',
      wasteFactor: '10',
    },
  });

  const onSubmit = (values: FormValues) => {
    const length = parseFloat(values.length);
    const width = parseFloat(values.width);
    const thickness = parseFloat(values.thickness);
    const waste = parseFloat(values.wasteFactor);
    
    if (length > 0 && width > 0 && thickness > 0 && waste >= 0) {
      const thicknessInFeet = thickness / 12; // inches to feet
      const cubicFeet = length * width * thicknessInFeet;
      const cubicFeetWithWaste = cubicFeet * (1 + waste / 100);
      const cubicYards = cubicFeetWithWaste / 27;

      // Assuming an 80lb bag yields ~0.6 cubic feet
      const bagsNeeded = Math.ceil(cubicFeetWithWaste / 0.6);

      setConcreteResult({ cubicYards, bagsNeeded });
    } else {
      setConcreteResult(null);
    }
  }

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
    if (!concreteResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Slab Length: ${values.length} ft\n` +
      `Slab Width: ${values.width} ft\n` +
      `Slab Thickness: ${values.thickness} in\n` +
      `Waste Factor: ${values.wasteFactor}%\n\n`+
      `--------------------\n` +
      `Concrete Needed (for delivery): ${concreteResult.cubicYards.toFixed(2)} cubic yards\n` +
      `Concrete Needed (for bags): ~${concreteResult.bagsNeeded} (80lb) bags\n`;
    
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
            Planning a foundation, patio, or sidewalk? Enter the dimensions of your slab to calculate the volume of concrete required in cubic yards. Press calculate to see the result.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="length" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Slab Length (ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="width" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Slab Width (ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="thickness" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Slab Thickness (in)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 4" {...field} /></FormControl>
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
        {concreteResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Concrete Needed</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{concreteResult.cubicYards.toFixed(2)} cubic yards</p>
                <p className="text-muted-foreground">or ~{concreteResult.bagsNeeded} (80lb) bags</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
