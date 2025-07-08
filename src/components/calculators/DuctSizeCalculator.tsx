
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
import { Download, Loader2, Wand2, X, HelpCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const formSchema = z.object({
  airFlow: z.string().min(1, 'Air Flow (CFM) is required.'),
  frictionLoss: z.string().min(1, 'Friction loss is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function DuctSizeCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [ductSizeResult, setDuctSizeResult] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      airFlow: '',
      frictionLoss: '0.1',
    },
  });

  const onSubmit = (values: FormValues) => {
    const cfm = parseFloat(values.airFlow);
    const friction = parseFloat(values.frictionLoss);

    if (cfm > 0 && friction > 0) {
      // Simplified Ductulator formula approximation for round metal ducts.
      const diameter = 1.3 * Math.pow(Math.pow(cfm, 0.9) / friction, 0.2);
      setDuctSizeResult(`Recommended: ${diameter.toFixed(1)}-inch round duct`);
    } else {
      setDuctSizeResult(null);
    }
  };

  const handleClear = () => {
    form.reset();
    setDuctSizeResult(null);
    setAiHint(null);
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
      toast({
        title: 'An error occurred',
        description: error instanceof Error ? error.message : 'Failed to get AI assistance. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const values = form.getValues();
    if (!ductSizeResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Air Flow: ${values.airFlow} CFM\n` +
      `Friction Loss: ${values.frictionLoss} in. w.g./100 ft\n\n`+
      `--------------------\n` +
      `Result: ${ductSizeResult}\n\n` +
      `Disclaimer: This is a simplified estimate for round metal ducts and is not a substitute for professional HVAC design.`;
    
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
            Ensure efficient airflow in your HVAC system by calculating the correct duct size. This is a simplified tool and requires technical inputs like Air Flow (CFM) and Friction Loss Rate, which are typically determined by a full HVAC load calculation (Manual J).
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>For Professional Use</AlertTitle>
                <AlertDescription>
                 This calculator is intended for HVAC professionals or knowledgeable homeowners. Incorrect duct sizing can lead to poor performance and inefficiency.
                </AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="airFlow" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5">
                            <FormLabel>Air Flow (CFM)</FormLabel>
                            <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Cubic Feet per Minute. This is the volume of air the duct needs to move, typically 400 CFM per ton of AC.</p></TooltipContent></Tooltip></TooltipProvider>
                        </div>
                        <FormControl><Input type="number" placeholder="e.g., 800" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="frictionLoss" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5">
                            <FormLabel>Friction Loss (in. w.g./100 ft)</FormLabel>
                            <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>The resistance to airflow. 0.1 in. w.g. is a common value for residential main trunk lines.</p></TooltipContent></Tooltip></TooltipProvider>
                        </div>
                        <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.1" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate</Button>
              <Button type="button" variant="outline" onClick={handleAiAssist} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                AI Assist
              </Button>
              {ductSizeResult && (
                <Button type="button" variant="destructive" onClick={handleClear}>
                  Clear<X className="ml-1 h-4 w-4" />
                </Button>
              )}
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
