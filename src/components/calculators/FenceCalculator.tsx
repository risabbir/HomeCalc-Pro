
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
  fenceLength: z.string().min(1, 'Fence length is required.'),
  postSpacing: z.string().min(1, 'Post spacing is required.'),
  panelWidth: z.string().min(1, 'Panel/Picket width is required.'),
  picketSpacing: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Result {
    posts: number;
    panels: number | null;
    pickets: number | null;
    rails: number;
}

export function FenceCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [result, setResult] = useState<Result | null>(null);
  const [fenceType, setFenceType] = useState<'panel' | 'picket'>('panel');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fenceLength: '',
      postSpacing: '8',
      panelWidth: '8',
      picketSpacing: '2',
    },
  });

  const onSubmit = (values: FormValues) => {
    const length = parseFloat(values.fenceLength);
    const postGap = parseFloat(values.postSpacing);

    if (length <= 0 || postGap <= 0) {
        toast({ title: 'Invalid Dimensions', description: 'Please enter positive values.', variant: 'destructive' });
        return;
    }

    const sections = Math.ceil(length / postGap);
    const posts = sections + 1;
    // Assuming 2 rails for standard fences
    const rails = sections * 2;

    let panels = null;
    let pickets = null;

    if (fenceType === 'panel') {
        const panelW = parseFloat(values.panelWidth);
        if (panelW > 0) {
            panels = Math.ceil(length / panelW);
        }
    } else {
        const picketW = parseFloat(values.panelWidth);
        const picketGap = parseFloat(values.picketSpacing || '0');
        if (picketW > 0) {
            pickets = Math.ceil(length * 12 / (picketW + picketGap));
        }
    }

    setResult({ posts, panels, pickets, rails });
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
    
    const results = [
        { key: 'Fence Posts', value: `~${result.posts} posts` },
        { key: 'Horizontal Rails', value: `~${result.rails} rails (${values.postSpacing} ft length)` },
    ];

    if (result.panels) {
        results.push({ key: 'Fence Panels', value: `~${result.panels} panels (${values.panelWidth} ft width)` });
    }
    if (result.pickets) {
        results.push({ key: 'Fence Pickets', value: `~${result.pickets} pickets (${values.panelWidth}" width)` });
    }

    generatePdf({
        title: calculator.name,
        slug: calculator.slug,
        inputs: [
            { key: 'Total Fence Length', value: `${values.fenceLength} ft` },
            { key: 'Post Spacing', value: `${values.postSpacing} ft` },
            ...(fenceType === 'panel' ? [{ key: 'Panel Width', value: `${values.panelWidth} ft` }] : []),
            ...(fenceType === 'picket' ? [{ key: 'Picket Width', value: `${values.panelWidth}"` }, {key: 'Picket Spacing', value: `${values.picketSpacing}"` }] : []),
        ],
        results: results,
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            Plan your new fence by estimating the number of posts, rails, and panels or pickets needed. Check our <Link href="/resources/fence-guide" className="text-primary underline">Fence Guide</Link> for installation details.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4">
            <Select onValueChange={(v) => setFenceType(v as 'panel' | 'picket')} defaultValue="panel">
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                    <SelectItem value="panel">Panel Fence</SelectItem>
                    <SelectItem value="picket">Picket Fence (Stick-built)</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="fenceLength" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Total Fence Length (ft)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 100" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="postSpacing" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Post Spacing (ft)</FormLabel><HelpInfo>The distance from the center of one post to the center of the next. 8 feet is standard.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="panelWidth" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{fenceType === 'panel' ? 'Panel Width (ft)' : 'Picket Width (in)'}</FormLabel>
                        <FormControl><Input type="number" placeholder={fenceType === 'panel' ? "e.g., 8" : "e.g., 5.5"} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                {fenceType === 'picket' && (
                    <FormField control={form.control} name="picketSpacing" render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-1.5"><FormLabel>Picket Spacing (in)</FormLabel><HelpInfo>The gap between each picket.</HelpInfo></div>
                            <FormControl><Input type="number" placeholder="e.g., 2" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate Materials</Button>
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
                <CardTitle>Estimated Materials</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="text-lg font-bold space-y-2">
                    <li>~{result.posts} Posts</li>
                    <li>~{result.rails} Rails</li>
                    {result.panels && <li>~{result.panels} Panels</li>}
                    {result.pickets && <li>~{result.pickets} Pickets</li>}
                </ul>
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
