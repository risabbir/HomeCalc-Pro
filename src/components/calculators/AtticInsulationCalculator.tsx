
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Calculator } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, Info, X, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

const formSchema = z.object({
  atticArea: z.string().min(1, 'Attic area is required.'),
  climateZone: z.string().min(1, 'Climate zone is required.'),
  existingInsulation: z.string().min(1, 'Existing insulation depth is required.'),
  insulationType: z.enum(['loose-fill-fiberglass', 'loose-fill-cellulose']),
});

type FormValues = z.infer<typeof formSchema>;

const R_VALUES_BY_ZONE: { [key: string]: number } = {
  '1': 30, '2': 38, '3': 38, '4': 49, '5': 49, '6': 60, '7': 60, '8': 60
};

const INSULATION_DATA = {
  'loose-fill-fiberglass': {
    name: 'Loose-Fill Fiberglass',
    rValuePerInch: 2.5,
    sqftCoveragePerInchPerBag: 100,
  },
  'loose-fill-cellulose': {
    name: 'Loose-Fill Cellulose',
    rValuePerInch: 3.7,
    sqftCoveragePerInchPerBag: 55,
  },
};

interface Result {
    targetRValue: number;
    currentRValue: number;
    neededInches: number;
    bagsNeeded: number;
    insulationTypeName: string;
}

