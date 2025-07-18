
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
import { HelpInfo } from '../layout/HelpInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { generatePdf } from '@/lib/pdfGenerator';

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
            { key: 'Vehicle Price', value: `$${parseFloat(values.vehiclePrice).toLocaleString()}` },
            { key: 'Down Payment', value: `$${parseFloat(values.downPayment || '0').toLocaleString()}` },
            { key: 'Trade-in Value', value: `$${parseFloat(values.tradeInValue || '0').toLocaleString()}` },
            { key: 'Sales Tax Rate', value: `${values.salesTaxRate || '0'}%` },
            { key: 'Other Fees', value: `$${parseFloat(values.otherFees || '0').toLocaleString()}` },
            { key: 'Annual Interest Rate', value: `${values.interestRate}%` },
            { key: 'Loan Term', value: `${values.loanTerm} years` },
        ],
        results: [
            { key: 'Estimated Monthly Payment', value: `$${result.monthlyPayment.toFixed(2)}` },
            { key: 'Total Loan Amount', value: `$${result.totalLoanAmount.toFixed(2)}` },
            { key: 'Total Interest Paid', value: `$${result.totalInterest.toFixed(2)}` },
            { key: 'Total Cost of Car', value: `$${result.totalCost.toFixed(2)}` },
        ],
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How to use this calculator</CardTitle>
        <CardDescription>
          Estimate your monthly car payment and see the total cost of your loan. Enter the vehicle's price and your loan details. Including a down payment, trade-in, and fees will provide the most accurate result.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="vehiclePrice" render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1.5"><FormLabel>Vehicle Price ($)</FormLabel><HelpInfo>The sticker price or negotiated price of the car.</HelpInfo></div>
                    <FormControl><Input type="number" placeholder="e.g., 35000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
               <FormField control={form.control} name="interestRate" render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1.5"><FormLabel>Annual Interest Rate (%)</FormLabel><HelpInfo>The annual percentage rate (APR) on your loan offer.</HelpInfo></div>
                    <FormControl><Input type="number" step="0.01" placeholder="e.g., 7.5" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
               <FormField control={form.control} name="downPayment" render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1.5"><FormLabel>Down Payment ($)</FormLabel><HelpInfo>The amount of cash you are paying upfront.</HelpInfo></div>
                    <FormControl><Input type="number" placeholder="e.g., 5000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
              <FormField control={form.control} name="tradeInValue" render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1.5"><FormLabel>Trade-in Value ($)</FormLabel><HelpInfo>The value the dealership is giving you for your old car.</HelpInfo></div>
                    <FormControl><Input type="number" placeholder="e.g., 2000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
              <FormField control={form.control} name="loanTerm" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <div className="flex items-center gap-1.5"><FormLabel>Loan Term (Years)</FormLabel><HelpInfo>The length of the loan in years. Common terms are 3, 4, 5, or 6 years.</HelpInfo></div>
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
                            <div className="flex items-center gap-1.5"><FormLabel>Sales Tax Rate (%)</FormLabel><HelpInfo>Your state or local sales tax rate. Enter 6.5 for 6.5%.</HelpInfo></div>
                            <FormControl><Input type="number" placeholder="e.g., 6.25" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="otherFees" render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-1.5"><FormLabel>Other Fees ($)</FormLabel><HelpInfo>Include dealer documentation fees, title, and registration fees.</HelpInfo></div>
                            <FormControl><Input type="number" placeholder="e.g., 500" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit">Calculate Payment</Button>
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
                <CardDescription>Estimated Monthly Payment</CardDescription>
                <CardTitle className="text-4xl">${result.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <ul className='text-sm space-y-1 w-full'>
                        <li className='flex justify-between'><span>Total Loan Amount</span> <strong>${result.totalLoanAmount.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</strong></li>
                        <li className='flex justify-between'><span>Total Interest Paid</span> <strong>${result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</strong></li>
                        <li className='flex justify-between font-medium'><span>Total Cost of Car</span> <strong>${result.totalCost.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</strong></li>
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
                </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
