
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import React from "react";

export const metadata: Metadata = {
    title: 'The Ultimate Deck Building Checklist | HomeCalc Pro',
    description: 'A comprehensive, step-by-step checklist for planning and building your new deck, covering design, permits, materials, construction, and safety.',
};

const relevantCalculators = [
    'decking-calculator',
    'concrete-slab-calculator',
];

const checklistItems = [
    { 
        category: "Phase 1: Planning & Design", 
        items: [
            { id: "p1_1", text: "Define Deck Purpose & Size:", details: "Determine primary use (dining, lounging, hot tub support) to establish size, shape, and feature requirements." },
            { id: "p1_2", text: "Establish a Comprehensive Budget:", details: "Account for all materials, permits, tool rentals, and a 10-15% contingency fund for unexpected costs." },
            { id: "p1_3", text: "Research Local Building Codes:", details: "Contact your local building department for permit requirements, setback rules, frost line depth, required footing sizes, and railing specifications." },
            { id: "p1_4", text: "Create a Detailed Deck Plan:", details: "Draft a to-scale plan showing dimensions, shape, height, ledger board placement, footing locations, beam and joist layout, and features like stairs and landings." },
            { id: "p1_5", text: "Select Materials:", details: "Choose decking (wood, composite, PVC), and ensure all structural lumber (posts, beams, joists) is pressure-treated for ground contact." },
        ]
    },
    { 
        category: "Phase 2: Site Preparation & Foundation", 
        items: [
            { id: "p2_1", text: "Call 811 Before You Dig:", details: "Contact your local utility locating service at least 3-4 days before digging to have all underground gas, water, and electric lines marked. This is a critical safety step." },
            { id: "p2_2", text: "Clear and Grade the Area:", details: "Remove all vegetation, rocks, and debris. Grade the soil to slope away from your house foundation for proper water drainage." },
            { id: "p2_3", text: "Lay Out Footing Locations:", details: "Use your plan, stakes, and string lines to precisely mark the center of each footing hole. Measure diagonally between corners to ensure the layout is perfectly square." },
            { id: "p2_4", text: "Dig Footing Holes:", details: "Dig holes to the depth and width required by your local code, ensuring they extend below the frost line to prevent heaving." },
            { id: "p2_5", text: "Pour Concrete Footings:", details: "Pour concrete and set post anchors into the wet concrete. Use a level to ensure anchors are perfectly plumb and aligned with your string lines." },
        ]
    },
    { 
        category: "Phase 3: Framing & Construction", 
        items: [
            { id: "p3_1", text: "Install Ledger Board & Flashing:", details: "Securely attach the ledger board to the house rim joist using appropriate lag screws or structural bolts. Install proper flashing above and behind the ledger to prevent water intrusion and rot." },
            { id: "p3_2", text: "Install Posts and Beams:", details: "Cut support posts to height and attach them to the post anchors. Securely fasten beams to the posts using post-to-beam connectors or by notching the posts." },
            { id: "p3_3", text: "Install Joists:", details: "Install the outer rim joists first, then fill in the field joists, typically spaced 16 inches on-center. Use joist hangers for all connections to the ledger and beams." },
            { id: "p3_4", text: "Verify Frame Integrity:", details: "Continuously check that the frame is square, level, and all connections are secure as you build." },
        ]
    },
    { 
        category: "Phase 4: Decking & Finishing Touches", 
        items: [
            { id: "p4_1", text: "Install Deck Boards:", details: "Lay the decking perpendicular to the joists. Start at the house and work outwards, maintaining a consistent gap (e.g., 1/8 inch) for drainage and expansion." },
            { id: "p4_2", text: "Build and Install Stairs:", details: "Construct stairs ensuring they meet code for riser height and tread depth. Securely attach the stair stringers to the deck frame." },
            { id: "p4_3", text: "Install Railing System:", details: "Securely bolt railing posts to the deck frame. Install rails and balusters according to code for height and spacing to ensure safety." },
            { id: "p4_4", text: "Add Fascia and Skirting:", details: "Install fascia boards to cover rim joists for a finished look. Consider adding skirting to hide the under-deck area." },
            { id: "p4_5", text: "Apply Protective Finish:", details: "If using wood decking, clean the surface and apply a quality stain or sealer after allowing the wood to properly dry out (check manufacturer recommendations)." },
        ]
    },
    { 
        category: "Phase 5: Final Inspection", 
        items: [
            { id: "p5_1", text: "Schedule Required Inspections:", details: "Call your building department to schedule required inspections (e.g., footing, framing, final) at the appropriate stages of the project." },
            { id: "p5_2", text: "Address Inspector Feedback:", details: "Promptly address any issues or corrections required by the inspector before considering the project complete." },
        ]
    }
];


