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
import { Download, Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  loanAmount: z.string().min(1, 'Loan amount is required.'),
  interestRate: z.string().min(1, 'Interest rate is required.'),
  loanTerm: z.string().min(1, 'Loan term is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function GeneralHomeCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [monthlyPayment, setMonthlyPayment] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanAmount: '',
      interestRate: '',
      loanTerm: '30',
    },
  });

  const onSubmit = (values: FormValues) => {
    const principal = parseFloat(values.loanAmount);
    const rate = parseFloat(values.interestRate) / 100 / 12;
    const term = parseFloat(values.loanTerm) * 12;

    if (principal > 0 && rate > 0 && term > 0) {
        const payment = (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
        setMonthlyPayment(`$${payment.toFixed(2)} / month`);
    } else {
        setMonthlyPayment(null);
    }
  };

  const handleAiAssist = async () => {
    setLoading(true);
    setAiHint(null);
    const values = form.getValues();
    const parameters = {
        loanAmount: values.loanAmount,
        interestRate: values.interestRate,
        loanTerm: values.loanTerm,
    };

    try {
      const result = await getAiAssistance({ calculatorType: calculator.name, parameters });
      if (result.autoCalculatedValues) {
        Object.entries(result.autoCalculatedValues).forEach(([key, value]) => {
          form.setValue(key as keyof FormValues, String(value));
        });
        toast({ title: 'AI Assistance', description: 'We\'ve filled in some values for you.' });
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
    if (!monthlyPayment) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const content = `HomeCalc Pro - ${calculator.name} (Mortgage)\n\n` +
      `Loan Amount: $${values.loanAmount}\n` +
      `Interest Rate: ${values.interestRate}%\n` +
      `Loan Term: ${values.loanTerm} years\n\n`+
      `--------------------\n` +
      `Estimated Monthly Payment: ${monthlyPayment}\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${calculator.slug}-results.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
            Estimate your monthly mortgage payment (principal and interest). This calculation does not include taxes, insurance, or PMI. Enter your desired loan amount, the annual interest rate, and the loan term in years. Press calculate to see the result.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="loanAmount" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Amount ($)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 300000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
               <FormField control={form.control} name="interestRate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Interest Rate (%)</FormLabel>
                    <FormControl><Input type="number" step="0.01" placeholder="e.g., 6.5" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
               <FormField control={form.control} name="loanTerm" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Loan Term (Years)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 30" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button type="submit">Calculate</Button>
              <Button type="button" variant="outline" onClick={handleAiAssist} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                AI Assist
              </Button>
            </div>
          </form>
        </Form>
        {aiHint && (
          <Alert className="mt-6"><Wand2 className="h-4 w-4" /><AlertTitle>AI Suggestion</AlertTitle><AlertDescription>{aiHint}</AlertDescription></Alert>
        )}
        {monthlyPayment && (
          <Card className="mt-6 bg-accent">
            <CardHeader><CardTitle>Estimated Monthly Payment</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{monthlyPayment}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results"><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
