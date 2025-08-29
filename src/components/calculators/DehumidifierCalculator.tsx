
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
import { useToast } from '@/hooks/use-toast';
import { Download, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpInfo } from '../layout/HelpInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { generatePdf } from '@/lib/pdfGenerator';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import Link from 'next/link';

const formSchema = z.object({
  roomArea: z.string().min(1, 'Room area is required.'),
  initialHumidity: z.enum(['moderately-damp', 'very-damp', 'wet', 'extremely-wet']),
  desiredHumidity: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PINT_CAPACITY_MAP_2019 = {
    'moderately-damp': { 500: 20, 1000: 25, 1500: 30, 2000: 35, 2500: 40 },
    'very-damp': { 500: 25, 1000: 30, 1500: 35, 2000: 40, 2500: 45 },
    'wet': { 500: 30, 1000: 35, 1500: 40, 2000: 45, 2500: 50 },
    'extremely-wet': { 500: 35, 1000: 40, 1500: 45, 2000: 50, 2500: 55 },
} as const;

export function DehumidifierCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [result, setResult] = useState<{ newPints: number, oldPints: number } | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomArea: '1500',
      initialHumidity: 'very-damp',
      desiredHumidity: '50',
    },
  });

  const onSubmit = (values: FormValues) => {
    const area = parseFloat(values.roomArea);
    if (area <= 0) {
      toast({ title: 'Invalid area', description: 'Please enter a positive value for the room area.', variant: 'destructive' });
      return;
    }

    const areaKey = Object.keys(PINT_CAPACITY_MAP_2019['moderately-damp']).reduce((prev, curr) => 
        Math.abs(parseInt(curr) - area) < Math.abs(parseInt(prev) - area) ? curr : prev
    ) as keyof typeof PINT_CAPACITY_MAP_2019['moderately-damp'];

    const newPints = PINT_CAPACITY_MAP_2019[values.initialHumidity][areaKey];
    
    const oldPints = Math.round((newPints / 0.6));

    setResult({ newPints, oldPints });
  };

  const handleClear = () => {
    form.reset();
    setResult(null);
  };

  const handleDownload = () => {
    const values = form.getValues();
    if (!result) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    
    const inputs = [
        { key: 'Room Area', value: `${values.roomArea} sq ft` },
        { key: 'Room Condition', value: values.initialHumidity.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) },
    ];
    if (values.desiredHumidity) {
        inputs.push({ key: 'Desired Humidity', value: `${values.desiredHumidity}%` });
    }

    generatePdf({
        title: calculator.name,
        slug: calculator.slug,
        inputs,
        results: [
            { key: 'Recommended Size (2019+ Models)', value: `${result.newPints} Pint Capacity` },
            { key: 'Equivalent Size (Pre-2019 Models)', value: `~${result.oldPints} Pint Capacity` },
        ],
        disclaimer: 'Modern dehumidifiers are rated under a new 2019 DOE standard. A new 35-pint model is roughly equivalent to an old 50-pint model.'
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
          Find the right size dehumidifier to effectively remove moisture from your room or basement. Choose the condition that best describes your space. Learn more in our <Link href="/resources/choosing-a-dehumidifier" className='text-primary underline'>guide</Link>.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="roomArea" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Room Area (sq ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 1500" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="initialHumidity" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Room Condition</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="moderately-damp">Moderately Damp (feels clammy)</SelectItem>
                          <SelectItem value="very-damp">Very Damp (musty odor)</SelectItem>
                          <SelectItem value="wet">Wet (visible water beads)</SelectItem>
                          <SelectItem value="extremely-wet">Extremely Wet (seepage)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="desiredHumidity" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <div className="flex items-center gap-1.5"><FormLabel>Desired Humidity (%) (Optional)</FormLabel><HelpInfo>The target humidity level you want to achieve. 45-50% is ideal for comfort and mold prevention.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate Size</Button>
              {result && (
                <Button type="button" variant="destructive" onClick={handleClear}>
                  Clear<X className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
        {result && (
          <Card className="mt-6 bg-accent">
            <CardHeader>
                <CardTitle>Recommended Dehumidifier Size</CardTitle>
                <Alert className='mt-4 border-primary/20'>
                    <AlertTitle>Important: New Sizing Standards</AlertTitle>
                    <AlertDescription>Dehumidifier testing standards changed in 2019. Our primary recommendation is for modern units. The pre-2019 equivalent is for comparison only.</AlertDescription>
                </Alert>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-background rounded-lg p-4 border text-center">
                    <p className="text-sm font-semibold">For units made AFTER 2019:</p>
                    <p className="text-3xl font-bold text-primary">{result.newPints} Pints/Day</p>
                    <p className="text-xs text-muted-foreground">Moisture Removal Capacity</p>
                </div>
                 <div className="bg-background rounded-lg p-4 border text-center">
                    <p className="text-sm font-semibold">For units made BEFORE 2019:</p>
                    <p className="text-3xl font-bold text-muted-foreground">~{result.oldPints} Pints/Day</p>
                     <p className="text-xs text-muted-foreground">Equivalent Capacity</p>
                </div>
            </CardContent>
            <CardContent>
                <TooltipProvider>
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={handleDownload} variant="secondary">
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Download results as PDF</p>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
