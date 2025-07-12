
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Calculator } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportAnIssue } from '@/components/layout/ReportAnIssue';
import { HelpInfo } from '../layout/HelpInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { generatePdf } from '@/lib/pdfGenerator';

const formSchema = z.object({
  roomArea: z.string().min(1, 'Room area is required.'),
  ceilingHeight: z.string().min(1, 'Ceiling height is required.'),
  insulation: z.enum(['good', 'average', 'poor']),
  sunExposure: z.enum(['shady', 'sunny']),
});

type FormValues = z.infer<typeof formSchema>;

export function HvacCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [btuResult, setBtuResult] = useState<string | null>(null);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomArea: '',
      ceilingHeight: '8',
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
      let btu = area * 25;

      if (height > 8) {
          btu += (area * (height - 8)) * 4;
      }

      if (values.insulation === 'poor') btu *= 1.2;
      if (values.insulation === 'good') btu *= 0.8;
      if (values.sunExposure === 'sunny') btu *= 1.1;

      if (units === 'imperial') {
          setBtuResult(`${Math.ceil(btu / 100) * 100} BTU/hr`);
      } else {
          const watts = btu / 3.41;
          setBtuResult(`${Math.ceil(watts / 100) * 100} Watts`);
      }
    } else {
      setBtuResult(null);
    }
  };

  const handleClear = () => {
    form.reset();
    setBtuResult(null);
  };
  
  const handleDownload = () => {
    const values = form.getValues();
    if (!btuResult) {
        toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
        return;
    }
    
    generatePdf({
        title: calculator.name,
        slug: calculator.slug,
        inputs: [
            { key: 'Room Area', value: `${values.roomArea} ${units === 'imperial' ? 'sq ft' : 'sq m'}` },
            { key: 'Ceiling Height', value: `${values.ceilingHeight} ${units === 'imperial' ? 'ft' : 'm'}` },
            { key: 'Insulation Quality', value: values.insulation },
            { key: 'Sun Exposure', value: values.sunExposure },
        ],
        results: [
            { key: 'Required AC Capacity', value: btuResult },
        ]
    });
  };

  return (
    <div className='max-w-2xl mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>How to use this calculator</CardTitle>
          <CardDescription>
              Enter your room's dimensions and environmental factors to get an estimate of the cooling capacity (BTU) your air conditioner needs. This is a simplified estimate for residential spaces.
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
                        <div className="flex items-center gap-1.5">
                              <FormLabel>Insulation Quality</FormLabel>
                              <HelpInfo>
                                  <ul className="list-disc pl-4 text-left max-w-xs"><li><b>Good:</b> Well-insulated walls, ceiling, and floor; double-pane windows.</li><li><b>Average:</b> Standard insulation; some leakage.</li><li><b>Poor:</b> Little to no insulation; single-pane windows.</li></ul>
                              </HelpInfo>
                          </div>
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
                        <div className="flex items-center gap-1.5">
                          <FormLabel>Sun Exposure</FormLabel>
                          <HelpInfo>Choose "Sunny" if the room gets significant direct sunlight, especially in the afternoon.</HelpInfo>
                        </div>
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
                {btuResult && (
                  <Button type="button" variant="destructive" onClick={handleClear}>
                    Clear<X className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
          
          {btuResult && (
            <Card className="mt-6 bg-accent">
              <CardHeader>
                <CardTitle>Required AC Capacity</CardTitle>
                <CardDescription>The estimated cooling power your AC unit needs for this room.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-2xl font-bold">{btuResult}</p>
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
      <ReportAnIssue />
    </div>
  );
}
