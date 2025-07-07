'use client';

import { useState, useEffect } from 'react';
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
  deckWidth: z.string().min(1, 'Deck width is required.'),
  deckLength: z.string().min(1, 'Deck length is required.'),
  boardWidth: z.string().min(1, 'Board width is required.'),
  joistSpacing: z.string().min(1, 'Joist spacing is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function DeckingCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [deckingResult, setDeckingResult] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deckWidth: '',
      deckLength: '',
      boardWidth: '5.5',
      joistSpacing: '16',
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    const values = watchedValues;
    const width = parseFloat(values.deckWidth);
    const length = parseFloat(values.deckLength);
    const boardW = parseFloat(values.boardWidth);
    const joistS = parseFloat(values.joistSpacing);

    if (width > 0 && length > 0 && boardW > 0 && joistS > 0) {
      const boardGap = 0.125; // 1/8 inch gap
      const boardsNeeded = Math.ceil( (width * 12) / (boardW + boardGap) );
      const joistsNeeded = Math.ceil( (length * 12) / joistS ) + 1;
      setDeckingResult(`${boardsNeeded} deck boards (at ${length} ft length) & ${joistsNeeded} joists (at ${width} ft length)`);
    } else {
      setDeckingResult(null);
    }
  }, [watchedValues]);

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
    if (!deckingResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Deck Width: ${values.deckWidth} ft\n` +
      `Deck Length: ${values.deckLength} ft\n` +
      `Board Width: ${values.boardWidth} in\n`+
      `Joist Spacing: ${values.joistSpacing} in\n\n`+
      `--------------------\n` +
      `Materials Needed: ${deckingResult}\n`;
    
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
        <CardTitle>{calculator.name}</CardTitle>
        <CardDescription>
          Plan your new deck project by calculating the number of deck boards and joists you'll need based on your deck's dimensions and structure. Results are calculated automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="deckWidth" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Deck Width (ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 12" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="deckLength" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Deck Length (ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 16" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="boardWidth" render={({ field }) => (
                     <FormItem>
                        <FormLabel>Deck Board Width (in)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 5.5" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="joistSpacing" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Joist Spacing (in)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="12">12"</SelectItem>
                                <SelectItem value="16">16"</SelectItem>
                                <SelectItem value="24">24"</SelectItem>
                            </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )}/>
            </div>

            <div className="flex flex-wrap gap-2">
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
        {deckingResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Estimated Materials</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-xl font-bold">{deckingResult}</p>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
