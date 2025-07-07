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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  climateZone: z.string().min(1, 'Climate zone is required.'),
  existingInsulation: z.string().min(1, 'Existing insulation is required.'),
  insulationResult: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const R_VALUES_BY_ZONE: { [key: string]: number } = {
  '1': 30, '2': 38, '3': 38, '4': 49, '5': 49, '6': 60, '7': 60, '8': 60
};

export function AtticInsulationCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      climateZone: '5',
      existingInsulation: '0',
      insulationResult: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const targetRValue = R_VALUES_BY_ZONE[values.climateZone];
    const existingInches = parseFloat(values.existingInsulation);
    const existingRValue = existingInches * 3.2; // Approximate R-value per inch for loose-fill fiberglass

    if (targetRValue > existingRValue) {
      const neededRValue = targetRValue - existingRValue;
      const neededInches = neededRValue / 3.2;
      form.setValue('insulationResult', `Add ${neededInches.toFixed(1)} inches (R-${neededRValue.toFixed(0)}) to reach target R-${targetRValue}.`);
    } else {
      form.setValue('insulationResult', `Your current insulation (R-${existingRValue.toFixed(0)}) meets or exceeds the recommended R-${targetRValue}.`);
    }
  };

  const handleAiAssist = async () => {
    setLoading(true);
    setAiHint(null);
    const values = form.getValues();
    const parameters = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => value !== '' && value !== undefined && key !== 'insulationResult')
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
    if (!values.insulationResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Climate Zone: ${values.climateZone}\n` +
      `Existing Insulation: ${values.existingInsulation} inches\n\n`+
      `--------------------\n` +
      `Recommendation: ${values.insulationResult}\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${calculator.slug}-results.txt`;
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const insulationResult = form.watch('insulationResult');

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle>{calculator.name}</CardTitle></CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="climateZone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Climate Zone (US)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          {Object.keys(R_VALUES_BY_ZONE).map(zone => (
                             <SelectItem key={zone} value={zone}>Zone {zone}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="existingInsulation" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Existing Insulation (inches)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>

            <div className="flex flex-wrap gap-2">
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
        {insulationResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Insulation Recommendation</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">{insulationResult}</p>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
