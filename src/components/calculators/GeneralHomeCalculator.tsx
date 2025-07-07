'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Calculator } from '@/lib/calculators';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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
  propertyTax: z.string().optional(),
  homeInsurance: z.string().optional(),
  pmi: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PaymentBreakdown {
    principalAndInterest: number;
    tax: number;
    insurance: number;
    pmi: number;
    total: number;
}

export function GeneralHomeCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [paymentBreakdown, setPaymentBreakdown] = useState<PaymentBreakdown | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanAmount: '300000',
      interestRate: '6.5',
      loanTerm: '30',
      propertyTax: '',
      homeInsurance: '',
      pmi: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const principal = parseFloat(values.loanAmount);
    const annualRate = parseFloat(values.interestRate);
    const monthlyRate = annualRate / 100 / 12;
    const termInMonths = parseFloat(values.loanTerm) * 12;

    const annualTax = parseFloat(values.propertyTax || '0');
    const annualInsurance = parseFloat(values.homeInsurance || '0');
    const monthlyPmi = parseFloat(values.pmi || '0');

    if (principal > 0 && annualRate > 0 && termInMonths > 0) {
        const pAndI = (principal * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / (Math.pow(1 + monthlyRate, termInMonths) - 1);
        const monthlyTax = annualTax / 12;
        const monthlyInsurance = annualInsurance / 12;
        const totalPayment = pAndI + monthlyTax + monthlyInsurance + monthlyPmi;

        setPaymentBreakdown({
            principalAndInterest: pAndI,
            tax: monthlyTax,
            insurance: monthlyInsurance,
            pmi: monthlyPmi,
            total: totalPayment,
        });
    } else {
        setPaymentBreakdown(null);
    }
  };

  const handleAiAssist = async () => {
    setLoading(true);
    setAiHint(null);
    const values = form.getValues();
    try {
      const result = await getAiAssistance({ calculatorType: calculator.name, parameters: values });
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
    if (!paymentBreakdown) {
      toast({ title: 'No result to download', description: 'Please calculate first.', variant: 'destructive' });
      return;
    }
    const content = `HomeCalc Pro - ${calculator.name} Results\n\n` +
      `Loan Amount: $${values.loanAmount}\n` +
      `Interest Rate: ${values.interestRate}%\n` +
      `Loan Term: ${values.loanTerm} years\n` +
      `Annual Property Tax: $${values.propertyTax || '0'}\n` +
      `Annual Home Insurance: $${values.homeInsurance || '0'}\n` +
      `Monthly PMI: $${values.pmi || '0'}\n\n` +
      `--------------------\n` +
      `Principal & Interest: $${paymentBreakdown.principalAndInterest.toFixed(2)}\n` +
      `Taxes: $${paymentBreakdown.tax.toFixed(2)}\n` +
      `Insurance: $${paymentBreakdown.insurance.toFixed(2)}\n` +
      `PMI: $${paymentBreakdown.pmi.toFixed(2)}\n` +
      `TOTAL MONTHLY PAYMENT: $${paymentBreakdown.total.toFixed(2)}\n`;
    
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
            Estimate your monthly mortgage payment. For a more accurate result, include optional expenses like property taxes, home insurance, and private mortgage insurance (PMI).
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
             <div className="space-y-2">
                <h4 className="font-medium">Optional Expenses</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-md border p-4">
                    <FormField control={form.control} name="propertyTax" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Property Tax ($/yr)</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 4000" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="homeInsurance" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Insurance ($/yr)</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 1500" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="pmi" render={({ field }) => (
                        <FormItem>
                            <FormLabel>PMI ($/mo)</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 100" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
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
        {paymentBreakdown && (
          <Card className="mt-6 bg-accent">
            <CardHeader>
                <CardDescription>Estimated Monthly Payment</CardDescription>
                <CardTitle className="text-4xl">${paymentBreakdown.total.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <ul className='text-sm space-y-1 w-full'>
                <li className='flex justify-between'><span>Principal & Interest</span> <strong>${paymentBreakdown.principalAndInterest.toFixed(2)}</strong></li>
                <li className='flex justify-between'><span>Property Tax</span> <span>${paymentBreakdown.tax.toFixed(2)}</span></li>
                <li className='flex justify-between'><span>Home Insurance</span> <span>${paymentBreakdown.insurance.toFixed(2)}</span></li>
                <li className='flex justify-between'><span>PMI</span> <span>${paymentBreakdown.pmi.toFixed(2)}</span></li>
              </ul>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results" className='shrink-0'><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
