
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
import { Download, Loader2, Wand2, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
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
  
  const onSubmit = (values: FormValues) => {
    let area = parseFloat(values.roomArea);
    let height = parseFloat(values.ceilingHeight);

    if (units === 'metric') {
        area = area * 10.764; // sq m to sq ft
        height = height * 3.28084; // m to ft
    }

    if (area > 0 && height > 0) {
      const volume = area * height;
      let btu = volume * 10;

      if (values.insulation === 'poor') btu *= 1.2;
      if (values.insulation === 'good') btu *= 0.8;
      if (values.sunExposure === 'sunny') btu *= 1.1;

      if (units === 'imperial') {
          setBtuResult(`${Math.ceil(btu)} BTU/hr`);
      } else {
          const watts = btu / 3.41;
          setBtuResult(`${Math.ceil(watts)} Watts`);
      }
    } else {
      setBtuResult(null);
    }
  };

  const handleClear = () => {
    form.reset();
    setBtuResult(null);
    setAiHint(null);
  };

  const handleAiAssist = async () => {
    setLoading(true);
    setAiHint(null);
    const values = form.getValues();
    try {
        const result = await getAiAssistance({
            calculatorType: calculator.name,
            parameters: {...values, units},
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
        `Units: ${units}\n`+
        `Room Area: ${values.roomArea} ${units === 'imperial' ? 'sq ft' : 'sq m'}\n` +
        `Ceiling Height: ${values.ceilingHeight} ${units === 'imperial' ? 'ft' : 'm'}\n` +
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
            Enter your room's dimensions and environmental factors to get an estimate of the cooling capacity your air conditioner needs. This is a simplified estimate for residential spaces.
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
                <FormField
                control={form.control}
                name="roomArea"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Room Area ({units === 'imperial' ? 'sq ft' : 'sq m'})</FormLabel>
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
                    <FormLabel>Ceiling Height ({units === 'imperial' ? 'ft' : 'm'})</FormLabel>
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
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate</Button>
              <Button type="button" variant="outline" onClick={handleAiAssist} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  AI Assist
              </Button>
              {btuResult && (
                <Button type="button" variant="ghost" onClick={handleClear} className="text-destructive hover:text-destructive">
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              )}
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
