

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Building2, Lightbulb, ShieldQuestion, HelpCircle } from "lucide-react";
import { ReportAnIssue } from "@/components/layout/ReportAnIssue";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "FAQ | HomeCalc Pro",
  description: "Frequently Asked Questions about HomeCalc Pro's calculators, AI features, and project planning tools.",
};

const generalFaqs = [
    {
        question: "Are these calculators 100% accurate?",
        answer: "Our calculators are designed for estimation purposes only. They provide a good starting point for planning, but for critical applications, we strongly recommend consulting with a qualified professional. Factors like local building codes, specific material properties, and unique project conditions can affect final results."
    },
    {
        question: "Can I save my calculation results?",
        answer: "Yes! Each calculator has a 'Download Results' button that appears after you perform a calculation. This will download a simple text file with your inputs and the calculated result for your records."
    },
    {
        question: "What if I can't find the calculator I need?",
        answer: "We are always looking to expand our toolset. You can use the 'AI Recommendations' feature on the homepage to describe your project. While it can only recommend existing calculators, this feedback helps us understand what tools our users are looking for. You can also ask our AI Chatbot for help on topics we don't have a calculator for."
    }
]

const aiFaqs = [
    {
        question: "How does the AI Assistant work?",
        answer: "The AI Assistant uses a powerful language model to help you fill in the blanks. When you're missing a value, it provides a reasonable estimate based on common scenarios and the information you've already provided. It also offers helpful hints to guide you in finding the exact information yourself."
    },
    {
        question: "Is my calculation data safe and private?",
        answer: "Absolutely. We do not store any of the numbers or project details you enter into our calculators after your session ends. For our AI features, we send only the necessary, anonymized data to our AI provider to generate a response. For more details, please review our Privacy Policy."
    }
]

const hvacFaqs = [
    {
        question: "How do I know what size furnace or AC unit I need?",
        answer: "The best way is with a proper load calculation, often called a 'Manual J' calculation. Our [HVAC Load Calculator](/calculators/hvac-load) provides a simplified estimate, but a professional technician can perform a detailed analysis for the most accurate sizing."
    },
    {
        question: "What's the difference between SEER and SEER2?",
        answer: "SEER2 is the new, more accurate standard for measuring air conditioner efficiency, updated in 2023. It uses more realistic testing conditions. While the numbers aren't directly comparable, a higher SEER or SEER2 rating always means better energy efficiency. Our [SEER Savings Calculator](/calculators/seer-savings-calculator) can help you estimate potential savings."
    },
    {
        question: "How are the cost estimates (e.g., furnace, heat pump) calculated?",
        answer: "Our cost estimators use industry-standard averages for materials and labor based on your inputs. These are intended for budget planning and are not a formal quote. Local prices, brand choice, and project complexity will affect the final cost, so we always recommend getting quotes from local professionals."
    }
]

// Helper function to render text with links
const renderAnswer = (text: string) => {
  const parts = text.split(/(\[.*?\]\(.*?\))/g);
  return parts.map((part, index) => {
    const match = part.match(/\[(.*?)\]\((.*?)\)/);
    if (match) {
      const [, linkText, href] = match;
      return (
        <Link key={index} href={href} className="text-primary underline hover:no-underline">
          {linkText}
        </Link>
      );
    }
    return part;
  });
};

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
                Have questions? We've got answers. If you can't find what you're looking for, feel free to ask our AI Chatbot.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
            <Card className="p-2 md:p-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <HelpCircle className="h-7 w-7 text-primary" />
                        General Questions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {generalFaqs.map((faq, index) => (
                            <AccordionItem key={`general-${index}`} value={`item-${index}`}>
                                <AccordionTrigger className="text-left text-base">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground">
                                    <p>{faq.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>

            <Card className="p-2 md:p-4">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Lightbulb className="h-7 w-7 text-primary" />
                        AI & Data Privacy
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {aiFaqs.map((faq, index) => (
                           <AccordionItem key={`ai-${index}`} value={`item-${index}`}>
                                <AccordionTrigger className="text-left text-base">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground">
                                    <p>{renderAnswer(faq.answer)}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
            
            <Card className="p-2 md:p-4 md:col-span-2">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Building2 className="h-7 w-7 text-primary" />
                        Calculators & Estimators
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     <Accordion type="single" collapsible className="w-full">
                        {hvacFaqs.map((faq, index) => (
                           <AccordionItem key={`hvac-${index}`} value={`item-${index}`}>
                                <AccordionTrigger className="text-left text-base">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground">
                                    <p>{renderAnswer(faq.answer)}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>

        </div>
        <ReportAnIssue />
      </div>
    </div>
  );
}
