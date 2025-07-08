
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
import { Download, Loader2, Wand2, X, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const formSchema = z.object({
  roomPerimeter: z.string().min(1, 'Room perimeter is required.'),
  wallHeight: z.string().min(1, 'Wall height is required.'),
  rollWidth: z.string().min(1, 'Roll width is required.'),
  rollLength: z.string().min(1, 'Roll length is required.'),
  patternRepeat: z.string().optional(),
  wasteFactor: z.string().min(1, 'Waste factor is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function WallpaperCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [wallpaperResult, setWallpaperResult] = useState<string | null>(null);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomPerimeter: '',
      wallHeight: '8',
      rollWidth: '20.5',
      rollLength: '33',
      patternRepeat: '0',
      wasteFactor: '15',
    },
  });

  const onSubmit = (values: FormValues) => {
    let perimeter = parseFloat(values.roomPerimeter);
    let height = parseFloat(values.wallHeight);
    let rWidth = parseFloat(values.rollWidth);
    let rLength = parseFloat(values.rollLength);
    let pRepeat = parseFloat(values.patternRepeat || '0');
    const waste = parseFloat(values.wasteFactor);

    if (units === 'metric') {
        perimeter = perimeter * 3.28084; // m to ft
        height = height * 3.28084; // m to ft
        rWidth = rWidth / 2.54; // cm to in
        rLength = rLength * 3.28084; // m to ft
        pRepeat = pRepeat / 2.54; // cm to in
    }

    if (perimeter > 0 && height > 0 && rWidth > 0 && rLength > 0 && waste >= 0) {
      const perimeterInInches = perimeter * 12;
      const stripsNeeded = Math.ceil(perimeterInInches / rWidth);
      
      const heightInInches = height * 12;
      const effectiveHeight = pRepeat > 0 ? (Math.ceil(heightInInches / pRepeat) * pRepeat) : heightInInches;

      const stripsPerRoll = Math.floor((rLength * 12) / effectiveHeight);
      
      const rollsNeededRaw = Math.ceil(stripsNeeded / stripsPerRoll);
      const rollsNeededWithWaste = Math.ceil(rollsNeededRaw * (1 + waste / 100));

      setWallpaperResult(`${rollsNeededWithWaste} rolls`);
    } else {
      setWallpaperResult(null);
    }
  };

  const handleClear = () => {
    form.reset();
    setWallpaperResult(null);
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
      toast({ title: 'AI Error', description: error instanceof Error ? error.message : 'Could not get assistance from AI.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const values = form.getValues();
    if (!wallpaperResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Room Perimeter: ${values.roomPerimeter} ${units === 'imperial' ? 'ft' : 'm'}\n` +
      `Wall Height: ${values.wallHeight} ${units === 'imperial' ? 'ft' : 'm'}\n` +
      `Roll Width: ${values.rollWidth} ${units === 'imperial' ? 'in' : 'cm'}\n` +
      `Roll Length: ${values.rollLength} ${units === 'imperial' ? 'ft' : 'm'}\n`+
      `Pattern Repeat: ${values.patternRepeat || '0'} ${units === 'imperial' ? 'in' : 'cm'}\n`+
      `Waste Factor: ${values.wasteFactor}%\n\n`+
      `--------------------\n` +
      `Estimated Rolls Needed: ${wallpaperResult}\n`;
    
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
          Buy the right amount of wallpaper. Calculate the total wall area and use your wallpaper roll's dimensions to find how many rolls you need. Remember to account for pattern repeat and a waste factor for cuts.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-start mb-4">
                <Tabs defaultValue="imperial" onValueChange={(value) => setUnits(value as 'imperial' | 'metric')} className="w-auto">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="imperial">Imperial</TabsTrigger>
                        <TabsTrigger value="metric">Metric</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="roomPerimeter" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Room Perimeter ({units === 'imperial' ? 'ft' : 'm'})</FormLabel><TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>The total length of all walls to be papered. (Length1 + Width1 + Length2...).</p></TooltipContent></Tooltip></TooltipProvider></div>
                        <FormControl><Input type="number" placeholder="e.g., 40" {...field} /></FormControl>
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
                <FormField control={form.control} name="rollWidth" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Roll Width ({units === 'imperial' ? 'in' : 'cm'})</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 20.5" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="rollLength" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Roll Length ({units === 'imperial' ? 'ft' : 'm'})</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 33" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="patternRepeat" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Pattern Repeat ({units === 'imperial' ? 'in' : 'cm'})</FormLabel><TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Found on the wallpaper label. The vertical distance before the pattern repeats. Enter 0 for solid colors.</p></TooltipContent></Tooltip></TooltipProvider></div>
                        <FormControl><Input type="number" placeholder="e.g., 18" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="wasteFactor" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Waste Factor (%)</FormLabel><TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Accounts for mistakes and cuts around windows/doors. 15% is standard.</p></TooltipContent></Tooltip></TooltipProvider></div>
                        <FormControl><Input type="number" placeholder="e.g., 15" {...field} /></FormControl>
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
              {wallpaperResult && (
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
        {wallpaperResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Wallpaper Rolls Needed</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">{wallpaperResult}</p>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
