'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Calculator } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAiAssistance } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  roomArea: z.string().min(1, 'Room area is required.'),
  ceilingHeight: z.string().min(1, 'Ceiling height is required.'),
  insulation: z.enum(['good', 'average', 'poor']),
  sunExposure: z.enum(['shady', 'sunny']),
});

type FormValues = z.infer<typeof formSchema>;

export function HvacCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [btuResult, setBtuResult] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomArea: '',
      ceilingHeight: '',
      insulation: 'average',
      sunExposure: 'shady',
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    const values = watchedValues;
    const area = parseFloat(values.roomArea);
    const height = parseFloat(values.ceilingHeight);

    if (area > 0 && height > 0) {
      const volume = area * height;
      let btu = volume * 10;

      if (values.insulation === 'poor') btu *= 1.2;
      if (values.insulation === 'good') btu *= 0.8;
      if (values.sunExposure === 'sunny') btu *= 1.1;

      setBtuResult(`${Math.ceil(btu)} BTU/hr`);
    } else {
      setBtuResult(null);
    }
  }, [watchedValues]);

  const handleAiAssist = async () => {
    setLoading(true);
    setAiHint(null);
    const values = form.getValues();
    const parameters = {
        roomArea: values.roomArea,
        ceilingHeight: values.ceilingHeight,
        insulation: values.insulation,
        sunExposure: values.sunExposure,
    };

    try {
        const result = await getAiAssistance({
            calculatorType: calculator.name,
            parameters,
        });

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
        toast({
            title: 'AI Error',
            description: 'Could not get assistance from AI.',
            variant: 'destructive',
        });
    } finally {
        setLoading(false);
    }
  };
  
  const handleDownload = () => {
    const values = form.getValues();
    if (!btuResult) {
        toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
        return;
    }
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
        `Room Area: ${values.roomArea} sq ft\n` +
        `Ceiling Height: ${values.ceilingHeight} ft\n` +
        `Insulation: ${values.insulation}\n` +
        `Sun Exposure: ${values.sunExposure}\n\n` +
        `--------------------\n` +
        `Required Capacity: ${btuResult}\n`;

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
            Enter your room's dimensions and environmental factors to get an estimate of the cooling capacity (in British Thermal Units or BTUs) your air conditioner needs. This is a simplified estimate for residential spaces. Results are calculated automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="roomArea"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Room Area (sq ft)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 200" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="ceilingHeight"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Ceiling Height (ft)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 8" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                  control={form.control}
                  name="insulation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insulation Quality</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select insulation quality" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="average">Average</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sunExposure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sun Exposure</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select sun exposure" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="shady">Mostly Shady</SelectItem>
                          <SelectItem value="sunny">Mostly Sunny</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
          <Alert className="mt-6">
            <Wand2 className="h-4 w-4" />
            <AlertTitle>AI Suggestion</AlertTitle>
            <AlertDescription>{aiHint}</AlertDescription>
          </Alert>
        )}

        {btuResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader>
              <CardTitle>Calculation Result</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Required AC Capacity</p>
                <p className="text-2xl font-bold">{btuResult}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results">
                <Download className="h-6 w-6" />
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
