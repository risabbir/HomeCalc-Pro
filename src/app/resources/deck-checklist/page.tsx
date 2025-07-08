import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ListChecks } from "lucide-react";

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
        "Define deck purpose (e.g., dining, lounging, hot tub support) to determine size and feature requirements.",
        "Establish a comprehensive budget, including materials, permits, tool rentals, and a 10-15% contingency fund.",
        "Contact your local building department for permit requirements, setback rules, frost line depth, and code specifics.",
        "Draft a detailed design plan: Sketch dimensions, shape, height, and features like stairs, railings, and lighting.",
        "Select materials: Choose decking (wood, composite, PVC), railings, and pressure-treated lumber for the substructure.",
    ]},
    { category: "Material Estimation & Ordering", items: [
        "Use our calculators for precise estimates of decking, joists, beams, and concrete for footings.",
        "Compile a complete shopping list: include all hardware (joist hangers, screws, bolts) and protective flashing.",
        "Place material orders from your supplier and coordinate a delivery date and location.",
    ]},
    { category: "Site Prep & Foundation", items: [
        "Call 811 (or your local service) at least a few days before digging to have all underground utility lines marked.",
        "Clear the construction area of all vegetation, rocks, and debris. Grade the area for proper drainage.",
        "Lay out the deck perimeter and footing locations using stakes, string lines, and marking paint. Check for square.",
        "Dig footing holes to the depth and width required by your local building code, ensuring they are below the frost line.",
        "Pour concrete footings and set post anchors while wet. Use a level to ensure they are perfectly plumb and aligned.",
    ]},
    { category: "Framing & Construction", items: [
        "Attach the ledger board to the house securely with appropriate lag screws or bolts, and install proper flashing to prevent water damage.",
        "Cut and install support posts onto the anchors. Attach beams securely to the posts using post caps or notches.",
        "Install rim joists and then the inner joists, typically spaced 16 inches on center. Use joist hangers for all connections.",
        "Continuously check that the frame is square, level, and securely fastened.",
    ]},
    { category: "Decking & Finishing", items: [
        "Install the deck boards perpendicular to the joists, maintaining a consistent gap (e.g., 1/8 inch) for drainage and expansion.",
        "Construct and install stairs, ensuring they meet code for riser height and tread depth for safety.",
        "Install railing posts, rails, and balusters according to code for height and spacing.",
        "Add finishing touches like fascia boards, skirting to hide the under-deck, or built-in benches and planters.",
        "If using wood, clean and apply a protective stain or sealer after the wood has had time to dry out.",
    ]},
    { category: "Final Inspection", items: [
        "Schedule required inspections (footing, framing, final) with your building department at the appropriate stages.",
        "Promptly address any issues raised by the inspector before proceeding to the next step or finalizing the project.",
    ]}
];


export default function DeckChecklistPage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                 <div className="text-center mb-12">
                    <ListChecks className="h-16 w-16 mx-auto text-primary mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">The Ultimate Deck Building Checklist</h1>
                    <p className="text-lg text-muted-foreground">
                        Building a deck is a major project. This detailed checklist helps you stay organized and ensures a safe, successful build from planning to completion.
                    </p>
                </div>

                 <Card className="mb-12">
                     <CardContent className="p-0 overflow-hidden rounded-lg">
                        <Image 
                            src="https://placehold.co/1200x500.png"
                            alt="A beautiful, newly built wooden deck with outdoor furniture"
                            width={1200}
                            height={500}
                            className="w-full h-auto object-cover"
                            data-ai-hint="deck furniture"
                        />
                     </CardContent>
                 </Card>

                <div className="space-y-8">
                    {checklistItems.map((section, sectionIndex) => (
                        <Card key={sectionIndex}>
                            <CardHeader>
                                <CardTitle>{section.category}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {section.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex items-start space-x-3">
                                       <Checkbox id={`item-${sectionIndex}-${itemIndex}`} aria-label={item} className="mt-1" />
                                       <label htmlFor={`item-${sectionIndex}-${itemIndex}`} className="text-base flex-1 text-muted-foreground">{item}</label>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Alert variant="destructive" className="mt-16">
                     <AlertTriangle className="h-4 w-4" />
                     <AlertTitle>Common Pitfalls to Avoid</AlertTitle>
                     <AlertDescription>
                         <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Improper Ledger Board Flashing:</strong> This is a primary cause of water damage, rot, and structural failure. Ensure it's done correctly.</li>
                            <li><strong>Inadequate Footings:</strong> Footings that are too shallow or small can lead to a sinking or unstable deck. Always dig below the frost line for your area.</li>
                            <li><strong>Incorrect Joist Spacing:</strong> Spacing joists too far apart can result in a bouncy, unsafe deck surface. Stick to your plans and code requirements.</li>
                            <li><strong>Ignoring the Permit Process:</strong> Building without a permit can lead to fines, tear-down orders, and major issues when selling your home.</li>
                         </ul>
                         <p className="font-bold mt-4">Disclaimer:</p>
                         <p className="text-sm">This checklist is for informational purposes only and is not a substitute for professional building plans or advice. Always adhere to local building codes and safety regulations. Consult a professional contractor or engineer for complex projects.</p>
                     </AlertDescription>
                </Alert>

                 <Card className="mt-16 bg-secondary">
                    <CardHeader>
                        <CardTitle>Calculators for Your Deck Project</CardTitle>
                        <CardDescription>Get started with the right numbers for your materials.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {relatedCalculators.map(calc => (
                            <Button asChild variant="outline" className="justify-start gap-4 bg-background" key={calc.slug}>
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