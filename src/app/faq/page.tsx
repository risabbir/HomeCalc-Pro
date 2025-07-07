import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata = {
  title: "FAQ | HomeCalc Pro",
  description: "Frequently Asked Questions about HomeCalc Pro.",
};

const faqs = [
    {
        question: "Are these calculators 100% accurate?",
        answer: "Our calculators are designed for estimation purposes only. They provide a good starting point for planning your projects, but for critical applications, we strongly recommend consulting with a qualified professional. Factors like local building codes, specific material properties, and unique project conditions can affect final results."
    },
    {
        question: "How does the AI Assistant work?",
        answer: "The AI Assistant uses a powerful language model to help you fill in the blanks. When you're missing a value, it provides a reasonable estimate based on common scenarios and the information you've already provided. It also offers helpful hints to guide you in finding the exact information yourself."
    },
    {
        question: "How are the cost estimates (e.g., kitchen remodel, furnace installation) calculated?",
        answer: "Our cost estimators use industry-standard averages for materials and labor based on the inputs you provide, like square footage and quality level. These are intended for budget planning and are not a formal quote. Local prices, specific material choices, and project complexity will affect the final cost, so we always recommend getting quotes from local professionals."
    },
    {
        question: "What's the difference between the 'SEER Savings' and 'Energy Savings' calculators?",
        answer: "The SEER Savings Calculator is specifically for comparing the efficiency of two air conditioning units using their SEER/SEER2 ratings. The general Energy Savings Calculator is more versatile; you can use it to compare any two electrical appliances (like an old fridge vs. a new one, or incandescent vs. LED bulbs) based on their wattage and daily usage."
    },
    {
        question: "Can I save my calculation results?",
        answer: "Yes! Each calculator has a 'Download Results' button that appears after you perform a calculation. This will download a simple text file with your inputs and the calculated result for your records."
    },
    {
        question: "What if I can't find the calculator I need?",
        answer: "We are always looking to expand our toolset. You can use the 'AI Recommendations' feature on the homepage to describe your project. While it can only recommend existing calculators, this feedback helps us understand what tools our users are looking for in the future."
    }
]

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-center mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Have questions? We've got answers. If you can't find what you're looking for, feel free to reach out to our support team.
        </p>
        <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-lg">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">
                        {faq.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
}
