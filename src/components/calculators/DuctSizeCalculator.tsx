
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
import { Download, X, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HelpInfo } from '../layout/HelpInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { generatePdf } from '@/lib/pdfGenerator';

const formSchema = z.object({
  airFlow: z.string().min(1, 'Air Flow (CFM) is required.'),
  frictionLoss: z.string().min(1, 'Friction loss is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function DuctSizeCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [ductSizeResult, setDuctSizeResult] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      airFlow: '',
      frictionLoss: '0.1',
    },
  });

  const onSubmit = (values: FormValues) => {
    const cfm = parseFloat(values.airFlow);
    const friction = parseFloat(values.frictionLoss);

    if (cfm > 0 && friction > 0) {
      // Simplified Ductulator formula approximation for round metal ducts.
      const diameter = 1.3 * Math.pow(Math.pow(cfm, 0.9) / friction, 0.2);
      setDuctSizeResult(`${diameter.toFixed(1)}-inch round duct`);
    } else {
      setDuctSizeResult(null);
    }
  };

  const handleClear = () => {
    form.reset();
    setDuctSizeResult(null);
  };

  const handleDownload = () => {
    const values = form.getValues();
    if (!ductSizeResult) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    
    generatePdf({
        title: calculator.name,
        slug: calculator.slug,
        inputs: [
            { key: 'Air Flow (CFM)', value: values.airFlow },
            { key: 'Friction Loss Rate', value: `${values.frictionLoss} in. w.g./100 ft` },
        ],
        results: [
            { key: 'Recommended Duct Size', value: ductSizeResult },
        ],
        disclaimer: 'This is a simplified estimate for round metal ducts and is not a substitute for professional HVAC design using ACCA Manual D.'
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            Ensure efficient airflow in your HVAC system by calculating the correct duct size. This is a simplified tool and requires technical inputs like Air Flow (CFM) and Friction Loss Rate, which are typically determined by a full HVAC load calculation (Manual J).
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>For Professional Use</AlertTitle>
                <AlertDescription>
                 This calculator is intended for HVAC professionals or knowledgeable homeowners. Incorrect duct sizing can lead to poor performance and inefficiency.
                </AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="airFlow" render={({ field }) => (
                    <FormItem>
                         <div className="flex items-center gap-1.5">
                            <FormLabel>Air Flow (CFM)</FormLabel>
                            <HelpInfo>Cubic Feet per Minute. This is the volume of air the duct needs to move, typically 400 CFM per ton of AC.</HelpInfo>
                        </div>
                        <FormControl><Input type="number" placeholder="e.g., 800" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="frictionLoss" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5">
                            <FormLabel>Friction Loss (in. w.g./100 ft)</FormLabel>
                            <HelpInfo>The resistance to airflow. 0.1 in. w.g. is a common value for residential main trunk lines.</HelpInfo>
                        </div>
                        <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.1" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate</Button>
              {ductSizeResult && (
                <Button type="button" variant="destructive" onClick={handleClear}>
                  Clear<X className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
        {ductSizeResult && (
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Recommended Duct Size</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-2xl font-bold">{ductSizeResult}</p>
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
