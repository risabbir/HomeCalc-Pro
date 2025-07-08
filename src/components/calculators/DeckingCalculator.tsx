
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
import { Download, Loader2, Wand2, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  deckWidth: z.string().min(1, 'Deck width is required.'),
  deckLength: z.string().min(1, 'Deck length is required.'),
  boardWidth: z.string().min(1, 'Board width is required.'),
  boardLength: z.string().min(1, 'Board length is required.'),
  joistSpacing: z.string().min(1, 'Joist spacing is required.'),
  wasteFactor: z.string().min(1, 'Waste factor is required.'),
});

type FormValues = z.infer<typeof formSchema>;

interface Result {
    boardsToBuy: number;
    joistsNeeded: number;
}

export function DeckingCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [deckingResult, setDeckingResult] = useState<Result | null>(null);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deckWidth: '',
      deckLength: '',
      boardWidth: '5.5',
      boardLength: '12',
      joistSpacing: '16',
      wasteFactor: '10',
    },
  });

  const onSubmit = (values: FormValues) => {
    let width = parseFloat(values.deckWidth);
    let length = parseFloat(values.deckLength);
    let boardW = parseFloat(values.boardWidth);
    let boardL = parseFloat(values.boardLength);
    let joistS = parseFloat(values.joistSpacing);
    const waste = parseFloat(values.wasteFactor);

    if (units === 'metric') {
        width = width * 3.28084; // m to ft
        length = length * 3.28084; // m to ft
        boardW = boardW / 2.54; // cm to in
        boardL = boardL * 3.28084; // m to ft
        joistS = joistS / 2.54; // cm to in
    }

    if (width > 0 && length > 0 && boardW > 0 && boardL > 0 && joistS > 0 && waste >= 0) {
      const boardGap = 0.125; // in
      const widthInInches = width * 12;
      const effectiveBoardWidth = boardW + boardGap;
      const rowsNeeded = Math.ceil(widthInInches / effectiveBoardWidth);
      const totalLinearFeet = rowsNeeded * length;
      const totalLinearFeetWithWaste = totalLinearFeet * (1 + waste / 100);
      const boardsToBuy = Math.ceil(totalLinearFeetWithWaste / boardL);
      
      const joistsNeeded = Math.ceil((length * 12) / joistS) + 1;

      setDeckingResult({ boardsToBuy, joistsNeeded });
    } else {
      setDeckingResult(null);
    }
  };

  const handleClear = () => {
    form.reset();
    setDeckingResult(null);
    setAiHint(null);
  };

  const handleAiAssist = async () => {
    setLoading(true);
    setAiHint(null);
    const values = form.getValues();
    try {
      const result = await getAiAssistance({ calculatorType: calculator.name, parameters: {...values, units} });
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
      `Deck Width: ${values.deckWidth} ${units === 'imperial' ? 'ft' : 'm'}\n` +
      `Deck Length: ${values.deckLength} ${units === 'imperial' ? 'ft' : 'm'}\n` +
      `Board Width: ${values.boardWidth} ${units === 'imperial' ? 'in' : 'cm'}\n`+
      `Board Length: ${values.boardLength} ${units === 'imperial' ? 'ft' : 'm'}\n`+
      `Joist Spacing: ${values.joistSpacing} ${units === 'imperial' ? 'in' : 'cm'}\n`+
      `Waste Factor: ${values.wasteFactor}%\n\n`+
      `--------------------\n` +
      `Deck Boards Needed: ~${deckingResult.boardsToBuy} boards (${values.boardLength}${units === 'imperial' ? 'ft' : 'm'} length)\n`+
      `Joists Needed: ~${deckingResult.joistsNeeded} joists (${values.deckWidth}${units === 'imperial' ? 'ft' : 'm'} length)\n`;
    
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
          Plan your new deck project by calculating the number of deck boards and joists you'll need based on your deck's dimensions and structure. Press calculate to see the result.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-start mb-4">
                <Tabs defaultValue="imperial" onValueChange={(value) => setUnits(value as 'imperial' | 'metric')} className="w-auto">
                    <TabsList>
                        <TabsTrigger value="imperial">Imperial</TabsTrigger>
                        <TabsTrigger value="metric">Metric</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="deckWidth" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Deck Width ({units === 'imperial' ? 'ft' : 'm'})</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 12" {...field} /></FormControl>
                        <FormDescription>Dimension perpendicular to deck boards.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="deckLength" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Deck Length ({units === 'imperial' ? 'ft' : 'm'})</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 16" {...field} /></FormControl>
                        <FormDescription>Dimension parallel to deck boards.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="boardWidth" render={({ field }) => (
                     <FormItem>
                        <FormLabel>Deck Board Width ({units === 'imperial' ? 'in' : 'cm'})</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 5.5" {...field} /></FormControl>
                        <FormDescription>Actual width of the board (e.g., 5.5" for a 1x6).</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="boardLength" render={({ field }) => (
                     <FormItem>
                        <FormLabel>Deck Board Length ({units === 'imperial' ? 'ft' : 'm'})</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value={units === 'imperial' ? '8' : '2.4'}> {units === 'imperial' ? '8 ft' : '2.4 m'}</SelectItem>
                                <SelectItem value={units === 'imperial' ? '12' : '3.6'}> {units === 'imperial' ? '12 ft' : '3.6 m'}</SelectItem>
                                <SelectItem value={units === 'imperial' ? '16' : '4.8'}> {units === 'imperial' ? '16 ft' : '4.8 m'}</SelectItem>
                                <SelectItem value={units === 'imperial' ? '20' : '6'}>{units === 'imperial' ? '20 ft' : '6 m'}</SelectItem>
                            </SelectContent>
                      </Select>
                      <FormDescription>Length of boards you plan to buy.</FormDescription>
                      <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="joistSpacing" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Joist Spacing ({units === 'imperial' ? 'in' : 'cm'})</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value={units === 'imperial' ? '12' : '30'}>{units === 'imperial' ? '12" on-center' : '30 cm on-center'}</SelectItem>
                                <SelectItem value={units === 'imperial' ? '16' : '40'}>{units === 'imperial' ? '16" on-center' : '40 cm on-center'}</SelectItem>
                                <SelectItem value={units === 'imperial' ? '24' : '60'}>{units === 'imperial' ? '24" on-center' : '60 cm on-center'}</SelectItem>
                            </SelectContent>
                      </Select>
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
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate</Button>
              <Button type="button" variant="outline" onClick={handleAiAssist} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                AI Assist
              </Button>
              {deckingResult && (
                <Button type="button" variant="ghost" onClick={handleClear} className="text-destructive hover:text-destructive">
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              )}
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
              <div className="text-lg font-bold">
                <p>~{deckingResult.boardsToBuy} deck boards</p>
                <p>~{deckingResult.joistsNeeded} joists</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