export default function DeckChecklistPage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                 <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">The Ultimate Deck Building Checklist</h1>
                    <p className="text-lg text-muted-foreground">
                        Building a deck is a major undertaking. Follow this detailed, phase-by-phase checklist to ensure a safe, professional, and successful build from start to finish.
                    </p>
                </div>

                 <Card className="mb-12">
                     <CardContent className="p-0 overflow-hidden rounded-lg">
                        <Image 
                            src="https://placehold.co/1200x500.png"
                            alt="A beautiful, newly built wooden deck with comfortable outdoor furniture, ready for relaxation."
                            width={1200}
                            height={500}
                            className="w-full h-auto object-cover"
                            data-ai-hint="deck furniture relax"
                            priority
                        />
                     </CardContent>
                 </Card>

                <div className="space-y-8">
                    {checklistItems.map((section) => (
                        <Card key={section.category}>
                            <CardHeader>
                                <CardTitle>{section.category}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                {section.items.map((item, itemIndex) => (
                                    <React.Fragment key={item.id}>
                                        {itemIndex > 0 && <Separator className="my-4" />}
                                        <div className="flex items-start space-x-4 p-2">
                                            <Checkbox id={item.id} aria-label={item.text} className="mt-1" />
                                            <div className="flex-1">
                                                <label htmlFor={item.id} className="font-medium text-base cursor-pointer">{item.text}</label>
                                                <p className="text-sm text-muted-foreground">{item.details}</p>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Alert variant="destructive" className="mt-16">
                     <AlertTriangle className="h-4 w-4" />
                     <AlertTitle>Critical Safety &amp; Durability Pitfalls to Avoid</AlertTitle>
                     <AlertDescription>
                         <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li><strong>Improper Ledger Board Attachment & Flashing:</strong> This is the #1 cause of catastrophic deck collapse and house rot. Ensure it is securely bolted and flashed correctly to prevent water damage.</li>
                            <li><strong>Inadequate Footings:</strong> Footings that are too shallow (above the frost line) or too small will cause your deck to heave, sink, and become unstable. Do not cut corners here.</li>
                            <li><strong>Incorrect Joist Spacing or Spans:</strong> Spacing joists too far apart or using undersized lumber for the span will result in a bouncy, unsafe deck surface that can fail over time.</li>
                            <li><strong>Ignoring the Permit Process:</strong> Building without a permit is illegal and unsafe. It can lead to fines, tear-down orders, and major liability issues.</li>
                         </ul>
                         <p className="font-bold mt-4">Disclaimer:</p>
                         <p className="text-sm">This checklist is for informational purposes only and is not a substitute for professional building plans, engineering, or advice. Always adhere strictly to your local building codes and safety regulations. When in doubt, consult a qualified professional contractor or engineer.</p>
                     </AlertDescription>
                </Alert>

                 <Card className="mt-16 bg-secondary">
                    <CardHeader>
                        <CardTitle>Calculate Your Deck Materials</CardTitle>
                        <CardDescription>Get a head start on your shopping list with these essential calculators for your deck project.</CardDescription>
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
