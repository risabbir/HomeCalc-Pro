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
import { getAiAssistance } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2, Wand2, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  vehiclePrice: z.string().min(1, 'Vehicle price is required.'),
  downPayment: z.string().optional(),
  tradeInValue: z.string().optional(),
  interestRate: z.string().min(1, 'Interest rate is required.'),
  loanTerm: z.string().min(1, 'Loan term is required.'),
  salesTaxRate: z.string().optional(),
  otherFees: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface LoanResult {
    monthlyPayment: number;
    totalLoanAmount: number;
    totalInterest: number;
    totalCost: number;
}

export function CarLoanCalculator({ calculator }: { calculator: Omit<Calculator, 'Icon'> }) {
  const [loading, setLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [result, setResult] = useState<LoanResult | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehiclePrice: '35000',
      downPayment: '5000',
      tradeInValue: '0',
      interestRate: '7.5',
      loanTerm: '5',
      salesTaxRate: '',
      otherFees: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const price = parseFloat(values.vehiclePrice);
    const downPayment = parseFloat(values.downPayment || '0');
    const tradeIn = parseFloat(values.tradeInValue || '0');
    const annualRate = parseFloat(values.interestRate);
    const monthlyRate = annualRate / 100 / 12;
    const termInMonths = parseFloat(values.loanTerm) * 12;
    const taxRate = parseFloat(values.salesTaxRate || '0') / 100;
    const fees = parseFloat(values.otherFees || '0');
    
    const totalVehicleCost = price * (1 + taxRate) + fees;
    const P = totalVehicleCost - downPayment - tradeIn; // Principal Loan Amount

    if (P > 0 && annualRate >= 0 && termInMonths > 0) {
        if (annualRate === 0) {
            const monthlyPayment = P / termInMonths;
            setResult({
                monthlyPayment,
                totalLoanAmount: P,
                totalInterest: 0,
                totalCost: totalVehicleCost,
            });
            return;
        }

        const monthlyPayment = (P * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / (Math.pow(1 + monthlyRate, termInMonths) - 1);
        const totalPayments = monthlyPayment * termInMonths;
        const totalInterest = totalPayments - P;
        const totalCost = totalVehicleCost + totalInterest;

        setResult({
            monthlyPayment,
            totalLoanAmount: P,
            totalInterest,
            totalCost,
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
      `Vehicle Price: $${values.vehiclePrice}\n` +
      `Down Payment: $${values.downPayment || '0'}\n` +
      `Trade-in Value: $${values.tradeInValue || '0'}\n` +
      `Sales Tax Rate: ${values.salesTaxRate || '0'}%\n` +
      `Other Fees: $${values.otherFees || '0'}\n` +
      `Annual Interest Rate: ${values.interestRate}%\n` +
      `Loan Term: ${values.loanTerm} years\n\n` +
      `--------------------\n` +
      `Monthly Payment: $${result.monthlyPayment.toFixed(2)}\n` +
      `Total Loan Amount: $${result.totalLoanAmount.toFixed(2)}\n` +
      `Total Interest Paid: $${result.totalInterest.toFixed(2)}\n` +
      `Total Cost of Car (including interest): $${result.totalCost.toFixed(2)}\n`;
    
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
          Estimate your monthly car payment and see the total cost of your loan. Enter the vehicle's price and your loan details. Including a down payment or trade-in value can lower your monthly payment.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="vehiclePrice" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Price ($)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 35000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
               <FormField control={form.control} name="interestRate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Interest Rate (%)</FormLabel>
                    <FormControl><Input type="number" step="0.01" placeholder="e.g., 7.5" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
               <FormField control={form.control} name="downPayment" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Down Payment ($)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 5000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
              <FormField control={form.control} name="tradeInValue" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trade-in Value ($)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 2000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
              <FormField control={form.control} name="loanTerm" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Loan Term (Years)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
            </div>
             <div className="space-y-2">
                <h4 className="font-medium">Taxes & Fees (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-md border p-4">
                    <FormField control={form.control} name="salesTaxRate" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sales Tax Rate (%)</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 6.25" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="otherFees" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Other Fees ($)</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 500" {...field} /></FormControl>
                            <FormDescription>Title, registration, etc.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate Payment</Button>
              <Button type="button" variant="outline" onClick={handleAiAssist} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                AI Assist
              </Button>
               <Button type="button" variant="ghost" onClick={handleClear}>
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </form>
        </Form>
        {aiHint && (
          <Alert className="mt-6"><Wand2 className="h-4 w-4" /><AlertTitle>AI Suggestion</AlertTitle><AlertDescription>{aiHint}</AlertDescription></Alert>
        )}
        {result && (
          <Card className="mt-6 bg-accent">
            <CardHeader>
                <CardDescription>Estimated Monthly Payment</CardDescription>
                <CardTitle className="text-4xl">${result.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <ul className='text-sm space-y-1 w-full'>
                <li className='flex justify-between'><span>Total Loan Amount</span> <strong>${result.totalLoanAmount.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</strong></li>
                <li className='flex justify-between'><span>Total Interest Paid</span> <strong>${result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</strong></li>
                 <li className='flex justify-between font-medium'><span>Total Cost of Car</span> <strong>${result.totalCost.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</strong></li>
              </ul>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Results" className='shrink-0'><Download className="h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
