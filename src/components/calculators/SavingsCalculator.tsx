
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
import { ReportAnIssue } from '@/components/layout/ReportAnIssue';
import { HelpInfo } from '../layout/HelpInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { generatePdf } from '@/lib/pdfGenerator';

const formSchema = z.object({
  initialDeposit: z.string().min(1, 'Initial deposit is required.'),
  monthlyContribution: z.string().min(1, 'Monthly contribution is required.'),
  interestRate: z.string().min(1, 'Interest rate is required.'),
  years: z.string().min(1, 'Investment period is required.'),
});

type FormValues = z.infer<typeof formSchema>;

interface SavingsResult {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
}

export function SavingsCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [result, setResult] = useState<SavingsResult | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialDeposit: '1000',
      monthlyContribution: '100',
      interestRate: '7',
      years: '10',
    },
  });

  const onSubmit = (values: FormValues) => {
    const P = parseFloat(values.initialDeposit);
    const PMT = parseFloat(values.monthlyContribution);
    const r = parseFloat(values.interestRate) / 100 / 12; // monthly rate
    const t = parseFloat(values.years);
    const n = t * 12; // number of months

    if (P >= 0 && PMT >= 0 && r >= 0 && n > 0) {
      if (r === 0) {
          const futureValue = P + (PMT * n);
          setResult({
            futureValue,
            totalContributions: futureValue,
            totalInterest: 0,
          });
          return;
      }
      const futureValue = P * Math.pow(1 + r, n) + PMT * ((Math.pow(1 + r, n) - 1) / r);
      const totalContributions = P + (PMT * n);
      const totalInterest = futureValue - totalContributions;

      setResult({
        futureValue,
        totalContributions,
        totalInterest,
      });
    } else {
      setResult(null);
    }
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
    
    generatePdf({
        title: calculator.name,
        slug: calculator.slug,
        inputs: [
            { key: 'Initial Deposit', value: `$${parseFloat(values.initialDeposit).toLocaleString()}` },
            { key: 'Monthly Contribution', value: `$${parseFloat(values.monthlyContribution).toLocaleString()}` },
            { key: 'Annual Interest Rate', value: `${values.interestRate}%` },
            { key: 'Investment Period', value: `${values.years} years` },
        ],
        results: [
            { key: 'Estimated Future Value', value: `$${result.futureValue.toFixed(2)}` },
            { key: 'Total Contributions', value: `$${result.totalContributions.toFixed(2)}` },
            { key: 'Total Interest Earned', value: `$${result.totalInterest.toFixed(2)}` },
        ]
    });
  };
  
  return (
    <div className="max-w-2xl mx-auto">
        <Card>
        <CardHeader>
            <CardTitle>How to use this calculator</CardTitle>
            <CardDescription>
            Plan for your future by estimating the growth of your investments over time. This calculation assumes interest is compounded monthly.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="initialDeposit" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Initial Deposit ($)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 1000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="monthlyContribution" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Monthly Contribution ($)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 100" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="interestRate" render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-1.5"><FormLabel>Annual Interest Rate (%)</FormLabel><HelpInfo>Your estimated annual rate of return. The historical average for the S&P 500 is ~10%.</HelpInfo></div>
                        <FormControl><Input type="number" step="0.01" placeholder="e.g., 7" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="years" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Investment Period (Years)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                <Button type="submit">Calculate</Button>
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
                    <CardDescription>Estimated Future Value</CardDescription>
                    <CardTitle className="text-4xl">${result.futureValue.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <ul className='text-sm space-y-1 w-full'>
                    <li className='flex justify-between'><span>Total Contributions</span> <strong>${result.totalContributions.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</strong></li>
                    <li className='flex justify-between'><span>Total Interest Earned</span> <strong>${result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</strong></li>
                </ul>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button onClick={handleDownload} variant="secondary" className="shrink-0">
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
