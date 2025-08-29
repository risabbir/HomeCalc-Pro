
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
import { useToast } from '@/hooks/use-toast';
import { Download, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpInfo } from '../layout/HelpInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { generatePdf } from '@/lib/pdfGenerator';
import Link from 'next/link';

const formSchema = z.object({
  roomType: z.enum(['bathroom', 'kitchen', 'whole-house']),
  roomLength: z.string().min(1, 'Length is required'),
  roomWidth: z.string().min(1, 'Width is required'),
  ceilingHeight: z.string().min(1, 'Ceiling height is required.'),
  occupants: z.string().optional(),
  climateRegion: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Result {
    cfm: number;
    fanSize: string;
    energyStar: string;
}

export function VentilationFanCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [result, setResult] = useState<Result | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomType: 'bathroom',
      roomLength: '10',
      roomWidth: '8',
      ceilingHeight: '8',
      occupants: '2',
      climateRegion: 'cold-dry',
    },
  });

  const onSubmit = (values: FormValues) => {
    const length = parseFloat(values.roomLength);
    const width = parseFloat(values.roomWidth);
    const height = parseFloat(values.ceilingHeight);
    const occupants = parseInt(values.occupants || '0');
    const area = length * width;

    if (area <= 0 || height <= 0) {
      toast({ title: 'Invalid dimensions', description: 'Please enter positive values for dimensions.', variant: 'destructive' });
      return;
    }
    
    let cfm = 0;
    
    switch (values.roomType) {
      case 'bathroom':
        cfm = Math.max(50, area);
        break;
      case 'kitchen':
        cfm = (area * height * 15) / 60;
        break;
      case 'whole-house':
        if (occupants <= 0) {
          toast({ title: 'Occupants required', description: 'Please enter the number of occupants for whole-house calculation.', variant: 'destructive' });
          return;
        }
        cfm = (area * 0.03) + (occupants * 7.5);
        break;
    }

    const roundedCfm = Math.ceil(cfm);

    let fanSize = "4 inch";
    if (roundedCfm > 90) fanSize = "6 inch";
    if (roundedCfm > 200) fanSize = "8 inch";
    if (roundedCfm > 400) fanSize = "10 inch";
    if (roundedCfm > 650) fanSize = "12 inch";

    setResult({
        cfm: roundedCfm,
        fanSize,
        energyStar: roundedCfm <= 300 ? "Look for an Energy Star rated fan for efficiency." : "Energy Star ratings are less common for very high CFM fans."
    });
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
        { key: 'Room Type', value: values.roomType.charAt(0).toUpperCase() + values.roomType.slice(1) },
        { key: 'Room Length', value: `${values.roomLength} ft` },
        { key: 'Room Width', value: `${values.roomWidth} ft` },
        { key: 'Ceiling Height', value: `${values.ceilingHeight} ft` },
    ];
    if (values.roomType === 'whole-house') {
        inputs.push({ key: 'Number of Occupants', value: values.occupants || '0' });
        inputs.push({ key: 'Climate Region', value: values.climateRegion || 'N/A' });
    }

    generatePdf({
        title: calculator.name,
        slug: calculator.slug,
        inputs,
        results: [
            { key: 'Recommended Airflow', value: `${result.cfm} CFM` },
            { key: 'Suggested Fan/Duct Size', value: result.fanSize },
            { key: 'Efficiency Note', value: result.energyStar },
        ]
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            Proper ventilation is key to good indoor air quality. Select the room type and enter its dimensions to find the recommended fan airflow capacity in Cubic Feet per Minute (CFM). For more details, see our <Link href="/resources/understanding-home-ventilation" className="text-primary underline">Ventilation Guide</Link>.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="roomType" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Room Type</FormLabel>
                      <Select onValueChange={(value) => { field.onChange(value); form.setValue('occupants', form.getValues('occupants')) }} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="bathroom">Bathroom</SelectItem>
                          <SelectItem value="kitchen">Kitchen</SelectItem>
                          <SelectItem value="whole-house">Whole House</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="roomLength" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Room Length (ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="roomWidth" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Room Width (ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="ceilingHeight" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ceiling Height (ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                {form.watch('roomType') === 'whole-house' && (
                    <>
                    <FormField control={form.control} name="occupants" render={({ field }) => (
                        <FormItem>
                             <div className="flex items-center gap-1.5"><FormLabel># of Occupants</FormLabel><HelpInfo>The number of people living in the home, used for whole-house ventilation calculations (ASHRAE 62.2 standard).</HelpInfo></div>
                            <FormControl><Input type="number" placeholder="e.g., 4" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="climateRegion" render={({ field }) => (
                        <FormItem>
                             <FormLabel>Climate Region</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="hot-humid">Hot-Humid</SelectItem>
                                    <SelectItem value="cold-dry">Cold-Dry</SelectItem>
                                    <SelectItem value="mixed">Mixed</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    </>
                )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate CFM</Button>
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
                <CardTitle>Recommended Fan Airflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="text-2xl font-bold">{result.cfm} CFM</div>
                <div><strong>Suggested Fan/Duct Size:</strong> {result.fanSize}</div>
                <div className="text-sm text-muted-foreground">{result.energyStar}</div>
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
