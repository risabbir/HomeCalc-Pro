
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Building2, Lightbulb, ShieldQuestion, HelpCircle } from "lucide-react";
import { ReportAnIssue } from "@/components/layout/ReportAnIssue";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Frequently Asked Questions | HomeCalc Pro",
  description: "Find answers to common questions about our free online calculators, AI features, data privacy, and how to get the most accurate project estimates.",
};

const faqSections = [
    {
        title: "General Questions",
        icon: HelpCircle,
        faqs: [
             {
                question: "Are these calculators 100% accurate?",
                answer: "Our calculators are designed for estimation purposes only. They provide a good starting point for planning, but for critical applications, we strongly recommend consulting with a qualified professional. Factors like local building codes, specific material properties, and unique project conditions can affect final results."
            },
            {
                question: "Can I save my calculation results?",
                answer: "Yes! Each calculator has a 'Download Results' button that appears after you perform a calculation. This will download a simple PDF file with your inputs and the calculated result for your records."
            },
            {
                question: "What if I can't find the calculator I need?",
                answer: "We are always looking to expand our toolset. You can use the 'AI Assistant' feature on the homepage to describe your project. While it can only recommend existing calculators, this feedback helps us understand what tools our users are looking for. You can also ask our AI Chatbot for help on topics we don't have a calculator for."
            }
        ]
    },
    {
        title: "AI & Data Privacy",
        icon: Lightbulb,
        faqs: [
            {
                question: "How does the AI Assistant work?",
                answer: "The AI Assistant uses a powerful language model to help you fill in the blanks. When you're missing a value, it provides a reasonable estimate based on common scenarios and the information you've already provided. It also offers helpful hints to guide you in finding the exact information yourself."
            },
            {
                question: "Is my calculation data safe and private?",
                answer: "Absolutely. We do not store any of the numbers or project details you enter into our calculators after your session ends. For our AI features, we send only the necessary, anonymized data to our AI provider to generate a response. For more details, please review our [Privacy Policy](/privacy-policy)."
            }
        ]
    },
    {
        title: "New Calculator FAQs",
        icon: ShieldQuestion,
        faqs: [
            {
                question: "What is CFM and why is it important for ventilation fans?",
                answer: "CFM stands for Cubic Feet per Minute. It's a measure of airflow volume. Choosing a fan with the correct CFM rating for your room size is critical to ensure it can effectively remove moisture and pollutants. Our [Ventilation Fan CFM Calculator](/calculators/ventilation-fan-cfm) helps you find the right rating for your bathroom or kitchen."
            },
            {
                question: "What's the difference between new and old dehumidifier sizes?",
                answer: "In 2019, the Department of Energy changed how dehumidifiers are tested, using cooler, more realistic room conditions. This means a new 35-pint model is roughly as powerful as an old 50-pint model. Our [Dehumidifier Size Calculator](/calculators/dehumidifier-size) provides recommendations based on the new standard."
            },
            {
                question: "How does roof pitch affect the amount of roofing material I need?",
                answer: "A steeper roof has more surface area than a flatter roof covering the same ground-level area. Our [Roofing Calculator](/calculators/roofing-materials) uses a pitch multiplier to account for this, ensuring you buy enough material for the actual surface of your roof."
            },
            {
                question: "Why do I need a 'waste factor' for tile and flooring?",
                answer: "A waste factor, typically 10-15%, accounts for the material you will lose to cuts, breakage, and mistakes during installation. It's crucial to purchase this extra amount to ensure you don't run out of material before the job is finished. Our [Tile Calculator](/calculators/tile-calculator) helps you factor this in."
            },
            {
                question: "What's included in the Drywall Calculator estimate?",
                answer: "Our [Drywall Calculator](/calculators/drywall-calculator) provides an all-in-one estimate for the main components of a drywall job: the number of sheets, the approximate weight of drywall screws, and the number of 4.5-gallon buckets of joint compound needed for taping and finishing."
            },
            {
                question: "Does the Fence Calculator account for gates?",
                answer: "The [Fence Materials Calculator](/calculators/fence-materials) primarily estimates the line posts, rails, and pickets/panels for the length of the fence. Gates often require specialized posts and hardware that should be planned for separately."
            },
            {
                question: "How accurate is the Water Heater Energy Cost comparison?",
                answer: "Our [Water Heater Cost Calculator](/calculators/water-heater-energy-cost) provides a solid estimate for comparing electric tank vs. electric tankless models based on your usage and rates. However, actual costs will vary based on gas vs. electric models, local utility rates, and specific unit efficiency (UEF rating)."
            },
            {
                question: "What is the 'gravel base' in the Driveway Calculator?",
                answer: "The gravel base is the most critical part of a long-lasting driveway. It's a layer of compacted crushed stone, typically 4-8 inches deep, that provides a stable foundation and ensures proper drainage. Our [Driveway Calculator](/calculators/driveway-materials) estimates the volume of gravel needed for this essential step."
            },
            {
                question: "What's the difference between solar payback period and ROI?",
                answer: "Payback period is how long it takes for your energy savings to equal the system's net cost. Return on Investment (ROI) is a measure of the total profitability over the system's life (usually 25 years). Our [Solar Savings Calculator](/calculators/solar-savings) estimates both to give you a full financial picture."
            }
        ]
    },
    {
        title: "HVAC FAQs",
        icon: Building2,
        faqs: [
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
    }
];

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
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
                Have questions? We've got answers. If you can't find what you're looking for, feel free to ask our AI Chatbot.
            </p>
        </div>

        <div className="space-y-8">
            {faqSections.map((section) => (
                <Card key={section.title} className="p-2 md:p-4">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg">
                                <section.icon className="h-7 w-7 text-primary" />
                            </div>
                            {section.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {section.faqs.map((faq, index) => (
                                <AccordionItem key={`${section.title}-${index}`} value={`item-${index}`} className="border-b last:border-b-0">
                                    <AccordionTrigger className="text-left text-base">{faq.question}</AccordionTrigger>
                                    <AccordionContent className="text-base text-muted-foreground">
                                        <p>{renderAnswer(faq.answer)}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            ))}
        </div>
        <ReportAnIssue />
      </div>
    </div>
  );
}
