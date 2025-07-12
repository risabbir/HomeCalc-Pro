
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { HelpInfo } from '../layout/HelpInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { generatePdf } from '@/lib/pdfGenerator';

const formSchema = z.object({
  deckWidth: z.string().min(1, 'Deck width is required.'),
  deckLength: z.string().min(1, 'Deck length is required.'),
  boardWidth: z.string().min(1, 'Board width is required.'),
  boardLength: z.string().min(1, 'Board length is required.'),
  joistSpacing: z.string().min(1, 'Joist spacing is required.'),
  wasteFactor: z.string().min(1, 'Waste factor is required.'),
});

type FormValues = z.infer<typeof formSchema>;

interface Result {
    boardsToBuy: number;
    joistsNeeded: number;
}

export function DeckingCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [deckingResult, setDeckingResult] = useState<Result | null>(null);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deckWidth: '',
      deckLength: '',
      boardWidth: '5.5',
      boardLength: '12',
      joistSpacing: '16',
      wasteFactor: '10',
    },
  });

  const onSubmit = (values: FormValues) => {
    let width = parseFloat(values.deckWidth);
    let length = parseFloat(values.deckLength);
    let boardW = parseFloat(values.boardWidth);
    let boardL = parseFloat(values.boardLength);
    let joistS = parseFloat(values.joistSpacing);
    const waste = parseFloat(values.wasteFactor);

    if (units === 'metric') {
        width = width * 3.28084; // m to ft
        length = length * 3.28084; // m to ft
        boardW = boardW / 2.54; // cm to in
        boardL = boardL * 3.28084; // m to ft
        joistS = joistS / 2.54; // cm to in
    }

    if (width > 0 && length > 0 && boardW > 0 && boardL > 0 && joistS > 0 && waste >= 0) {
      const boardGap = 0.125; // in
      const widthInInches = width * 12;
      const effectiveBoardWidth = boardW + boardGap;
      const rowsNeeded = Math.ceil(widthInInches / effectiveBoardWidth);
      const totalLinearFeet = rowsNeeded * length;
      const totalLinearFeetWithWaste = totalLinearFeet * (1 + waste / 100);
      const boardsToBuy = Math.ceil(totalLinearFeetWithWaste / boardL);
      
      const joistsNeeded = Math.ceil((length * 12) / joistS) + 1;

      setDeckingResult({ boardsToBuy, joistsNeeded });
    } else {
      setDeckingResult(null);
    }
  };

  const handleClear = () => {
    form.reset();
    setDeckingResult(null);
  };

  const handleDownload = () => {
    const values = form.getValues();
    if (!deckingResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }

    const boardLengthDisplay = `${values.boardLength}${units === 'imperial' ? 'ft' : 'm'}`;
    const joistLengthDisplay = `${values.deckWidth}${units === 'imperial' ? 'ft' : 'm'}`;

    generatePdf({
        title: calculator.name,
        slug: calculator.slug,
        inputs: [
            { key: 'Deck Width', value: `${values.deckWidth} ${units === 'imperial' ? 'ft' : 'm'}` },
            { key: 'Deck Length', value: `${values.deckLength} ${units === 'imperial' ? 'ft' : 'm'}` },
            { key: 'Deck Board Width', value: `${values.boardWidth} ${units === 'imperial' ? 'in' : 'cm'}` },
            { key: 'Deck Board Length', value: boardLengthDisplay },
            { key: 'Joist Spacing', value: `${values.joistSpacing} ${units === 'imperial' ? 'in' : 'cm'}` },
            { key: 'Waste Factor', value: `${values.wasteFactor}%` },
        ],
        results: [
            { key: 'Deck Boards Needed', value: `~${deckingResult.boardsToBuy} boards (${boardLengthDisplay} length)` },
            { key: 'Joists Needed', value: `~${deckingResult.joistsNeeded} joists (${joistLengthDisplay} length)` },
        ],
        disclaimer: 'This is a materials estimate for standard layouts. Complex designs may require more materials. Always consult a building professional.'
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
          Plan your new deck project by calculating the number of deck boards and framing joists you'll need based on your deck's dimensions and structure. Check our <Link href="/resources/deck-checklist" className="text-primary underline">Deck Building Checklist</Link> for a full project guide.
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
                <FormField control={form.control} name="deckWidth" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Deck Width ({units === 'imperial' ? 'ft' : 'm'})</FormLabel><HelpInfo>The dimension perpendicular to the direction your deck boards will run.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 12" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="deckLength" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Deck Length ({units === 'imperial' ? 'ft' : 'm'})</FormLabel><HelpInfo>The dimension parallel to the direction your deck boards will run.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 16" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="boardWidth" render={({ field }) => (
                     <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Deck Board Width ({units === 'imperial' ? 'in' : 'cm'})</FormLabel><HelpInfo>The actual measured width of a single deck board. (e.g., a "1x6" board is actually 5.5 inches wide).</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 5.5" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="boardLength" render={({ field }) => (
                     <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Deck Board Length</FormLabel></div>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value={units === 'imperial' ? '8' : '2.4'}> {units === 'imperial' ? '8 ft' : '2.4 m'}</SelectItem>
                                <SelectItem value={units === 'imperial' ? '12' : '3.6'}> {units === 'imperial' ? '12 ft' : '3.6 m'}</SelectItem>
                                <SelectItem value={units === 'imperial' ? '16' : '4.8'}> {units === 'imperial' ? '16 ft' : '4.8 m'}</SelectItem>
                                <SelectItem value={units === 'imperial' ? '20' : '6'}>{units === 'imperial' ? '20 ft' : '6 m'}</SelectItem>
                            </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="joistSpacing" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Joist Spacing</FormLabel><HelpInfo>The distance from the center of one joist to the center of the next. 16" (40cm) is standard.</HelpInfo></div>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value={units === 'imperial' ? '12' : '30'}>{units === 'imperial' ? '12" on-center' : '30 cm on-center'}</SelectItem>
                                <SelectItem value={units === 'imperial' ? '16' : '40'}>{units === 'imperial' ? '16" on-center' : '40 cm on-center'}</SelectItem>
                                <SelectItem value={units === 'imperial' ? '24' : '60'}>{units === 'imperial' ? '24" on-center' : '60 cm on-center'}</SelectItem>
                            </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="wasteFactor" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Waste Factor (%)</FormLabel><HelpInfo>Accounts for cuts, mistakes, and unusable board sections. 10-15% is standard.</HelpInfo></div>
                        <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate</Button>
              {deckingResult && (
                <Button type="button" variant="destructive" onClick={handleClear}>
                  Clear<X className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
        {deckingResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader>
                <CardTitle>Estimated Materials</CardTitle>
                <CardDescription>Includes waste factor. Does not include hardware or footings.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-lg font-bold">
                <p>~{deckingResult.boardsToBuy} deck boards</p>
                <p>~{deckingResult.joistsNeeded} joists</p>
              </div>
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
