import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export const metadata: Metadata = {
    title: 'Deck Building Checklist | HomeCalc Pro',
    description: 'A comprehensive checklist for planning and building your new deck.',
};

const relevantCalculators = [
    'decking-calculator',
    'concrete-slab-calculator',
];

const checklistItems = [
    "Define goals and budget for your deck project.",
    "Check local building codes and permit requirements with your municipality.",
    "Choose a location and create a detailed design plan.",
    "Use our calculators to estimate materials needed (decking, joists, concrete).",
    "Prepare the site: clear vegetation and level the ground.",
    "Mark layout for footings with stakes and string.",
    "Dig holes and pour concrete footings. Ensure they are level and properly cured.",
    "Attach ledger board to the house (if applicable) with proper flashing.",
    "Install support posts and beams.",
    "Install floor joists according to your plan (e.g., 16\" on center).",
    "Lay the deck boards, ensuring a consistent gap (e.g., 1/8 inch).",
    "Install railings, stairs, and any other finishing touches.",
    "Apply stain or sealer to protect the wood.",
    "Schedule final inspection if required by your permit.",
];


export default function DeckChecklistPage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                <article className="prose dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-bold font-headline mb-4">Deck Building Project Checklist</h1>
                    <p className="text-lg text-muted-foreground">
                        Building a deck is a rewarding but complex project. This checklist outlines the major steps from planning to completion to help you stay organized and ensure a safe, successful build.
                    </p>
                </article>

                <div className="mt-12 space-y-4">
                    {checklistItems.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg bg-background">
                           <Checkbox id={`item-${index}`} aria-label={item} className="mt-1" />
                           <label htmlFor={`item-${index}`} className="text-base flex-1">{item}</label>
                        </div>
                    ))}
                </div>

                <div className="prose dark:prose-invert max-w-none mt-12">
                     <p className="font-bold">Disclaimer:</p>
                     <p className="text-sm">This checklist is for informational purposes only and is not a substitute for professional building plans or advice. Always adhere to local building codes and safety regulations. Consult a professional contractor or engineer for complex projects.</p>
                </div>


                 <Card className="mt-16 bg-accent/50">
                    <CardHeader>
                        <CardTitle>Related Calculators</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {relatedCalculators.map(calc => (
                            <Button asChild variant="outline" className="justify-start gap-4" key={calc.slug}>
                                <Link href={`/calculators/${calc.slug}`}>
                                    <calc.Icon className="h-5 w-5 text-primary" />
                                    {calc.name}
                                </Link>
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