export function AtticInsulationCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [result, setResult] = useState<Result | null>(null);
  const [isSufficient, setIsSufficient] = useState(false);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      atticArea: '',
      climateZone: '5',
      existingInsulation: '0',
      insulationType: 'loose-fill-fiberglass',
    },
  });

  const onSubmit = (values: FormValues) => {
    setResult(null);
    setIsSufficient(false);

    let area = parseFloat(values.atticArea);
    const climateZone = values.climateZone;
    let existingDepth = parseFloat(values.existingInsulation);

    if (units === 'metric') {
        area = area * 10.764; // sq meters to sq feet
        existingDepth = existingDepth / 2.54; // cm to inches
    }
    
    if(isNaN(area) || area <= 0) {
      form.setError("atticArea", { type: "manual", message: "Please enter a valid area." });
      return;
    }

    const insulationType = values.insulationType;
    const selectedInsulation = INSULATION_DATA[insulationType];
    const currentRValue = existingDepth * 2.5; // Assume existing is old fiberglass/cellulose with R-2.5/inch
    const targetRValue = R_VALUES_BY_ZONE[climateZone];
    
    if (currentRValue >= targetRValue) {
      setIsSufficient(true);
      return;
    }

    const neededRValue = targetRValue - currentRValue;
    const neededInches = neededRValue / selectedInsulation.rValuePerInch;
    const bagsNeeded = Math.ceil((area * neededInches) / selectedInsulation.sqftCoveragePerInchPerBag);

    setResult({
        targetRValue,
        currentRValue,
        neededInches,
        bagsNeeded,
        insulationTypeName: selectedInsulation.name,
    });
  };

  const handleClear = () => {
    form.reset();
    setResult(null);
    setIsSufficient(false);
  };

  const handleDownload = () => {
    const values = form.getValues();
    if (!result && !isSufficient) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }

    let content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `--Your Inputs--\n` +
      `Attic Area: ${values.atticArea} ${units === 'imperial' ? 'sq ft' : 'sq m'}\n` +
      `Climate Zone: ${values.climateZone}\n` +
      `Existing Insulation: ${values.existingInsulation} ${units === 'imperial' ? 'inches' : 'cm'}\n` +
      `Selected New Insulation: ${INSULATION_DATA[values.insulationType].name}\n\n`;

    if(isSufficient) {
        content += `--------------------\n` +
        `Your current insulation level appears to be sufficient for your climate zone. No additional insulation is recommended.`;
    } else if (result) {
        const neededDisplay = units === 'imperial' ? result.neededInches.toFixed(1) + '"' : (result.neededInches * 2.54).toFixed(1) + ' cm';
        content += `--------------------\n` +
        `--Your Insulation Plan--\n` +
        `Target R-Value for Zone ${values.climateZone}: R-${result.targetRValue}\n` +
        `Additional Depth Needed: ${neededDisplay}\n` +
        `Estimated Bags Needed: ~${result.bagsNeeded} bags\n`;
    }

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
            Proper attic insulation is key to energy efficiency. This tool helps you determine how much new insulation you need to meet Department of Energy recommendations for your climate zone.
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
                <FormField control={form.control} name="atticArea" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5">
                            <FormLabel>Attic Area ({units === 'imperial' ? 'sq ft' : 'sq m'})</FormLabel>
                             <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Calculate the length times width of your attic floor.</p></TooltipContent></Tooltip></TooltipProvider>
                        </div>
                        <FormControl><Input type="number" placeholder="e.g., 1000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="climateZone" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5">
                            <FormLabel>U.S. Climate Zone</FormLabel>
                            <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Determines your recommended R-value. See our <Link href="/resources/climate-zone-map" className="text-primary underline">Climate Zone Map</Link> to find yours.</p></TooltipContent></Tooltip></TooltipProvider>
                        </div>
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
                         <div className="flex items-center gap-1.5">
                            <FormLabel>Existing Insulation Depth ({units === 'imperial' ? 'in' : 'cm'})</FormLabel>
                            <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Use a ruler to measure the depth of your current insulation at its most level point. Enter 0 if none.</p></TooltipContent></Tooltip></TooltipProvider>
                        </div>
                        <FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="insulationType" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5">
                            <FormLabel>New Insulation Type</FormLabel>
                            <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger type="button"><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Cellulose generally has a higher R-value per inch than fiberglass. Choose the type you plan to add.</p></TooltipContent></Tooltip></TooltipProvider>
                        </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                           <SelectItem value="loose-fill-fiberglass">Loose-Fill Fiberglass</SelectItem>
                           <SelectItem value="loose-fill-cellulose">Loose-Fill Cellulose</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )}/>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate</Button>
              {(result || isSufficient) && (
                <Button type="button" variant="destructive" onClick={handleClear}>
                    <X className="mr-1 h-4 w-4" />
                    Clear
                </Button>
              )}
            </div>
          </form>
        </Form>
        {isSufficient && (
             <Card className="mt-6 bg-green-500/10 border-green-500/30">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Info className="h-8 w-8 text-green-600" />
                    <div>
                        <CardTitle className="text-green-700">Insulation Level is Sufficient</CardTitle>
                        <CardDescription className="text-green-700/80">Your current insulation depth meets or exceeds the recommendation for your climate zone. No action is needed.</CardDescription>
                    </div>
                </CardHeader>
             </Card>
        )}
        {result && (
          <Card className="mt-6 bg-accent">
            <CardHeader>
                <CardTitle>Your Attic Insulation Plan</CardTitle>
                <CardDescription>Here's what you need to do to reach your energy efficiency goals.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                 <div className="bg-background/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Target R-Value</p>
                    <p className="text-3xl font-bold">R-{result.targetRValue}</p>
                 </div>
                 <div className="bg-background/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Depth to Add</p>
                    <p className="text-3xl font-bold">{units === 'imperial' ? `${result.neededInches.toFixed(1)}"` : `${(result.neededInches * 2.54).toFixed(1)} cm`}</p>
                 </div>
                 <div className="bg-background/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Bags of {result.insulationTypeName}</p>
                    <p className="text-3xl font-bold">~{result.bagsNeeded}</p>
                 </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
                 <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Disclaimer</AlertTitle>
                    <AlertDescription>This is an estimate. Coverage per bag varies by manufacturer and desired R-value. Always check the coverage chart on the packaging before purchasing.</AlertDescription>
                </Alert>
                <Button variant="ghost" size="sm" onClick={handleDownload}><Download className="h-4 w-4 mr-2" /> Download Plan</Button>
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
