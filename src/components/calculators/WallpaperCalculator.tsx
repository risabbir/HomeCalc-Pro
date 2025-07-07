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
  roomPerimeter: z.string().min(1, 'Room perimeter is required.'),
  wallHeight: z.string().min(1, 'Wall height is required.'),
  rollWidth: z.string().min(1, 'Roll width is required.'),
  rollLength: z.string().min(1, 'Roll length is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function WallpaperCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [wallpaperResult, setWallpaperResult] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomPerimeter: '',
      wallHeight: '8',
      rollWidth: '20.5',
      rollLength: '33',
    },
  });

  const onSubmit = (values: FormValues) => {
    const perimeter = parseFloat(values.roomPerimeter);
    const height = parseFloat(values.wallHeight);
    const rWidth = parseFloat(values.rollWidth);
    const rLength = parseFloat(values.rollLength);

    if (perimeter > 0 && height > 0 && rWidth > 0 && rLength > 0) {
      const wallArea = perimeter * height;
      const rollWidthInFt = rWidth / 12; // in to ft
      const rollArea = rollWidthInFt * rLength;
      const rollsNeeded = Math.ceil(wallArea / rollArea * 1.1); // 10% waste
      setWallpaperResult(`${rollsNeeded} rolls`);
    } else {
      setWallpaperResult(null);
    }
  };

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
    if (!wallpaperResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Room Perimeter: ${values.roomPerimeter} ft\n` +
      `Wall Height: ${values.wallHeight} ft\n` +
      `Roll Width: ${values.rollWidth} in\n` +
      `Roll Length: ${values.rollLength} ft\n\n`+
      `--------------------\n` +
      `Rolls Needed: ${wallpaperResult}\n`;
    
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
          Buy the right amount of wallpaper. Calculate the total wall area (perimeter times height) and use your wallpaper roll's dimensions to find how many rolls you need. Press calculate to see the result.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="roomPerimeter" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Room Perimeter (ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 40" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="wallHeight" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Wall Height (ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="rollWidth" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Roll Width (inches)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 20.5" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="rollLength" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Roll Length (ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 33" {...field} /></FormControl>
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
