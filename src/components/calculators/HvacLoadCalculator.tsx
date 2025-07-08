
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

const formSchema = z.object({
  totalArea: z.string().min(1, 'Total area is required.'),
  climateZone: z.string().min(1, 'Climate zone is required.'),
  windowsArea: z.string().min(1, 'Windows area is required.'),
  numberOfOccupants: z.string().min(1, 'Required.'),
  insulationQuality: z.enum(['good', 'average', 'poor']),
});

type FormValues = z.infer<typeof formSchema>;

const CLIMATE_FACTORS = {
    cooling: { '1': 40, '2': 35, '3': 30, '4': 25, '5': 20, '6': 20, '7': 15, '8': 15 },
    heating: { '1': 15, '2': 20, '3': 25, '4': 30, '5': 40, '6': 45, '7': 50, '8': 55 },
}

export function HvacLoadCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [loadResult, setLoadResult] = useState<string | null>(null);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalArea: '',
      climateZone: '5',
      windowsArea: '',
      numberOfOccupants: '2',
      insulationQuality: 'average',
    },
  });

  const onSubmit = (values: FormValues) => {
    let area = parseFloat(values.totalArea);
    let windows = parseFloat(values.windowsArea);
    const climateZone = values.climateZone as keyof typeof CLIMATE_FACTORS.cooling;
    const occupants = parseInt(values.numberOfOccupants);

    if (units === 'metric') {
        area = area * 10.764; // sq m to sq ft
        windows = windows * 10.764; // sq m to sq ft
    }

    if (area > 0 && windows >= 0 && climateZone && occupants > 0) {
      let insulationMultiplier = 1;
      if (values.insulationQuality === 'poor') insulationMultiplier = 1.2;
      if (values.insulationQuality === 'good') insulationMultiplier = 0.8;
      
      const occupantLoad = occupants * 400; // BTUs per person
      const windowLoad = windows * 45; // BTUs per sq ft of window (average)
      
      const coolingLoad = ((area * CLIMATE_FACTORS.cooling[climateZone]) + windowLoad) * insulationMultiplier + occupantLoad;
      const heatingLoad = (area * CLIMATE_FACTORS.heating[climateZone]) * insulationMultiplier;
      
      if (units === 'imperial') {
        const coolingTons = (coolingLoad / 12000).toFixed(1);
        setLoadResult(`Cooling: ${coolingLoad.toFixed(0)} BTU/hr (${coolingTons} tons) | Heating: ${heatingLoad.toFixed(0)} BTU/hr`);
      } else {
        const coolingWatts = coolingLoad / 3.41;
        const heatingWatts = heatingLoad / 3.41;
        setLoadResult(`Cooling: ${coolingWatts.toFixed(0)} W | Heating: ${heatingWatts.toFixed(0)} W`);
      }

    } else {
      setLoadResult(null);
    }
  };
  
  const handleClear = () => {
    form.reset();
    setLoadResult(null);
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
    if (!loadResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Total Area: ${values.totalArea} ${units === 'imperial' ? 'sq ft' : 'sq m'}\n` +
      `Climate Zone: ${values.climateZone}\n` +
      `Windows Area: ${values.windowsArea} ${units === 'imperial' ? 'sq ft' : 'sq m'}\n` +
      `Number of Occupants: ${values.numberOfOccupants}\n` +
      `Insulation Quality: ${values.insulationQuality}\n\n`+
      `--------------------\n` +
      `Estimated Load: ${loadResult}\n` +
      `Disclaimer: This is a simplified estimate and not a substitute for a professional Manual J calculation.`;
    
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
            A simplified "Manual J" calculation to determine the heating and cooling load for your entire home. This is essential for correctly sizing a new central HVAC system.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>For Estimation Only</AlertTitle>
                <AlertDescription>
                This tool provides a simplified estimate. A professional Manual J calculation considers many more factors like window orientation, air leakage, and local design temperatures.
                </AlertDescription>
            </Alert>
            <div className="flex justify-start mb-4">
                <Tabs defaultValue="imperial" onValueChange={(value) => setUnits(value as 'imperial' | 'metric')} className="w-auto">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="imperial">Imperial</TabsTrigger>
                        <TabsTrigger value="metric">Metric</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="totalArea" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Total Conditioned Area ({units === 'imperial' ? 'sq ft' : 'sq m'})</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 2000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="windowsArea" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5">
                            <FormLabel>Total Window Area ({units === 'imperial' ? 'sq ft' : 'sq m'})</FormLabel>
                            <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Sum the area (width x height) of all windows.</p></TooltipContent></Tooltip></TooltipProvider>
                        </div>
                        <FormControl><Input type="number" placeholder="e.g., 150" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="climateZone" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5">
                            <FormLabel>U.S. Climate Zone</FormLabel>
                            <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Determines your recommended R-value. See our <Link href="/resources/climate-zone-map" className="text-primary underline">Climate Zone Map</Link> to find yours.</p></TooltipContent></Tooltip></TooltipProvider>
                        </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          {Object.keys(CLIMATE_FACTORS.cooling).map(zone => (
                             <SelectItem key={zone} value={zone}>Zone {zone}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="numberOfOccupants" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Number of Occupants</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 4" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField
                  control={form.control}
                  name="insulationQuality"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                       <div className="flex items-center gap-1.5">
                            <FormLabel>Overall Insulation Quality</FormLabel>
                            <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent>
                                <ul className="list-disc pl-4 text-left"><li><b>Good:</b> Meets or exceeds modern code; well-sealed.</li><li><b>Average:</b> Older construction, but reasonably insulated.</li><li><b>Poor:</b> Little to no insulation, drafty.</li></ul>
                            </TooltipContent></Tooltip></TooltipProvider>
                        </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue/></SelectTrigger>
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
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate Load</Button>
              <Button type="button" variant="outline" onClick={handleAiAssist} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                AI Assist
              </Button>
              {loadResult && (
                <Button type="button" variant="destructive" onClick={handleClear}>
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
        {loadResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Estimated HVAC Load</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-xl font-bold">{loadResult}</p>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
