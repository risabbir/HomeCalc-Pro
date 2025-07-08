import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Ultimate Deck Building Checklist | HomeCalc Pro',
    description: 'A comprehensive checklist for planning and building your new deck, from foundation to finishing touches.',
};

const relevantCalculators = [
    'decking-calculator',
    'concrete-slab-calculator',
];

const checklistItems = [
    { category: "Planning & Design", items: [
        "Define goals: What will you use the deck for? (e.g., dining, lounging, a hot tub).",
        "Set a realistic budget, including materials, permits, and potential tool rentals.",
        "Check with your local building department for permit requirements, setback rules, and code specifics.",
        "Create a detailed design plan: Sketch the size, shape, height, and features like stairs and railings.",
        "Choose materials: Select decking (wood, composite), railings, and substructure lumber.",
    ]},
    { category: "Material Estimation", items: [
        "Use our calculators to get a solid estimate for decking boards, joists, beams, and concrete for footings.",
        "Create a final shopping list including all hardware (screws, joist hangers, bolts) and flashing.",
        "Order materials and arrange for delivery.",
    ]},
    { category: "Site Preparation & Foundation", items: [
        "Call 811 to have underground utility lines marked before you dig.",
        "Clear and level the construction area.",
        "Lay out the deck perimeter and footing locations using stakes and string lines.",
        "Dig footing holes to the depth and width required by your local code.",
        "Pour concrete footings, setting post anchors while the concrete is wet. Ensure they are level.",
    ]},
    { category: "Framing & Construction", items: [
        "Attach the ledger board to the house securely with proper flashing to prevent water damage.",
        "Install support posts on the anchors and attach beams.",
        "Install the rim joists and then the inner joists, typically 16 inches on center.",
        "Ensure the frame is square, level, and secure.",
    ]},
    { category: "Finishing", items: [
        "Install the deck boards, maintaining a consistent gap (e.g., 1/8 inch) for drainage.",
        "Build and install stairs, ensuring they meet code for rise and run.",
        "Install railing posts, rails, and balusters for safety.",
        "Add finishing touches like fascia boards, skirting, or built-in benches.",
        "Apply a protective stain or sealer to wood decking.",
    ]},
    { category: "Inspection", items: [
        "Schedule any required inspections (footing, framing, final) with your building department.",
        "Address any issues raised by the inspector before final sign-off.",
    ]}
];


export default function DeckChecklistPage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                 <article className="prose dark:prose-invert max-w-none">
                     <Image 
                        src="https://placehold.co/1200x400.png"
                        alt="A new deck under construction"
                        width={1200}
                        height={400}
                        className="rounded-lg mb-8 object-cover"
                        data-ai-hint="deck construction"
                    />
                    <h1 className="text-4xl font-bold font-headline mb-4">The Ultimate Deck Building Checklist</h1>
                    <p className="text-lg text-muted-foreground">
                        Building a deck is a rewarding but complex project. This checklist breaks down the major steps from planning to completion to help you stay organized and ensure a safe, successful build.
                    </p>
                </article>

                <div className="mt-12 space-y-8">
                    {checklistItems.map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                            <h2 className="text-2xl font-semibold font-headline border-b pb-2 mb-4">{section.category}</h2>
                            <div className="space-y-4">
                                {section.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex items-start space-x-3 p-4 border rounded-lg bg-background">
                                       <Checkbox id={`item-${sectionIndex}-${itemIndex}`} aria-label={item} className="mt-1" />
                                       <label htmlFor={`item-${sectionIndex}-${itemIndex}`} className="text-base flex-1">{item}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="prose dark:prose-invert max-w-none mt-16">
                     <h2 className="text-2xl font-bold font-headline">Common Pitfalls to Avoid</h2>
                     <ul>
                        <li><strong>Improper Ledger Board Flashing:</strong> This is a primary cause of house rot and structural failure. Ensure it's done correctly.</li>
                        <li><strong>Inadequate Footings:</strong> Footings that are too shallow or small can lead to a sinking or unstable deck. Always dig below the frost line for your area.</li>
                        <li><strong>Incorrect Joist Spacing:</strong> Spacing joists too far apart can result in a bouncy, unsafe deck surface. Stick to your plans and code requirements.</li>
                        <li><strong>Ignoring the Permit Process:</strong> Building without a permit can lead to fines, tear-down orders, and issues when selling your home.</li>
                     </ul>
                     <p className="font-bold mt-8">Disclaimer:</p>
                     <p className="text-sm">This checklist is for informational purposes only and is not a substitute for professional building plans or advice. Always adhere to local building codes and safety regulations. Consult a professional contractor or engineer for complex projects.</p>
                </div>

                 <Card className="mt-16 bg-accent/50">
                    <CardHeader>
                        <CardTitle>Calculators for Your Deck Project</CardTitle>
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
