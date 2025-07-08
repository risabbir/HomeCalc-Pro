
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Calculator } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAiAssistance } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2, Wand2, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  roomLength: z.string().min(1, 'Room length is required.'),
  roomWidth: z.string().min(1, 'Room width is required.'),
  wallHeight: z.string().min(1, 'Wall height is required.'),
  coats: z.string().min(1, 'Number of coats is required.'),
  numWindows: z.string().optional(),
  numDoors: z.string().optional(),
  includeCeiling: z.boolean().optional(),
});
type FormValues = z.infer<typeof formSchema>;

export function HomeImprovementCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [paintResult, setPaintResult] = useState<string | null>(null);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
        roomLength: '',
        roomWidth: '',
        wallHeight: '8',
        coats: '2',
        numWindows: '0',
        numDoors: '0',
        includeCeiling: false,
    },
  });

  const onSubmit = (values: FormValues) => {
    let length = parseFloat(values.roomLength);
    let width = parseFloat(values.roomWidth);
    let height = parseFloat(values.wallHeight);
    const coats = parseInt(values.coats, 10);
    const windows = parseInt(values.numWindows || '0', 10);
    const doors = parseInt(values.numDoors || '0', 10);

    const GALLONS_PER_SQFT = 350;
    const LITERS_PER_SQ_METER = 9.8; // Approx. coverage for metric

    if (units === 'metric') {
        length = length * 3.28084; // m to ft for underlying logic
        width = width * 3.28084; // m to ft
        height = height * 3.28084; // m to ft
    }

    if (length > 0 && width > 0 && height > 0 && coats > 0) {
      const wallArea = 2 * (length + width) * height;
      const areaToSubtract = (windows * 15) + (doors * 21); // Standard imperial area for windows and doors
      let paintableArea = wallArea - areaToSubtract;

      if(values.includeCeiling) {
        const ceilingArea = length * width;
        paintableArea += ceilingArea;
      }
      
      if (units === 'imperial') {
          const gallonsNeeded = (paintableArea * coats) / GALLONS_PER_SQFT;
          setPaintResult(`${gallonsNeeded.toFixed(2)} gallons`);
      } else {
          const paintableAreaMetric = paintableArea / 10.764; // sq ft to sq m
          const litersNeeded = (paintableAreaMetric * coats) / LITERS_PER_SQ_METER;
          setPaintResult(`${litersNeeded.toFixed(2)} liters`);
      }

    } else {
      setPaintResult(null);
    }
  };

  const handleClear = () => {
    form.reset();
    setPaintResult(null);
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
    if (!paintResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const unit = units === 'imperial' ? 'ft' : 'm';
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Room Dimensions (LxWxH): ${values.roomLength} ${unit} x ${values.roomWidth} ${unit} x ${values.wallHeight} ${unit}\n` +
      `Number of Coats: ${values.coats}\n` +
      `Number of Windows: ${values.numWindows || '0'}\n` +
      `Number of Doors: ${values.numDoors || '0'}\n` +
      `Paint Ceiling: ${values.includeCeiling ? 'Yes' : 'No'}\n\n` +
      `--------------------\n` +
      `Paint Needed: ${paintResult}\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${calculator.slug}-results.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            Figure out how much paint you'll need. Enter your room's dimensions and the number of coats. We'll automatically subtract standard-sized areas for doors and windows.
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField control={form.control} name="roomLength" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Length ({units === 'imperial' ? 'ft' : 'm'})</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 12" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
              <FormField control={form.control} name="roomWidth" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Width ({units === 'imperial' ? 'ft' : 'm'})</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
              <FormField control={form.control} name="wallHeight" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wall Height ({units === 'imperial' ? 'ft' : 'm'})</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
            </div>
             <div className="space-y-2">
                <FormLabel>Doors, Windows, and Ceiling</FormLabel>
                <FormDescription>Enter details to exclude from the total area or add the ceiling.</FormDescription>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-md border p-4">
                    <FormField control={form.control} name="numDoors" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Number of Doors</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 1" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="numWindows" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Number of Windows</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 2" {...field} /></FormControl>
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
                 <div className="pt-2">
                    <FormField
                        control={form.control}
                        name="includeCeiling"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                Also paint the ceiling?
                                </FormLabel>
                                <FormDescription>
                                Check this box to include the ceiling area in the calculation.
                                </FormDescription>
                            </div>
                            </FormItem>
                        )}
                        />
                </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate</Button>
              <Button type="button" variant="outline" onClick={handleAiAssist} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                AI Assist
              </Button>
              {paintResult && (
                <Button type="button" variant="ghost" onClick={handleClear}>
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
        {paintResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Paint Estimation</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Paint Needed</p>
                <p className="text-2xl font-bold">{paintResult}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
