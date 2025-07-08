
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
import { Download, Loader2, Wand2, X, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
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
    setAiHint(null);
  };

  const handleAiAssist = async () => {
    setLoading(true);
    setAiHint(null);
    const values = form.getValues();
    try {
      const res = await getAiAssistance({ calculatorType: calculator.name, parameters: values });
      if (res.autoCalculatedValues) {
        Object.entries(res.autoCalculatedValues).forEach(([key, value]) => {
          form.setValue(key as keyof FormValues, String(value));
        });
        toast({ title: 'AI Assistance', description: 'We\'ve filled in some values for you.' });
      }
      if (res.hintsAndNextSteps) {
        setAiHint(res.hintsAndNextSteps);
      }
    } catch (error) {
      toast({ title: 'AI Error', description: 'Could not get assistance from AI.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const values = form.getValues();
    if (!result) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Initial Deposit: $${values.initialDeposit}\n` +
      `Monthly Contribution: $${values.monthlyContribution}\n` +
      `Annual Interest Rate: ${values.interestRate}%\n` +
      `Investment Period: ${values.years} years\n\n` +
      `--------------------\n` +
      `Future Value: $${result.futureValue.toFixed(2)}\n` +
      `Total Contributions: $${result.totalContributions.toFixed(2)}\n` +
      `Total Interest Earned: $${result.totalInterest.toFixed(2)}\n`;
    
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
                    <div className="flex items-center gap-1.5"><FormLabel>Annual Interest Rate (%)</FormLabel><TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Your estimated annual rate of return. The historical average for the S&P 500 is ~10%.</p></TooltipContent></Tooltip></TooltipProvider></div>
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
              <Button type="button" variant="outline" onClick={handleAiAssist} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                AI Assist
              </Button>
              {result && (
                <Button type="button" variant="destructive" onClick={handleClear}>
                  Clear
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
        {aiHint && (
          <Alert className="mt-6"><Wand2 className="h-4 w-4" /><AlertTitle>AI Suggestion</AlertTitle><AlertDescription>{aiHint}</AlertDescription></Alert>
        )}
        {result && (
          <Card className="mt-6 bg-accent">
            <CardHeader>
                <CardDescription>Estimated Future Value</CardDescription>
                <CardTitle className="text-4xl">${result.futureValue.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <ul className='text-sm space-y-1 w-full'>
                <li className='flex justify-between'><span>Total Contributions</span> <strong>${result.totalContributions.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</strong></li>
                <li className='flex justify-between'><span>Total Interest Earned</span> <strong>${result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</strong></li>
              </ul>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results" className='shrink-0'><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
